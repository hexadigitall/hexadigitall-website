#!/usr/bin/env node
/**
 * Generate course-specific Open Graph images using Puppeteer.
 * Fetches courses from Sanity and renders branded cards.
 */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import { createClient } from '@sanity/client';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-08-30',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

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

let LOGO_SVG = '';
try {
  LOGO_SVG = fs.readFileSync(path.resolve('public/hexadigitall-logo-transparent.svg'), 'utf8');
} catch (e) {
  try {
    LOGO_SVG = fs.readFileSync(path.resolve('public/hexadigitall-logo.svg'), 'utf8');
  } catch {}
}

function cardHTML({ title, subtitle, badge, price, level, icon = '🎓', gradientFrom = '#667eea', gradientTo = '#764ba2' }) {
  const safeTitle = escapeHtml(title);
  const safeSubtitle = escapeHtml(subtitle || 'Live Mentoring · Self‑Paced');
  const priceHtml = price ? `<div class="price">${escapeHtml(price)}</div>` : '';
  const badgeHtml = badge ? `<div class="badge">${escapeHtml(badge)}</div>` : '';
  const levelHtml = level ? `<div class="level">${escapeHtml(level)}</div>` : '';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=${WIDTH}, initial-scale=1" />
  <title>${safeTitle} | Hexadigitall</title>
  <style>
    :root { --from: ${gradientFrom}; --to: ${gradientTo}; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body { width: ${WIDTH}px; height: ${HEIGHT}px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #0b1520; background: linear-gradient(135deg, #fff 0%, #f6fafb 60%, #f0f7f9 100%); }
    .card { position: relative; display: flex; flex-direction: column; justify-content: center; height: 100%; width: 100%; padding: 64px 72px; overflow: hidden; }
    .bg-gradient { position: absolute; inset: -40px -40px auto auto; width: 70%; height: 70%; background: radial-gradient(1200px 600px at 85% 30%, var(--to) 0%, transparent 60%), radial-gradient(1000px 500px at 70% 60%, var(--from) 0%, transparent 60%); opacity: 0.18; filter: blur(2px); }
    .frame { position: absolute; inset: 18px; border-radius: 18px; border: 1px solid rgba(10,77,104,.12); }
    .logo { position: absolute; top: 22px; right: 22px; width: 160px; height: auto; opacity: .95; }
    .logo svg { width: 100%; height: auto; display: block; }
    .icon { font-size: 64px; line-height: 1; margin-bottom: 10px; }
    .title { font-weight: 800; font-size: 52px; line-height: 1.1; color: #0A2230; margin: 0 0 12px; }
    .subtitle { font-weight: 500; font-size: 24px; color: #234; margin: 0 0 16px; opacity: .9; }
    .footer { display: flex; align-items: center; gap: 14px; margin-top: 8px; }
    .badge { background: linear-gradient(135deg, var(--from), var(--to)); color: white; padding: 8px 14px; border-radius: 999px; font-size: 18px; font-weight: 700; letter-spacing: .3px; }
    .price { color: #0A4D68; font-weight: 800; font-size: 22px; }
    .level { color: #764ba2; font-weight: 800; font-size: 18px; }
    .brand { position: absolute; bottom: 20px; right: 28px; color: #0A4D68; opacity: .85; font-weight: 700; letter-spacing: .3px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="bg-gradient" aria-hidden="true"></div>
    <div class="frame" aria-hidden="true"></div>
    ${LOGO_SVG ? `<div class="logo" aria-hidden="true">${LOGO_SVG}</div>` : ''}
    <div class="icon">${icon}</div>
    <h1 class="title">${safeTitle}</h1>
    <p class="subtitle">${safeSubtitle}</p>
    <div class="footer">${levelHtml}${badgeHtml}${priceHtml}</div>
    <div class="brand">hexadigitall.com</div>
  </div>
</body>
</html>`;
}

async function fetchTopCourses(limit = 6) {
  const query = `*[_type == "course"] | order(featured desc, title asc)[0...${limit}] {
    title, slug, level, courseType, nairaPrice, hourlyRateNGN
  }`;
  return client.fetch(query);
}

function priceLabel(course) {
  if (course.courseType === 'live') {
    return course.hourlyRateNGN ? `From ₦${Number(course.hourlyRateNGN).toLocaleString()}/hr` : 'Regional pricing available';
  }
  return course.nairaPrice ? `₦${Number(course.nairaPrice).toLocaleString()}` : '';
}

async function generate() {
  ensureOutDir();
  const courses = await fetchTopCourses(8);
  const browser = await puppeteer.launch({ headless: 'new', defaultViewport: { width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 }, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  try {
    for (const course of courses) {
      const html = cardHTML({
        title: course.title,
        subtitle: 'Learn from expert mentors',
        badge: 'New for 2025',
        price: priceLabel(course),
        level: course.level || 'All Levels',
      });
      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      const base = `course-${course.slug.current}`;
      const pngPath = path.join(OUT_DIR, `${base}.png`);
      const jpgPath = path.join(OUT_DIR, `${base}.jpg`);
      await page.screenshot({ path: pngPath, type: 'png' });
      await page.screenshot({ path: jpgPath, type: 'jpeg', quality: 90 });
      console.log(`✅ Generated: ${path.relative(process.cwd(), pngPath)} & .jpg`);
    }
  } finally {
    await browser.close();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generate().catch((err) => { console.error('❌ Generation failed:', err); process.exit(1); });
}
