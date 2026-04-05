import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import type { CurriculumDocument } from '@/lib/curriculum-types'

export async function generatePdfFromHtml(html: string): Promise<Uint8Array> {
  let browser: { newPage: () => Promise<{ setContent: (value: string, options: { waitUntil: 'networkidle0' }) => Promise<void>; pdf: (options: { format: 'A4'; margin: { top: string; bottom: string; left: string; right: string }; printBackground: true; preferCSSPageSize: true }) => Promise<Uint8Array> }>; close: () => Promise<void> }

  if (process.env.VERCEL) {
    const chromium = (await import('@sparticuz/chromium')).default
    const puppeteerCore = await import('puppeteer-core')

    browser = await puppeteerCore.default.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
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

    return await page.pdf({
      format: 'A4',
      margin: { top: '12mm', bottom: '12mm', left: '12mm', right: '12mm' },
      printBackground: true,
      preferCSSPageSize: true,
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
  const margin = 40
  const lineHeight = 15

  let page = pdf.addPage(pageSize)
  let y = page.getHeight() - margin

  const drawWrappedText = (text: string, size = 11, bold = false) => {
    const safeText = sanitizeText(text)
    if (!safeText) return

    const font = bold ? fontBold : fontRegular
    const maxWidth = page.getWidth() - margin * 2
    const words = safeText.split(/\s+/).filter(Boolean)
    let line = ''

    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word
      const width = font.widthOfTextAtSize(candidate, size)

      if (width > maxWidth && line) {
        if (y < margin + lineHeight) {
          page = pdf.addPage(pageSize)
          y = page.getHeight() - margin
        }
        page.drawText(line, { x: margin, y, size, font, color: rgb(0.1, 0.12, 0.16) })
        y -= lineHeight
        line = word
      } else {
        line = candidate
      }
    }

    if (line) {
      if (y < margin + lineHeight) {
        page = pdf.addPage(pageSize)
        y = page.getHeight() - margin
      }
      page.drawText(line, { x: margin, y, size, font, color: rgb(0.1, 0.12, 0.16) })
      y -= lineHeight
    }
  }

  const drawHeading = (text: string, size = 16) => {
    const safeText = sanitizeText(text)
    if (!safeText) return

    if (y < margin + 36) {
      page = pdf.addPage(pageSize)
      y = page.getHeight() - margin
    }
    page.drawText(safeText, { x: margin, y, size, font: fontBold, color: rgb(0.03, 0.25, 0.37) })
    y -= size + 8
  }

  drawHeading(curriculum.title, 20)
  if (curriculum.summary) drawWrappedText(curriculum.summary, 11)
  y -= 6

  if (curriculum.duration || curriculum.level || curriculum.studyTime || curriculum.schoolName) {
    drawHeading('Course Snapshot', 14)
    if (curriculum.duration) drawWrappedText(`Duration: ${curriculum.duration}`)
    if (curriculum.level) drawWrappedText(`Level: ${curriculum.level}`)
    if (curriculum.studyTime) drawWrappedText(`Study Time: ${curriculum.studyTime}`)
    if (curriculum.schoolName) drawWrappedText(`School: ${curriculum.schoolName}`)
    y -= 4
  }

  if (curriculum.welcomeMessages?.length) {
    drawHeading(curriculum.welcomeTitle || 'Welcome', 14)
    for (const paragraph of curriculum.welcomeMessages) {
      drawWrappedText(paragraph)
      y -= 2
    }
  }

  const drawListSection = (title: string, items?: string[]) => {
    if (!items?.length) return
    drawHeading(title, 14)
    for (const item of items) drawWrappedText(`- ${item}`)
    y -= 4
  }

  drawListSection('Prerequisites', curriculum.prerequisites)
  drawListSection('Essential Resources', curriculum.essentialResources)
  drawListSection('Learning Roadmap', curriculum.learningRoadmap)

  if (curriculum.weeks?.length) {
    drawHeading('Weekly Curriculum', 15)
    for (const week of curriculum.weeks) {
      drawHeading(`Week ${week.weekNumber}: ${week.topic}`, 12)
      if (week.duration) drawWrappedText(`Duration: ${week.duration}`)
      for (const outcome of week.outcomes || []) drawWrappedText(`- ${outcome}`)
      if (week.labItems?.length) {
        drawWrappedText('Lab:')
        for (const labItem of week.labItems) drawWrappedText(`- ${labItem}`)
      }
      y -= 4
    }
  }

  if (curriculum.capstoneProjects?.length) {
    drawHeading('Capstone Projects', 15)
    for (const project of curriculum.capstoneProjects) {
      drawHeading(project.title, 12)
      if (project.description) drawWrappedText(project.description)
      for (const item of project.deliverables || []) drawWrappedText(`- ${item}`)
      y -= 4
    }
  }

  return await pdf.save()
}
