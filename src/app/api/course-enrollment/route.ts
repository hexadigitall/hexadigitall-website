// src/app/api/course-enrollment/route.ts
import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { client, writeClient } from '@/sanity/client';
import { groq } from 'next-sanity';
import { emailService } from '@/lib/email';
import { CourseEnrollmentData } from '@/lib/email-types';

interface StudentDetails {
  fullName: string;
  email: string;
  phone: string;
  experience?: string;
  goals?: string;
}

interface EnrollmentRequest {
  courseId: string;
  studentDetails: StudentDetails;
  amount: number; // Amount in kobo
}

interface Course {
  _id: string;
  title: string;
  price: number;
  instructor: string;
  maxStudents?: number;
  currentEnrollments?: number;
}

export async function POST(request: Request) {
  try {
    const { courseId, studentDetails, amount }: EnrollmentRequest = await request.json();

    // Validate required fields
    if (!courseId || !studentDetails?.fullName || !studentDetails?.email || !amount) {
      return NextResponse.json(
        { error: 'Missing required enrollment information' },
        { status: 400 }
      );
    }

    // Fetch and validate course
    const course: Course = await client.fetch(
      groq`*[_type == "course" && _id == $courseId][0]{
        _id,
        title,
        price,
        instructor,
        maxStudents,
        "currentEnrollments": count(*[_type == "enrollment" && courseId._ref == ^._id])
      }`,
      { courseId }
    );

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Check course availability
    if (course.maxStudents && (course.currentEnrollments || 0) >= course.maxStudents) {
      return NextResponse.json(
        { error: 'Course is full. Please join the waitlist.' },
        { status: 400 }
      );
    }

    // Validate price (security check)
    const expectedAmount = course.price * 100; // Convert to kobo
    if (Math.abs(amount - expectedAmount) > 100) { // Allow 1 NGN difference
      return NextResponse.json(
        { error: 'Price mismatch. Please refresh and try again.' },
        { status: 400 }
      );
    }

    // Check if student is already enrolled
    const existingEnrollment = await client.fetch(
      groq`*[_type == "enrollment" && studentEmail == $email && courseId._ref == $courseId][0]`,
      { email: studentDetails.email, courseId }
    );

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'You are already enrolled in this course.' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card', 'link'], // Enable Stripe Link
      line_items: [{
        price_data: {
          currency: 'ngn',
          product_data: {
            name: `${course.title} - Course Enrollment`,
            description: `Enrollment for ${course.title} by ${course.instructor}`,
            images: [`${process.env.NEXT_PUBLIC_SITE_URL}/api/course-image/${courseId}`],
          },
          unit_amount: expectedAmount,
        },
        quantity: 1,
      }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/enrollment-success?session_id={CHECKOUT_SESSION_ID}&course_id=${courseId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/courses/${course.title.toLowerCase().replace(/\s+/g, '-')}?enrollment=cancelled`,
      metadata: {
        type: 'course_enrollment',
        courseId,
        studentEmail: studentDetails.email,
        studentName: studentDetails.fullName,
        studentPhone: studentDetails.phone,
        experience: studentDetails.experience || '',
        goals: studentDetails.goals || '',
      },
      customer_email: studentDetails.email,
      // Enhanced checkout options for better UX
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['NG', 'US', 'GB', 'CA'], // Support multiple countries
      },
      customer_creation: 'always', // Create customer for future enrollments
      invoice_creation: {
        enabled: true,
      },
      // Save payment method for future course purchases
      payment_intent_data: {
        setup_future_usage: 'off_session',
      },
      // Phone number collection for course communications
      phone_number_collection: {
        enabled: true,
      },
      // Custom checkout appearance
      ui_mode: 'hosted', // Use Stripe's optimized checkout page
      // Automatic tax calculation (if enabled in Stripe dashboard)
      automatic_tax: {
        enabled: false, // Enable this if you have tax settings configured
      },
    });

    // Store pending enrollment (will be confirmed on successful payment)
    await writeClient.create({
      _type: 'pendingEnrollment',
      courseId: {
        _type: 'reference',
        _ref: courseId,
      },
      studentName: studentDetails.fullName,
      studentEmail: studentDetails.email,
      studentPhone: studentDetails.phone,
      experience: studentDetails.experience,
      goals: studentDetails.goals,
      stripeSessionId: session.id,
      amount: expectedAmount,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ 
      checkoutUrl: session.url,
      sessionId: session.id 
    });

  } catch (error) {
    console.error('Course enrollment error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Check for common Sanity permission errors
    if (errorMessage.includes('Insufficient permissions') || errorMessage.includes('permission "create" required')) {
      return NextResponse.json(
        { 
          error: 'System configuration error. Please contact support to complete your enrollment.',
          details: 'The enrollment system needs to be configured with proper permissions.'
        },
        { status: 500 }
      );
    }
    
    // Check for Stripe errors
    if (errorMessage.includes('StripeInvalidRequestError')) {
      return NextResponse.json(
        { error: 'Payment processing error. Please try again.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Webhook handler for successful payments (to be called by Stripe)
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });
    }

    // Verify session with Stripe
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    const { courseId, studentEmail, studentName, studentPhone, experience, goals } = session.metadata!;

    // Convert pending enrollment to confirmed enrollment
    const pendingEnrollment = await client.fetch(
      groq`*[_type == "pendingEnrollment" && stripeSessionId == $sessionId][0]`,
      { sessionId }
    );

    if (!pendingEnrollment) {
      return NextResponse.json({ error: 'Pending enrollment not found' }, { status: 404 });
    }

    // Create confirmed enrollment
    const enrollment = await writeClient.create({
      _type: 'enrollment',
      courseId: {
        _type: 'reference',
        _ref: courseId,
      },
      studentName,
      studentEmail,
      studentPhone,
      experience: experience || undefined,
      goals: goals || undefined,
      enrolledAt: new Date().toISOString(),
      paymentStatus: 'completed',
      stripeSessionId: sessionId,
      amount: session.amount_total,
    });

    // Delete pending enrollment
    await writeClient.delete(pendingEnrollment._id);

    // Send enrollment confirmation emails
    try {
      const courseInfo = await client.fetch(
        groq`*[_type == "course" && _id == $courseId][0]{
          title,
          dollarPrice,
          nairaPrice
        }`,
        { courseId }
      );

      const enrollmentData: CourseEnrollmentData = {
        studentName,
        studentEmail,
        courseName: courseInfo?.title || 'Course',
        coursePrice: courseInfo?.dollarPrice || (session.amount_total || 0) / 100,
        enrollmentId: enrollment._id,
        paymentPlan: session.amount_total && session.amount_total < (courseInfo?.dollarPrice || 0) * 100 ? 'Installment Plan' : 'Full Payment'
      };

      const emailResult = await emailService.sendCourseEnrollmentEmails(enrollmentData);
      if (!emailResult.success) {
        console.error('Failed to send enrollment emails:', emailResult.error);
        // Don't fail the enrollment, just log the error
      } else {
        console.log('Enrollment emails sent successfully:', emailResult.message);
      }
    } catch (emailError) {
      console.error('Email service error:', emailError);
      // Continue with enrollment success even if email fails
    }

    return NextResponse.json({ 
      success: true,
      enrollmentId: enrollment._id 
    });

  } catch (error) {
    console.error('Enrollment confirmation error:', error);
    return NextResponse.json({ error: 'Failed to confirm enrollment' }, { status: 500 });
  }
}
