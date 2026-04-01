import { NextResponse } from 'next/server';
import { groq } from 'next-sanity';
import { client, writeClient } from '@/sanity/client';
import { emailService } from '@/lib/email';

const BOOK_QUERY = groq`
  *[_type == "book" && slug.current == $slug][0]{
    title,
    status,
    salesLinks[]{url, label, platform}
  }
`;

const PENDING_SUBSCRIBERS_QUERY = groq`
  *[_type == "bookReleaseSubscriber" && bookSlug == $slug && status == "pending"]{
    _id,
    email
  }
`;

function extractAuthToken(request: Request): string {
  const bearer = request.headers.get('authorization');
  if (bearer?.startsWith('Bearer ')) {
    return bearer.slice('Bearer '.length).trim();
  }

  return request.headers.get('x-release-notify-token')?.trim() ?? '';
}

export async function POST(request: Request) {
  try {
    const expectedToken = process.env.RELEASE_NOTIFY_SECRET;
    if (!expectedToken) {
      return NextResponse.json({ error: 'RELEASE_NOTIFY_SECRET is not configured.' }, { status: 500 });
    }

    const providedToken = extractAuthToken(request);
    if (!providedToken || providedToken !== expectedToken) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const slug = String(body?.slug || '').trim();

    if (!slug) {
      return NextResponse.json({ error: 'Book slug is required.' }, { status: 400 });
    }

    const book = await client.fetch<{
      title: string;
      status: string;
      salesLinks?: Array<{ url?: string; label?: string; platform?: string }>;
    } | null>(BOOK_QUERY, { slug });

    if (!book) {
      return NextResponse.json({ error: 'Book not found.' }, { status: 404 });
    }

    if (book.status !== 'available') {
      return NextResponse.json({
        error: `Book is currently '${book.status}'. Dispatch is only allowed when status is 'available'.`,
      }, { status: 400 });
    }

    const subscribers = await client.fetch<Array<{ _id: string; email: string }>>(PENDING_SUBSCRIBERS_QUERY, { slug });
    if (subscribers.length === 0) {
      return NextResponse.json({ message: 'No pending subscribers for this book.', notified: 0 }, { status: 200 });
    }

    const buyLink = book.salesLinks?.find((link) => !!link.url)?.url;
    const notifiedIds: string[] = [];
    const failed: Array<{ email: string; reason: string }> = [];

    for (const subscriber of subscribers) {
      const result = await emailService.sendEmail({
        to: subscriber.email,
        subject: `${book.title} is now available`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto;">
            <h2 style="color:#0A4D68;">Good news: ${book.title} is now available</h2>
            <p>You asked to be notified as soon as this textbook was released.</p>
            ${buyLink ? `<p><a href="${buyLink}" style="display:inline-block;padding:10px 16px;background:#0A4D68;color:#fff;text-decoration:none;border-radius:8px;">Buy now</a></p>` : ''}
            <p style="margin-top:16px;">You can also view the book details on Hexadigitall:</p>
            <p><a href="https://hexadigitall.com/store/${slug}">https://hexadigitall.com/store/${slug}</a></p>
          </div>
        `,
      });

      if (result.success) {
        notifiedIds.push(subscriber._id);
      } else {
        failed.push({ email: subscriber.email, reason: result.error ?? 'Unknown failure' });
      }
    }

    const nowIso = new Date().toISOString();
    await Promise.all(
      notifiedIds.map((id) =>
        writeClient
          .patch(id)
          .set({ status: 'notified', notifiedAt: nowIso })
          .commit()
      )
    );

    return NextResponse.json({
      message: `Dispatch complete for ${book.title}.`,
      notified: notifiedIds.length,
      failed,
    }, { status: 200 });
  } catch (error) {
    console.error('Release notification dispatch error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
