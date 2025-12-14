import { NextRequest, NextResponse } from 'next/server'
import { client, writeClient } from '@/sanity/client'

export async function GET() {
  try {
    const query = `*[_type == "formSubmission"] | order(submittedAt desc) {
      _id,
      type,
      status,
      priority,
      name,
      email,
      phone,
      company,
      subject,
      message,
      formData,
      submittedAt,
      ipAddress,
      userAgent
    }`

    const submissions = await client.fetch(query)

    return NextResponse.json({
      success: true,
      submissions,
    })
  } catch (error) {
    console.error('Failed to fetch submissions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status, priority, notes } = await request.json()

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Submission ID is required' },
        { status: 400 }
      )
    }

    const updates: Record<string, unknown> = {}
    if (status) updates.status = status
    if (priority) updates.priority = priority
    if (notes !== undefined) updates.notes = notes

    await writeClient.patch(id).set(updates).commit()

    return NextResponse.json({
      success: true,
      message: 'Submission updated successfully',
    })
  } catch (error) {
    console.error('Failed to update submission:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update submission' },
      { status: 500 }
    )
  }
}
