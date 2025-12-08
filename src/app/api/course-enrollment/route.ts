// src/app/api/course-enrollment/route.ts
// Paystack-based course enrollment endpoint
import { NextResponse } from 'next/server';
import { client } from '@/sanity/client';

interface EnrollmentRequest {
  courseId: string;
  studentDetails?: {
    fullName?: string;
    email?: string;
    phone?: string;
  };
  amount: number;
  currency: string;
}

export async function POST(request: Request) {
  try {
    const body: EnrollmentRequest = await request.json();
    const { courseId, amount, currency, studentDetails } = body;

    // Validate required fields
    if (!courseId || !amount || !currency) {
      return NextResponse.json(
        { error: 'Missing required fields: courseId, amount, currency' },
        { status: 400 }
      );
    }

    // Verify course exists in Sanity
    const course = await client.fetch(
      '*[_type == "course" && _id == $id][0]',
      { id: courseId }
    );
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Initialize Paystack transaction
    const paystackAmount = Math.round(amount); // Paystack expects amount in kobo (for NGN) or lowest currency unit

    const paystackPayload = {
      email: studentDetails?.email || 'noemail@hexadigitall.com',
      amount: paystackAmount,
      metadata: {
        courseId,
        courseName: course.title,
        studentName: studentDetails?.fullName,
        studentPhone: studentDetails?.phone,
      },
      channels: ['card', 'bank', 'ussd', 'qr', 'bank_transfer', 'eft'],
    };

    // Call Paystack API to initialize transaction
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paystackPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Paystack initialization error:', errorData);
      return NextResponse.json(
        { error: 'Failed to initialize payment', details: errorData },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (!data.status) {
      return NextResponse.json(
        { error: 'Payment initialization failed', details: data },
        { status: 500 }
      );
    }

    // Return the Paystack checkout URL
    return NextResponse.json({
      success: true,
      checkoutUrl: data.data.authorization_url,
      accessCode: data.data.access_code,
      reference: data.data.reference,
    });
  } catch (error) {
    console.error('Course enrollment error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Handle session verification from Paystack callback
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json(
        { error: 'Missing reference' },
        { status: 400 }
      );
    }

    // Verify transaction with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to verify payment' },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (!data.status || !data.data.status || data.data.status !== 'success') {
      return NextResponse.json(
        { error: 'Payment verification failed', status: data.data?.status },
        { status: 400 }
      );
    }

    // Payment successful
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      reference: data.data.reference,
      amount: data.data.amount,
      customer: data.data.customer,
    });
  } catch (error) {
    console.error('Enrollment verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
