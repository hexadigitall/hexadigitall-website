#!/usr/bin/env node
/**
 * Generator 3 OG images with real course backgrounds.
 *
 * What it does:
 * - Fetches course slugs/titles from Sanity.
 * - Scans public/assets/images/courses for available images.
 * - Maps image filenames -> course slugs using normalization and alias mapping.
 * - Generates OG images in Generator 3 style using the matched background image.
 *
 * Output:
 * - public/og-images/course-<slug>.jpg
 *
 * Usage:
 * - node scripts/generate-og-generator3-course-bg.mjs
 * - node scripts/generate-og-generator3-course-bg.mjs --limit=20
 * - node scripts/generate-og-generator3-course-bg.mjs --slugs=architecting-landing-zones,azure-security-technologies-az-500
 */
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';
import QRCode from 'qrcode';
import { createClient } from '@sanity/client';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(PROJECT_ROOT, '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const WIDTH = 1200;
const HEIGHT = 630;
const IMAGE_DIR = path.join(PROJECT_ROOT, 'public/assets/images/courses');
const OUT_DIR = path.join(PROJECT_ROOT, 'public/og-images');

function parseArgs(argv) {
  const args = { limit: 0, slugs: [] };
  for (const arg of argv) {
    if (arg.startsWith('--limit=')) {
      const value = Number.parseInt(arg.slice('--limit='.length), 10);
      args.limit = Number.isFinite(value) ? value : 0;
    }
    if (arg.startsWith('--slugs=')) {
      args.slugs = arg
        .slice('--slugs='.length)
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
    }
  }
  return args;
}

function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function getImageDataUri(imagePath) {
  if (!fs.existsSync(imagePath)) return '';
  const ext = path.extname(imagePath).toLowerCase();
  const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
  const buffer = fs.readFileSync(imagePath);
  return `data:${mime};base64,${buffer.toString('base64')}`;
}

let LOGO_SVG = '';
try {
  LOGO_SVG = fs.readFileSync(path.join(PROJECT_ROOT, 'public/hexadigitall-logo-transparent.svg'), 'utf8');
} catch {
  try {
    LOGO_SVG = fs.readFileSync(path.join(PROJECT_ROOT, 'public/hexadigitall-logo.svg'), 'utf8');
  } catch {
    LOGO_SVG = '';
  }
}

function accentForSlug(slug) {
  const palette = ['#00D9FF', '#7C3AED', '#06B6D4', '#22C55E', '#F59E0B'];
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return palette[hash % palette.length];
}

function cardHTML({ title, subtitle, accent, backgroundImageUri, qrCodeDataUri = '' }) {
  const qrHtml = qrCodeDataUri ? `<img src="${qrCodeDataUri}" class="qr-code" alt="QR Code" />` : '';
  const bgLayer = backgroundImageUri
    ? `
      .bg-image {
        position: absolute;
        inset: 0;
        background-image: url('${backgroundImageUri}');
        background-size: cover;
        background-position: center;
        filter: saturate(1.05) contrast(1.05);
      }
      .bg-dim {
        position: absolute;
        inset: 0;
        background: linear-gradient(100deg, rgba(7,14,31,0.86) 0%, rgba(9,18,41,0.80) 48%, rgba(7,14,31,0.70) 100%);
      }
      .right-glow {
        position: absolute;
        right: -120px;
        top: -80px;
        width: 540px;
        height: 540px;
        background: radial-gradient(circle, ${accent}33 0%, transparent 72%);
        border-radius: 50%;
      }
    `
    : `
      .bg-image {
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
      }
      .bg-dim {
        position: absolute;
        inset: 0;
        background: linear-gradient(100deg, rgba(7,14,31,0.76) 0%, rgba(9,18,41,0.70) 48%, rgba(7,14,31,0.60) 100%);
      }
      .right-glow {
        position: absolute;
        right: -120px;
        top: -80px;
        width: 540px;
        height: 540px;
        background: radial-gradient(circle, ${accent}30 0%, transparent 72%);
        border-radius: 50%;
      }
    `;

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      width: ${WIDTH}px;
      height: ${HEIGHT}px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #fff;
      overflow: hidden;
      position: relative;
    }
    ${bgLayer}
    .card {
      position: absolute;
      inset: 0;
      padding: 40px;
      z-index: 2;
    }
    .header {
      position: absolute;
      top: 40px;
      left: 40px;
      right: 40px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .logo-container { width: 120px; }
    .logo-container svg { width: 100%; height: auto; opacity: 0.9; }
    .brand {
      text-align: right;
      color: ${accent};
      font-weight: 700;
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .brand small {
      display: block;
      margin-top: 2px;
      font-size: 9px;
      opacity: 0.78;
      letter-spacing: 1.5px;
    }
    .content {
      position: absolute;
      left: 40px;
      right: 230px;
      top: 150px;
      bottom: 170px;
      display: grid;
      grid-template-rows: auto auto auto minmax(0, 1fr) auto;
      align-content: start;
      row-gap: 0;
      z-index: 3;
      min-height: 0;
    }
    .badge {
      display: inline-block;
      background: ${accent}20;
      color: ${accent};
      padding: 7px 16px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.7px;
      text-transform: uppercase;
      border: 1px solid ${accent}55;
      margin-bottom: 14px;
      width: fit-content;
    }
    .accent-line {
      width: 78px;
      height: 3px;
      background: linear-gradient(90deg, ${accent} 0%, ${accent}00 100%);
      margin-bottom: 18px;
      border-radius: 2px;
    }
    h1 {
      font-size: 60px;
      font-weight: 800;
      line-height: 1.06;
      margin: 0 0 12px 0;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
      max-width: 100%;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .subtitle {
      font-size: 17px;
      color: #D1D9E6;
      line-height: 1.5;
      margin: 0 0 16px 0;
      max-width: 100%;
      text-shadow: 0 1px 8px rgba(0, 0, 0, 0.28);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .subtitle-spacer {
      min-height: 0;
    }
    .cta {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: ${accent};
      color: #0B1225;
      padding: 12px 30px;
      border-radius: 8px;
      font-weight: 800;
      font-size: 13px;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      width: fit-content;
      box-shadow: 0 8px 22px ${accent}55;
    }
    .footer {
      position: absolute;
      left: 40px;
      right: 40px;
      bottom: 32px;
      display: flex;
      justify-content: flex-start;
      align-items: flex-end;
    }
    .footer-text {
      font-size: 11px;
      color: #A5B2C8;
      font-weight: 600;
      letter-spacing: 0.4px;
    }
    .qr-code {
      position: absolute;
      right: 40px;
      bottom: 32px;
      width: 108px;
      height: 108px;
      background: #fff;
      padding: 6px;
      border-radius: 8px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
    }
  </style>
</head>
<body>
  <div class="bg-image"></div>
  <div class="bg-dim"></div>
  <div class="right-glow"></div>

  <div class="card">
    <div class="header">
      <div class="logo-container">${LOGO_SVG}</div>
      <div class="brand">${accent.toUpperCase()}<small>HEXADIGITALL.COM</small></div>
    </div>

    <div class="content">
      <div class="badge">Live Certification Course</div>
      <div class="accent-line"></div>
      <h1>${escapeHtml(title)}</h1>
      <p class="subtitle">${escapeHtml(subtitle)}</p>
      <div class="subtitle-spacer"></div>
      <div class="cta">Enroll Now</div>
    </div>

    <div class="footer">
      <div class="footer-text">Professional Training • Real-World Projects</div>
    </div>
    ${qrHtml}
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
  } catch {
    return '';
  }
}

function toCanonical(value) {
  return value
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/-\d+$/, '');
}

const ALIAS_TO_SLUG = {
  'advanced-backend-engineering-node-js-microservices': 'advanced-backend-nodejs',
  'advanced-seo-rank-1-on-google': 'advanced-seo-mastery',
  'advanced-seo-serp-ranking-mastery': 'advanced-seo-mastery',
  'ai-engineering-building-llms-neural-networks': 'ai-engineering-llms',
  'applied-machine-learning-data-science': 'applied-machine-learning',
  'aws-certified-solutions-architect-associate-professional': 'aws-certified-solutions-architect',
  'c-net-core-architecture': 'c-sharp-net-core',
  'certified-scrum-master-csm-bootcamp': 'certified-scrum-master-csm',
  'cisco-certified-network-associate-ccna-200-301': 'ccna-networking',
  'cissp-certification-prep-course': 'cissp-certification-prep',
  'cissp-senior-security-professional-prep': 'cissp-certification-prep',
  'cloud-infrastructure-deployment-strategy': 'cloud-infrastructure-strategy',
  'computer-hardware-engineering-system-maintenance': 'computer-hardware-engineering',
  'cross-platform-mobile-app-development-react-native': 'react-native-mobile-dev',
  'data-analysis-with-python': 'python-data-science-analytics',
  'devops-engineering-kubernetes-mastery': 'devops-kubernetes-mastery',
  'devops-fundamentals-git-github-mastery': 'git-github-beginners',
  'digital-marketing-for-small-businesses': 'digital-marketing-small-business',
  'enterprise-security-risk-management': 'enterprise-security-risk',
  'ethical-hacking-for-beginners': 'ethical-hacking-beginners',
  'ethical-hacking-penetration-testing-masterclass': 'ethical-hacking-penetration-testing',
  'executive-agile-leadership-transformation': 'executive-agile-leadership',
  'frontend-mastery-with-react-next-js': 'frontend-mastery-react',
  'full-stack-web-development-bootcamp-zero-to-hero': 'full-stack-web-development',
  'git-github-for-beginners': 'git-github-beginners',
  'google-analytics-4-from-beginner-to-expert': 'google-analytics-4-mastery',
  'google-analytics-4-ga4-data-mastery': 'google-analytics-4-mastery',
  'integrated-digital-marketing-growth-strategy': 'integrated-digital-marketing',
  'linux-administration-shell-scripting-pro': 'linux-administration-shell-scripting',
  'mobile-office-business-productivity-from-your-phone': 'professional-office-365',
  'modern-javascript-algorithms-data-structures': 'full-stack-web-development',
  'motion-graphics-visual-effects': 'motion-graphics-vfx',
  'network-security-administration': 'network-security-admin',
  'product-design-ui-ux-professional-bootcamp': 'ui-ux-product-design',
  'product-strategy-the-lean-startup-building-mvps': 'product-strategy-lean-startup',
  'professional-office-365-suite-mastery': 'professional-office-365',
  'project-management-fundamentals': 'pmp-certification-prep',
  'python-for-data-science-analytics': 'python-data-science-analytics',
  'react-native-build-mobile-apps-for-ios-android': 'react-native-mobile-dev',
  'social-media-marketing-community-growth': 'social-media-community-growth',
  'technical-writing-api-documentation': 'technical-writing-api-docs',
  'the-lean-startup-build-your-mvp': 'product-strategy-lean-startup',
  'visual-brand-design-graphic-artistry': 'visual-brand-design',
  'web-development-bootcamp-from-zero-to-hero': 'full-stack-web-development',
};

function imageFilenameToCandidateSlugs(filename, knownSlugsSet) {
  const base = toCanonical(filename.replace(/\.[^.]+$/, ''));
  const noPrefix = base.replace(/^course-/, '');
  const candidates = new Set([noPrefix]);
  if (ALIAS_TO_SLUG[noPrefix]) candidates.add(ALIAS_TO_SLUG[noPrefix]);

  // Sometimes filename has trailing hyphen before extension in source assets.
  candidates.add(noPrefix.replace(/-+$/, ''));

  // Broad fallback: match slug inclusion both ways.
  for (const slug of knownSlugsSet) {
    if (slug === noPrefix || slug.includes(noPrefix) || noPrefix.includes(slug)) {
      candidates.add(slug);
    }
  }

  return [...candidates].filter((slug) => knownSlugsSet.has(slug));
}

function pickSubtitle(course) {
  const raw =
    (course.summary && course.summary.trim()) ||
    (course.description && course.description.trim()) ||
    `Advance your skills with ${course.title}.`;

  // Keep subtitle concise so CTA and QR never compete for vertical space.
  if (raw.length <= 110) return raw;
  return `${raw.slice(0, 107).trim()}...`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!fs.existsSync(IMAGE_DIR)) {
    throw new Error(`Courses image directory not found: ${IMAGE_DIR}`);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log('🔎 Fetching courses from Sanity...');
  const courses = await client.fetch(`
    *[_type == "course" && defined(slug.current)]{
      _id,
      title,
      summary,
      description,
      "slug": slug.current
    }
  `);

  const filteredCourses = args.slugs.length
    ? courses.filter((c) => args.slugs.includes(c.slug))
    : courses;

  const slugToCourse = new Map(filteredCourses.map((c) => [c.slug, c]));
  const knownSlugsSet = new Set(slugToCourse.keys());

  const imageFiles = fs
    .readdirSync(IMAGE_DIR)
    .filter((name) => /\.(jpg|jpeg|png)$/i.test(name));

  const selected = [];
  const matchedSlugs = new Set();

  for (const imageFile of imageFiles) {
    const matches = imageFilenameToCandidateSlugs(imageFile, knownSlugsSet);
    if (!matches.length) continue;

    // Keep first match per slug to avoid duplicate outputs from variant filenames.
    for (const slug of matches) {
      if (matchedSlugs.has(slug)) continue;
      matchedSlugs.add(slug);
      selected.push({ slug, imageFile });
      break;
    }
  }

  selected.sort((a, b) => a.slug.localeCompare(b.slug));

  const finalSelection = args.limit > 0 ? selected.slice(0, args.limit) : selected;

  console.log(`📦 Matched ${selected.length} course slugs with local course images.`);
  if (args.limit > 0) {
    console.log(`🎯 Applying limit: generating ${finalSelection.length} images.`);
  }

  if (!finalSelection.length) {
    console.log('⚠️ No matched courses found.');
    return;
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  let generated = 0;

  for (const item of finalSelection) {
    const course = slugToCourse.get(item.slug);
    const imagePath = path.join(IMAGE_DIR, item.imageFile);
    const bgData = getImageDataUri(imagePath);
    const accent = accentForSlug(course.slug);
    const qrUrl = `https://www.hexadigitall.com/courses/${course.slug}`;
    const qrCodeUri = await generateQRCodeUri(qrUrl);
    const subtitle = pickSubtitle(course);

    const html = cardHTML({
      title: course.title,
      subtitle,
      accent,
      backgroundImageUri: bgData,
      qrCodeDataUri: qrCodeUri,
    });

    const outFile = path.join(OUT_DIR, `course-${course.slug}.jpg`);

    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await page.screenshot({ path: outFile, type: 'jpeg', quality: 92 });

    generated += 1;
    console.log(`✅ ${generated}/${finalSelection.length} -> course-${course.slug}.jpg (bg: ${item.imageFile})`);
  }

  await page.close();
  await browser.close();

  console.log('');
  console.log(`✨ Done. Generated ${generated} Generator 3 OG images with real course backgrounds.`);
  console.log(`📁 Output: ${OUT_DIR}`);
}

main().catch((err) => {
  console.error('❌ Generation failed:', err.message);
  process.exit(1);
});
