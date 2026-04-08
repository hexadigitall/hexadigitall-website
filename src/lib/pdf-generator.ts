import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import type { CurriculumDocument } from '@/lib/curriculum-types'

interface PdfRenderOptions {
  title?: string
}

export async function generatePdfFromHtml(html: string, options?: PdfRenderOptions): Promise<Uint8Array> {
  let browser: { newPage: () => Promise<{ setContent: (value: string, options: { waitUntil: 'networkidle0' }) => Promise<void>; pdf: (options: { format: 'A4'; margin: { top: string; bottom: string; left: string; right: string }; printBackground: true; preferCSSPageSize: true; displayHeaderFooter: true; headerTemplate: string; footerTemplate: string }) => Promise<Uint8Array> }>; close: () => Promise<void> }

  if (process.env.VERCEL) {
    const chromium = (await import('@sparticuz/chromium')).default
    const puppeteerCore = await import('puppeteer-core')
    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || await chromium.executablePath()

    browser = await puppeteerCore.default.launch({
      args: [...chromium.args, '--font-render-hinting=none'],
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: true,
    })
  } else {
    const puppeteer = await import('puppeteer')
    browser = await puppeteer.default.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
  }

  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })

    const title = (options?.title || 'Hexadigitall Curriculum').replace(/</g, '&lt;').replace(/>/g, '&gt;')

    const headerTemplate = `
      <div style="width:100%;padding:0 12mm;font-size:8.8px;color:#1e3a8a;font-family:Arial,sans-serif;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Hexadigitall</span>
        <span style="opacity:0.85;">${title}</span>
      </div>
    `

    const footerTemplate = `
      <div style="width:100%;padding:0 12mm;font-size:8px;color:#4b5563;font-family:Arial,sans-serif;display:flex;justify-content:space-between;align-items:center;">
        <span>Official Curriculum Document</span>
        <span><span class="pageNumber"></span>/<span class="totalPages"></span></span>
      </div>
    `

    return await page.pdf({
      format: 'A4',
      margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' },
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: true,
      headerTemplate,
      footerTemplate,
    })
  } finally {
    await browser.close()
  }
}

export async function generatePdfFallback(curriculum: CurriculumDocument): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  const fontRegular = await pdf.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold)

  const sanitizeText = (value: string): string =>
    value
      .normalize('NFKD')
      .replace(/[^\u0000-\u00FF]/g, '')
      .replace(/\s+/g, ' ')
      .trim()

  const pageSize: [number, number] = [595.28, 841.89] // A4 points
  const margin = 44
  const lineHeight = 15

  const ink = rgb(0.07, 0.11, 0.21)
  const soft = rgb(0.24, 0.31, 0.45)
  const brandBlue = rgb(0.11, 0.31, 0.85)
  const coverBlue = rgb(0.06, 0.18, 0.52)
  const lightSurface = rgb(0.95, 0.97, 1)
  const line = rgb(0.82, 0.88, 0.96)

  let page = pdf.addPage(pageSize)
  let y = page.getHeight() - margin

  const getWrappedLines = (text: string, size: number, bold = false, maxWidth = page.getWidth() - margin * 2): string[] => {
    const safeText = sanitizeText(text)
    if (!safeText) return []
    const font = bold ? fontBold : fontRegular
    const words = safeText.split(/\s+/).filter(Boolean)
    const lines: string[] = []
    let lineText = ''

    for (const word of words) {
      const candidate = lineText ? `${lineText} ${word}` : word
      const width = font.widthOfTextAtSize(candidate, size)
      if (width > maxWidth && lineText) {
        lines.push(lineText)
        lineText = word
      } else {
        lineText = candidate
      }
    }

    if (lineText) lines.push(lineText)
    return lines
  }

  const ensureSpace = (required: number) => {
    if (y < margin + required) {
      page = pdf.addPage(pageSize)
      y = page.getHeight() - margin
    }
  }

  const drawWrappedText = (text: string, size = 11, bold = false, color = soft, indent = 0) => {
    const lines = getWrappedLines(text, size, bold, page.getWidth() - margin * 2 - indent)
    const font = bold ? fontBold : fontRegular

    for (const lineText of lines) {
      ensureSpace(lineHeight + 2)
      page.drawText(lineText, { x: margin + indent, y, size, font, color })
      y -= lineHeight
    }
  }

  const drawSectionHeader = (title: string) => {
    const safeTitle = sanitizeText(title)
    if (!safeTitle) return

    ensureSpace(34)
    const top = y + 8
    page.drawRectangle({
      x: margin,
      y: top - 22,
      width: page.getWidth() - margin * 2,
      height: 22,
      color: lightSurface,
      borderColor: line,
      borderWidth: 1,
    })
    page.drawText(safeTitle, {
      x: margin + 10,
      y: top - 15,
      size: 11,
      font: fontBold,
      color: brandBlue,
    })
    y -= 24
  }

  // Branded cover page for the fallback path.
  page.drawRectangle({
    x: 0,
    y: 0,
    width: page.getWidth(),
    height: page.getHeight(),
    color: coverBlue,
  })

  page.drawRectangle({
    x: page.getWidth() - margin - 76,
    y: page.getHeight() - 110,
    width: 76,
    height: 76,
    color: rgb(1, 1, 1),
    opacity: 0.1,
    borderColor: rgb(0.75, 0.87, 1),
    borderWidth: 1,
    borderOpacity: 0.55,
  })

  page.drawText('H', {
    x: page.getWidth() - margin - 50,
    y: page.getHeight() - 88,
    size: 34,
    font: fontBold,
    color: rgb(0.5, 0.83, 1),
  })

  page.drawText('Hexadigitall Technologies', {
    x: margin,
    y: page.getHeight() - 80,
    size: 12,
    font: fontBold,
    color: rgb(1, 1, 1),
  })

  const coverTitleLines = getWrappedLines(curriculum.title, 28, true, page.getWidth() - margin * 2)
  let coverTitleY = page.getHeight() - 160
  for (const lineText of coverTitleLines.slice(0, 4)) {
    page.drawText(lineText, {
      x: margin,
      y: coverTitleY,
      size: 28,
      font: fontBold,
      color: rgb(1, 1, 1),
    })
    coverTitleY -= 34
  }

  const summary = curriculum.heroSummary || curriculum.summary || curriculum.course?.summary || curriculum.course?.description
  if (summary) {
    const coverSummaryLines = getWrappedLines(summary, 12, false, page.getWidth() - margin * 2)
    let coverSummaryY = coverTitleY - 10
    for (const lineText of coverSummaryLines.slice(0, 6)) {
      page.drawText(lineText, {
        x: margin,
        y: coverSummaryY,
        size: 12,
        font: fontRegular,
        color: rgb(0.9, 0.94, 1),
      })
      coverSummaryY -= 17
    }
  }

  const metaItems = [
    `Duration: ${sanitizeText(curriculum.duration || 'TBD')}`,
    `Level: ${sanitizeText(curriculum.level || 'TBD')}`,
    `Study Time: ${sanitizeText(curriculum.studyTime || 'TBD')}`,
    `School: ${sanitizeText(curriculum.schoolName || 'Hexadigitall')}`,
  ]

  let metaY = 150
  for (const item of metaItems) {
    page.drawText(item, {
      x: margin,
      y: metaY,
      size: 11,
      font: fontBold,
      color: rgb(0.88, 0.93, 1),
    })
    metaY -= 20
  }

  page.drawText('Official Curriculum Guide', {
    x: margin,
    y: 58,
    size: 10,
    font: fontRegular,
    color: rgb(0.86, 0.92, 1),
  })

  page = pdf.addPage(pageSize)
  y = page.getHeight() - margin

  drawSectionHeader('Program Snapshot')
  if (summary) {
    drawWrappedText(summary, 11, false, soft)
    y -= 4
  }

  if (curriculum.heroTags?.length) {
    drawWrappedText(`Focus Areas: ${curriculum.heroTags.map((tag) => sanitizeText(tag)).join(' | ')}`, 10, false, brandBlue)
    y -= 4
  }

  if (curriculum.welcomeMessages?.length) {
    drawSectionHeader(curriculum.welcomeTitle || 'Welcome')
    for (const message of curriculum.welcomeMessages) {
      drawWrappedText(message, 11, false, soft)
      y -= 2
    }
  }

  const drawListSection = (title: string, items?: string[]) => {
    if (!items?.length) return
    drawSectionHeader(title)
    for (const item of items) {
      drawWrappedText(`- ${item}`, 11, false, soft)
    }
    y -= 3
  }

  drawListSection('Prerequisites', curriculum.prerequisites)
  drawListSection('Essential Resources', curriculum.essentialResources)
  drawListSection('Learning Roadmap', curriculum.learningRoadmap)

  if (curriculum.weeks?.length) {
    drawSectionHeader('Weekly Curriculum')
    for (const week of curriculum.weeks) {
      const weekTitle = `Week ${week.weekNumber}: ${sanitizeText(week.topic)}`
      ensureSpace(30)
      page.drawText(weekTitle, {
        x: margin,
        y,
        size: 12,
        font: fontBold,
        color: ink,
      })
      y -= 17

      if (week.duration) {
        drawWrappedText(`Duration: ${week.duration}`, 10, false, brandBlue)
      }

      for (const outcome of week.outcomes || []) {
        drawWrappedText(`- ${outcome}`, 11, false, soft, 10)
      }

      if (week.labItems?.length) {
        drawWrappedText(sanitizeText(week.labTitle || 'Lab Exercise'), 10, true, brandBlue)
        for (const labItem of week.labItems) {
          drawWrappedText(`- ${labItem}`, 10, false, soft, 10)
        }
      }

      y -= 6
    }
  }

  if (curriculum.capstoneProjects?.length) {
    drawSectionHeader('Capstone Projects')
    for (const project of curriculum.capstoneProjects) {
      ensureSpace(24)
      drawWrappedText(project.title, 12, true, ink)
      if (project.description) drawWrappedText(project.description, 11, false, soft)
      for (const item of project.deliverables || []) {
        drawWrappedText(`- ${item}`, 11, false, soft, 10)
      }
      y -= 5
    }
  }

  return await pdf.save()
}
