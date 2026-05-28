import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const reference = searchParams.get('reference');
    const email = searchParams.get('email');

    if (!reference && !email) {
      return NextResponse.json({ success: false, error: 'Missing identifier' }, { status: 400 });
    }

    let query = '';
    let params = {};

    if (reference) {
      // If we have a Paystack reference, we can check for that in metadata or cross-verify
      // For now, we assume the webhook has already created the ledger entry.
      // We look for a ledger entry created recently with this metadata if possible, 
      // or we just verify the Paystack reference directly with Paystack API.
      
      const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
          'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      });
      const paystackData = await paystackResponse.json();

      if (!paystackData.status || paystackData.data.status !== 'success') {
        return NextResponse.json({ success: false, error: 'Payment not verified' }, { status: 402 });
      }

      const customerEmail = paystackData.data.customer.email;
      const publicationId = paystackData.data.metadata.publicationId;

      // Check if ledger exists
      query = `*[_type == "publicationAccessLedger" && customerIdentityHash == $email && purchasedPublicationReference._ref == $pubId][0] {
        _id,
        "publication": purchasedPublicationReference-> {
          title,
          "studentFileUrl": studentFile.asset->url,
          "teacherFileUrl": teacherFile.asset->url,
          "resources": embeddedResources[]-> {
            title,
            matrixId,
            secureAssetUrl
          }
        }
      }`;
      params = { email: customerEmail, pubId: publicationId };
    } else {
      // Manual email check (for returning users)
      query = `*[_type == "publicationAccessLedger" && customerIdentityHash == $email] {
        _id,
        "publication": purchasedPublicationReference-> {
          title,
          "studentFileUrl": studentFile.asset->url,
          "teacherFileUrl": teacherFile.asset->url
        }
      }`;
      params = { email };
    }

    let access = await client.fetch(query, params);

    if (!access) {
      if (reference) {
        // Fallback: If Paystack verified the transaction but the webhook hasn't created the ledger yet
        const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
          headers: {
            'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        });
        const paystackData = await paystackResponse.json();
        
        if (paystackData.status && paystackData.data.status === 'success') {
          const publicationId = paystackData.data.metadata.publicationId;
          const publication = await client.fetch(`*[_id == $pubId || _id == "drafts." + $pubId][0] {
            title,
            "studentFileUrl": studentFile.asset->url,
            "teacherFileUrl": teacherFile.asset->url,
            "resources": embeddedResources[]-> {
              title,
              matrixId,
              secureAssetUrl
            }
          }`, { pubId: publicationId });
          
          if (publication) {
            return NextResponse.json({ success: true, data: { publication } });
          }
        }
      }
      return NextResponse.json({ success: false, error: 'No access record found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: access });
  } catch (error) {
    console.error('Access verification error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
