#!/usr/bin/env node
/**
 * generate-dunce-to-midjourney-pro-cover-exports.mjs
 *
 * Exports all cover assets for the Dunce to Midjourney Pro textbook.
 *
 * Cover export policy (per TEXTBOOK_PRINT_AND_SALES_PLAYBOOK.md):
 *   - Paperback full-wrap  → PDF only
 *   - Hardcover full-wrap  → PDF only
 *   - Front cover only     → JPG + TIFF
 *   - Kindle cover         → JPG + TIFF (rendered via temp PDF then ImageMagick)
 *
 * Usage:
 *   node generate-dunce-to-midjourney-pro-cover-exports.mjs
 *   node generate-dunce-to-midjourney-pro-cover-exports.mjs kindle-cover
 *   node generate-dunce-to-midjourney-pro-cover-exports.mjs front-cover
 *
 * Outputs all files to:
 *   public/textbooks/kdp/dunce-to-midjourney-pro/covers/
 */

import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { createReadStream, statSync, existsSync, mkdirSync } from 'fs';
import { join, extname, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname);

const TITLE_DIR = 'public/textbooks/kdp/dunce-to-midjourney-pro';
const COVERS_DIR = `${TITLE_DIR}/covers`;

// Spine width note: paperback spine = page count * paper thickness (0.002252in per page for 60# cream).
// At ~200 pages: 0.002252 * 200 = ~0.45in. Update --spine CSS variable in fullwrap files after
// final page count is confirmed from the frozen interior PDF.
const COVERS = [
  {
    id: 'front-cover',
    name: 'Dunce to Midjourney Pro — Front Cover',
    src: `${TITLE_DIR}/dunce-to-midjourney-pro-kdp-cover.html`,
    width: 1800,
    height: 2700,
    outBase: `${COVERS_DIR}/dunce-to-midjourney-pro-kdp-cover`,
    outputs: { pdf: false, jpg: true, tiff: true },
  },
  {
    id: 'paperback-fullwrap',
    name: 'Dunce to Midjourney Pro — Paperback Full Wrap',
    src: `${TITLE_DIR}/dunce-to-midjourney-pro-kdp-cover-fullwrap.html`,
    // 12.75in * 300dpi = 3825; 9.25in * 300dpi = 2775
    width: 3825,
    height: 2775,
    outBase: `${COVERS_DIR}/dunce-to-midjourney-pro-kdp-cover-fullwrap`,
    outputs: { pdf: true, jpg: false, tiff: false },
  },
  {
    id: 'hardcover-fullwrap',
    name: 'Dunce to Midjourney Pro — Hardcover Full Wrap',
    src: `${TITLE_DIR}/dunce-to-midjourney-pro-kdp-cover-hardcover-fullwrap.html`,
    // 13.125in * 300dpi = 3938; 9.25in * 300dpi = 2775
    width: 3938,
    height: 2775,
    outBase: `${COVERS_DIR}/dunce-to-midjourney-pro-kdp-cover-hardcover-fullwrap`,
    outputs: { pdf: true, jpg: false, tiff: false },
  },
  {
    id: 'kindle-cover',
    name: 'Dunce to Midjourney Pro — Kindle Cover',
    src: `${TITLE_DIR}/dunce-to-midjourney-pro-kindle-cover.html`,
    width: 1600,
    height: 2560,
    outBase: `${COVERS_DIR}/dunce-to-midjourney-pro-kindle-cover`,
    outputs: { pdf: false, jpg: true, tiff: true },
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
  @import url('https://fonts.googleapis.com/css2?family=Noto+Emoji:wght@400;700&family=Noto+Sans+Symbols+2&family=Noto+Sans+Symbols&display=swap');
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

async function preparePage(page, srcUrl, width, height) {
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (req.url().includes('pagedjs')) {
      req.abort();
    } else {
      req.continue();
    }
  });

  if (width && height) {
    await page.setViewport({ width: Math.round(width), height: Math.round(height), deviceScaleFactor: 1 });
  }

  await page.goto(srcUrl, { waitUntil: 'domcontentloaded', timeout: 0 });
  await page.waitForFunction(() => document.readyState === 'complete');
  await page.addStyleTag({ content: SYMBOL_FONT_CSS });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res)));
  });
}

async function generatePDF(browser, srcUrl, outPath, name) {
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);
  page.setDefaultTimeout(0);
  try {
    await preparePage(page, srcUrl);
    await page.pdf({
      path: outPath,
      preferCSSPageSize: true,
      printBackground: true,
      timeout: 0,
      displayHeaderFooter: false,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
    const mb = (statSync(outPath).size / 1024 / 1024).toFixed(2);
    console.log(`     ✓ PDF: ${outPath} (${mb} MB)`);
  } finally {
    await page.close();
  }
}

async function generateJPG(browser, srcUrl, width, height, outPath) {
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);
  page.setDefaultTimeout(0);
  try {
    await preparePage(page, srcUrl, width, height);
    await page.screenshot({ path: outPath, type: 'jpeg', quality: 95, fullPage: true });
    const mb = (statSync(outPath).size / 1024 / 1024).toFixed(2);
    console.log(`     ✓ JPG: ${outPath} (${mb} MB)`);
  } finally {
    await page.close();
  }
}

function generateJPGFromPDF(inputPath, jpgPath, width, height) {
  console.log('     • Converting PDF → JPG via ImageMagick...');
  execSync(`convert -density 300 -quality 95 "${inputPath}" -resize ${width}x${height}! "${jpgPath}"`, {
    stdio: 'pipe',
    timeout: 120000,
  });
  const mb = (statSync(jpgPath).size / 1024 / 1024).toFixed(2);
  console.log(`     ✓ JPG: ${jpgPath} (${mb} MB)`);
}

function generateTIFF(inputPath, tiffPath, width, height) {
  console.log('     • Converting → TIFF via ImageMagick...');
  const resizePart = width && height ? ` -resize ${width}x${height}!` : '';
  execSync(`convert -density 300 -quality 95 "${inputPath}"${resizePart} "${tiffPath}"`, {
    stdio: 'pipe',
    timeout: 120000,
  });
  const mb = (statSync(tiffPath).size / 1024 / 1024).toFixed(2);
  console.log(`     ✓ TIFF: ${tiffPath} (${mb} MB)`);
}

function ensureOutputDir() {
  const dir = join(ROOT, COVERS_DIR);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

async function main() {
  const filter = process.argv[2];
  const targets = filter ? COVERS.filter((c) => c.id === filter || c.src.includes(filter)) : COVERS;

  if (targets.length === 0) {
    console.error(`No cover matched filter: "${filter}"`);
    console.error(`Valid ids: ${COVERS.map((c) => c.id).join(', ')}`);
    process.exit(1);
  }

  for (const cover of targets) {
    if (!existsSync(join(ROOT, cover.src))) {
      console.error(`Source not found: ${join(ROOT, cover.src)}`);
      process.exit(1);
    }
  }

  ensureOutputDir();

  console.log('Dunce to Midjourney Pro — Cover Export Generator');
  console.log('='.repeat(50));
  console.log('Policy: Full-wrap → PDF only | Front cover/Kindle → JPG + TIFF');
  console.log('Reminder: confirm spine width in fullwrap files matches final interior page count before release.\n');

  const { server, port } = await startLocalServer(ROOT, 0);
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const failures = [];
  try {
    for (const cover of targets) {
      try {
        console.log(`\n  → ${cover.name}`);
        const srcUrl = `http://127.0.0.1:${port}/${cover.src}`;
        const pdfPath = join(ROOT, `${cover.outBase}.pdf`);
        const jpgPath = join(ROOT, `${cover.outBase}.jpg`);
        const tiffPath = join(ROOT, `${cover.outBase}.tiff`);

        if (cover.outputs.pdf) {
          await generatePDF(browser, srcUrl, pdfPath, cover.name);
        }

        if (cover.id === 'kindle-cover') {
          const tempPdfPath = join(ROOT, `${cover.outBase}.tmp.pdf`);
          await generatePDF(browser, srcUrl, tempPdfPath, cover.name);
          if (cover.outputs.jpg) {
            generateJPGFromPDF(tempPdfPath, jpgPath, cover.width, cover.height);
          }
          if (cover.outputs.tiff) {
            generateTIFF(tempPdfPath, tiffPath, cover.width, cover.height);
          }
          execSync(`rm -f "${tempPdfPath}"`);
        } else {
          if (cover.outputs.jpg) {
            await generateJPG(browser, srcUrl, cover.width, cover.height, jpgPath);
          }
          if (cover.outputs.tiff) {
            const tiffSource = cover.outputs.jpg ? jpgPath : pdfPath;
            generateTIFF(tiffSource, tiffPath, cover.width, cover.height);
          }
        }
      } catch (error) {
        failures.push(cover.name);
        console.error(`  ✗ Failed: ${cover.name}`);
        console.error(`    ${error.message}`);
      }
    }
  } finally {
    await browser.close();
    await new Promise((res) => server.close(res));
  }

  console.log('\n' + '='.repeat(50));
  if (failures.length === 0) {
    console.log('✓ All cover exports completed successfully.');
    console.log(`  Output directory: ${join(ROOT, COVERS_DIR)}`);
  } else {
    console.error(`✗ ${failures.length} cover export(s) failed.`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
