import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

type Params = {
  slug: string
}

export async function GET(request: NextRequest, context: { params: Promise<Params> }) {
  const { slug } = await context.params

  try {
    // Sanitize slug to prevent directory traversal
    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
    }

    // Try to find the curriculum file
    const curriculumDir = path.join(process.cwd(), 'public', 'curriculums')
    const filename = `curriculum-${slug}.html`
    const filepath = path.join(curriculumDir, filename)

    // Security: verify the path is within the curriculum directory
    if (!filepath.startsWith(curriculumDir)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Read the HTML file
    let htmlContent: string
    try {
      htmlContent = await fs.readFile(filepath, 'utf-8')
    } catch {
      return NextResponse.json({ error: 'Curriculum file not found' }, { status: 404 })
    }

    // Try to use puppeteer if available, otherwise use a lightweight fallback
    let pdfBuffer: Uint8Array | null = null

    try {
      // Dynamically import puppeteer (available in both dev and build environments on Vercel)
      const puppeteer = await import('puppeteer')
      const browser = await puppeteer.default.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      })

      const page = await browser.newPage()
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' })

      // Set A4 paper size with reasonable margins
      pdfBuffer = await page.pdf({
        format: 'A4',
        margin: { top: '14mm', bottom: '14mm', left: '14mm', right: '14mm' },
        printBackground: true,
      })

      await browser.close()
    } catch (error) {
      console.warn('Puppeteer PDF generation failed, attempting fallback:', error)

      // Fallback: use html2pdf or return with instructions
      // For now, return a message to use browser print
      return NextResponse.json(
        {
          error: 'PDF generation service temporarily unavailable',
          message: 'Please use the Print / Save option instead',
        },
        { status: 503 }
      )
    }

    if (!pdfBuffer) {
      return NextResponse.json(
        { error: 'Failed to generate PDF' },
        { status: 500 }
      )
    }

    // Return PDF with appropriate headers
    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${slug}-curriculum.pdf"`,
        'Content-Length': Buffer.from(pdfBuffer).length.toString(),
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
