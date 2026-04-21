#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const manuscriptJobs = [
  {
    input: path.join(rootDir, 'public/textbooks/kdp/devops-engineering-cloud-infrastructure-core/devops-kdp-6x9-teacher.html'),
    output: path.join(rootDir, 'public/textbooks/kdp/devops-engineering-cloud-infrastructure-core/pdfs/devops-kdp-6x9-teacher.pdf'),
    label: 'Teacher paperback manuscript',
  },
  {
    input: path.join(rootDir, 'public/textbooks/kdp/devops-engineering-cloud-infrastructure-core/devops-kdp-6x9-hardcover-teacher.html'),
    output: path.join(rootDir, 'public/textbooks/kdp/devops-engineering-cloud-infrastructure-core/pdfs/devops-kdp-6x9-hardcover-teacher.pdf'),
    label: 'Teacher hardcover manuscript',
  },
];

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function applyTwemojiSvgFallback(page) {
  try {
    await page.addScriptTag({
      url: 'https://cdn.jsdelivr.net/npm/twemoji@14.0.2/dist/twemoji.min.js',
    });

    await page.evaluate(() => {
      if (!window.twemoji || !document.body) {
        return;
      }

      window.twemoji.parse(document.body, {
        folder: 'svg',
        ext: '.svg',
      });

      const styleId = 'twemoji-print-style';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = [
          'img.emoji {',
          '  height: 1em;',
          '  width: 1em;',
          '  margin: 0 0.06em;',
          '  vertical-align: -0.1em;',
          '}',
        ].join('\n');
        document.head.appendChild(style);
      }
    });
  } catch {
    // Keep native glyph rendering if Twemoji assets are unavailable.
  }
}

async function waitForTocAndPaged(page) {
  try {
    await page.waitForFunction(() => {
      const toc = document.getElementById('dynamic-toc');
      return toc && toc.children.length > 0;
    }, { timeout: 90000 });
  } catch {
    // Continue even if the manuscript has no dynamic TOC.
  }

  await page.evaluate(async () => {
    if (window.PagedPolyfill && typeof window.PagedPolyfill.preview === 'function') {
      try {
        await window.PagedPolyfill.preview();
      } catch {
        // Some files may already be paginated; keep going.
      }
    }
  });

  await new Promise((resolve) => setTimeout(resolve, 1500));
}

async function fillTocFallbackPageNumbers(page) {
  return page.evaluate(() => {
    const pageNumberSpans = Array.from(document.querySelectorAll('.toc-page-number'));
    if (!pageNumberSpans.length) {
      return { total: 0, filled: 0 };
    }

    const pxPerIn = 96;
    const pageHeightPx = 9 * pxPerIn;
    let filled = 0;

    pageNumberSpans.forEach((span) => {
      if ((span.textContent || '').trim()) {
        return;
      }
      const href = span.getAttribute('href');
      if (!href || !href.startsWith('#')) {
        return;
      }
      const target = document.querySelector(href);
      if (!target) {
        return;
      }

      const y = target.getBoundingClientRect().top + window.scrollY;
      const pageNumber = Math.max(1, Math.floor(y / pageHeightPx) + 1);
      span.textContent = String(pageNumber);
      filled += 1;
    });

    return { total: pageNumberSpans.length, filled };
  });
}

async function exportManuscript(browser, job) {
  ensureDir(job.output);
  const page = await browser.newPage();
  page.setDefaultTimeout(0);
  page.setDefaultNavigationTimeout(0);

  try {
    await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(job.input).href, {
      waitUntil: 'domcontentloaded',
      timeout: 0,
    });

    await applyTwemojiSvgFallback(page);

    await page.evaluate(async () => {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
    });

    await waitForTocAndPaged(page);
    const tocFallback = await fillTocFallbackPageNumbers(page);

    await page.pdf({
      path: job.output,
      width: '6in',
      height: '9in',
      printBackground: true,
      margin: { top: '0in', right: '0in', bottom: '0in', left: '0in' },
      displayHeaderFooter: false,
      preferCSSPageSize: false,
      timeout: 0,
    });

    const fileSize = fs.statSync(job.output).size;
    const sizeMb = (fileSize / 1024 / 1024).toFixed(2);
    console.log(`OK ${job.label}: ${job.output} (${sizeMb} MB)`);
    if (tocFallback.total > 0) {
      console.log(`   TOC fallback numbers applied: ${tocFallback.filled}/${tocFallback.total}`);
    }
  } finally {
    await page.close();
  }
}

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    protocolTimeout: 900000,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    for (const job of manuscriptJobs) {
      await exportManuscript(browser, job);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error('Failed to export teacher KDP manuscripts:', error);
  process.exit(1);
});
