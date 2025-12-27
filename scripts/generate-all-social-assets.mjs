#!/usr/bin/env node
/**
 * 🎨 MASTER SOCIAL ASSET GENERATOR (Ultimate Edition)
 * * LOGIC:
 * 1. COURSES: Uses 'public/course-images' (JPGs) + 'public/course_og_images' (PNGs).
 * 2. SERVICES: Uses EXACT filenames from 'promotional-campaign/images/raw'.
 * - Maps every single file you downloaded to a specific Title/Subtitle.
 * 3. DATA ANALYSIS: Uses specific override.
 */

import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

// --- CONFIGURATION ---
const DIRS = {
  out: path.resolve('public/og-images'),
  courseBg: path.resolve('public/course-images'),
  courseOg: path.resolve('public/course_og_images'),
  serviceBg: path.resolve('promotional-campaign/images/raw'),
  dataAnalysisOverride: path.resolve('public/assets/images/courses/course-data-analysis.jpg'),
  homeOg: path.resolve('public/digitall_partner.png'),
  logo: path.resolve('public/hexadigitall-logo-transparent.png')
};

const BRAND = {
  primary: '#001F3F',
  accent: '#00D9FF',
  overlayFrom: 'rgba(0, 31, 63, 0.95)',
  overlayTo: 'rgba(0, 31, 63, 0.1)'
};

const ABBREVIATIONS = new Set([
  'AWS', 'SEO', 'AI', 'LLM', 'API', 'UI', 'UX', 'CISSP', 'CCNA', 'CSM', 'IAC', 'GA4', 
  'IOS', 'CSS', 'HTML', 'SERP', 'PC', 'MVP', 'PM', 'PMP', 'IT', 'SQL', 'GCP', 'AZURE', 'CRM',
  'C#', '.NET', 'DS', 'ML', 'CV', 'BI', 'CMS'
]);

// ✅ THE MASTER LIST: Mapped exactly to your new files
const ALL_SERVICES = [
  // --- 1. WEB & MOBILE DEV ---
  { file: 'service-web-and-mobile-development.jpg', slug: 'service-web-development', title: 'Web & Mobile Dev', subtitle: 'Full-Stack Solutions' },
  { file: 'service-landing-page-design.jpg', slug: 'service-landing-page', title: 'Landing Page Design', subtitle: 'Convert Visitors to Leads' },
  { file: 'service-business-website.jpg', slug: 'service-business-website', title: 'Professional Website', subtitle: 'Launch Your Business Online' },
  { file: 'service-ecommerce-store.jpg', slug: 'service-ecommerce', title: 'E-Commerce Store', subtitle: 'Sell Online 24/7' },
  { file: 'service-mobile-app-development.jpg', slug: 'service-mobile-app', title: 'Mobile App Dev', subtitle: 'iOS & Android Solutions' },
  { file: 'service-cms-integration.jpg', slug: 'service-cms', title: 'CMS Integration', subtitle: 'Manage Content Easily' },
  
  // --- 2. BUSINESS PLANS ---
  { file: 'service-business-plan-and-logo.jpg', slug: 'service-business-plan', title: 'Business Plans', subtitle: 'Strategy & Funding' },
  { file: 'service-business-plan-starter.jpg', slug: 'package-business-plan-starter', title: 'Starter Plan', subtitle: 'Perfect for New Startups' },
  { file: 'service-business-plan-growth.jpg', slug: 'package-business-plan-growth', title: 'Growth Plan', subtitle: 'Scale Your Operations' },
  { file: 'service-business-plan-investor.jpg', slug: 'package-business-plan-investor', title: 'Investor Plan', subtitle: 'Bank-Ready Documents' },
  { file: 'service-logo-design.jpg', slug: 'service-logo-design', title: 'Logo Design', subtitle: 'Memorable Brand Identity' },
  { file: 'service-financial-projections.jpg', slug: 'service-financial-projections', title: 'Financial Projections', subtitle: '5-Year Forecasts' },

  // --- 3. SOCIAL MEDIA ---
  { file: 'service-social-media-marketing.jpg', slug: 'service-social-media', title: 'Social Media Marketing', subtitle: 'Grow Your Audience' },
  { file: 'service-social-starter.jpg', slug: 'package-social-starter', title: 'Social Starter', subtitle: 'Consistent Online Presence' },
  { file: 'service-marketing-pro.jpg', slug: 'package-marketing-pro', title: 'Marketing Pro', subtitle: 'Advanced Growth Strategy' },
  { file: 'service-growth-accelerator.jpg', slug: 'package-growth-accelerator', title: 'Growth Accelerator', subtitle: 'Viral Content & Ads' },
  { file: 'service-ad-campaign-setup.jpg', slug: 'service-ad-campaigns', title: 'Ad Campaign Setup', subtitle: 'High-ROI Paid Ads' },
  { file: 'service-social-media-audit.jpg', slug: 'service-social-audit', title: 'Social Media Audit', subtitle: 'Optimize Your Strategy' },

  // --- 4. MENTORING ---
  { file: 'service-mentoring-and-consulting.jpg', slug: 'service-mentoring', title: 'Mentoring & Consulting', subtitle: 'Expert Guidance' },
  { file: 'service-strategy-session.jpg', slug: 'service-strategy-session', title: 'Strategy Session', subtitle: '1-on-1 Action Plan' },
  { file: 'service-mentoring-program.jpg', slug: 'service-mentoring-program', title: 'Mentorship Program', subtitle: 'Long-Term Career Growth' },
  { file: 'service-pitch-practice.jpg', slug: 'service-pitch-practice', title: 'Pitch Practice', subtitle: 'Win Over Investors' },

  // --- 5. PROFILE & PORTFOLIO ---
  { file: 'service-profile-and-portfolio.jpg', slug: 'service-profile-building', title: 'Profile Building', subtitle: 'Stand Out Professionally' },
  { file: 'service-professional-cv-resume.jpg', slug: 'service-cv-resume', title: 'Professional CV', subtitle: 'ATS-Optimized Resume' },
  { file: 'service-linkedin-optimization.jpg', slug: 'service-linkedin', title: 'LinkedIn Optimization', subtitle: 'Attract Recruiters' },
  { file: 'service-portfolio-website.jpg', slug: 'service-portfolio-site', title: 'Portfolio Website', subtitle: 'Showcase Your Work' },

  // --- 6. SPECIALIZED ---
  { file: 'service-cloud-infrastructure-devops.jpg', slug: 'service-cloud-devops', title: 'Cloud & DevOps', subtitle: 'Scalable Infrastructure' },
  { file: 'service-data-analytics-bi.jpg', slug: 'service-data-analytics', title: 'Data Analytics (BI)', subtitle: 'Visualize Your Data' },
  { file: 'service-it-support.jpg', slug: 'service-it-support', title: 'IT Support', subtitle: 'Reliable Tech Solutions' },
  { file: 'service-cybersecurity.jpg', slug: 'service-cybersecurity', title: 'Cybersecurity', subtitle: 'Protect Your Assets' }
];

// --- HELPERS ---

function cleanTitle(filename) {
  let name = filename.replace(/\.[^/.]+$/, "").replace(/[-_]\d+$/, '').replace(/-$/, '');
  if (name.includes('node-js')) name = name.replace('node-js', 'Node.js');
  return name.split('-').map(word => {
    const upper = word.toUpperCase();
    if (ABBREVIATIONS.has(upper)) return upper;
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

function loadFileAsBase64(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return `data:image/${path.extname(filePath).slice(1)};base64,${fs.readFileSync(filePath).toString('base64')}`;
    }
  } catch (e) { console.warn(`⚠️  Missing: ${filePath}`); }
  return null;
}

// HTML Generator
const generateHTML = (title, subtitle, tag, format, logoData, bgImageData) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&display=swap');
    body { margin: 0; padding: 0; width: ${format.width}px; height: ${format.height}px; font-family: 'Montserrat', sans-serif; overflow: hidden; position: relative; background: ${BRAND.primary}; }
    .bg-image { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('${bgImageData}'); background-size: cover; background-position: center; z-index: 1; }
    .overlay { position: absolute; bottom: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, ${BRAND.overlayTo} 0%, ${BRAND.overlayFrom} 85%); z-index: 2; }
    .content { position: absolute; bottom: 0; left: 0; width: 100%; padding: ${format.id === 'portrait' ? '120px 80px' : '80px'}; box-sizing: border-box; z-index: 3; display: flex; flex-direction: column; justify-content: flex-end; }
    .tag { display: inline-block; background: ${BRAND.accent}; color: ${BRAND.primary}; padding: 10px 24px; border-radius: 50px; font-weight: 800; text-transform: uppercase; font-size: ${format.id === 'portrait' ? '32px' : '20px'}; margin-bottom: 24px; align-self: flex-start; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
    h1 { font-size: ${format.id === 'portrait' ? '70px' : '56px'}; color: white; margin: 0 0 16px 0; line-height: 1.1; font-weight: 800; text-shadow: 0 4px 20px rgba(0,0,0,0.5); text-transform: capitalize; }
    p { font-size: ${format.id === 'portrait' ? '40px' : '28px'}; color: #E2E8F0; margin: 0 0 32px 0; font-weight: 600; max-width: 90%; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
    .logo { position: absolute; top: ${format.id === 'portrait' ? '80px' : '60px'}; left: ${format.id === 'portrait' ? '80px' : '60px'}; width: ${format.id === 'portrait' ? '250px' : '200px'}; z-index: 4; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3)); }
    .website { position: absolute; bottom: ${format.id === 'portrait' ? '60px' : '40px'}; right: ${format.id === 'portrait' ? '80px' : '60px'}; color: rgba(255,255,255,0.8); font-size: ${format.id === 'portrait' ? '32px' : '24px'}; font-weight: 600; letter-spacing: 1px; z-index: 4; }
    .bar { width: 120px; height: 8px; background: ${BRAND.accent}; border-radius: 4px; margin-bottom: 32px; }
  </style>
</head>
<body>
  ${bgImageData ? `<div class="bg-image"></div>` : ''}
  <div class="overlay"></div>
  ${logoData ? `<img src="${logoData}" class="logo" />` : ''}
  <div class="content">
    <div class="tag">${tag}</div>
    <h1>${title}</h1>
    <div class="bar"></div>
    <p>${subtitle}</p>
  </div>
  <div class="website">hexadigitall.com</div>
</body>
</html>
`;

// --- MAIN EXECUTION ---
async function generate() {
  console.log('🚀 Starting SOCIAL ASSET GENERATOR (Ultimate Edition)...');
  
  if (!fs.existsSync(DIRS.out)) fs.mkdirSync(DIRS.out, { recursive: true });
  ['posts', 'stories'].forEach(sub => {
    const p = path.join(DIRS.out, sub);
    if (!fs.existsSync(p)) fs.mkdirSync(p);
  });

  const logoData = loadFileAsBase64(DIRS.logo);
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  // --- A. HOME PAGE ---
  if (fs.existsSync(DIRS.homeOg)) {
    fs.copyFileSync(DIRS.homeOg, path.join(DIRS.out, 'home.png'));
    console.log(`✅ Copied: home.png`);
  }

  // --- B. COURSES (Legacy Source of Truth) ---
  const courseFiles = fs.readdirSync(DIRS.courseBg).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
  console.log(`\n🎓 Processing ${courseFiles.length} Course Backgrounds...`);

  for (const filename of courseFiles) {
    const slug = filename.replace(/\.[^/.]+$/, "");
    const title = cleanTitle(filename);
    
    // 1. Link Preview
    const ogPath = path.join(DIRS.courseOg, slug + '.png');
    const destOgPath = path.join(DIRS.out, slug + '.jpg');
    if (fs.existsSync(ogPath)) {
      fs.copyFileSync(ogPath, destOgPath);
    } else {
      const bgData = loadFileAsBase64(path.join(DIRS.courseBg, filename));
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 630 });
      const html = generateHTML(title, 'Live Mentorship', 'Live Course', { id: 'landscape', width: 1200, height: 630 }, logoData, bgData);
      await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.screenshot({ path: destOgPath, type: 'jpeg', quality: 90 });
      await page.close();
    }

    // 2. Socials
    const bgPath = slug.includes('data-analysis') ? DIRS.dataAnalysisOverride : path.join(DIRS.courseBg, filename);
    const bgData = loadFileAsBase64(bgPath);
    
    if (bgData) {
      const page = await browser.newPage();
      const socialFormats = [
        { id: 'square', width: 1080, height: 1080, folder: 'posts' },
        { id: 'portrait', width: 1080, height: 1920, folder: 'stories' }
      ];
      for (const fmt of socialFormats) {
        try {
          await page.setViewport({ width: fmt.width, height: fmt.height });
          const html = generateHTML(title, 'Live Mentorship & Certification', 'Live Course', fmt, logoData, bgData);
          await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 60000 });
          const outPath = path.join(DIRS.out, fmt.folder, `${slug}.jpg`);
          await page.screenshot({ path: outPath, type: 'jpeg', quality: 90 });
        } catch (err) { console.error(err.message); }
      }
      await page.close();
      console.log(`   ✨ Generated Course: ${title}`);
    }
  }

  // --- C. SERVICES (Explicit Mapping) ---
  console.log(`\n🛠️  Processing ${ALL_SERVICES.length} Services...`);
  
  for (const item of ALL_SERVICES) {
    const bgPath = path.join(DIRS.serviceBg, item.file);
    const bgData = loadFileAsBase64(bgPath);

    if (!bgData) {
      console.warn(`   ⚠️ Missing Image: ${item.file} (Skipping ${item.title})`);
      continue;
    }

    const page = await browser.newPage();
    const allFormats = [
      { id: 'landscape', width: 1200, height: 630, folder: '' },
      { id: 'square', width: 1080, height: 1080, folder: 'posts' },
      { id: 'portrait', width: 1080, height: 1920, folder: 'stories' }
    ];

    for (const fmt of allFormats) {
      try {
        await page.setViewport({ width: fmt.width, height: fmt.height });
        const html = generateHTML(item.title, item.subtitle, 'Premium Service', fmt, logoData, bgData);
        await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 60000 });
        const outPath = fmt.folder 
          ? path.join(DIRS.out, fmt.folder, `${item.slug}.jpg`)
          : path.join(DIRS.out, `${item.slug}.jpg`);
        await page.screenshot({ path: outPath, type: 'jpeg', quality: 90 });
      } catch (err) {
        console.error(`      ❌ Error ${item.slug}: ${err.message}`);
      }
    }
    await page.close();
    console.log(`   ✅ Generated: ${item.title}`);
  }

  await browser.close();
  console.log('\n🎉 ASSET GENERATION COMPLETE!');
}

generate().catch(console.error);