// src/app/api/course-enrollment/route.ts
import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { client, writeClient } from '@/sanity/client';
import { groq } from 'next-sanity';
import { emailService } from '@/lib/email';
import { CourseEnrollmentData } from '@/lib/email-types';
import Stripe from 'stripe';

interface StudentDetails {
  fullName: string;
  email: string;
  phone: string;
  experience?: string;
  goals?: string;
  preferredSchedule?: string;
}

interface PaymentPlan {
  id: string;
  name: string;
  installments: number;
  downPayment: number;
  processingFee: number;
}

interface PricingConfiguration {
  hoursPerWeek: number;
  weeksPerMonth: number;
  totalHours: number;
  sessionFormat: 'one-on-one' | 'small-group' | 'group';
  currency: string;
  hourlyRate: number;
  totalMonthlyPrice: number;
}

interface EnrollmentRequest {
  courseId: string;
  courseType: 'self-paced' | 'live';
  studentDetails: StudentDetails;
  paymentPlan: PaymentPlan;
  amount: number;
  currency: string;
  pricingConfiguration?: PricingConfiguration;
}

interface Course {
  _id: string;
  title: string;
  courseType?: 'self-paced' | 'live';
  // Legacy pricing
  price?: number;
  nairaPrice?: number;
  dollarPrice?: number;
  // Live course pricing
  hourlyRateUSD?: number;
  hourlyRateNGN?: number;
  instructor: string;
  maxStudents?: number;
  currentEnrollments?: number;
}

interface SanityReference {
  _type: 'reference';
  _ref: string;
}

interface PendingEnrollmentData {
  _type: 'pendingEnrollment';
  courseId: SanityReference;
  courseType: 'live' | 'self-paced';
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  experience?: string;
  goals?: string;
  preferredSchedule?: string;
  stripeSessionId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  pricingConfiguration?: PricingConfiguration;
}

interface EnrollmentData {
  _type: 'enrollment';
  courseId: SanityReference;
  courseType: 'live' | 'self-paced';
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  experience?: string;
  goals?: string;
  preferredSchedule?: string;
  enrolledAt: string;
  paymentStatus: string;
  stripeSessionId: string;
  amount: number | null;
  liveCourseDetails?: {
    hoursPerWeek: number;
    sessionFormat: string;
    totalHours?: number;
    monthlyAmount: number | null;
  };
}

export async function POST(request: Request) {
  try {
    const { 
      courseId, 
      courseType = 'self-paced',
      studentDetails, 
      amount,
      currency,
      pricingConfiguration
    }: EnrollmentRequest = await request.json();

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
        courseType,
        price,
        nairaPrice,
        dollarPrice,
        hourlyRateUSD,
        hourlyRateNGN,
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

    const isLiveCourse = courseType === 'live' || course.courseType === 'live';

    // Check course availability (mainly for self-paced courses)
    if (!isLiveCourse && course.maxStudents && (course.currentEnrollments || 0) >= course.maxStudents) {
      return NextResponse.json(
        { error: 'Course is full. Please join the waitlist.' },
        { status: 400 }
      );
    }

    // Validate pricing based on course type
    let expectedAmount: number;
    let productName: string;
    let productDescription: string;
    
    if (isLiveCourse && pricingConfiguration) {
      // Live course pricing validation
      const baseRate = currency === 'NGN' ? course.hourlyRateNGN : course.hourlyRateUSD;
      if (!baseRate) {
        return NextResponse.json(
          { error: 'Course pricing not configured for live sessions' },
          { status: 400 }
        );
      }
      
      expectedAmount = Math.round(pricingConfiguration.totalMonthlyPrice * (currency === 'NGN' ? 1 : 100));
      productName = `${course.title} - Live Sessions (${pricingConfiguration.hoursPerWeek}h/week)`;
      productDescription = `${pricingConfiguration.sessionFormat} sessions: ${pricingConfiguration.totalHours} hours/month - ${course.title} by ${course.instructor}`;
    } else {
      // Legacy self-paced pricing validation
      const basePrice = course.dollarPrice || (course.nairaPrice || course.price || 0);
      expectedAmount = Math.round(basePrice * (currency === 'NGN' ? 1 : 100));
      productName = `${course.title} - Course Enrollment`;
      productDescription = `Enrollment for ${course.title} by ${course.instructor}`;
    }

    // Allow small price differences (for currency conversion fluctuations)
    const tolerance = currency === 'NGN' ? 1000 : 100; // 10 NGN or $1 tolerance
    if (Math.abs(amount - expectedAmount) > tolerance) {
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

    if (existingEnrollment && !isLiveCourse) {
      return NextResponse.json(
        { error: 'You are already enrolled in this course.' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const stripe = getStripe();
    
    // Determine success and cancel URLs
    const successUrl = isLiveCourse 
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/enrollment-success?session_id={CHECKOUT_SESSION_ID}&course_id=${courseId}&type=live`
      : `${process.env.NEXT_PUBLIC_SITE_URL}/enrollment-success?session_id={CHECKOUT_SESSION_ID}&course_id=${courseId}`;
      
    const cancelUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/courses?enrollment=cancelled`;

    const sessionCreateData: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: productName,
            description: productDescription,
            images: [`${process.env.NEXT_PUBLIC_SITE_URL}/api/course-image/${courseId}`],
          },
          unit_amount: expectedAmount,
        },
        quantity: 1,
      }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        type: isLiveCourse ? 'live_course_enrollment' : 'course_enrollment',
        courseId,
        courseType: isLiveCourse ? 'live' : 'self-paced',
        studentEmail: studentDetails.email,
        studentName: studentDetails.fullName,
        studentPhone: studentDetails.phone,
        experience: studentDetails.experience || '',
        goals: studentDetails.goals || '',
        preferredSchedule: studentDetails.preferredSchedule || '',
        ...(pricingConfiguration && {
          hoursPerWeek: pricingConfiguration.hoursPerWeek.toString(),
          sessionFormat: pricingConfiguration.sessionFormat,
          totalHours: pricingConfiguration.totalHours.toString(),
        })
      },
      customer_email: studentDetails.email,
      billing_address_collection: 'auto',
      customer_creation: 'always',
      invoice_creation: {
        enabled: true,
      },
      phone_number_collection: {
        enabled: true,
      },
      ui_mode: 'hosted',
      automatic_tax: {
        enabled: false,
      },
    };

    // Add shipping collection for physical products or international customers
    if (currency !== 'NGN') {
      sessionCreateData.shipping_address_collection = {
        allowed_countries: ['US', 'GB', 'CA', 'AU', 'DE', 'FR'],
      };
    }

    // For live courses, set up recurring payments if needed
    if (isLiveCourse && pricingConfiguration) {
      sessionCreateData.subscription_data = {
        metadata: {
          courseId,
          studentEmail: studentDetails.email,
          hoursPerWeek: pricingConfiguration.hoursPerWeek.toString(),
          sessionFormat: pricingConfiguration.sessionFormat,
        }
      };
    }

    const session = await stripe.checkout.sessions.create(sessionCreateData);

    // Store pending enrollment
    const pendingEnrollmentData: PendingEnrollmentData = {
      _type: 'pendingEnrollment',
      courseId: {
        _type: 'reference',
        _ref: courseId,
      },
      courseType: isLiveCourse ? 'live' : 'self-paced',
      studentName: studentDetails.fullName,
      studentEmail: studentDetails.email,
      studentPhone: studentDetails.phone,
      experience: studentDetails.experience,
      goals: studentDetails.goals,
      preferredSchedule: studentDetails.preferredSchedule,
      stripeSessionId: session.id,
      amount: expectedAmount,
      currency,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Add pricing configuration for live courses
    if (pricingConfiguration) {
      pendingEnrollmentData.pricingConfiguration = pricingConfiguration;
    }

    await writeClient.create(pendingEnrollmentData);

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

    const metadata = session.metadata!;
    const { 
      courseId, 
      courseType,
      studentEmail, 
      studentName, 
      studentPhone, 
      experience, 
      goals,
      preferredSchedule,
      hoursPerWeek,
      sessionFormat,
      totalHours
    } = metadata;

    // Convert pending enrollment to confirmed enrollment
    const pendingEnrollment = await client.fetch(
      groq`*[_type == "pendingEnrollment" && stripeSessionId == $sessionId][0]`,
      { sessionId }
    );

    if (!pendingEnrollment) {
      return NextResponse.json({ error: 'Pending enrollment not found' }, { status: 404 });
    }

    // Create confirmed enrollment
    const enrollmentData: EnrollmentData = {
      _type: 'enrollment',
      courseId: {
        _type: 'reference',
        _ref: courseId,
      },
      courseType: (courseType as 'live' | 'self-paced') || 'self-paced',
      studentName,
      studentEmail,
      studentPhone,
      experience: experience || undefined,
      goals: goals || undefined,
      preferredSchedule: preferredSchedule || undefined,
      enrolledAt: new Date().toISOString(),
      paymentStatus: 'completed',
      stripeSessionId: sessionId,
      amount: session.amount_total,
    };

    // Add live course specific data
    if (courseType === 'live' && hoursPerWeek) {
      enrollmentData.liveCourseDetails = {
        hoursPerWeek: parseInt(hoursPerWeek),
        sessionFormat,
        totalHours: totalHours ? parseInt(totalHours) : undefined,
        monthlyAmount: session.amount_total,
      };
    }

    const enrollment = await writeClient.create(enrollmentData);

    // Delete pending enrollment
    await writeClient.delete(pendingEnrollment._id);

    // Send enrollment confirmation emails
    try {
      const courseInfo = await client.fetch(
        groq`*[_type == "course" && _id == $courseId][0]{
          title,
          courseType,
          dollarPrice,
          nairaPrice,
          hourlyRateUSD,
          hourlyRateNGN
        }`,
        { courseId }
      );

      const enrollmentEmailData: CourseEnrollmentData = {
        studentName,
        studentEmail,
        courseName: courseInfo?.title || 'Course',
        coursePrice: courseInfo?.dollarPrice || (session.amount_total || 0) / 100,
        enrollmentId: enrollment._id,
        paymentPlan: courseType === 'live' ? 'Live Sessions' : 'Full Payment'
      };

      const emailResult = await emailService.sendCourseEnrollmentEmails(enrollmentEmailData);
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
