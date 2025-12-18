import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const templates = [
  {
    name: 'season-of-style',
    file: 'season-of-style.html',
    sizes: [
      { name: 'instagram-square', width: 1080, height: 1080 },
      { name: 'instagram-story', width: 1080, height: 1920 },
      { name: 'facebook', width: 1200, height: 628 },
      { name: 'tiktok', width: 1080, height: 1920 },
    ],
  },
  {
    name: 'slay-into-2026',
    file: 'slay-into-2026.html',
    sizes: [
      { name: 'instagram-square', width: 1080, height: 1080 },
      { name: 'instagram-story', width: 1080, height: 1920 },
      { name: 'facebook', width: 1200, height: 628 },
      { name: 'tiktok', width: 1080, height: 1920 },
    ],
  },
  {
    name: 'gift-the-style',
    file: 'gift-the-style.html',
    sizes: [
      { name: 'instagram-square', width: 1080, height: 1080 },
      { name: 'instagram-story', width: 1080, height: 1920 },
      { name: 'facebook', width: 1200, height: 628 },
      { name: 'tiktok', width: 1080, height: 1920 },
    ],
  },
  {
    name: 'flash-sale',
    file: 'flash-sale.html',
    sizes: [
      { name: 'instagram-square', width: 1080, height: 1080 },
      { name: 'instagram-story', width: 1080, height: 1920 },
      { name: 'facebook', width: 1200, height: 628 },
      { name: 'tiktok', width: 1080, height: 1920 },
    ],
  },
  {
    name: 'meet-curator',
    file: 'meet-curator.html',
    sizes: [
      { name: 'instagram-square', width: 1080, height: 1080 },
      { name: 'instagram-story', width: 1080, height: 1920 },
      { name: 'facebook', width: 1200, height: 628 },
      { name: 'tiktok', width: 1080, height: 1920 },
    ],
  },
];

async function generateImages() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
    ],
  });

  console.log('🎨 Starting image generation...\n');

  for (const template of templates) {
    console.log(`📸 Processing: ${template.name}`);

    const templatePath = path.join(__dirname, 'templates', template.file);
    const fileUrl = `file://${templatePath}`;

    for (const size of template.sizes) {
      try {
        const page = await browser.newPage();
        await page.setViewport({
          width: size.width,
          height: size.height,
          deviceScaleFactor: 2, // 2x for high quality
        });

        await page.goto(fileUrl, { waitUntil: 'networkidle2' });

        // Wait a bit for animations to settle
        await new Promise(resolve => setTimeout(resolve, 500));

        // Create output directory if it doesn't exist
        const outputDir = path.join(__dirname, 'images', template.name, size.name);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        // Save as PNG
        const pngPath = path.join(outputDir, `${size.name}.png`);
        await page.screenshot({
          path: pngPath,
          type: 'png',
          omitBackground: false,
        });

        // Save as JPG for smaller file size
        const jpgPath = path.join(outputDir, `${size.name}.jpg`);
        await page.screenshot({
          path: jpgPath,
          type: 'jpeg',
          quality: 95,
        });

        console.log(`   ✅ ${size.name}: PNG & JPG saved`);
        await page.close();
      } catch (error) {
        console.error(`   ❌ Error generating ${size.name}:`, error.message);
      }
    }

    console.log('');
  }

  await browser.close();
  console.log('✨ All images generated successfully!');
  console.log('📁 Check forSMM/images/ for your campaign assets');
}

generateImages().catch(console.error);
