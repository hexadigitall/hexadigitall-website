#!/usr/bin/env node
/**
 * Generate Open Graph images from HTML/CSS using Puppeteer.
 * Features:
 * - Clean minimal design with left-side overlay and full-bleed background
 * - Dynamic school and service OG images from background image folders
 * - Robust title logic with suffix/abbreviation handling
 * - QR code generation and embedding (positioned bottom-right)
 * 
 * Outputs 1200x630 PNG + JPG files to public/og-images.
 * 
 * Background Image Directories:
 * - Courses: public/assets/images/courses
 * - Schools: public/assets/images/schools
 * - Services: public/assets/images/services
 */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';
import QRCode from 'qrcode';

const OUT_DIR = path.resolve('public/og-images');
const ASSETS_DIR = path.resolve('public/assets/images');
const WIDTH = 1200;
const HEIGHT = 630;

const IMAGE_DIRS = {
  courses: path.join(ASSETS_DIR, 'courses'),
  schools: path.join(ASSETS_DIR, 'schools'),
  services: path.join(ASSETS_DIR, 'services'),
};

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
  void e;
  try {
    LOGO_SVG = fs.readFileSync(path.resolve('public/hexadigitall-logo.svg'), 'utf8');
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

function filenameToSlug(filename) {
  if (!filename) return '';
  let slug = filename.replace(/\.[^/.]+$/, '');
  slug = slug.replace(/-\d+$/, '');
  
  // Map common filename variations to correct slugs
  const slugMap = {
    'advanced-ansible-automation-iac': 'advanced-ansible-automation',
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
    'digital-literacy-computer-operations': 'digital-literacy-computer-operations',
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
    'java-enterprise-development': 'java-enterprise-development',
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
    'course-coding': 'full-stack-web-development',
    'course-data-analysis': 'python-data-science-analytics'
  };
  
  return slugMap[slug] || slug;
}

function filenameToTitle(filename) {
  if (!filename) return '';
  let title = filename.replace(/\.[^/.]+$/, '');
  title = title.replace(/-\d+$/, '');
  let words = title.split('-');
  const acronyms = new Set([
    'api', 'aws', 'ccna', 'cissp', 'cms', 'csm', 'devops', 'ga', 'ga4', 'html', 
    'http', 'iac', 'ios', 'it', 'json', 'llm', 'mvp', 'node', 'oop', 'orm', 'pmp', 
    'rest', 'seo', 'sql', 'sso', 'ui', 'ux', 'vfx', 'wip', 'xml', 'ai', 'bi', 'cv', 
    'dm', 'cto', 'cfo', 'ceo', 'saas', 'b2b', 'b2c', 'yoy', 'roi', 'kpi', 'oa'
  ]);
  words = words.map(word => {
    if (!word) return '';
    const lower = word.toLowerCase();
    if (acronyms.has(lower)) return lower.toUpperCase();
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  words = words.filter(word => isNaN(word));
  return words.join(' ');
}

function getImageDataUri(imagePath) {
  if (!imagePath || !fs.existsSync(imagePath)) return '';
  try {
    const buffer = fs.readFileSync(imagePath);
    const ext = path.extname(imagePath).slice(1).toLowerCase();
    const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
    return `data:${mime};base64,${buffer.toString('base64')}`;
  } catch {
    return '';
  }
}

async function generateBaseCards(browser) {
  const page = await browser.newPage();
  let count = 0;

  const baseCards = [
    {
      file: 'services-hub',
      title: 'Professional Digital Services',
      label: 'Web Development · Marketing · Business',
      buttonText: 'Explore Services',
    },
    {
      file: 'courses-hub',
      title: 'Master In‑Demand Tech Skills',
      label: 'Professional Certification',
      buttonText: 'Browse Courses',
    },
    {
      file: 'proposal-jhema-wears',
      title: 'Jhema Wears E‑Commerce',
      label: 'Complete Online Store Solution',
      buttonText: 'View Proposal',
    },
    {
      file: 'proposal-generic',
      title: 'E‑Commerce Solutions',
      label: 'Launch Your Online Store',
      buttonText: 'Get Started',
    },
    {
      file: 'proposal-divas-kloset',
      title: 'Social Media Growth Strategy',
      label: 'Content · Ads · Community',
      buttonText: 'Learn More',
    },
  ];

  for (const card of baseCards) {
    const qrUrl = `https://www.hexadigitall.com/${card.file}`;
    const qrCodeUri = await generateQRCodeUri(qrUrl);
    const html = cardHTML({
      title: card.title,
      label: card.label,
      buttonText: card.buttonText,
      qrCodeDataUri: qrCodeUri,
    });
    
    try {
      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      const pngPath = path.join(OUT_DIR, `${card.file}.png`);
      const jpgPath = path.join(OUT_DIR, `${card.file}.jpg`);
      await page.screenshot({ path: pngPath, type: 'png' });
      await page.screenshot({ path: jpgPath, type: 'jpeg', quality: 90 });
      console.log(`✅ Base card: ${path.relative(process.cwd(), jpgPath)}`);
      count++;
    } catch (err) {
      console.error(`❌ Failed to generate base card ${card.file}:`, err.message);
    }
  }

  await page.close();
  return count;
}

async function generateCourseOGImages(browser) {
  const page = await browser.newPage();
  const coursesDir = IMAGE_DIRS.courses;
  
  if (!fs.existsSync(coursesDir)) {
    console.warn(`⚠️  Courses directory not found: ${coursesDir}`);
    return 0;
  }

  const courseImages = fs.readdirSync(coursesDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  let count = 0;

  for (const imageFile of courseImages) {
    const imagePath = path.join(coursesDir, imageFile);
    const filename = imageFile.replace(/\.[^/.]+$/, '');
    const slug = filenameToSlug(filename);
    const title = filenameToTitle(filename);
    const bgUri = getImageDataUri(imagePath);
    const qrUrl = `https://www.hexadigitall.com/courses/${slug}`;
    const qrCodeUri = await generateQRCodeUri(qrUrl);

    const html = cardHTML({
      title,
      label: 'Professional Certification',
      buttonText: 'Enroll Now',
      backgroundImageUri: bgUri,
      qrCodeDataUri: qrCodeUri,
    });

    const outFile = `course-${filename}`;
    try {
      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      const pngPath = path.join(OUT_DIR, `${outFile}.png`);
      const jpgPath = path.join(OUT_DIR, `${outFile}.jpg`);
      await page.screenshot({ path: pngPath, type: 'png' });
      await page.screenshot({ path: jpgPath, type: 'jpeg', quality: 90 });
      console.log(`✅ Course: ${path.relative(process.cwd(), jpgPath)}`);
      count++;
    } catch (err) {
      console.error(`❌ Failed to generate course OG for ${slug}:`, err.message);
    }
  }

  await page.close();
  return count;
}

async function generateSchoolOGImages(browser) {
  const page = await browser.newPage();
  const schoolsDir = IMAGE_DIRS.schools;
  
  if (!fs.existsSync(schoolsDir)) {
    console.warn(`⚠️  Schools directory not found: ${schoolsDir}`);
    return 0;
  }

  const schoolImages = fs.readdirSync(schoolsDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  let count = 0;

  for (const imageFile of schoolImages) {
    const imagePath = path.join(schoolsDir, imageFile);
    const slug = imageFile.replace(/\.[^/.]+$/, '');
    const title = filenameToTitle(slug);
    const bgUri = getImageDataUri(imagePath);
    const qrUrl = `https://www.hexadigitall.com/school/${slug}`;
    const qrCodeUri = await generateQRCodeUri(qrUrl);

    const html = cardHTML({
      title,
      label: 'School & Training Program',
      buttonText: 'Learn More',
      backgroundImageUri: bgUri,
      qrCodeDataUri: qrCodeUri,
    });

    const outFile = `school-${slug}`;
    try {
      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      const pngPath = path.join(OUT_DIR, `${outFile}.png`);
      const jpgPath = path.join(OUT_DIR, `${outFile}.jpg`);
      await page.screenshot({ path: pngPath, type: 'png' });
      await page.screenshot({ path: jpgPath, type: 'jpeg', quality: 90 });
      console.log(`✅ School: ${path.relative(process.cwd(), jpgPath)}`);
      count++;
    } catch (err) {
      console.error(`❌ Failed to generate school OG for ${slug}:`, err.message);
    }
  }

  await page.close();
  return count;
}

async function generateServiceOGImages(browser) {
  const page = await browser.newPage();
  const servicesDir = IMAGE_DIRS.services;
  
  if (!fs.existsSync(servicesDir)) {
    console.warn(`⚠️  Services directory not found: ${servicesDir}`);
    return 0;
  }

  const serviceImages = fs.readdirSync(servicesDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  let count = 0;

  for (const imageFile of serviceImages) {
    const imagePath = path.join(servicesDir, imageFile);
    const slug = imageFile.replace(/\.[^/.]+$/, '');
    const title = filenameToTitle(slug);
    const bgUri = getImageDataUri(imagePath);
    const qrUrl = `https://www.hexadigitall.com/services/${slug}`;
    const qrCodeUri = await generateQRCodeUri(qrUrl);

    const html = cardHTML({
      title,
      label: 'Professional Service',
      buttonText: 'Get Started',
      backgroundImageUri: bgUri,
      qrCodeDataUri: qrCodeUri,
    });

    const outFile = `service-${slug}`;
    try {
      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      const pngPath = path.join(OUT_DIR, `${outFile}.png`);
      const jpgPath = path.join(OUT_DIR, `${outFile}.jpg`);
      await page.screenshot({ path: pngPath, type: 'png' });
      await page.screenshot({ path: jpgPath, type: 'jpeg', quality: 90 });
      console.log(`✅ Service: ${path.relative(process.cwd(), jpgPath)}`);
      count++;
    } catch (err) {
      console.error(`❌ Failed to generate service OG for ${slug}:`, err.message);
    }
  }

  await page.close();
  return count;
}

async function generate() {
  ensureOutDir();
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    console.log('🎨 Generating clean, minimal OG images with QR codes...\n');

    const baseCount = await generateBaseCards(browser);
    const courseCount = await generateCourseOGImages(browser);
    const schoolCount = await generateSchoolOGImages(browser);
    const serviceCount = await generateServiceOGImages(browser);

    const totalCount = baseCount + courseCount + schoolCount + serviceCount;
    console.log(`\n✨ Generation complete!`);
    console.log(`   Base cards: ${baseCount}`);
    console.log(`   Courses: ${courseCount}`);
    console.log(`   Schools: ${schoolCount}`);
    console.log(`   Services: ${serviceCount}`);
    console.log(`   Total: ${totalCount} OG images generated`);
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
