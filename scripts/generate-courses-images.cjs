#!/usr/bin/env node
/**
 * 🎨 MASTER SOCIAL ASSET GENERATOR (Source of Truth Edition)
 * * LOGIC REVERSED:
 * 1. COURSES: Loop through 'public/course-images' (JPGs) to ensure correct backgrounds.
 * - Link Preview: Look for matching PNG in 'public/course_og_images'.
 * - Socials: Generate using the JPG source.
 * * 2. SERVICES: Map Service -> Theme -> Image in 'promotional-campaign/images/raw'.
 */

import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

// --- CONFIGURATION ---
const DIRS = {
  out: path.resolve('public/og-images'),
  courseBg: path.resolve('public/course-images'),    // SOURCE OF TRUTH for Courses
  courseOg: path.resolve('public/course_og_images'), // Source for Link Previews
  serviceBg: path.resolve('promotional-campaign/images/raw'),
  dataAnalysisBg: path.resolve('public/assets/images/courses/course-data-analysis.jpg'),
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
  'C#', '.NET'
]);

// Service Mapping (Theme-based)
const SERVICES = [
  { slug: 'service-web-development', title: 'Professional Websites', subtitle: 'Launch in 7 Days', theme: 'tech' },
  { slug: 'service-business-planning', title: 'Bank-Ready Business Plans', subtitle: 'Secure Funding Fast', theme: 'business' },
  { slug: 'service-digital-marketing', title: 'Digital Marketing', subtitle: 'Triple Your Leads', theme: 'marketing' },
  { slug: 'service-ecommerce', title: 'E-Commerce Stores', subtitle: 'Sell Online 24/7', theme: 'tech' } // Uses tech images if 'shop' missing
];

// --- HELPERS ---

function cleanTitle(filename) {
  // 1. Remove extension
  let slug = filename.replace(/\.[^/.]+$/, "");
  
  // 2. Remove trailing numbers/junk (e.g. "-2", "-0", "-")
  // Matches - followed by digits or nothing at end of string
  slug = slug.replace(/[-_]\d+$/, '').replace(/-$/, '');

  // 3. Fix specific messy slugs if needed
  if (slug.includes('node-js')) slug = slug.replace('node-js', 'Node.js');

  // 4. Capitalize
  return slug.split('-').map(w => {
    const upper = w.toUpperCase();
    if (ABBREVIATIONS.has(upper)) return upper;
    return w.charAt(0).toUpperCase() + w.slice(1);
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

// Find image by Theme Keyword in Raw folder
function findServiceImage(theme) {
  if (!fs.existsSync(DIRS.serviceBg)) return null;
  const files = fs.readdirSync(DIRS.serviceBg);
  
  // Look for file containing theme name (e.g. "tech-1.jpg")
  const match = files.find(f => f.toLowerCase().includes(theme) && /\.(jpg|jpeg|png|webp)$/i.test(f));
  
  return match ? path.join(DIRS.serviceBg, match) : null;
}

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
    h1 { font-size: ${format.id === 'portrait' ? '80px' : '64px'}; color: white; margin: 0 0 16px 0; line-height: 1.1; font-weight: 800; text-shadow: 0 4px 20px rgba(0,0,0,0.5); text-transform: capitalize; }
    p { font-size: ${format.id === 'portrait' ? '40px' : '30px'}; color: #E2E8F0; margin: 0 0 32px 0; font-weight: 600; max-width: 90%; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
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
  console.log('🚀 Starting SOCIAL ASSET GENERATOR (Source of Truth Edition)...');
  
  // 1. Setup
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

  // --- B. COURSES (Driven by public/course-images JPGs) ---
  // This ensures we use every background provided by the user.
  const courseFiles = fs.readdirSync(DIRS.courseBg).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
  console.log(`\n🎓 Processing ${courseFiles.length} Course Backgrounds...`);

  for (const filename of courseFiles) {
    const slug = filename.replace(/\.[^/.]+$/, "");
    const title = cleanTitle(filename);
    
    // 1. Handle Link Preview (Landscape)
    // Check if a pre-made PNG exists in course_og_images
    const ogPath = path.join(DIRS.courseOg, slug + '.png');
    const destOgPath = path.join(DIRS.out, slug + '.jpg');
    
    if (fs.existsSync(ogPath)) {
      // Use existing high-quality OG
      fs.copyFileSync(ogPath, destOgPath);
      // console.log(`   📦 ${slug} (Link Copied)`);
    } else {
      // If no pre-made OG exists, we must generate one from the background
      console.log(`   ⚙️  Generating missing Link Preview for ${slug}`);
      const bgData = loadFileAsBase64(path.join(DIRS.courseBg, filename));
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 630 });
      const html = generateHTML(title, 'Live Mentorship', 'Live Course', { id: 'landscape', width: 1200, height: 630 }, logoData, bgData);
      await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.screenshot({ path: destOgPath, type: 'jpeg', quality: 90 });
      await page.close();
    }

    // 2. Generate Socials (Square/Portrait) using the Correct Background
    // Data Analysis Override check
    const bgPath = slug.includes('data-analysis') 
      ? DIRS.dataAnalysisBg 
      : path.join(DIRS.courseBg, filename);

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
        } catch (err) {
          console.error(`      ❌ Error ${slug} [${fmt.id}]: ${err.message}`);
        }
      }
      await page.close();
      console.log(`   ✨ Generated Socials: ${title}`);
    }
  }

  // --- C. SERVICES (Theme-Based Matching) ---
  console.log(`\n🛠️  Processing Services...`);
  for (const service of SERVICES) {
    const bgPath = findServiceImage(service.theme);
    
    if (bgPath) {
      const bgData = loadFileAsBase64(bgPath);
      const page = await browser.newPage();
      const allFormats = [
        { id: 'landscape', width: 1200, height: 630, folder: '' },
        { id: 'square', width: 1080, height: 1080, folder: 'posts' },
        { id: 'portrait', width: 1080, height: 1920, folder: 'stories' }
      ];

      for (const fmt of allFormats) {
        try {
          await page.setViewport({ width: fmt.width, height: fmt.height });
          const html = generateHTML(service.title, service.subtitle, 'Premium Service', fmt, logoData, bgData);
          await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 60000 });
          const outPath = fmt.folder 
            ? path.join(DIRS.out, fmt.folder, `${service.slug}.jpg`)
            : path.join(DIRS.out, `${service.slug}.jpg`);
          await page.screenshot({ path: outPath, type: 'jpeg', quality: 90 });
        } catch (err) {
          console.error(`      ❌ Error ${service.slug}: ${err.message}`);
        }
      }
      await page.close();
      console.log(`   ✅ ${service.slug} (Using: ${path.basename(bgPath)})`);
    } else {
      console.warn(`   ⚠️  No background found for theme: ${service.theme}`);
    }
  }

  await browser.close();
  console.log('\n🎉 DONE!');
}

generate().catch(console.error);