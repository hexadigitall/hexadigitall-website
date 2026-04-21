#!/usr/bin/env node
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
    name: 'Landing Zones Student Paperback (6x9)',
    src: 'public/textbooks/kdp/architecting-landing-zones/architecting-landing-zones-kdp-6x9.html',
    out: 'public/textbooks/kdp/architecting-landing-zones/pdfs/architecting-landing-zones-kdp-6x9.pdf',
  },
  {
    id: 'teacher-paperback',
    name: 'Landing Zones Teacher Paperback (6x9)',
    src: 'public/textbooks/kdp/architecting-landing-zones/architecting-landing-zones-kdp-6x9-teacher.html',
    out: 'public/textbooks/kdp/architecting-landing-zones/pdfs/architecting-landing-zones-kdp-6x9-teacher.pdf',
  },
  {
    id: 'student-hardcover',
    name: 'Landing Zones Student Hardcover (6x9)',
    src: 'public/textbooks/kdp/architecting-landing-zones/architecting-landing-zones-kdp-6x9-hardcover.html',
    out: 'public/textbooks/kdp/architecting-landing-zones/pdfs/architecting-landing-zones-kdp-6x9-hardcover.pdf',
  },
  {
    id: 'teacher-hardcover',
    name: 'Landing Zones Teacher Hardcover (6x9)',
    src: 'public/textbooks/kdp/architecting-landing-zones/architecting-landing-zones-kdp-6x9-hardcover-teacher.html',
    out: 'public/textbooks/kdp/architecting-landing-zones/pdfs/architecting-landing-zones-kdp-6x9-hardcover-teacher.pdf',
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
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      createReadStream(filePath).pipe(res);
    } catch {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server error');
    }
  });
  return new Promise((resolvePromise, reject) => {
    server.on('error', reject);
    server.listen(port, '127.0.0.1', () => resolvePromise({ server, port: server.address().port }));
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

    await page.goto(srcUrl, { waitUntil: 'domcontentloaded', timeout: 0 });
    await page.waitForFunction(() => document.readyState === 'complete');
    await page.addStyleTag({ content: SYMBOL_FONT_CSS });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await new Promise((resolvePromise) => requestAnimationFrame(() => requestAnimationFrame(resolvePromise)));
    });

    await page.pdf({
      path: outPath,
      preferCSSPageSize: true,
      printBackground: true,
      timeout: 0,
      displayHeaderFooter: false,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });

    const mb = (statSync(outPath).size / 1024 / 1024).toFixed(1);
    console.log(`     ✓ ${outPath}`);
    console.log(`       ${mb} MB`);
  } finally {
    await page.close();
  }
}

async function main() {
  const filter = process.argv[2];
  const targets = filter ? MANUSCRIPTS.filter((m) => m.id === filter || m.src.includes(filter)) : MANUSCRIPTS;

  if (targets.length === 0) {
    console.error(`No manuscript matched filter: "${filter}"`);
    console.error(`Valid ids: ${MANUSCRIPTS.map((m) => m.id).join(', ')}`);
    process.exit(1);
  }

  for (const manuscript of targets) {
    if (!existsSync(join(ROOT, manuscript.src))) {
      console.error(`Source not found: ${join(ROOT, manuscript.src)}`);
      console.error('Run the landing-zones build scripts first.');
      process.exit(1);
    }
  }

  console.log('Landing Zones KDP PDF Generator');
  console.log('='.repeat(50));
  const { server, port } = await startLocalServer(ROOT, 0);
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const failures = [];
  try {
    for (const manuscript of targets) {
      try {
        await generatePDF(browser, `http://127.0.0.1:${port}/${manuscript.src}`, join(ROOT, manuscript.out), manuscript.name);
      } catch (error) {
        failures.push(manuscript.name);
        console.error(`  ✗ Failed: ${manuscript.name}`);
        console.error(`    ${error.message}`);
      }
    }
  } finally {
    await browser.close();
    await new Promise((resolvePromise) => server.close(resolvePromise));
  }

  console.log('\n' + '='.repeat(50));
  if (failures.length === 0) {
    console.log(`✓ All ${targets.length} PDF(s) generated successfully.`);
  } else {
    console.error(`✗ ${failures.length} PDF(s) failed.`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
