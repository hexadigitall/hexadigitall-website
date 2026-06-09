import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/client'
import { emailService } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      phone,
      service,
      city,
      message,
      campaignName = 'dec_jan_2025',
      campaignSource,
      campaignMedium,
      campaignContent,
      campaignTerm,
    } = body

    if (!name || !email || !service || !city) {
      return NextResponse.json(
        { error: 'Name, email, service, and city are required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined
    const userAgent = request.headers.get('user-agent') || undefined
    const referrer = request.headers.get('referer') || undefined

    const submission = {
      _type: 'formSubmission',
      type: 'campaign',
      status: 'new',
      name,
      email,
      phone,
      service,
      city,
      message,
      campaignName,
      campaignSource,
      campaignMedium,
      campaignContent,
      campaignTerm,
      landingPage: referrer,
      formData: {
        ...body,
      },
      submittedAt: new Date().toISOString(),
      ipAddress,
      userAgent,
      referrer,
    }

    try {
      await writeClient.create(submission)
    } catch (dbError) {
      console.error('Failed to save campaign lead:', dbError)
    }

    try {
      await emailService.sendContactForm({
        name,
        email,
        service,
        message: message || `Campaign lead for ${service} in ${city}`,
      })
    } catch (emailError) {
      console.error('Failed to send campaign lead email:', emailError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Campaign lead error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
