import { NextRequest, NextResponse } from 'next/server';
import { createDownloadToken } from '@/lib/download-token';

export async function POST(request: NextRequest) {
  try {
    const { fileUrl, email, publicationId } = await request.json();

    if (!fileUrl || !email || !publicationId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const token = createDownloadToken(fileUrl, email, publicationId);
    const downloadUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://hexadigitall.com'}/api/publications/download?token=${encodeURIComponent(token)}`;

    return NextResponse.json({ success: true, downloadUrl });
  } catch {
    return NextResponse.json({ error: 'Failed to generate download token' }, { status: 500 });
  }
}
