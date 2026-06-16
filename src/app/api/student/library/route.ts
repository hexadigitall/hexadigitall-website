import { NextResponse } from 'next/server';
import { client } from '@/sanity/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const query = `
      *[_type == "publicationAccessLedger" && customerIdentityHash == $email && operationalLedgerState == "active"] {
        "title": purchasedPublicationReference->title,
        "type": purchasedPublicationReference->_type,
        "slug": purchasedPublicationReference->slug.current,
        "audience": audience,
        "acquiredAt": grantedSystemTimestamp,
        "hasTeacherFile": purchasedPublicationReference->teacherFile.asset->url != null,
        "files": [
          {
            "url": purchasedPublicationReference->studentFile.asset->url,
            "label": "Download Student Edition"
          },
          {
            "url": purchasedPublicationReference->teacherFile.asset->url,
            "label": "Download Teacher Edition"
          }
        ]
      }
    `;
    
    // We should also look for registrations if a physical book was registered
    const registrationsQuery = `
      *[_type == "publicationRegistration" && email == $email && status == "verified"] {
        "title": publication->title,
        "type": publication->_type,
        "slug": publication->slug.current,
        "acquiredAt": registeredAt,
        "hasTeacherFile": false,
        "files": [
          {
            "url": publication->studentFile.asset->url,
            "label": "Download Student Edition"
          }
        ]
      }
    `;

    const [ledgerItems, registrationItems] = await Promise.all([
      client.fetch(query, { email }),
      client.fetch(registrationsQuery, { email })
    ]);

    // Format output
    const formattedLedger = ledgerItems.map((item: any) => ({
      ...item,
      type: item.type === 'book' ? 'Textbook' : 'Digital Imprint',
      files: (item.files || []).filter((f: any) => f?.url)
    }));

    const formattedRegistrations = registrationItems.map((item: any) => ({
      ...item,
      type: 'Registered Copy'
    }));

    // Deduplicate logic can go here if needed, but for now combine
    const allItems = [...formattedLedger, ...formattedRegistrations];

    // Sort by acquired date descending
    allItems.sort((a, b) => new Date(b.acquiredAt).getTime() - new Date(a.acquiredAt).getTime());

    return NextResponse.json({ success: true, items: allItems });
  } catch (error: any) {
    console.error('Library fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch library items' }, { status: 500 });
  }
}
