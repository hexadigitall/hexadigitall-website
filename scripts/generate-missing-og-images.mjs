#!/usr/bin/env node
/**
 * Generate OG images for courses missing them.
 * Uses the same design system as generate-og-images.mjs:
 * - Left-aligned text overlay with dark background
 * - Full-bleed course background image
 * - Brand logo and URL (top)
 * - QR code with sharable link (bottom-right)
 */
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';
import fs from 'node:fs';
import puppeteer from 'puppeteer';
import QRCode from 'qrcode';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const OUT_DIR = path.resolve(__dirname, '..', 'public/og-images');
const WIDTH = 1200;
const HEIGHT = 630;

function ensureOutDir() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

let LOGO_SVG = '';
try {
  LOGO_SVG = fs.readFileSync(path.resolve(__dirname, '..', 'public/hexadigitall-logo-transparent.svg'), 'utf8');
} catch (e) {
  try {
    LOGO_SVG = fs.readFileSync(path.resolve(__dirname, '..', 'public/hexadigitall-logo.svg'), 'utf8');
  } catch {}
}

function cardHTML({ title, label, buttonText, backgroundImageUri = '', qrCodeDataUri = '' }) {
  const bgStyle = backgroundImageUri 
    ? `background-image: url('${backgroundImageUri}'); background-size: cover; background-position: center;`
    : 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);';
  const qrHtml = qrCodeDataUri 
    ? `<img src="${qrCodeDataUri}" class="qr-code" alt="QR Code" aria-hidden="true" />`
    : '';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} | Hexadigitall</title>
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      width: ${WIDTH}px; height: ${HEIGHT}px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif;
      color: #fff;
      ${bgStyle}
      background-attachment: fixed;
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
      text-decoration: none;
      border: none;
      cursor: pointer;
      width: fit-content;
      text-transform: uppercase;
    }
    .button:hover {
      background: #00c5e8;
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
      <div class="label">${escapeHtml(label || 'PROFESSIONAL CERTIFICATION')}</div>
      <h1 class="title">${escapeHtml(title)}</h1>
      <button class="button">${escapeHtml(buttonText || 'ENROLL NOW')}</button>
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
    console.warn('QR code generation failed:', err.message);
    return '';
  }
}

async function generateOGImages() {
  console.log('🔍 Finding courses missing OG images...\n');

  // Find courses in affordable range (NGN 25k-50k/month = 6,250-12,500/hr) without ogImage
  const courses = await client.fetch(`
    *[_type == "course" && hourlyRateNGN >= 6250 && hourlyRateNGN <= 12500 && !defined(ogImage)] {
      _id,
      title,
      "slug": slug.current,
      summary,
      hourlyRateNGN,
      hourlyRateUSD,
      "schoolName": school->name
    }
  `);

  if (!courses || courses.length === 0) {
    console.log('✅ All affordable courses already have OG images!');
    return;
  }

  console.log(`📋 Found ${courses.length} courses needing OG images:\n`);
  courses.forEach((c, i) => {
    console.log(`${i + 1}. ${c.title} (₦${c.hourlyRateNGN * 8}/month)`);
  });
  console.log('');

  ensureOutDir();

  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  let successCount = 0;
  let uploadCount = 0;

  for (const course of courses) {
    try {
      const qrUrl = `https://www.hexadigitall.com/courses/${course.slug}`;
      const qrCodeUri = await generateQRCodeUri(qrUrl);

      // Generate OG image
      const html = cardHTML({
        title: course.title,
        label: 'Professional Certification',
        buttonText: 'Enroll Now',
        backgroundImageUri: '', // Gradient fallback
        qrCodeDataUri: qrCodeUri,
      });

      await page.setContent(html, { waitUntil: 'domcontentloaded' });

      const filename = `course-${course.slug}`;
      const pngPath = path.join(OUT_DIR, `${filename}.png`);
      const jpgPath = path.join(OUT_DIR, `${filename}.jpg`);

      await page.screenshot({ path: pngPath, type: 'png' });
      await page.screenshot({ path: jpgPath, type: 'jpeg', quality: 90 });

      console.log(`✅ Generated: ${filename}.jpg`);
      successCount++;

      // Upload to Sanity
      const imageBuffer = fs.readFileSync(jpgPath);
      const asset = await client.assets.upload('image', imageBuffer, {
        filename: `${filename}.jpg`,
        contentType: 'image/jpeg',
      });

      // Update course with OG image reference
      await client
        .patch(course._id)
        .set({
          ogImage: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: asset._id,
            },
          },
        })
        .commit();

      console.log(`   📤 Uploaded to Sanity and linked to course`);
      uploadCount++;

    } catch (err) {
      console.error(`❌ Failed for ${course.title}:`, err.message);
    }
  }

  await page.close();
  await browser.close();

  console.log(`\n✨ Generation complete!`);
  console.log(`   Images generated: ${successCount}/${courses.length}`);
  console.log(`   Uploaded to Sanity: ${uploadCount}/${courses.length}`);
  console.log(`   Output directory: ${OUT_DIR}`);
}

generateOGImages().catch((err) => {
  console.error('❌ Script failed:', err);
  process.exit(1);
});
