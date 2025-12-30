#!/usr/bin/env node

/**
 * HEXADIGITALL COURSE OG IMAGE GENERATOR
 * Uses course images, logo, and polymorphic backgrounds
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
// removed unused sharp import

const OUTPUT_DIR = path.join(__dirname, 'images', 'courses-og');
const COURSE_IMAGES_DIR = path.join(__dirname, '..', 'public', 'course-images');
const LOGO_PATH = path.join(__dirname, '..', 'public', 'hexadigitall-logo-transparent.png');
const COURSE_LIST_PATH = path.join(__dirname, '..', 'docs', 'Fully_Updated_Course_List_Plus_Data_for_Sanity_Studio.md');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const BRAND_COLORS = {
  primary: '#001F3F',
  primaryAccent: '#00D9FF',
  secondary: '#1B4D5C',
  action: '#FF6B4A',
  special: '#00FF41',
  background: '#FFFFFF',
  text: '#2C3E50',
};

const FORMATS = [
  { name: 'og', width: 1200, height: 630 },
];

function getLogoBase64() {
  try {
    const logoBuffer = fs.readFileSync(LOGO_PATH);
    const base64 = logoBuffer.toString('base64');
    return `data:image/png;base64,${base64}`;
  } catch {
    console.warn(`Logo not found at ${LOGO_PATH}`);
    return null;
  }
}

function getCourseImageBase64(imageName) {
  const filepath = path.join(COURSE_IMAGES_DIR, imageName);
  try {
    const imageBuffer = fs.readFileSync(filepath);
    const base64 = imageBuffer.toString('base64');
    return { dataUri: `data:image/jpeg;base64,${base64}`, filepath };
  } catch {
    console.error(`Failed to read image: ${filepath}`);
    return { dataUri: null, filepath: null };
  }
}

function parseCourses() {
  const content = fs.readFileSync(COURSE_LIST_PATH, 'utf8');
  const courseRegex = /Title\s*\n([^\n]+)[\s\S]*?Slug\s*\n([^\n]+)[\s\S]*?ogImage\s*\n([^\n]+)[\s\S]*?ogTitle\s*\n([^\n]+)[\s\S]*?ogDescription\s*\n([^\n]+)/g;
  const courses = [];
  let match;
  while ((match = courseRegex.exec(content)) !== null) {
    courses.push({
      title: match[1].trim(),
      slug: match[2].trim(),
      image: match[3].replace('/assets/images/courses/', '').trim(),
      ogTitle: match[4].trim(),
      ogDescription: match[5].trim(),
    });
  }
  return courses;
}

async function analyzeImage() {
  // ...existing code from V5 for placement, color, etc...
  return { placement: 'bottom-center', align: 'center', stackText: true, color: 'rgba(0,0,0,0.55)', textColor: '#FFFFFF' };
}

function generateTemplate(course, format, courseImageDataUri, logoDataUri, analysis) {
  // ...similar to V5, but with course.title, ogTitle, ogDescription, and CTA...
  const css = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; }
    .canvas { width: 100%; height: 100%; position: relative; overflow: hidden; background: ${BRAND_COLORS.primary}; }
    .course-image { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; z-index: 0; }
    .logo-container { position: absolute; top: 32px; left: 32px; z-index: 5; width: 120px; height: auto; }
    .logo-container img { width: 100%; height: auto; display: block; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3)); }
    .text-background { position: absolute; left: 50%; transform: translateX(-50%); bottom: 70px; padding: 24px 40px; background: ${analysis?.color || 'rgba(0,0,0,0.45)'}; border-radius: 16px; backdrop-filter: blur(2px); box-shadow: 0 6px 18px rgba(0,0,0,0.25); color: ${analysis?.textColor || 'white'}; text-align: left; width: 70%; max-width: 800px; }
    .title { font-family: 'Poppins', sans-serif; font-size: 64px; font-weight: 900; margin-bottom: 12px; color: ${analysis?.textColor || 'white'}; text-shadow: 0 2px 10px rgba(0,0,0,0.55); }
    .og-title { font-size: 32px; font-weight: 700; margin-bottom: 8px; color: ${BRAND_COLORS.primaryAccent}; }
    .og-description { font-size: 20px; margin-bottom: 18px; color: ${analysis?.textColor || 'white'}; }
    .cta-button { display: inline-block; background: ${BRAND_COLORS.action}; color: ${BRAND_COLORS.background}; padding: 20px 50px; border-radius: 50px; font-size: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 6px 18px rgba(0,0,0,0.35); border: none; }
    .footer { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); font-size: 14px; font-weight: 700; z-index: 10; padding: 8px 16px; background: rgba(0,0,0,0.4); border-radius: 8px; backdrop-filter: blur(4px); }
    .website { color: white; text-shadow: 0 2px 6px rgba(0,0,0,0.8); }
  `;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>${css}</style>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    </head>
    <body>
      <div class="canvas">
        ${courseImageDataUri ? `<img src="${courseImageDataUri}" alt="Course" class="course-image">` : ''}
        ${logoDataUri ? `<div class="logo-container"><img src="${logoDataUri}" alt="Hexadigitall Logo"></div>` : ''}
        <div class="text-background">
          <div class="title">${course.title}</div>
          <div class="og-title">${course.ogTitle}</div>
          <div class="og-description">${course.ogDescription}</div>
          <div class="cta-button">Enroll Now</div>
        </div>
        <div class="footer"><div class="website">hexadigitall.com</div></div>
      </div>
    </body>
    </html>
  `;
  return html;
}

async function generateImage(browser, course, format, courseImageObj, logoDataUri) {
  const page = await browser.newPage();
  await page.setViewport({ width: format.width, height: format.height, deviceScaleFactor: 2 });
  const analysis = await analyzeImage();
  const html = generateTemplate(course, format, courseImageObj?.dataUri || null, logoDataUri, analysis);
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const filename = `${course.slug}-${format.name}.jpg`;
  const filepath = path.join(OUTPUT_DIR, filename);
  await page.screenshot({ path: filepath, type: 'jpeg', quality: 95 });
  await page.close();
  return filepath;
}

async function main() {
  console.log('🎨 Hexadigitall Course OG Image Generator\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  const logoDataUri = getLogoBase64();
  if (logoDataUri) {
    console.log('✓ Logo loaded successfully\n');
  } else {
    console.log('⚠️  Logo not found - continuing without logo\n');
  }
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  let totalGenerated = 0;
  let totalFailed = 0;
  const courses = parseCourses();
  for (const course of courses) {
    console.log(`📸 ${course.title}`);
    const courseImage = getCourseImageBase64(course.image);
    if (courseImage && courseImage.dataUri) {
      console.log(`   ✓ Loaded course image`);
    } else {
      console.log(`   ⚠️  No course image found`);
    }
    for (const format of FORMATS) {
      try {
        await generateImage(browser, course, format, courseImage, logoDataUri);
        console.log(`   ✓ ${format.name}`);
        totalGenerated++;
      } catch (err) {
        console.log(`   ✗ ${format.name}: ${err.message}`);
        totalFailed++;
      }
    }
    console.log();
  }
  await browser.close();
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`\n✅ Complete!`);
  console.log(`   Generated: ${totalGenerated} images`);
  console.log(`   Failed: ${totalFailed}`);
  console.log(`   📁 Location: ${OUTPUT_DIR}`);
}

main().catch(console.error);
