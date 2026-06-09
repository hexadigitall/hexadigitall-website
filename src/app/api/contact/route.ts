// src/app/api/contact/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { emailService } from '@/lib/email';
import { writeClient } from '@/sanity/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message, service } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Save to Sanity database (even if email fails, we want to keep the submission)
    try {
      await writeClient.create({
        _type: 'formSubmission',
        type: 'contact',
        status: 'new',
        name,
        email,
        message,
        formData: { service },
        submittedAt: new Date().toISOString(),
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
        referrer: request.headers.get('referer'),
      });
    } catch (dbError) {
      console.error('Failed to save to database:', dbError);
      // Continue even if database save fails
    }

    // Send email using the email service
    const result = await emailService.sendContactForm({
      name,
      email,
      message,
      service
    });

    if (!result.success) {
      console.error('Email sending failed:', result.error);
      // Still return success since we saved to database
      return NextResponse.json({ 
        message: 'Thank you! Your message has been received. We\'ll get back to you within 24 hours.' 
      }, { status: 200 });
    }

    console.log('Contact form email sent successfully:', result.message);
    return NextResponse.json({ 
      message: 'Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.' 
    }, { status: 200 });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ 
      error: 'Internal server error. Please try again or contact us directly at hexadigitztech@gmail.com' 
    }, { status: 500 });
  }
}
