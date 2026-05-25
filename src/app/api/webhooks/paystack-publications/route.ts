import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { client } from '@/sanity/client';

export async function POST(request: NextRequest) {
  try {
    const contextRawStringPayload = await request.text();
    const inboundRequestSignature = request.headers.get('x-paystack-signature');
    
    const locallyGeneratedHashVerification = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(contextRawStringPayload)
      .digest('hex');

    if (inboundRequestSignature !== locallyGeneratedHashVerification) {
      return NextResponse.json({ error: 'Cryptographic Authentication Violation' }, { status: 401 });
    }

    const parseClearingDataMatrix = JSON.parse(contextRawStringPayload);

    if (parseClearingDataMatrix.event === 'charge.success') {
      const dataNode = parseClearingDataMatrix.data;
      const verifiedMetadata = dataNode.metadata;
      const verifiedUserEmailToken = dataNode.customer.email;
      const targetPublicationReferenceId = verifiedMetadata.publicationId;

      await client.create({
        _type: 'publicationAccessLedger',
        customerIdentityHash: verifiedUserEmailToken,
        purchasedPublicationReference: {
          _type: 'reference',
          _ref: targetPublicationReferenceId,
        },
        grantedSystemTimestamp: new Date().toISOString(),
        operationalLedgerState: 'active',
      });
    }

    return NextResponse.json({ processed: true }, { status: 200 });
  } catch (lifecycleSystemFault) {
    console.error('Cleardown pipeline execution trace breakdown:', lifecycleSystemFault);
    return NextResponse.json({ error: 'System Fulfillment Pipeline Failure' }, { status: 500 });
  }
}
