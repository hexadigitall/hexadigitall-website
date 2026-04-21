#!/usr/bin/env node
import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { createReadStream, statSync, existsSync, mkdirSync } from 'fs';
import { join, extname, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname);

// Cover export policy:
// - Full-wrap paperback/hardcover: PDF only
// - Kindle cover page: JPG + TIFF only
const COVERS = [
  {
    id: 'paperback-fullwrap',
    name: 'Landing Zones Paperback Full Wrap',
    src: 'public/textbooks/kdp/architecting-landing-zones/architecting-landing-zones-kdp-cover-fullwrap.html',
    width: 3862.5,  // 12.875in × 300 DPI
    height: 2775,   // 9.25in × 300 DPI
    pdfs: ['public/textbooks/kdp/architecting-landing-zones/covers/architecting-landing-zones-paperback-fullwrap.pdf'],
    jpgs: [],
    tiffs: [],
  },
  {
    id: 'hardcover-fullwrap',
    name: 'Landing Zones Hardcover Full Wrap',
    src: 'public/textbooks/kdp/architecting-landing-zones/architecting-landing-zones-kdp-cover-hardcover-fullwrap.html',
    width: 3909,    // 13.03in × 300 DPI
    height: 2775,   // 9.25in × 300 DPI
    pdfs: ['public/textbooks/kdp/architecting-landing-zones/covers/architecting-landing-zones-hardcover-fullwrap.pdf'],
    jpgs: [],
    tiffs: [],
  },
  {
    id: 'kindle-cover',
    name: 'Landing Zones Kindle Cover',
    src: 'public/textbooks/kdp/architecting-landing-zones/architecting-landing-zones-kindle-cover.html',
    width: 1600,
    height: 2560,
    pdfs: [],
    jpgs: ['public/textbooks/kdp/architecting-landing-zones/covers/architecting-landing-zones-kindle-cover.jpg'],
    tiffs: ['public/textbooks/kdp/architecting-landing-zones/covers/architecting-landing-zones-kindle-cover.tiff'],
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

    const mb = (statSync(outPath).size / 1024 / 1024).toFixed(2);
    console.log(`     ✓ PDF: ${outPath}`);
    console.log(`       ${mb} MB`);
  } finally {
    await page.close();
  }
}

async function generateJPG(browser, srcUrl, width, height, outPath, name) {
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

    await page.setViewport({ width: Math.round(width), height: Math.round(height), deviceScaleFactor: 1 });
    await page.goto(srcUrl, { waitUntil: 'domcontentloaded', timeout: 0 });
    await page.waitForFunction(() => document.readyState === 'complete');
    await page.addStyleTag({ content: SYMBOL_FONT_CSS });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await new Promise((resolvePromise) => requestAnimationFrame(() => requestAnimationFrame(resolvePromise)));
    });

    await page.screenshot({
      path: outPath,
      type: 'jpeg',
      quality: 95,
      fullPage: true,
    });

    const mb = (statSync(outPath).size / 1024 / 1024).toFixed(2);
    console.log(`     ✓ JPG: ${outPath}`);
    console.log(`       ${mb} MB`);
  } finally {
    await page.close();
  }
}

function generateJPGFromPDF(inputPath, jpgPath, width, height) {
  console.log(`     • Converting to JPG...`);
  execSync(`convert -density 300 -quality 95 "${inputPath}" -resize ${width}x${height}! "${jpgPath}"`, {
    stdio: 'pipe',
    timeout: 60000,
  });

  if (existsSync(jpgPath)) {
    const mb = (statSync(jpgPath).size / 1024 / 1024).toFixed(2);
    console.log(`     ✓ JPG: ${jpgPath}`);
    console.log(`       ${mb} MB`);
  }
}

function generateTIFF(inputPath, tiffPath, name, width, height) {
  // Use ImageMagick to convert image/PDF to TIFF
  try {
    console.log(`     • Converting to TIFF...`);
    const resizePart = width && height ? ` -resize ${width}x${height}!` : '';
    execSync(`convert -density 300 -quality 95 "${inputPath}"${resizePart} "${tiffPath}"`, {
      stdio: 'pipe',
      timeout: 60000,
    });

    if (existsSync(tiffPath)) {
      const mb = (statSync(tiffPath).size / 1024 / 1024).toFixed(2);
      console.log(`     ✓ TIFF: ${tiffPath}`);
      console.log(`       ${mb} MB`);
    }
  } catch (error) {
    console.warn(`     ⚠ TIFF conversion skipped: ImageMagick not available or conversion failed`);
    console.warn(`       Install ImageMagick to enable TIFF export: apt-get install imagemagick`);
  }
}

async function ensureDirectories(paths) {
  const dirs = new Set();
  paths.forEach((p) => {
    const dir = dirname(join(ROOT, p));
    dirs.add(dir);
  });
  dirs.forEach((dir) => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  });
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

  // Ensure output directories exist
  const allOutputs = targets.flatMap((c) => [...c.pdfs, ...c.jpgs, ...c.tiffs]);
  await ensureDirectories(allOutputs);

  console.log('Landing Zones Cover Export Generator');
  console.log('='.repeat(50));
  console.log(`Formats: Full-wrap PDF only; Kindle JPG/TIFF only\n`);

  const { server, port } = await startLocalServer(ROOT, 0);
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const failures = [];
  try {
    for (const cover of targets) {
      try {
        const srcUrl = `http://127.0.0.1:${port}/${cover.src}`;
        
        let pdfPath = null;
        let jpgPath = null;

        if (cover.pdfs.length > 0) {
          pdfPath = join(ROOT, cover.pdfs[0]);
          await generatePDF(browser, srcUrl, pdfPath, cover.name);
        }

        if (cover.id === 'kindle-cover') {
          const tempPdfPath = join(ROOT, 'public/textbooks/kdp/architecting-landing-zones/covers/architecting-landing-zones-kindle-cover.tmp.pdf');
          await generatePDF(browser, srcUrl, tempPdfPath, cover.name);

          if (cover.jpgs.length > 0) {
            jpgPath = join(ROOT, cover.jpgs[0]);
            generateJPGFromPDF(tempPdfPath, jpgPath, cover.width, cover.height);
          }

          if (cover.tiffs.length > 0) {
            const tiffPath = join(ROOT, cover.tiffs[0]);
            generateTIFF(tempPdfPath, tiffPath, cover.name, cover.width, cover.height);
          }

          execSync(`rm -f "${tempPdfPath}"`);
        } else {
          if (cover.jpgs.length > 0) {
            jpgPath = join(ROOT, cover.jpgs[0]);
            await generateJPG(browser, srcUrl, cover.width, cover.height, jpgPath, cover.name);
          }

          if (cover.tiffs.length > 0) {
            const tiffPath = join(ROOT, cover.tiffs[0]);
            const tiffSource = jpgPath || pdfPath;
            generateTIFF(tiffSource, tiffPath, cover.name, cover.width, cover.height);
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
    await new Promise((resolvePromise) => server.close(resolvePromise));
  }

  console.log('\n' + '='.repeat(50));
  if (failures.length === 0) {
    console.log(`✓ All cover exports completed successfully.`);
  } else {
    console.error(`✗ ${failures.length} cover export(s) failed.`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
