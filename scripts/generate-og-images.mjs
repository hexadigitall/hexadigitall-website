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
    file: 'proposal-jhema-wears',
    params: {
      title: 'Jhema Wears — E‑Commerce Proposal',
      subtitle: 'Tiered packages • Paystack checkout • Fast mobile UX',
      bullets: [
        'Product catalog with variants',
        'Paystack payments (cards, transfer, USSD)',
        'Shipping providers & notifications',
        'SEO + social meta (OG) ready',
      ],
      badge: 'Most Popular: Starter',
      price: 'From ₦199,000',
      icon: '🛍️',
      gradientFrom: '#0A4D68',
      gradientTo: '#066d7f',
    },
  },
  {
    file: 'proposal-generic',
    params: {
      title: 'E‑Commerce Proposal — Your Business',
      subtitle: 'Launch fast • Scale smart • Convert more',
      bullets: [
        'Product catalog & checkout',
        'Paystack payments (cards, transfer, USSD)',
        'Shipping & notifications',
        'SEO + OG social previews',
      ],
      badge: 'Pick a plan to start',
      price: 'From ₦199,000',
      icon: '🛒',
      gradientFrom: '#4facfe',
      gradientTo: '#00f2fe',
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
      price: 'From ₦299,000',
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
      price: 'From ₦300,000/month',
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
  {
    file: 'service-ecommerce',
    params: {
      title: 'E‑Commerce Stores',
      subtitle: 'Sell Fast · Scale Smart',
      bullets: ['Mobile‑First Storefront', 'Paystack Checkout', 'Inventory & Shipping', 'Analytics & SEO'],
      badge: 'Ready to Launch',
      price: 'From ₦199,000',
      icon: '🛒',
      gradientFrom: '#4facfe',
      gradientTo: '#00f2fe',
    },
  },
  {
    file: 'service-portfolio',
    params: {
      title: 'Professional Portfolio Sites',
      subtitle: 'Your 24/7 Salesperson',
      bullets: ['Personal Brand Site', 'Case Studies & Testimonials', 'SEO & Contact Forms', 'Fast Hosting'],
      badge: 'Client‑Winning Design',
      price: 'From ₦299,000',
      icon: '🗂️',
      gradientFrom: '#10b981',
      gradientTo: '#0ea5e9',
    },
  },
  {
    file: 'proposal-jhema-wears',
    params: {
      title: 'Jhema Wears E-Commerce',
      subtitle: 'Complete Online Store Solution',
      bullets: ['Paystack Checkout', 'Product Catalog', 'Shipping Integration', 'Marketing Tools'],
      badge: 'Ready to Launch',
      price: 'From ₦199,000',
      icon: '🛍️',
      gradientFrom: '#0A4D68',
      gradientTo: '#066d7f',
    },
  },
  {
    file: 'proposal-generic',
    params: {
      title: 'E-Commerce Proposal',
      subtitle: 'Tailored Online Store Solutions',
      bullets: ['Secure Payments', 'Inventory Mgmt', 'Shipping Ready', 'SEO Optimized'],
      badge: 'Customizable Plans',
      price: 'From ₦199,000',
      icon: '🛒',
      gradientFrom: '#0A4D68',
      gradientTo: '#066d7f',
    },
  },
  {
    file: 'proposal-divas-kloset',
    params: {
      title: 'Diva\'s Kloset Marketing',
      subtitle: 'Social Media & Growth Strategy',
      bullets: ['Content Creation', 'Influencer Mgmt', 'Meta Ads', 'DM Sales Closing'],
      badge: 'Festive Ready',
      price: 'From ₦250,000',
      icon: '📱',
      gradientFrom: '#d946ef',
      gradientTo: '#ec4899',
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

    // Base cards
    for (const { file, params } of CARDS) {
      const html = cardHTML(params);
      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      const pngPath = path.join(OUT_DIR, `${file}.png`);
      const jpgPath = path.join(OUT_DIR, `${file}.jpg`);
      await page.screenshot({ path: pngPath, type: 'png' });
      await page.screenshot({ path: jpgPath, type: 'jpeg', quality: 90 });
      console.log(`✅ Generated: ${path.relative(process.cwd(), pngPath)} & .jpg`);
    }

    // City-labeled variants for top cities
    const cities = ['lagos', 'abuja', 'portharcourt', 'calabar', 'ibadan', 'kano', 'enugu'];
    const cityNames = {
      lagos: 'Lagos',
      abuja: 'Abuja',
      portharcourt: 'Port Harcourt',
      calabar: 'Calabar',
      ibadan: 'Ibadan',
      kano: 'Kano',
      enugu: 'Enugu',
    };

    const serviceFiles = [
      'service-web-development',
      'service-digital-marketing',
      'service-ecommerce',
      'service-business-planning',
      'service-portfolio',
    ];

    const serviceDisplay = {
      'service-web-development': 'Websites',
      'service-digital-marketing': 'Digital Marketing',
      'service-ecommerce': 'E‑Commerce',
      'service-business-planning': 'Business Plans',
      'service-portfolio': 'Portfolio Sites',
    };

    function paramsFor(file) {
      const base = CARDS.find(c => c.file === file);
      return base ? base.params : null;
    }

    for (const svc of serviceFiles) {
      const baseParams = paramsFor(svc);
      if (!baseParams) continue;
      for (const city of cities) {
        const cityLabel = cityNames[city] || city;
        const file = `${svc}-${city}`;
        const params = {
          ...baseParams,
          title: `${serviceDisplay[svc]} — ${cityLabel}`,
        };
        const html = cardHTML(params);
        await page.setContent(html, { waitUntil: 'domcontentloaded' });
        const pngPath = path.join(OUT_DIR, `${file}.png`);
        const jpgPath = path.join(OUT_DIR, `${file}.jpg`);
        await page.screenshot({ path: pngPath, type: 'png' });
        await page.screenshot({ path: jpgPath, type: 'jpeg', quality: 90 });
        console.log(`🏙️  City OG: ${path.relative(process.cwd(), jpgPath)} & .png`);
      }
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
