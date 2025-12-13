#!/usr/bin/env node
/**
 * Generate Open Graph images from HTML/CSS using Puppeteer.
 * Outputs 1200x630 PNG + JPG files to public/og-images.
 */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const OUT_DIR = path.resolve('public/og-images');
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

// Load inline SVG logo once
let LOGO_SVG = '';
try {
  LOGO_SVG = fs.readFileSync(path.resolve('public/hexadigitall-logo-transparent.svg'), 'utf8');
} catch (e) {
  try {
    LOGO_SVG = fs.readFileSync(path.resolve('public/hexadigitall-logo.svg'), 'utf8');
  } catch {}
}

function cardHTML({ title, subtitle, bullets = [], badge, price, icon = '🚀', gradientFrom = '#0A4D68', gradientTo = '#066d7f' }) {
  const bulletHtml = bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('');
  const priceHtml = price ? `<div class="price">${escapeHtml(price)}</div>` : '';
  const badgeHtml = badge ? `<div class="badge">${escapeHtml(badge)}</div>` : '';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} | Hexadigitall</title>
  <style>
    :root {
      --from: ${gradientFrom};
      --to: ${gradientTo};
    }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      width: ${WIDTH}px; height: ${HEIGHT}px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif;
      color: #0b1520;
      background: linear-gradient(135deg, #fff 0%, #f6fafb 60%, #f0f7f9 100%);
    }
    .card {
      position: relative;
      display: flex; flex-direction: column; justify-content: center;
      height: 100%; width: 100%;
      padding: 64px 72px;
      overflow: hidden;
    }
    .bg-gradient {
      position: absolute; inset: -40px -40px auto auto; width: 70%; height: 70%;
      background: radial-gradient(1200px 600px at 85% 30%, var(--to) 0%, transparent 60%),
                  radial-gradient(1000px 500px at 70% 60%, var(--from) 0%, transparent 60%);
      opacity: 0.18; filter: blur(2px);
    }
    .brand { position: absolute; bottom: 20px; right: 28px; color: #0A4D68; opacity: .85; font-weight: 700; letter-spacing: .3px; }
    .logo { position: absolute; top: 22px; right: 22px; width: 160px; height: auto; opacity: .95; }
    .logo svg { width: 100%; height: auto; display: block; }
    .icon { font-size: 72px; line-height: 1; margin-bottom: 12px; }
    .title { font-weight: 800; font-size: 56px; line-height: 1.1; color: #0A2230; margin: 0 0 14px; }
    .subtitle { font-weight: 500; font-size: 26px; color: #234; margin: 0 0 18px; opacity: .9; }
    .list { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 28px; list-style: none; padding: 0; margin: 0 0 20px; }
    .list li { font-size: 22px; color: #1c2a36; position: relative; padding-left: 28px; }
    .list li::before { content: '✓'; position: absolute; left: 0; top: 0; color: #0A4D68; font-weight: 900; }
    .footer { display: flex; align-items: center; gap: 16px; margin-top: 10px; }
    .badge { background: linear-gradient(135deg, var(--from), var(--to)); color: white; padding: 10px 16px; border-radius: 999px; font-size: 18px; font-weight: 700; letter-spacing: .3px; }
    .price { color: #0A4D68; font-weight: 800; font-size: 22px; }
    .frame { position: absolute; inset: 18px; border-radius: 18px; border: 1px solid rgba(10,77,104,.12); }
  </style>
</head>
<body>
  <div class="card">
    <div class="bg-gradient" aria-hidden="true"></div>
    <div class="frame" aria-hidden="true"></div>
    ${LOGO_SVG ? `<div class="logo" aria-hidden="true">${LOGO_SVG}</div>` : ''}
    <div class="icon">${escapeHtml(icon)}</div>
    <h1 class="title">${escapeHtml(title)}</h1>
    <p class="subtitle">${escapeHtml(subtitle || '')}</p>
    ${bullets.length ? `<ul class="list">${bulletHtml}</ul>` : ''}
    <div class="footer">${badgeHtml}${priceHtml}</div>
    <div class="brand">hexadigitall.com</div>
  </div>
</body>
</html>`;
}

const CARDS = [
  {
    file: 'services-hub',
    params: {
      title: 'Professional Digital Services',
      subtitle: 'Web Dev · Marketing · Business Planning',
      bullets: ['Custom Websites & Apps', 'Social Media & Ads', 'Logos & Brand Strategy', 'Mentoring & Consulting'],
      badge: 'December Offers Active',
      price: 'Starting at ₦15,000',
      icon: '⚡',
      gradientFrom: '#0A4D68',
      gradientTo: '#066d7f',
    },
  },
  {
    file: 'courses-hub',
    params: {
      title: 'Master In‑Demand Tech Skills',
      subtitle: 'Live Mentoring · Self‑Paced',
      bullets: ['Web & Mobile Development', 'Digital Marketing', 'Business Fundamentals', 'Career Mentoring'],
      badge: 'New for 2025',
      price: 'Regional pricing available',
      icon: '🎓',
      gradientFrom: '#667eea',
      gradientTo: '#764ba2',
    },
  },
  {
    file: 'service-web-development',
    params: {
      title: 'Web & Mobile Development',
      subtitle: 'Fast · Secure · Responsive',
      bullets: ['Custom Websites', 'React & Next.js', 'Android/iOS Apps', 'E‑commerce & APIs'],
      badge: 'Business Website Special',
      price: 'From ₦99,000',
      icon: '🧩',
      gradientFrom: '#10b981',
      gradientTo: '#0ea5e9',
    },
  },
  {
    file: 'service-digital-marketing',
    params: {
      title: 'Digital Marketing & Ads',
      subtitle: 'Growth · Engagement · ROI',
      bullets: ['Instagram & TikTok Ads', 'Content Strategy', 'SEO & Analytics', 'Lead Funnels'],
      badge: 'Promo Running',
      price: 'From ₦10k / month',
      icon: '📈',
      gradientFrom: '#f093fb',
      gradientTo: '#f5576c',
    },
  },
  {
    file: 'service-business-planning',
    params: {
      title: 'Business Planning & Logo',
      subtitle: 'Plan · Brand · Launch',
      bullets: ['Business Plan', 'Logo & Identity', 'Pitch Deck', 'Go‑to‑Market'],
      badge: 'Bundle Discount',
      price: 'Save ₦39,000',
      icon: '🧠',
      gradientFrom: '#4facfe',
      gradientTo: '#00f2fe',
    },
  },
];

async function generate() {
  ensureOutDir();
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    for (const { file, params } of CARDS) {
      const html = cardHTML(params);
      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      const pngPath = path.join(OUT_DIR, `${file}.png`);
      const jpgPath = path.join(OUT_DIR, `${file}.jpg`);
      await page.screenshot({ path: pngPath, type: 'png' });
      await page.screenshot({ path: jpgPath, type: 'jpeg', quality: 90 });
      console.log(`✅ Generated: ${path.relative(process.cwd(), pngPath)} & .jpg`);
    }
  } finally {
    await browser.close();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generate().catch((err) => {
    console.error('❌ Generation failed:', err);
    process.exit(1);
  });
}
