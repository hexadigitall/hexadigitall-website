import { NextRequest, NextResponse } from 'next/server'
import { client, writeClient } from '@/sanity/client'

type Attachment = {
  name?: string
  url?: string
  type?: string
  size?: number
  assetId?: string
}

function maskAttachmentUrls(origin: string, attachments?: Attachment[]) {
  if (!attachments || attachments.length === 0) return attachments
  return attachments.map((attachment) => {
    if (!attachment.assetId) return attachment
    return {
      ...attachment,
      url: `${origin}/api/files/${encodeURIComponent(attachment.assetId)}`,
    }
  })
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const submissionId = url.searchParams.get('id')
    const status = url.searchParams.get('status')
    const type = url.searchParams.get('type')
    const limitParam = url.searchParams.get('limit')
    const limit = limitParam ? Math.min(parseInt(limitParam, 10), 50) : null

    const filters: string[] = ['_type == "formSubmission"']
    const params: Record<string, unknown> = {}

    if (submissionId) {
      filters.push('_id == $id')
      params.id = submissionId
    }
    if (status) {
      filters.push('status == $status')
      params.status = status
    }
    if (type) {
      filters.push('type == $type')
      params.type = type
    }

    let query = `*[$[filters]] | order(submittedAt desc)`
    query = query.replace('$[filters]', filters.join(' && '))

    if (limit) {
      query += `[0...${limit}]`
    }

    query += `{
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
      service,
      city,
      campaignName,
      campaignSource,
      campaignMedium,
      campaignContent,
      campaignTerm,
      landingPage,
      formData,
      attachments,
      submittedAt,
      ipAddress,
      userAgent,
      referrer
    }`

    const submissions = await client.fetch(query, params)
    const origin = new URL(request.url).origin
    const maskedSubmissions = submissions.map((submission: { attachments?: Attachment[] }) => ({
      ...submission,
      attachments: maskAttachmentUrls(origin, submission.attachments),
    }))

    return NextResponse.json({
      success: true,
      submissions: maskedSubmissions,
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
    const { id, ids, status, priority, notes } = await request.json()

    if (!id && (!ids || !Array.isArray(ids) || ids.length === 0)) {
      return NextResponse.json(
        { success: false, error: 'Submission ID is required' },
        { status: 400 }
      )
    }

    const updates: Record<string, unknown> = {}
    if (status) updates.status = status
    if (priority) updates.priority = priority
    if (notes !== undefined) updates.notes = notes

    if (ids && Array.isArray(ids) && ids.length > 0) {
      const tx = writeClient.transaction()
      ids.forEach((docId: string) => {
        tx.patch(docId, (p) => p.set(updates))
      })
      await tx.commit()
    } else if (id) {
      await writeClient.patch(id).set(updates).commit()
    }

    return NextResponse.json({
      success: true,
      message: 'Submission(s) updated successfully',
    })
  } catch (error) {
    console.error('Failed to update submission:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update submission' },
      { status: 500 }
    )
  }
}
