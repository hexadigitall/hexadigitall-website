// src/app/api/newsletter/route.ts
import { NextResponse } from 'next/server';
import { emailService } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, source } = body;

    // Basic validation
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Check for common disposable email domains
    const disposableDomains = [
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 'mailinator.com'
    ];
    const emailDomain = email.split('@')[1].toLowerCase();
    if (disposableDomains.includes(emailDomain)) {
      return NextResponse.json({ 
        error: 'Please use a permanent email address' 
      }, { status: 400 });
    }

    // Send newsletter subscription emails
    const result = await emailService.subscribeToNewsletter({
      email,
      source: source || 'Footer Newsletter'
    });

    if (!result.success) {
      console.error('Newsletter subscription failed:', result.error);
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again later.' }, 
        { status: 500 }
      );
    }

    console.log('Newsletter subscription successful:', result.message);
    return NextResponse.json({ 
      message: 'Successfully subscribed! Check your email for a welcome message.' 
    }, { status: 200 });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json({ 
      error: 'Internal server error. Please try again later.' 
    }, { status: 500 });
  }
}
