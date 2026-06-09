// src/app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'OK',
    message: 'API is working',
    timestamp: new Date().toISOString(),
    version: 'v2.0 - Fixed price conversion',
    env: {
      hasStripeSecret: !!process.env.STRIPE_SECRET_KEY,
      hasSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
      nodeEnv: process.env.NODE_ENV
    }
  });
}
