import { NextResponse } from 'next/server';
import { writeClient } from '@/sanity/client';

export async function POST(request: Request) {
  try {
    const { email, bookId, audience = 'teacher' } = await request.json();

    if (!email || !bookId) {
      return NextResponse.json({ error: 'Email and Book ID are required' }, { status: 400 });
    }

    // Check if access already exists to avoid duplicates
    const existing = await writeClient.fetch(
      `*[_type == "publicationAccessLedger" && customerIdentityHash == $email && purchasedPublicationReference._ref == $bookId && audience == $audience][0]`,
      { email, bookId, audience }
    );

    if (existing) {
      return NextResponse.json({ success: true, message: 'Already saved' });
    }

    // Create the ledger entry
    const doc = {
      _type: 'publicationAccessLedger',
      customerIdentityHash: email,
      purchasedPublicationReference: {
        _type: 'reference',
        _ref: bookId
      },
      audience: audience,
      grantedSystemTimestamp: new Date().toISOString(),
      operationalLedgerState: 'active',
      purchasePriceSnapshot: 0,
      currencySnapshot: 'USD'
    };

    await writeClient.create(doc);

    return NextResponse.json({ success: true, message: 'Saved to library' });
  } catch (error: any) {
    console.error('Save to library error:', error);
    return NextResponse.json({ error: 'Failed to save to library' }, { status: 500 });
  }
}
