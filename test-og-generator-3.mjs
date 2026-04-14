#!/usr/bin/env node
/**
 * Test OG Generator 3: Premium Dark Theme with Brand Elements
 * Sophisticated design with dark background, accent colors, and full branding
 */
import puppeteer from 'puppeteer';
import QRCode from 'qrcode';
import fs from 'node:fs';
import path from 'node:path';

const OUTPUT_DIR = 'public/og-images/test-gen-3';
const WIDTH = 1200;
const HEIGHT = 630;

const TEST_COURSES = [
  { slug: 'architecting-landing-zones', title: 'Architecting Landing Zones', subtitle: 'Design scalable cloud solutions', accent: '#00D9FF' },
  { slug: 'azure-security-technologies-az-500', title: 'Azure Security & Compliance', subtitle: 'Security fundamentals and best practices', accent: '#7C3AED' },
  { slug: 'devops-kubernetes-mastery', title: 'DevOps & Kubernetes Mastery', subtitle: 'Master containerization and orchestration', accent: '#06B6D4' }
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

function cardHTML({ title, subtitle, accent, qrCodeDataUri = '' }) {
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
      background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
      color: #fff;
      overflow: hidden;
    }
    .background-accent {
      position: absolute;
      right: -200px;
      top: -100px;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, ${accent}22 0%, transparent 70%);
      border-radius: 50%;
    }
    .card {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 40px;
      z-index: 2;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .logo-container {
      width: 120px;
    }
    .logo-container svg {
      width: 100%;
      height: auto;
      opacity: 0.9;
    }
    .brand {
      text-align: right;
      color: ${accent};
      font-weight: 700;
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .content {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      max-width: 700px;
      z-index: 3;
    }
    .accent-line {
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, ${accent} 0%, ${accent}00 100%);
      margin-bottom: 20px;
      border-radius: 2px;
    }
    h1 {
      font-size: 48px;
      font-weight: 800;
      color: #fff;
      margin: 0 0 12px 0;
      line-height: 1.2;
    }
    .subtitle {
      font-size: 16px;
      color: #CBD5E1;
      line-height: 1.5;
      margin: 0 0 24px 0;
    }
    .cta {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: ${accent};
      color: #0F172A;
      padding: 12px 28px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.5px;
      text-decoration: none;
      width: fit-content;
      text-transform: uppercase;
      box-shadow: 0 8px 24px ${accent}40;
      transition: all 0.3s ease;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .footer-text {
      font-size: 11px;
      color: #94A3B8;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .badge {
      display: inline-block;
      background: ${accent}20;
      color: ${accent};
      padding: 6px 14px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      border: 1px solid ${accent}40;
    }
    .qr-code {
      width: 100px;
      height: 100px;
      background: #fff;
      padding: 6px;
      border-radius: 6px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }
  </style>
</head>
<body>
  <div class="background-accent"></div>
  <div class="card">
    <div class="header">
      <div class="logo-container">
        ${LOGO_SVG ? LOGO_SVG : ''}
      </div>
      <div class="brand">
        <div>${accent.toUpperCase()}</div>
        <div style="font-size: 9px; font-weight: 600; margin-top: 2px; opacity: 0.7;">HEXADIGITALL.COM</div>
      </div>
    </div>
    
    <div class="content">
      <div class="badge">LIVE CERTIFICATION COURSE</div>
      <div class="accent-line"></div>
      <h1>${escapeHtml(title)}</h1>
      <p class="subtitle">${escapeHtml(subtitle)}</p>
      <a href="#" class="cta">Enroll Now</a>
    </div>
    
    <div class="footer">
      <div class="footer-text">Professional Training • Real-World Projects</div>
      ${qrHtml}
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
      color: { dark: '#0F172A', light: '#ffffff' },
    });
  } catch (err) {
    return '';
  }
}

async function generateTestImages() {
  console.log('🎨 Test OG Generator 3: Premium Dark Theme (accent gradients, sophisticated design)\n');
  
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
      subtitle: course.subtitle,
      accent: course.accent,
      qrCodeDataUri: qrCodeUri,
    });

    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    const imagePath = `${OUTPUT_DIR}/test-3-${i + 1}-${course.slug}.jpg`;
    await page.screenshot({ path: imagePath, type: 'jpeg', quality: 90 });

    console.log(`✅ Generated: test-3-${i + 1}-${course.slug}.jpg`);
  }

  await page.close();
  await browser.close();

  console.log(`\n✨ Test 3 complete! Generated 3 images in ${OUTPUT_DIR}/\n`);
}

generateTestImages().catch(console.error);
