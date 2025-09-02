// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, service } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // In a real application, you would integrate an email service here
    // like SendGrid, Resend, or Nodemailer.
    console.log('--- New Contact Form Submission ---');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Service:', service);
    console.log('Message:', message);
    console.log('Recipient Email:', process.env.CONTACT_FORM_RECIPIENT_EMAIL);
    console.log('------------------------------------');

    // await sendEmail({ to: process.env.CONTACT_FORM_RECIPIENT_EMAIL, from: 'noreply@hexadigitall.com', subject: 'New Contact Form', ... });

    return NextResponse.json({ message: 'Form submitted successfully!' }, { status: 200 });

  } catch (_error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}