import { NextRequest, NextResponse } from 'next/server'
import { groq } from 'next-sanity'
import { client } from '@/sanity/client'
import type { CurriculumDocument } from '@/lib/curriculum-types'
import { renderCurriculumPdfHtml } from '@/lib/curriculum-pdf'
import { generatePdfFallback, generatePdfFromHtml } from '@/lib/pdf-generator'

type Params = {
  slug: string
}

export async function GET(request: NextRequest, context: { params: Promise<Params> }) {
  const { slug } = await context.params

  try {
    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
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
      { slug }
    )

    if (!curriculum) {
      return NextResponse.json({ error: 'Curriculum document not found' }, { status: 404 })
    }

    let pdfBuffer: Uint8Array | null = null

    try {
      const html = renderCurriculumPdfHtml(curriculum)
      pdfBuffer = await generatePdfFromHtml(html)
    } catch (error) {
      console.warn('Puppeteer PDF generation failed:', error)
      try {
        pdfBuffer = await generatePdfFallback(curriculum)
      } catch (fallbackError) {
        console.error('Fallback PDF generation failed:', fallbackError)
        return NextResponse.json(
          {
            error: 'PDF generation service temporarily unavailable',
            message: 'Please try again shortly.',
          },
          { status: 503 }
        )
      }
    }

    if (!pdfBuffer) {
      return NextResponse.json(
        { error: 'Failed to generate PDF' },
        { status: 500 }
      )
    }

    // Return PDF with appropriate headers
    const buffer = Buffer.from(pdfBuffer)

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${slug}-curriculum.pdf"`,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
