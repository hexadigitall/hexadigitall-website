import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import QRCode from 'qrcode';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const LOGO_PATH = path.join(PROJECT_ROOT, 'public/hexadigitall-logo-transparent.png');
const OUTPUT_ROOT = path.join(PROJECT_ROOT, 'public/og-images');
const COURSES_DIR = path.join(PROJECT_ROOT, 'public/assets/images/courses');

const BASE_SITE_URL = 'https://www.hexadigitall.com';

const COURSE_TITLE_MAP = {
  'autocad-masterclass': 'AutoCAD Masterclass',
  'archicad-professional': 'ArchiCAD Professional',
  'adobe-creative-cloud-suite': 'Adobe Creative Cloud Suite',
  'vector-graphics-mastery-coreldraw': 'Vector Graphics Mastery (CorelDRAW)',
  'visual-communication-infographics': 'Visual Communication & Infographics',
  'business-intelligence-analytics': 'Business Intelligence (BI) & Analytics',
  'advanced-excel-business': 'Advanced Excel for Business',
  'programming-data-management': 'Programming for Data Management',
  'sql-relational-database-design': 'SQL & Relational Database Design',
  'nosql-cloud-database-architecture': 'NoSQL & Cloud Database Architecture',
  'rapid-app-development-low-code': 'Rapid App Development (Low-Code/No-Code)',
  'microsoft-access-business-apps': 'Microsoft Access for Business Apps',
  'executive-presentation-public-speaking': 'Executive Presentation & Public Speaking',
  'microsoft-365-ai-integration': 'Microsoft 365 & AI Integration',
};

function getTitle(filename) {
  const name = path.parse(filename).name;
  
  // Check new courses first
  for (const [key, title] of Object.entries(COURSE_TITLE_MAP)) {
    if (name.includes(key)) return title;
  }
  
  // Fallback: smart title case
  const words = name.replace(/^course-/, '').split(/[-_]/);
  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function getDesignHTML(title, imgBase64, logoBase64, qrCodeBase64) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&display=swap');
        body { margin: 0; padding: 0; width: 1200px; height: 630px; font-family: 'Montserrat', sans-serif; background-color: #001F3F; position: relative; overflow: hidden; }
        
        .bg-image { position: absolute; inset: 0; background-image: url('${imgBase64}'); background-size: cover; background-position: center; opacity: 0.4; z-index: 1; }
        
        .overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(0,31,63,0.9) 0%, rgba(0,31,63,0.7) 50%, rgba(0,217,255,0.1) 100%); z-index: 2; }
        
        .logo { position: absolute; top: 30px; left: 30px; width: 180px; z-index: 20; }
        
        .content { position: absolute; left: 40px; bottom: 40px; width: 700px; z-index: 10; }
        
        .badge { display: inline-block; background: linear-gradient(135deg, #00D9FF, #0099CC); color: white; padding: 8px 20px; border-radius: 20px; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
        
        h1 { color: white; margin: 0 0 12px 0; font-size: 52px; font-weight: 800; line-height: 1.1; text-shadow: 0 4px 20px rgba(0,0,0,0.5); }
        
        .divider { width: 80px; height: 4px; background: linear-gradient(90deg, #00D9FF, #0099CC); margin-bottom: 16px; border-radius: 2px; }
        
        .cta { display: inline-block; background: linear-gradient(135deg, #00D9FF, #0099CC); color: #001F3F; padding: 12px 32px; border-radius: 25px; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; }
        
        .qr-box { position: absolute; right: 40px; bottom: 40px; background: white; padding: 10px; border-radius: 12px; z-index: 20; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        
        .qr-code { width: 120px; height: 120px; display: block; }
        
        .qr-text { font-size: 10px; color: #001F3F; font-weight: 700; text-align: center; margin-top: 4px; letter-spacing: 0.5px; }
        
        .website { position: absolute; bottom: 20px; left: 40px; color: rgba(255,255,255,0.8); font-size: 12px; font-weight: 600; z-index: 20; }
      </style>
    </head>
    <body>
      <div class="bg-image"></div>
      <div class="overlay"></div>
      <img src="${logoBase64}" class="logo" />
      <div class="content">
        <div class="badge">Professional Course</div>
        <h1>${title}</h1>
        <div class="divider"></div>
        <div class="cta">Enroll Now</div>
      </div>
      <div class="qr-box">
        <img src="${qrCodeBase64}" class="qr-code" />
        <div class="qr-text">SCAN TO ENROLL</div>
      </div>
      <div class="website">hexadigitall.com</div>
    </body>
    </html>
  `;
}

async function generateImages() {
  console.log('🎨 Generating OG Images for New Courses\n');
  
  if (!fs.existsSync(OUTPUT_ROOT)) fs.mkdirSync(OUTPUT_ROOT, { recursive: true });
  
  if (!fs.existsSync(LOGO_PATH)) {
    console.error(`❌ Logo not found: ${LOGO_PATH}`);
    process.exit(1);
  }

  const logoBuffer = fs.readFileSync(LOGO_PATH);
  const logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;

  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  let success = 0;
  let failed = 0;

  // Get only new courses
  const newCourseFiles = fs.readdirSync(COURSES_DIR)
    .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
    .filter(f => Object.keys(COURSE_TITLE_MAP).some(key => f.includes(key)));

  console.log(`📂 Found ${newCourseFiles.length} new course images\n`);

  for (const file of newCourseFiles) {
    try {
      const imagePath = path.join(COURSES_DIR, file);
      const title = getTitle(file);
      const slug = path.parse(file).name.replace(/^course-/, '').replace(/[-_]?\d+$/, '');
      const courseUrl = `${BASE_SITE_URL}/courses/${slug}`;

      console.log(`📸 ${file}`);
      
      // Generate QR code
      const qrCode = await QRCode.toDataURL(courseUrl, { width: 300, margin: 1 });
      
      // Load image
      const imgBuffer = fs.readFileSync(imagePath);
      const imgBase64 = `data:image/jpeg;base64,${imgBuffer.toString('base64')}`;
      
      // Generate HTML
      const html = getDesignHTML(title, imgBase64, logoBase64, qrCode);
      
      // Create and render page
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 630 });
      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      
      // Screenshot
      const outputFile = path.join(OUTPUT_ROOT, slug + '.jpg');
      await page.screenshot({ path: outputFile, type: 'jpeg', quality: 92 });
      await page.close();
      
      console.log(`   ✅ Saved: ${slug}.jpg\n`);
      success++;
      
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}\n`);
      failed++;
    }
  }

  await browser.close();

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Generation Complete:`);
  console.log(`   Success: ${success}`);
  console.log(`   Failed: ${failed}`);
  console.log(`   Output: ${OUTPUT_ROOT}`);
  console.log('='.repeat(60));
}

generateImages().catch(console.error);
