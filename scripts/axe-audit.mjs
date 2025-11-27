import puppeteer from 'puppeteer'
import fs from 'fs/promises'

const URL = process.env.URL || 'http://localhost:3000/services'
const AXE_URL = 'https://unpkg.com/axe-core@4.8.0/axe.min.js'

async function fetchAxe() {
  const res = await fetch(AXE_URL)
  if (!res.ok) throw new Error('Failed to fetch axe-core')
  return await res.text()
}

async function waitForPage(page, url, timeout = 60000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    try {
      // Add cache-busting query parameter
      const cacheUrl = url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now()
      await page.goto(cacheUrl, { waitUntil: 'networkidle2', timeout: 10000 })
      return
    } catch (err) {
      // retry
      await new Promise(r => setTimeout(r, 2000))
    }
  }
  throw new Error('Timeout waiting for page to become available')
}

;(async () => {
  console.log(`Launching browser and auditing ${URL}`)
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  try {
    const page = await browser.newPage()
    // increase default timeout
    page.setDefaultNavigationTimeout(120000)

    await waitForPage(page, URL, 90000)

    console.log('Page loaded — injecting axe-core')
    const axeSource = await fetchAxe()
    await page.addScriptTag({ content: axeSource })

    console.log('Running axe.run()')
    const results = await page.evaluate(async () => {
      // @ts-ignore
      // Run default axe ruleset
      return await window.axe.run(document)
    })

    await fs.writeFile('axe-report.json', JSON.stringify(results, null, 2))
    console.log(`Saved axe report to axe-report.json — violations: ${results.violations.length}`)

    if (results.violations.length > 0) {
      console.log('Top violations:')
      for (const v of results.violations.slice(0, 10)) {
        console.log(`- ${v.id} [${v.impact}] ${v.description} — nodes: ${v.nodes.length} — see ${v.helpUrl}`)
      }
    } else {
      console.log('No accessibility violations found by axe-core')
    }

    await page.close()
  } catch (err) {
    console.error('Audit failed:', err)
    process.exitCode = 2
  } finally {
    await browser.close()
  }
})()
