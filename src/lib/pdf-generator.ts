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
