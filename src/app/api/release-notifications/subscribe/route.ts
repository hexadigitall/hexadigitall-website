import { NextResponse } from 'next/server';
import { groq } from 'next-sanity';
import { client, writeClient } from '@/sanity/client';
import { emailService } from '@/lib/email';

const BOOK_LOOKUP_QUERY = groq`*[_type == "book" && slug.current == $slug][0]{title, status}`;

const EXISTING_SUBSCRIBER_QUERY = groq`
  *[_type == "bookReleaseSubscriber" && bookSlug == $slug && lower(email) == lower($email)][0]{_id, status}
`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || '').trim().toLowerCase();
    const slug = String(body?.slug || '').trim();

    if (!email || !slug) {
      return NextResponse.json({ error: 'Email and book slug are required.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
    }

    const book = await client.fetch<{ title: string; status: string } | null>(BOOK_LOOKUP_QUERY, { slug });
    if (!book) {
      return NextResponse.json({ error: 'Book not found.' }, { status: 404 });
    }

    const existing = await client.fetch<{ _id: string; status: string } | null>(EXISTING_SUBSCRIBER_QUERY, { slug, email });
    if (existing && existing.status === 'pending') {
      return NextResponse.json({ message: 'You are already on the release list for this book.' }, { status: 200 });
    }

    if (existing && existing.status === 'notified') {
      return NextResponse.json({ message: 'You have already been notified for this book release.' }, { status: 200 });
    }

    await writeClient.create({
      _type: 'bookReleaseSubscriber',
      email,
      bookSlug: slug,
      bookTitle: book.title,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    await emailService.sendEmail({
      to: email,
      subject: `Release list confirmed: ${book.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto;">
          <h2 style="color:#0A4D68;">You're on the list</h2>
          <p>Thanks for subscribing to release updates for <strong>${book.title}</strong>.</p>
          <p>We'll email you as soon as this textbook is available.</p>
          <p style="color:#6b7280; font-size:12px; margin-top:24px;">Hexadigitall Textbook Store</p>
        </div>
      `,
    });

    return NextResponse.json({ message: 'Subscription confirmed. You will be notified on release.' }, { status: 200 });
  } catch (error) {
    console.error('Release notification subscribe error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
