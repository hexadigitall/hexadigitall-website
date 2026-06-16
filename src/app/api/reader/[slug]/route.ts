import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { client } from '@/sanity/client';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { cookies } from 'next/headers';

const LOCAL_READER_FILES: Record<string, string> = {
  'architecting-landing-zones': 'architecting-landing-zones-kdp-6x9-teacher.html',
  'devops-engineering-cloud-infrastructure-core': 'devops-kdp-6x9-teacher.html',
  'dunce-to-midjourney-pro': 'dunce-to-midjourney-pro.html',
};

async function isTeacher(): Promise<boolean> {
  // 1. Try NextAuth session
  const session = await auth();
  if (session) {
    const user = session.user as any;
    if (user?.email) {
      const sanityUser = await client.fetch(
        `*[_type == "user" && email == $email][0] { role }`,
        { email: user.email }
      );
      if (sanityUser?.role === 'teacher' || sanityUser?.role === 'instructor' || sanityUser?.role === 'admin') {
        return true;
      }
    }
  }

  // 2. Fallback to admin_token cookie (credential login)
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get('admin_token')?.value;
    if (raw) {
      const decoded = JSON.parse(Buffer.from(decodeURIComponent(raw), 'base64').toString('utf-8')) as {
        role?: string; timestamp?: number;
      };
      if (decoded?.timestamp && Date.now() - decoded.timestamp < 24 * 60 * 60 * 1000) {
        if (decoded.role === 'teacher' || decoded.role === 'instructor' || decoded.role === 'admin') {
          return true;
        }
      }
    }
  } catch {
    // ignore
  }

  return false;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const isCheck = request.nextUrl.searchParams.get('check') === '1';

  if (!(await isTeacher())) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const filename = LOCAL_READER_FILES[slug];
  if (!filename) {
    return new NextResponse('Not found', { status: 404 });
  }

  const filePath = join(process.cwd(), 'data', 'textbooks', 'kdp', slug, filename);
  if (!existsSync(filePath)) {
    return new NextResponse('File not found', { status: 404 });
  }

  if (isCheck) {
    return new NextResponse('OK', { status: 200 });
  }

  const content = readFileSync(filePath, 'utf-8');
  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      'X-Frame-Options': 'SAMEORIGIN',
    },
  });
}
