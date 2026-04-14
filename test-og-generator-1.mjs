#!/usr/bin/env node
/**
 * Test OG Generator 1: Premium design with gradient overlay and QR codes
 * Based on scripts/generate-og-images.mjs and scripts/generate-missing-og-images.mjs
 * Design: Left-aligned dark overlay (rgba(10, 20, 40, 0.85)), cyan accents, logo, QR code
 */
import puppeteer from 'puppeteer';
import QRCode from 'qrcode';
import fs from 'node:fs';
import path from 'node:path';

const OUTPUT_DIR = 'public/og-images/test-gen-1';
const WIDTH = 1200;
const HEIGHT = 630;

const TEST_COURSES = [
  { slug: 'architecting-landing-zones', title: 'Architecting Landing Zones', label: 'CLOUD ARCHITECTURE' },
  { slug: 'azure-security-technologies-az-500', title: 'Azure Security & Compliance', label: 'SECURITY FUNDAMENTALS' },
  { slug: 'devops-kubernetes-mastery', title: 'DevOps & Kubernetes Mastery', label: 'INFRASTRUCTURE' }
];

function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

let LOGO_SVG = '';
try {
  LOGO_SVG = fs.readFileSync('public/hexadigitall-logo-transparent.svg', 'utf8');
} catch {
  try {
    LOGO_SVG = fs.readFileSync('public/hexadigitall-logo.svg', 'utf8');
  } catch {}
}

function cardHTML({ title, label, qrCodeDataUri = '' }) {
  const qrHtml = qrCodeDataUri 
    ? `<img src="${qrCodeDataUri}" class="qr-code" alt="QR Code" />`
    : '';

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      width: ${WIDTH}px; height: ${HEIGHT}px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #fff;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .card {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      padding: 0;
    }
    .content-overlay {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 45%;
      height: auto;
      background: rgba(10, 20, 40, 0.85);
      backdrop-filter: blur(2px);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 32px 40px;
    }
    .label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: #00d9ff;
      margin: 0 0 8px 0;
      text-transform: uppercase;
    }
    .title {
      font-weight: 800;
      font-size: 36px;
      line-height: 1.2;
      color: #ffffff;
      margin: 0 0 16px 0;
    }
    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #00d9ff;
      color: #0a1428;
      padding: 10px 24px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.5px;
      width: fit-content;
      text-transform: uppercase;
    }
    .logo {
      position: absolute;
      top: 24px;
      right: 28px;
      width: 140px;
      height: auto;
      opacity: 0.95;
      z-index: 10;
    }
    .logo svg {
      width: 100%;
      height: auto;
      display: block;
    }
    .brand {
      position: absolute;
      top: 24px;
      right: 180px;
      color: #00d9ff;
      opacity: 0.9;
      font-weight: 700;
      letter-spacing: 1px;
      font-size: 12px;
      z-index: 10;
    }
    .qr-code {
      position: absolute;
      bottom: 32px;
      right: 32px;
      width: 120px;
      height: 120px;
      opacity: 0.95;
      border-radius: 8px;
      border: 2px solid rgba(0, 217, 255, 0.3);
      z-index: 10;
    }
  </style>
</head>
<body>
  <div class="card">
    ${LOGO_SVG ? `<div class="logo">${LOGO_SVG}</div>` : ''}
    <div class="brand">HEXADIGITALL.COM</div>
    ${qrHtml}
    <div class="content-overlay">
      <div class="label">${escapeHtml(label)}</div>
      <h1 class="title">${escapeHtml(title)}</h1>
      <button class="button">ENROLL NOW</button>
    </div>
  </div>
</body>
</html>`;
}

async function generateQRCodeUri(text) {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      width: 180,
      margin: 1,
      color: { dark: '#00d9ff', light: '#ffffff' },
    });
  } catch (err) {
    return '';
  }
}

async function generateTestImages() {
  console.log('🎨 Test OG Generator 1: Premium Design (dark overlay, cyan accents, QR codes)\n');
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  for (let i = 0; i < TEST_COURSES.length; i++) {
    const course = TEST_COURSES[i];
    const qrUrl = `https://www.hexadigitall.com/courses/${course.slug}`;
    const qrCodeUri = await generateQRCodeUri(qrUrl);

    const html = cardHTML({
      title: course.title,
      label: course.label,
      qrCodeDataUri: qrCodeUri,
    });

    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    const imagePath = `${OUTPUT_DIR}/test-1-${i + 1}-${course.slug}.jpg`;
    await page.screenshot({ path: imagePath, type: 'jpeg', quality: 90 });

    console.log(`✅ Generated: test-1-${i + 1}-${course.slug}.jpg`);
  }

  await page.close();
  await browser.close();

  console.log(`\n✨ Test 1 complete! Generated 3 images in ${OUTPUT_DIR}/\n`);
}

generateTestImages().catch(console.error);
