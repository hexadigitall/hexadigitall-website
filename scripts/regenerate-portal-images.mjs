import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import QRCode from 'qrcode';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const BASE_SITE_URL = 'https://www.hexadigitall.com';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const LOGO_PATH = path.join(PROJECT_ROOT, 'public/hexadigitall-logo-transparent.png');
const OUTPUT_ROOT = path.join(PROJECT_ROOT, 'public/og-images');

const TITLE_TEXT_OVERRIDES = {
  'courses': 'Explore Our Professional Courses',
  'services': 'Discover Our Services'
};

const UPPERCASE_WORDS = ['aws', 'sql', 'nosql', 'api', 'ai', 'bi', 'css', 'html', 'php', 'js', 'cad', 'bim', 'iot', 'devops', 'ui', 'ux', 'seo', 'serp', 'sem', 'crm', 'erp', 'llm', 'llms', 'ga4', 'mvp', 'mvps', 'ios', 'cv'];

function formatTitle(filename) {
  let rawName = path.parse(filename).name;
  
  if (TITLE_TEXT_OVERRIDES[rawName]) return TITLE_TEXT_OVERRIDES[rawName];

  const words = rawName.split(/[-_]/);
  return words.map((word, index) => {
    const lowerWord = word.toLowerCase();
    if (['and', 'or', 'for', 'to', 'in', 'with', 'on', 'at', 'of', 'by'].includes(lowerWord) && index !== 0) return lowerWord;
    if (UPPERCASE_WORDS.includes(lowerWord)) return lowerWord.toUpperCase();
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

function getDesignHTML(type, title, category, imgBase64, logoBase64, qrCodeBase64) {
  let width = 1200, height = 630;
  if (type === 'post') { width = 1080; height = 1080; }
  if (type === 'story') { width = 1080; height = 1920; }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        body { margin: 0; padding: 0; width: ${width}px; height: ${height}px; font-family: 'Inter', sans-serif; background-color: #0f172a; position: relative; overflow: hidden; }
        
        .bg-image { position: absolute; inset: 0; background-image: url('${imgBase64}'); background-size: cover; background-position: center; opacity: 0.35; z-index: 1; }
        
        .brand-badge { position: absolute; top: 40px; right: 50px; background: linear-gradient(90deg, #0f172a 0%, #1e293b 100%); border: 1px solid rgba(255,255,255,0.1); color: #06b6d4; padding: 10px 25px; border-radius: 50px; font-weight: 800; font-size: 16px; letter-spacing: 1px; z-index: 20; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
        
        .logo-container { position: absolute; top: 40px; left: 50px; z-index: 20; background: rgba(15, 23, 42, 0.6); padding: 10px 20px; border-radius: 12px; backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.05); }
        .logo { width: 160px; display: block; }
        
        .qr-container { position: absolute; bottom: 40px; right: 50px; background: white; padding: 10px; border-radius: 12px; z-index: 20; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
        .qr-code { width: 100px; height: 100px; display: block; }
        
        .content-card {
          position: absolute; left: 50px; z-index: 10;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.85) 100%);
          backdrop-filter: blur(10px); padding: 40px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.6);
          ${type === 'story' ? 
            'bottom: 250px; left: 50%; transform: translateX(-50%); width: 80%; text-align: center; border-bottom: 8px solid #06b6d4;' : 
            'bottom: 50px; width: 65%; border-left: 8px solid #06b6d4;'}
        }

        .category { color: #06b6d4; font-size: 14px; text-transform: uppercase; font-weight: 700; letter-spacing: 2px; margin-bottom: 12px; }
        h1 { color: white; margin: 0; font-weight: 800; line-height: 1.1; font-size: ${type === 'story' ? '48px' : '42px'}; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
        .cta-btn { display: inline-block; margin-top: 20px; background: linear-gradient(90deg, #06b6d4 0%, #22d3ee 100%); color: #0f172a; padding: 12px 30px; border-radius: 50px; font-weight: 800; font-size: 14px; text-transform: uppercase; box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3); }
      </style>
    </head>
    <body>
      <div class="bg-image"></div>
      <div class="logo-container"><img src="${logoBase64}" class="logo" /></div>
      <div class="brand-badge">HEXADIGITALL.COM</div>
      <div class="content-card">
        <div class="category">${category}</div>
        <h1>${title}</h1>
        <div class="cta-btn">Browse Now</div>
      </div>
      <div class="qr-container"><img src="${qrCodeBase64}" class="qr-code" /></div>
    </body>
    </html>
  `;
}

(async () => {
  console.log('🔄 Regenerating OG images for courses.jpg and services.jpg...\n');

  const browser = await puppeteer.launch();
  let page = await browser.newPage();

  if (!fs.existsSync(LOGO_PATH)) { 
    console.error(`❌ Logo missing: ${LOGO_PATH}`); 
    process.exit(1); 
  }
  const logoBuffer = fs.readFileSync(LOGO_PATH);
  const logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;

  // Generate for both courses.jpg and services.jpg
  const filesToGenerate = [
    { file: 'courses.jpg', sourceType: 'courses', badgeText: 'Professional Certification', targetUrl: `${BASE_SITE_URL}/courses` },
    { file: 'services.jpg', sourceType: 'services', badgeText: 'Professional Service', targetUrl: `${BASE_SITE_URL}/services` }
  ];

  for (const item of filesToGenerate) {
    const { file, sourceType, badgeText, targetUrl } = item;
    const sourcePath = path.join(PROJECT_ROOT, `public/assets/images/${sourceType}`, file);
    
    if (!fs.existsSync(sourcePath)) {
      console.log(`⚠️  File not found: ${sourcePath}`);
      continue;
    }

    const title = formatTitle(file);
    const qrCodeDataUrl = await QRCode.toDataURL(targetUrl, { width: 300, margin: 0 });
    const imgBuffer = fs.readFileSync(sourcePath);
    const imgBase64 = `data:image/jpeg;base64,${imgBuffer.toString('base64')}`;

    const formats = [
      { type: 'main', dir: OUTPUT_ROOT },
      { type: 'post', dir: path.join(OUTPUT_ROOT, 'posts') },
      { type: 'story', dir: path.join(OUTPUT_ROOT, 'stories') }
    ];

    console.log(`📄 Processing ${file}...`);
    for (const fmt of formats) {
      if (!fs.existsSync(fmt.dir)) fs.mkdirSync(fmt.dir, { recursive: true });
      const html = getDesignHTML(fmt.type, title, badgeText, imgBase64, logoBase64, qrCodeDataUrl);
      await page.setContent(html);
      
      if (fmt.type === 'main') await page.setViewport({ width: 1200, height: 630 });
      if (fmt.type === 'post') await page.setViewport({ width: 1080, height: 1080 });
      if (fmt.type === 'story') await page.setViewport({ width: 1080, height: 1920 });

      const outputPath = path.join(fmt.dir, file);
      await page.screenshot({ path: outputPath, type: 'jpeg', quality: 90 });
      process.stdout.write('.');
    }
    console.log(' ✓');
  }

  await browser.close();
  console.log('\n✅ OG image regeneration complete for courses.jpg and services.jpg');
})();
