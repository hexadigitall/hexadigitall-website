import { NextRequest, NextResponse } from 'next/server'
import { groq } from 'next-sanity'
import { client, writeClient } from '@/sanity/client'
import type { CurriculumDocument } from '@/lib/curriculum-types'
import { renderCurriculumPdfHtml } from '@/lib/curriculum-pdf'
import { generatePdfFallback, generatePdfFromHtml } from '@/lib/pdf-generator'

async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  try {
    const token = authHeader.substring(7)
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
    const hoursSinceLogin = (Date.now() - decoded.timestamp) / (1000 * 60 * 60)

    if (hoursSinceLogin >= 24) {
      return null
    }

    if (decoded.userId) {
      const user = await client.fetch(
        `*[_type == "user" && _id == $id][0]{_id, username, role, status}`,
        { id: decoded.userId }
      )

      if (!user || user.status === 'suspended') {
        return null
      }

      return user
    }

    return decoded
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)

    if (!user || (user.role !== 'student' && user.role !== 'admin')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { enrollmentId } = await request.json()
    if (!enrollmentId) {
      return NextResponse.json({ success: false, message: 'Enrollment ID is required' }, { status: 400 })
    }

    const userId = user._id || user.userId

    const enrollment = await client.fetch(
      groq`*[_type == "enrollment" && _id == $enrollmentId && studentId._ref == $userId][0]{
        _id,
        studentName,
        studentEmail,
        curriculumPdf {
          asset->{
            _id,
            url,
            originalFilename
          }
        },
        "course": courseId->{
          _id,
          title,
          slug,
          summary,
          description
        }
      }`,
      { enrollmentId, userId }
    )

    if (!enrollment?.course?.slug?.current) {
      return NextResponse.json({ success: false, message: 'Enrollment not found' }, { status: 404 })
    }

    if (enrollment.curriculumPdf?.asset?.url) {
      return NextResponse.json({
        success: true,
        reused: true,
        url: enrollment.curriculumPdf.asset.url,
        filename: enrollment.curriculumPdf.asset.originalFilename,
      })
    }

    const curriculum = await client.fetch<CurriculumDocument | null>(
      groq`*[_type == "curriculum" && course->slug.current == $slug][0]{
        _id,
        title,
        slug,
        summary,
        heroSummary,
        heroTags,
        duration,
        level,
        studyTime,
        schoolName,
        welcomeTitle,
        welcomeMessages,
        prerequisites,
        complementaryCourses,
        essentialResources,
        learningRoadmap,
        weeks,
        capstoneProjects,
        "course": course->{
          _id,
          title,
          slug,
          summary,
          description
        }
      }`,
      { slug: enrollment.course.slug.current }
    )

    if (!curriculum) {
      return NextResponse.json({ success: false, message: 'Curriculum not found' }, { status: 404 })
    }

    let generatedPdf: Uint8Array
    try {
      generatedPdf = await generatePdfFromHtml(renderCurriculumPdfHtml(curriculum), {
        title: curriculum.title,
      })
    } catch (error) {
      console.warn('Primary curriculum PDF generation failed, using fallback:', error)
      generatedPdf = await generatePdfFallback(curriculum)
    }

    const pdfBuffer = Buffer.from(generatedPdf)
    const safeCourseSlug = enrollment.course.slug.current.replace(/[^a-z0-9-]/gi, '-').toLowerCase()
    const filename = `${safeCourseSlug}-curriculum.pdf`

    const asset = await writeClient.assets.upload('file', pdfBuffer, {
      filename,
      contentType: 'application/pdf',
    })

    await writeClient
      .patch(enrollment._id)
      .set({
        curriculumPdf: {
          _type: 'file',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
        },
        curriculumPdfGeneratedAt: new Date().toISOString(),
        curriculumSlugSnapshot: curriculum.slug.current,
      })
      .commit()

    return NextResponse.json({
      success: true,
      url: asset.url,
      filename,
    })
  } catch (error) {
    console.error('Failed to generate curriculum PDF for enrollment:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to generate curriculum PDF' },
      { status: 500 }
    )
  }
}
