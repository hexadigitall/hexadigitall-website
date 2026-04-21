#!/usr/bin/env node
/**
 * Generate KDP 6x9 manuscript PDFs using Puppeteer.
 *
 * Strategy:
 *   - Paged.js is intentionally blocked (the HTML guards with `if (window.PagedPolyfill)`).
 *   - Chrome's native @page CSS engine handles 6x9 pagination and margins.
 *   - @media print rules in each manuscript correct all padding/max-width values.
 *   - `preferCSSPageSize: true` honours the `@page { size: 152.4mm 228.6mm }` rule.
 *
 * Output: four PDFs in public/textbooks/kdp/devops-engineering-cloud-infrastructure-core/pdfs/
 *
 * Usage:
 *   node generate-kdp-pdfs.mjs
 *   node generate-kdp-pdfs.mjs student-paperback   # single manuscript
 */

import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { createReadStream, statSync, existsSync } from 'fs';
import { join, extname, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname);

const MANUSCRIPTS = [
  {
    id: 'student-paperback',
    name: 'Student Paperback (6x9)',
    src: 'public/textbooks/kdp/devops-engineering-cloud-infrastructure-core/devops-kdp-6x9.html',
    out: 'public/textbooks/kdp/devops-engineering-cloud-infrastructure-core/pdfs/devops-kdp-6x9.pdf',
  },
  {
    id: 'teacher-paperback',
    name: 'Teacher Paperback (6x9)',
    src: 'public/textbooks/kdp/devops-engineering-cloud-infrastructure-core/devops-kdp-6x9-teacher.html',
    out: 'public/textbooks/kdp/devops-engineering-cloud-infrastructure-core/pdfs/devops-kdp-6x9-teacher.pdf',
  },
  {
    id: 'student-hardcover',
    name: 'Student Hardcover (6x9)',
    src: 'public/textbooks/kdp/devops-engineering-cloud-infrastructure-core/devops-kdp-6x9-hardcover.html',
    out: 'public/textbooks/kdp/devops-engineering-cloud-infrastructure-core/pdfs/devops-kdp-6x9-hardcover.pdf',
  },
  {
    id: 'teacher-hardcover',
    name: 'Teacher Hardcover (6x9)',
    src: 'public/textbooks/kdp/devops-engineering-cloud-infrastructure-core/devops-kdp-6x9-hardcover-teacher.html',
    out: 'public/textbooks/kdp/devops-engineering-cloud-infrastructure-core/pdfs/devops-kdp-6x9-hardcover-teacher.pdf',
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
    font-family:
      'Inter',
      'Noto Sans SC',
      'Noto Sans JP',
      'Noto Sans Symbols 2',
      'Noto Sans Symbols',
      'Noto Emoji',
      'Segoe UI Emoji',
      'Apple Color Emoji',
      'Noto Color Emoji',
      sans-serif !important;
    font-variant-emoji: emoji;
  }

  *::before,
  *::after {
    font-family:
      'Inter',
      'Noto Sans SC',
      'Noto Sans JP',
      'Noto Sans Symbols 2',
      'Noto Sans Symbols',
      'Noto Emoji',
      'Segoe UI Emoji',
      'Apple Color Emoji',
      'Noto Color Emoji',
      sans-serif !important;
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
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      createReadStream(filePath).pipe(res);
    } catch {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server error');
    }
  });
  return new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(port, '127.0.0.1', () => {
      const address = server.address();
      resolve({ server, port: address.port });
    });
  });
}

async function generatePDF(browser, srcUrl, outPath, name) {
  console.log(`\n  → ${name}`);
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);
  page.setDefaultTimeout(0);

  try {
    // Block Paged.js CDN — Chrome's native @page CSS handles pagination in print mode.
    // The HTML guards the preview() call with `if (window.PagedPolyfill)` so this is safe.
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (req.url().includes('pagedjs')) {
        req.abort();
      } else {
        req.continue();
      }
    });

    // Load the manuscript and wait for deterministic DOM readiness.
    console.log(`     Loading...`);
    await page.goto(srcUrl, { waitUntil: 'domcontentloaded', timeout: 0 });
    await page.waitForFunction(() => document.readyState === 'complete');

    // Ensure robust fallback coverage for symbols, emoji, and CJK ideographs.
    await page.addStyleTag({ content: SYMBOL_FONT_CSS });

    // Remove debugging/overlay elements that can introduce stray page marks.
    await page.evaluate(() => {
      const selectors = [
        '.pagedjs_debug',
        '.pagedjs_warnings',
        '[class*="puppeteer-watermark"]',
        '[id*="puppeteer-watermark"]',
      ];
      for (const selector of selectors) {
        document.querySelectorAll(selector).forEach((el) => el.remove());
      }
    });

    // Wait for all fonts (Google Fonts etc.) to be fully loaded.
    await page.evaluate(async () => {
      await document.fonts.ready;
      // Yield two frames so layout fully settles before PDF snapshot.
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });

    console.log(`     Generating PDF...`);
    await page.pdf({
      path: outPath,
      // Honour the CSS `@page { size: 152.4mm 228.6mm }` rule exactly.
      preferCSSPageSize: true,
      printBackground: true,
      timeout: 0,
      displayHeaderFooter: false,
      // Margins are controlled by @page margin-* rules in the CSS; set 0 here.
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });

    const bytes = statSync(outPath).size;
    const mb = (bytes / 1024 / 1024).toFixed(1);
    console.log(`     ✓ ${outPath}`);
    console.log(`       ${mb} MB`);
  } finally {
    await page.close();
  }
}

async function main() {
  const filter = process.argv[2]; // optional: filter by manuscript id
  const targets = filter
    ? MANUSCRIPTS.filter((m) => m.id === filter || m.src.includes(filter))
    : MANUSCRIPTS;

  if (targets.length === 0) {
    console.error(`No manuscript matched filter: "${filter}"`);
    console.error(`Valid ids: ${MANUSCRIPTS.map((m) => m.id).join(', ')}`);
    process.exit(1);
  }

  // Validate source files exist
  for (const ms of targets) {
    const srcPath = join(ROOT, ms.src);
    if (!existsSync(srcPath)) {
      console.error(`Source not found: ${srcPath}`);
      console.error('Run the build scripts first: python3 build-kdp-6x9.py etc.');
      process.exit(1);
    }
  }

  const PORT = 0;
  console.log('KDP 6x9 PDF Generator');
  console.log('='.repeat(50));
  const { server, port } = await startLocalServer(ROOT, PORT);
  console.log(`Starting local server on http://127.0.0.1:${port}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
  });

  const errors = [];
  try {
    for (const ms of targets) {
      const srcUrl = `http://127.0.0.1:${port}/${ms.src}`;
      const outPath = join(ROOT, ms.out);
      try {
        await generatePDF(browser, srcUrl, outPath, ms.name);
      } catch (err) {
        console.error(`  ✗ Failed: ${ms.name}`);
        console.error(`    ${err.message}`);
        errors.push(ms.name);
      }
    }
  } finally {
    await browser.close();
    await new Promise((r) => server.close(r));
  }

  console.log('\n' + '='.repeat(50));
  if (errors.length === 0) {
    console.log(`✓ All ${targets.length} PDF(s) generated successfully.`);
    console.log('\nNote: TOC page numbers require Paged.js (browser preview).');
    console.log('For TOC page numbers, open the HTML in Chrome → Ctrl+P → Save as PDF');
    console.log('with paper size Custom: 152.4mm × 228.6mm and margins: None.');
  } else {
    console.log(`✗ ${errors.length} failed: ${errors.join(', ')}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
