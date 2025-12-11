// src/app/api/contact/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { emailService } from '@/lib/email';

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

    // Send email using the email service
    const result = await emailService.sendContactForm({
      name,
      email,
      message,
      service
    });

    if (!result.success) {
      console.error('Email sending failed:', result.error);
      return NextResponse.json(
        { error: 'Failed to send message. Please try again or contact us directly.' }, 
        { status: 500 }
      );
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
