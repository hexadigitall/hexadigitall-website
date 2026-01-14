#!/usr/bin/env node
/**
 * Generate OG images for new courses
 * Uses existing course images as backgrounds with proper overlay design
 */

import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import QRCode from 'qrcode';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BRAND = { 
  primary: '#001F3F', 
  accent: '#00D9FF', 
  overlayFrom: 'rgba(0, 31, 63, 0.95)', 
  overlayTo: 'rgba(0, 31, 63, 0.3)' 
};

const coursesData = [
  { slug: 'autocad-masterclass', title: 'AutoCAD Masterclass', subtitle: '2D Drafting & 3D Modeling', image: 'autocad-masterclass.jpg' },
  { slug: 'archicad-professional', title: 'ArchiCAD Professional', subtitle: 'BIM & Visualization', image: 'archicad-professional.jpg' },
  { slug: 'adobe-creative-cloud-suite', title: 'Adobe Creative Cloud Suite', subtitle: 'Vector & Photo Compositing', image: 'adobe-creative-cloud-suite.jpg' },
  { slug: 'vector-graphics-mastery-coreldraw', title: 'Vector Graphics Mastery', subtitle: 'CorelDRAW Print Design', image: 'vector-graphics-mastery-coreldraw.jpg' },
  { slug: 'visual-communication-infographics', title: 'Visual Communication', subtitle: 'Design & Data Visualization', image: 'digital-literacy-computer-operations.jpg' },
  { slug: 'business-intelligence-analytics', title: 'Business Intelligence & Analytics', subtitle: 'Power BI & Tableau Dashboards', image: 'business-intelligence-bi-and-analytics.jpg' },
  { slug: 'advanced-excel-business', title: 'Advanced Excel for Business', subtitle: 'Formulas, Pivot Tables & Macros', image: 'advanced-excel-for-business.jpg' },
  { slug: 'programming-data-management', title: 'Programming for Data Management', subtitle: 'Python, Pandas & NumPy', image: 'data-analysis-with-python.jpg' },
  { slug: 'sql-relational-database-design', title: 'SQL & Database Design', subtitle: 'Complex Queries & Normalization', image: 'advanced-backend-engineering-node-js-microservices-.jpg' },
  { slug: 'nosql-cloud-database-architecture', title: 'NoSQL & Cloud DB Architecture', subtitle: 'MongoDB, AWS & Azure', image: 'aws-certified-solutions-architect-associate-professional-.jpg' },
  { slug: 'rapid-app-development-low-code', title: 'Rapid App Development', subtitle: 'Low-Code/No-Code Solutions', image: 'cross-platform-mobile-app-development-react-native-.jpg' },
  { slug: 'microsoft-access-business-apps', title: 'Microsoft Access', subtitle: 'Business Database Apps', image: 'digital-literacy-computer-operations.jpg' },
  { slug: 'executive-presentation-public-speaking', title: 'Executive Presentation', subtitle: 'Public Speaking & Slide Design', image: 'executive-presentation-and-public-speaking.jpg' },
  { slug: 'microsoft-365-ai-integration', title: 'Microsoft 365 & AI', subtitle: 'Copilot & Teams Collaboration', image: 'digital-literacy-computer-operations-2.jpg' }
];

Let me create a focused script that generates OG images using the same approach as the existing generate-final-assets.mjs script that works.
</thinking>

<function_calls>
<invoke name="create_file">
<parameter name="content">#!/usr/bin/env node
/**
 * Generate OG Images for New Courses
 * Uses the same proven approach as generate-final-assets.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';
import QRCode from 'qrcode';

const DIRS = {
  out: 'public/og-images',
  courseBg: 'public/assets/images/courses',
  logo: 'public/hexadigitall-logo-transparent.png'
};

const BRAND = { 
  primary: '#001F3F', 
  accent: '#00D9FF', 
  overlayFrom: 'rgba(0, 31, 63, 0.95)', 
  overlayTo: 'rgba(0, 31, 63, 0.3)' 
};

const coursesData = [
  { slug: 'autocad-masterclass', title: 'AutoCAD Masterclass', subtitle: 'Master 2D & 3D Design', file: 'autocad-masterclass.jpg' },
  { slug: 'archicad-professional', title: 'ArchiCAD Professional', subtitle: 'BIM & Visualization', file: 'archicad-professional.jpg' },
  { slug: 'adobe-creative-cloud-suite', title: 'Adobe Creative Cloud', subtitle: 'Vector & Photo Design', file: 'adobe-creative-cloud-suite.jpg' },
  { slug: 'vector-graphics-mastery-coreldraw', title: 'Vector Graphics Mastery', subtitle: 'Print Design with CorelDRAW', file: 'vector-graphics-mastery-coreldraw.jpg' },
  { slug: 'visual-communication-infographics', title: 'Visual Communication', subtitle: 'Design & Infographics', file: 'digital-literacy-computer-operations.jpg' },
  { slug: 'business-intelligence-analytics', title: 'Business Intelligence & Analytics', description: 'Power BI, Tableau & Dashboards', image: 'business-intelligence-bi-and-analytics.jpg' },
  { slug: 'advanced-excel-business', title: 'Advanced Excel for Business', description: 'Formulas, Pivot Tables & Macros', image: 'advanced-excel-for-business.jpg' },
  { slug: 'programming-data-management', title: 'Programming for Data', description: 'Python, Pandas & NumPy', image: 'data-analysis-with-python.jpg' },
  { slug: 'sql-relational-database-design', title: 'SQL & Database Design', description: 'Complex Queries & Normalization', image: 'advanced-backend-engineering-node-js-microservices-.jpg' },
  { slug: 'nosql-cloud-database-architecture', title: 'NoSQL & Cloud DB', description: 'MongoDB, AWS & Azure', image: 'aws-certified-solutions-architect-associate-professional-.jpg' },
  { slug: 'rapid-app-development-low-code', title: 'Rapid App Development', description: 'Low-Code/No-Code Solutions', image: 'cross-platform-mobile-app-development-react-native-.jpg' },
  { slug: 'microsoft-access-business-apps', title: 'Microsoft Access', description: 'Business Database Apps', image: 'digital-literacy-computer-operations.jpg' },
  { slug: 'executive-presentation-public-speaking', title: 'Executive Presentation', description: 'Public Speaking & Slides', image: 'executive-presentation-and-public-speaking.jpg' },
  { slug: 'microsoft-365-ai-integration', title: 'Microsoft 365 & AI', description: 'Copilot & Collaboration', image: 'digital-literacy-computer-operations-2.jpg' }
];

async function generateOGImagesSync() {
  console.log('🎨 Generating OG Images for 14 Courses\n');
  
  const outputDir = path.join(__dirname, 'public/og-images');
  const coursesDir = path.join(__dirname, 'public/assets/images/courses');
  const logoPath = path.join(__dirname, 'public/hexadigitall-logo-transparent.png');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const logoData = fs.existsSync(logoPath) 
    ? `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}` 
    : null;
  
  console.log('🚀 Starting browser...');
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  let count = 0;
  
  for (const course of courses) {
    const outputPath = path.join(outputDir, `${course.slug}.jpg`);
    
    if (fs.existsSync(outputPath)) {
      console.log(`${++count}/14 ⏩ ${course.slug} - exists`);
      continue;
    }
    
    const bgPath = path.join(coursesDir, course.image);
    if (!fs.existsSync(bgPath)) {
      console.log(`${++count}/14 ⚠️  ${course.slug} - image not found: ${course.image}`);
      continue;
    }
    
    const bgData = `data:image/jpeg;base64,${fs.readFileSync(bgPath).toString('base64')}`;
    const url = `https://www.hexadigitall.com/courses/${course.slug}`;
    const qrCode = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'H',
      width: 180,
      margin: 1,
      color: { dark: '#001F3F', light: '#FFFFFF' }
    });
    
    const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;font-family:'Montserrat',sans-serif;overflow:hidden;position:relative;background:#001F3F}
.bg{position:absolute;top:0;left:0;width:100%;height:100%;background:url('${bgData}') center/cover;z-index:1}
.overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(135deg,rgba(0,31,63,0.85) 0%,rgba(0,31,63,0.4) 50%,rgba(0,217,255,0.05) 100%);z-index:2}
.logo{position:absolute;top:25px;left:35px;height:55px;z-index:4}
.content{position:absolute;left:45px;top:130px;width:680px;z-index:3}
.tag{display:inline-block;background:linear-gradient(135deg,#00D9FF,#0099CC);color:#fff;padding:6px 18px;border-radius:18px;font-weight:800;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;box-shadow:0 3px 12px rgba(0,217,255,0.3)}
h1{font-size:52px;font-weight:800;color:#fff;line-height:1.15;margin-bottom:10px;text-shadow:0 4px 20px rgba(0,0,0,0.6)}
.bar{width:75px;height:4px;background:linear-gradient(90deg,#00D9FF,#0099CC);margin-bottom:14px;border-radius:2px}
.desc{font-size:17px;color:#E2E8F0;line-height:1.5;margin-bottom:18px;text-shadow:0 2px 10px rgba(0,0,0,0.4)}
.cta{display:inline-block;background:linear-gradient(135deg,#00D9FF,#0099CC);color:#001F3F;padding:11px 30px;border-radius:24px;font-weight:800;font-size:13px;text-transform:uppercase;letter-spacing:1px;box-shadow:0 4px 15px rgba(0,217,255,0.4)}
.qr{position:absolute;right:35px;bottom:35px;z-index:4;text-align:center}
.qr img{width:110px;height:110px;background:#fff;padding:7px;border-radius:9px;box-shadow:0 4px 15px rgba(0,0,0,0.4);margin-bottom:6px}
.qr-text{font-size:9px;color:#E2E8F0;font-weight:700;letter-spacing:0.5px}
.footer{position:absolute;bottom:22px;left:45px;z-index:4;color:rgba(255,255,255,0.65);font-size:11px;font-weight:600;letter-spacing:0.5px}
</style></head><body>
<div class="bg"></div><div class="overlay"></div>
${logoData?`<img src="${logoData}" class="logo">`:''}
<div class="content">
<div class="tag">Live Course</div>
<h1>${course.title}</h1>
<div class="bar"></div>
<p class="desc">${course.description}</p>
<div class="cta">Enroll Now</div>
</div>
<div class="qr">
<img src="${qrCode}">
<div class="qr-text">SCAN TO ENROLL</div>
</div>
<div class="footer">hexadigitall.com</div>
</body></html>`;
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630 });
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await page.screenshot({ path: outputPath, type: 'jpeg', quality: 92 });
    await page.close();
    
    console.log(`${++count}/14 ✅ ${course.slug}`);
  }
  
  await browser.close();
  console.log('\n✨ Complete! Generated OG images in public/og-images/\n');
}

generateOGImagesSync().catch(console.error);
