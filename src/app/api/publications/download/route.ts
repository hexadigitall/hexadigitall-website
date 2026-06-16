import { NextRequest, NextResponse } from 'next/server';
import { verifyDownloadToken, getDownloadTokenExpiryHours } from '@/lib/download-token';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Download token is required' }, { status: 400 });
    }

    const payload = verifyDownloadToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Download link has expired or is invalid' }, { status: 410 });
    }

    return NextResponse.redirect(payload.fileUrl, 302);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
