#!/usr/bin/env node
/**
 * Test OG Generator 2: Minimalist design with side branding
 * Simpler approach with background gradient and minimal overlay
 */
import puppeteer from 'puppeteer';
import QRCode from 'qrcode';
import fs from 'node:fs';
import path from 'node:path';

const OUTPUT_DIR = 'public/og-images/test-gen-2';
const WIDTH = 1200;
const HEIGHT = 630;

const TEST_COURSES = [
  { slug: 'architecting-landing-zones', title: 'Architecting Landing Zones', color: '#FF6B6B' },
  { slug: 'azure-security-technologies-az-500', title: 'Azure Security & Compliance', color: '#4ECDC4' },
  { slug: 'devops-kubernetes-mastery', title: 'DevOps & Kubernetes Mastery', color: '#FFE66D' }
];

function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

let LOGO_PNG = '';
try {
  LOGO_PNG = `data:image/png;base64,${fs.readFileSync('public/hexadigitall-logo-transparent.png').toString('base64')}`;
} catch {
  LOGO_PNG = '';
}

function cardHTML({ title, slug, color, qrCodeDataUri = '' }) {
  const bgGradient = color === '#FF6B6B' ? 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)' :
                     color === '#4ECDC4' ? 'linear-gradient(135deg, #4ECDC4 0%, #44A5A0 100%)' :
                     'linear-gradient(135deg, #FFE66D 0%, #FFC93C 100%)';

  const qrHtml = qrCodeDataUri 
    ? `<img src="${qrCodeDataUri}" class="qr" alt="QR Code" />`
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
      font-family: 'Segoe UI', Roboto, sans-serif;
      background: ${bgGradient};
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      padding: 60px;
    }
    .logo {
      position: absolute;
      top: 30px;
      left: 40px;
      height: 50px;
      opacity: 0.95;
    }
    .logo img {
      height: 100%;
    }
    .brand-text {
      position: absolute;
      top: 35px;
      right: 40px;
      color: rgba(255, 255, 255, 0.85);
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 1px;
    }
    .content {
      max-width: 700px;
    }
    .badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.5px;
      margin-bottom: 20px;
      backdrop-filter: blur(5px);
    }
    h1 {
      font-size: 48px;
      font-weight: 800;
      color: #fff;
      margin: 0 0 20px 0;
      line-height: 1.2;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .cta {
      display: inline-block;
      background: #fff;
      color: ${color};
      padding: 12px 32px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 0.5px;
      text-decoration: none;
      text-transform: uppercase;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }
    .qr {
      position: absolute;
      bottom: 30px;
      right: 30px;
      width: 100px;
      height: 100px;
      background: #fff;
      padding: 8px;
      border-radius: 6px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
  </style>
</head>
<body>
  <div class="container">
    ${LOGO_PNG ? `<div class="logo"><img src="${LOGO_PNG}" /></div>` : ''}
    <div class="brand-text">HEXADIGITALL.COM</div>
    ${qrHtml}
    <div class="content">
      <div class="badge">LIVE COURSE</div>
      <h1>${escapeHtml(title)}</h1>
      <a href="#" class="cta">Start Learning</a>
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
      width: 150,
      margin: 1,
      color: { dark: '#333333', light: '#ffffff' },
    });
  } catch (err) {
    return '';
  }
}

async function generateTestImages() {
  console.log('🎨 Test OG Generator 2: Minimalist Design (color gradients, simple layout)\n');
  
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
      slug: course.slug,
      color: course.color,
      qrCodeDataUri: qrCodeUri,
    });

    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    const imagePath = `${OUTPUT_DIR}/test-2-${i + 1}-${course.slug}.jpg`;
    await page.screenshot({ path: imagePath, type: 'jpeg', quality: 90 });

    console.log(`✅ Generated: test-2-${i + 1}-${course.slug}.jpg`);
  }

  await page.close();
  await browser.close();

  console.log(`\n✨ Test 2 complete! Generated 3 images in ${OUTPUT_DIR}/\n`);
}

generateTestImages().catch(console.error);
