#!/usr/bin/env node
/**
 * generate-dunce-to-midjourney-pro-kdp-pdfs.mjs
 *
 * Generates KDP 6x9 interior manuscript PDFs for Dunce to Midjourney Pro.
 *
 * Uses Chrome's native @page CSS engine (Paged.js is blocked).
 * preferCSSPageSize honours the `@page { size: 6in 9in }` rule exactly.
 *
 * Output: public/textbooks/kdp/dunce-to-midjourney-pro/pdfs/
 *
 * Usage:
 *   node generate-dunce-to-midjourney-pro-kdp-pdfs.mjs
 *   node generate-dunce-to-midjourney-pro-kdp-pdfs.mjs paperback
 *   node generate-dunce-to-midjourney-pro-kdp-pdfs.mjs hardcover
 */

import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { createReadStream, statSync, existsSync, mkdirSync } from 'fs';
import { join, extname, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname);
const TITLE_DIR = 'public/textbooks/kdp/dunce-to-midjourney-pro';

const MANUSCRIPTS = [
  {
    id: 'paperback',
    name: 'Dunce to Midjourney Pro — Paperback (6x9)',
    src: `${TITLE_DIR}/dunce-to-midjourney-pro-kdp-6x9.html`,
    out: `${TITLE_DIR}/pdfs/dunce-to-midjourney-pro-kdp-6x9.pdf`,
  },
  {
    id: 'hardcover',
    name: 'Dunce to Midjourney Pro — Hardcover (6x9)',
    src: `${TITLE_DIR}/dunce-to-midjourney-pro-kdp-6x9-hardcover.html`,
    out: `${TITLE_DIR}/pdfs/dunce-to-midjourney-pro-kdp-6x9-hardcover.pdf`,
  },
];

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

const SYMBOL_FONT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Emoji:wght@400;700&family=Noto+Sans+Symbols+2&family=Noto+Sans+Symbols&family=Noto+Sans+SC:wght@400;700&family=Noto+Sans+JP:wght@400;700&display=swap');
  html, body, * {
    font-variant-emoji: emoji;
  }
`;

function startLocalServer(root, port) {
  const server = createServer((req, res) => {
    const urlPath = req.url.split('?')[0];
    const filePath = join(root, urlPath);
    try {
      if (!existsSync(filePath) || !statSync(filePath).isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
        return;
      }
      const ext = extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      createReadStream(filePath).pipe(res);
    } catch {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server error');
    }
  });
  return new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(port, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

async function generatePDF(browser, srcUrl, outPath, name) {
  console.log(`\n  → ${name}`);
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);
  page.setDefaultTimeout(0);
  try {
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (req.url().includes('pagedjs')) {
        req.abort();
      } else {
        req.continue();
      }
    });

    console.log(`     Loading...`);
    await page.goto(srcUrl, { waitUntil: 'domcontentloaded', timeout: 0 });
    await page.waitForFunction(() => document.readyState === 'complete');
    await page.addStyleTag({ content: SYMBOL_FONT_CSS });

    await page.evaluate(() => {
      const selectors = ['.pagedjs_debug', '.pagedjs_warnings', '[class*="puppeteer-watermark"]'];
      for (const selector of selectors) {
        document.querySelectorAll(selector).forEach((el) => el.remove());
      }
    });

    await page.evaluate(async () => {
      await document.fonts.ready;
      await new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res)));
    });

    console.log(`     Generating PDF...`);
    await page.pdf({
      path: outPath,
      preferCSSPageSize: true,
      printBackground: true,
      timeout: 0,
      displayHeaderFooter: false,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });

    const mb = (statSync(outPath).size / 1024 / 1024).toFixed(1);
    console.log(`     ✓ ${outPath} (${mb} MB)`);
  } finally {
    await page.close();
  }
}

async function main() {
  const filter = process.argv[2];
  const targets = filter
    ? MANUSCRIPTS.filter((m) => m.id === filter || m.src.includes(filter))
    : MANUSCRIPTS;

  if (targets.length === 0) {
    console.error(`No manuscript matched filter: "${filter}"`);
    console.error(`Valid ids: ${MANUSCRIPTS.map((m) => m.id).join(', ')}`);
    process.exit(1);
  }

  for (const m of targets) {
    if (!existsSync(join(ROOT, m.src))) {
      console.error(`Source not found: ${join(ROOT, m.src)}`);
      console.error(`Run the build scripts first: python3 build-kdp-dunce-to-midjourney-pro-6x9.py`);
      process.exit(1);
    }
    mkdirSync(join(ROOT, `${TITLE_DIR}/pdfs`), { recursive: true });
  }

  console.log('Dunce to Midjourney Pro — Interior PDF Generator');
  console.log('='.repeat(50));

  const { server, port } = await startLocalServer(ROOT, 0);
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const failures = [];
  try {
    for (const m of targets) {
      try {
        const srcUrl = `http://127.0.0.1:${port}/${m.src}`;
        await generatePDF(browser, srcUrl, join(ROOT, m.out), m.name);
      } catch (error) {
        failures.push(m.name);
        console.error(`  ✗ Failed: ${m.name} — ${error.message}`);
      }
    }
  } finally {
    await browser.close();
    await new Promise((res) => server.close(res));
  }

  console.log('\n' + '='.repeat(50));
  if (failures.length === 0) {
    console.log('✓ All interior PDFs generated.');
    console.log(`  Output: ${join(ROOT, TITLE_DIR, 'pdfs')}`);
    console.log('\n  Next step: confirm page count, then update --spine width in fullwrap cover files.');
  } else {
    console.error(`✗ ${failures.length} PDF(s) failed.`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
