// src/app/api/custom-build/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { emailService } from '@/lib/email'

interface Payload {
  form?: string
  platform: 'web' | 'mobile' | 'both' | null
  features: string[]
  budget: 'basic' | 'standard' | 'premium' | 'enterprise' | null
  estimate: string
  email: string
  company?: string
  timestamp?: string
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function buildAdminHtml(p: Payload) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin:0 auto;">
      <h2 style="margin:0 0 8px 0;">New Custom Build Request</h2>
      <p style="margin:0 0 16px 0; color:#555;">Generated ${new Date().toLocaleString()}</p>
      <table style="width:100%; border-collapse:collapse;">
        <tr><td style="padding:8px 0; font-weight:600;">Email</td><td>${p.email}</td></tr>
        ${p.company ? `<tr><td style="padding:8px 0; font-weight:600;">Company</td><td>${p.company}</td></tr>` : ''}
        <tr><td style="padding:8px 0; font-weight:600;">Platform</td><td>${p.platform || '—'}</td></tr>
        <tr><td style="padding:8px 0; font-weight:600;">Budget</td><td>${p.budget || '—'}</td></tr>
        <tr><td style="padding:8px 0; font-weight:600;">Features</td><td>${p.features?.length ? p.features.join(', ') : '—'}</td></tr>
        <tr><td style="padding:8px 0; font-weight:600;">Estimate</td><td>${p.estimate}</td></tr>
      </table>
      <div style="margin-top:16px; padding:12px; background:#fff8e1; border:1px solid #ffe082; border-radius:8px;">
        <strong>Next Step:</strong> Reply to the client to schedule a discovery call.
      </div>
    </div>
  `
}

function buildUserHtml(p: Payload) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin:0 auto;">
      <h2 style="margin:0 0 8px 0;">We received your custom build request ✅</h2>
      <p style="margin:0 0 16px 0; color:#555;">Thanks for reaching out! Here is a quick summary.</p>
      <table style="width:100%; border-collapse:collapse;">
        ${p.company ? `<tr><td style="padding:8px 0; font-weight:600;">Company</td><td>${p.company}</td></tr>` : ''}
        <tr><td style="padding:8px 0; font-weight:600;">Platform</td><td>${p.platform || '—'}</td></tr>
        <tr><td style="padding:8px 0; font-weight:600;">Budget</td><td>${p.budget || '—'}</td></tr>
        <tr><td style="padding:8px 0; font-weight:600;">Features</td><td>${p.features?.length ? p.features.join(', ') : '—'}</td></tr>
        <tr><td style="padding:8px 0; font-weight:600;">Estimated Range</td><td>${p.estimate}</td></tr>
      </table>
      <p style="margin:16px 0 0 0;">Our team will contact you within 4–6 business hours to finalize your tailored plan.</p>
      <p style="margin:8px 0 0 0;">Need to add details? Reply directly to this email.</p>
    </div>
  `
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as Payload

    if (!payload?.email || !isValidEmail(payload.email)) {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 })
    }

    // Basic normalization
    const data: Payload = {
      form: 'custom-build-request',
      platform: payload.platform ?? null,
      features: Array.isArray(payload.features) ? payload.features : [],
      budget: payload.budget ?? null,
      estimate: payload.estimate || '—',
      email: payload.email,
      company: payload.company || '',
      timestamp: payload.timestamp || new Date().toISOString(),
    }

    // Send admin notification
    const adminEmail = process.env.CONTACT_FORM_RECIPIENT_EMAIL || 'hexadigitztech@gmail.com'
    const adminResult = await emailService.sendEmail({
      to: adminEmail,
      subject: 'New Custom Build Request - Hexadigitall',
      html: buildAdminHtml(data),
      from: process.env.FROM_EMAIL || 'noreply@hexadigitall.com',
      replyTo: data.email,
    })

    // Send confirmation to user
    const userResult = await emailService.sendEmail({
      to: data.email,
      subject: 'Custom Build Request Received - Hexadigitall',
      html: buildUserHtml(data),
      from: process.env.FROM_EMAIL || 'hello@hexadigitall.com',
      replyTo: process.env.CONTACT_FORM_RECIPIENT_EMAIL || 'hexadigitztech@gmail.com',
    })

    const ok = adminResult.success && userResult.success
    return NextResponse.json({ success: ok, admin: adminResult, user: userResult })
  } catch (err) {
    console.error('Custom build email error:', err)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
