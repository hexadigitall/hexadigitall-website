#!/usr/bin/env node
/**
 * Enhanced Open Graph Preview Generator
 * 
 * This script generates deterministic social preview images using Puppeteer.
 * It extends the existing generate-og-images.mjs script with TypeScript support
 * and additional configuration options.
 * 
 * Usage:
 *   npm run og:generate        # Generate all predefined images
 *   ts-node scripts/generate-og-preview.ts --custom  # Generate custom images
 * 
 * Output: public/social-preview/ and public/og-images/
 * 
 * Image Specifications:
 * - Facebook/LinkedIn: 1200×630 px (1.91:1 ratio)
 * - Twitter: 1200×675 px (16:9 ratio)
 * - Format: JPG (optimized) and PNG (high quality)
 * - Max size: < 1MB for optimal loading
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Note: In a real implementation, you would import puppeteer
// For now, this is a placeholder/template showing the structure
// import puppeteer from 'puppeteer';

// Configuration
const CONFIG = {
  outputDirs: {
    social: path.resolve('public/social-preview'),
    og: path.resolve('public/og-images'),
  },
  dimensions: {
    facebook: { width: 1200, height: 630, label: 'Facebook/LinkedIn/OG' },
    twitter: { width: 1200, height: 675, label: 'Twitter Card' },
    instagram: { width: 1080, height: 1080, label: 'Instagram Post (backup)' },
  },
  defaultDimension: 'facebook',
  formats: ['png', 'jpg'] as const,
  jpegQuality: 90,
  deviceScaleFactor: 2, // Retina display
  baseUrl: 'https://hexadigitall.com',
} as const;

interface ImageGenerationOptions {
  title: string;
  subtitle?: string;
  bullets?: string[];
  badge?: string;
  price?: string;
  icon?: string;
  gradientFrom?: string;
  gradientTo?: string;
  dimension?: keyof typeof CONFIG.dimensions;
  outputName: string;
  outputDir?: keyof typeof CONFIG.outputDirs;
}

/**
 * Ensure output directories exist
 */
function ensureDirectories(): void {
  Object.values(CONFIG.outputDirs).forEach(dir => {
    fs.mkdirSync(dir, { recursive: true });
  });
  console.log('✅ Output directories ready');
}

/**
 * Escape HTML special characters
 */
function escapeHtml(str: string = ''): string {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

/**
 * Load SVG logo as inline string
 */
function loadLogo(): string {
  const logoPath = path.resolve('public/hexadigitall-logo-transparent.svg');
  const fallbackPath = path.resolve('public/hexadigitall-logo.svg');
  
  try {
    return fs.readFileSync(logoPath, 'utf8');
  } catch {
    try {
      return fs.readFileSync(fallbackPath, 'utf8');
    } catch {
      console.warn('⚠️  Logo not found, proceeding without logo');
      return '';
    }
  }
}

/**
 * Generate HTML template for OG image
 */
function generateHTML(options: ImageGenerationOptions): string {
  const {
    title,
    subtitle = '',
    bullets = [],
    badge = '',
    price = '',
    icon = '🚀',
    gradientFrom = '#0A4D68',
    gradientTo = '#066d7f',
    dimension = CONFIG.defaultDimension,
  } = options;

  const { width, height } = CONFIG.dimensions[dimension];
  const logo = loadLogo();
  
  const bulletHtml = bullets.length
    ? `<ul class="list">${bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ul>`
    : '';
  
  const priceHtml = price ? `<div class="price">${escapeHtml(price)}</div>` : '';
  const badgeHtml = badge ? `<div class="badge">${escapeHtml(badge)}</div>` : '';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} | Hexadigitall</title>
  <style>
    :root {
      --from: ${gradientFrom};
      --to: ${gradientTo};
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { margin: 0; padding: 0; }
    body {
      width: ${width}px;
      height: ${height}px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
      color: #0b1520;
      background: linear-gradient(135deg, #fff 0%, #f6fafb 60%, #f0f7f9 100%);
      overflow: hidden;
    }
    .card {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      width: 100%;
      padding: 64px 72px;
      overflow: hidden;
    }
    .bg-gradient {
      position: absolute;
      inset: -40px -40px auto auto;
      width: 70%;
      height: 70%;
      background: radial-gradient(1200px 600px at 85% 30%, var(--to) 0%, transparent 60%),
                  radial-gradient(1000px 500px at 70% 60%, var(--from) 0%, transparent 60%);
      opacity: 0.18;
      filter: blur(2px);
    }
    .brand {
      position: absolute;
      bottom: 20px;
      right: 28px;
      color: #0A4D68;
      opacity: 0.85;
      font-weight: 700;
      letter-spacing: 0.3px;
      font-size: 18px;
    }
    .logo {
      position: absolute;
      top: 22px;
      right: 22px;
      width: 160px;
      height: auto;
      opacity: 0.95;
    }
    .logo svg {
      width: 100%;
      height: auto;
      display: block;
    }
    .icon {
      font-size: 72px;
      line-height: 1;
      margin-bottom: 12px;
    }
    .title {
      font-weight: 800;
      font-size: 56px;
      line-height: 1.1;
      color: #0A2230;
      margin: 0 0 14px;
      max-width: 900px;
    }
    .subtitle {
      font-weight: 500;
      font-size: 26px;
      color: #234;
      margin: 0 0 18px;
      opacity: 0.9;
      max-width: 800px;
    }
    .list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 28px;
      list-style: none;
      padding: 0;
      margin: 0 0 20px;
      max-width: 900px;
    }
    .list li {
      font-size: 22px;
      color: #1c2a36;
      position: relative;
      padding-left: 28px;
    }
    .list li::before {
      content: '✓';
      position: absolute;
      left: 0;
      top: 0;
      color: #0A4D68;
      font-weight: 900;
    }
    .footer {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 10px;
    }
    .badge {
      background: linear-gradient(135deg, var(--from), var(--to));
      color: white;
      padding: 10px 16px;
      border-radius: 999px;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 0.3px;
    }
    .price {
      color: #0A4D68;
      font-weight: 800;
      font-size: 22px;
    }
    .frame {
      position: absolute;
      inset: 18px;
      border-radius: 18px;
      border: 1px solid rgba(10, 77, 104, 0.12);
      pointer-events: none;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="bg-gradient" aria-hidden="true"></div>
    <div class="frame" aria-hidden="true"></div>
    ${logo ? `<div class="logo" aria-hidden="true">${logo}</div>` : ''}
    <div class="icon">${escapeHtml(icon)}</div>
    <h1 class="title">${escapeHtml(title)}</h1>
    ${subtitle ? `<p class="subtitle">${escapeHtml(subtitle)}</p>` : ''}
    ${bulletHtml}
    <div class="footer">${badgeHtml}${priceHtml}</div>
    <div class="brand">hexadigitall.com</div>
  </div>
</body>
</html>`;
}

/**
 * Generate OG image using Puppeteer
 * 
 * Note: This is a placeholder implementation.
 * In production, uncomment the puppeteer code below.
 */
async function generateImage(options: ImageGenerationOptions): Promise<void> {
  const {
    outputName,
    outputDir = 'og',
    dimension = CONFIG.defaultDimension,
  } = options;

  const { width, height } = CONFIG.dimensions[dimension];
  const dir = CONFIG.outputDirs[outputDir];
  const html = generateHTML(options);

  // Placeholder: In real implementation, use Puppeteer
  console.log(`📝 Would generate: ${outputName} (${width}×${height})`);
  
  /*
  // Real Puppeteer implementation (uncomment when puppeteer is available):
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({
      width,
      height,
      deviceScaleFactor: CONFIG.deviceScaleFactor,
    });
    
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    // Generate PNG
    if (CONFIG.formats.includes('png')) {
      const pngPath = path.join(dir, `${outputName}.png`);
      await page.screenshot({ path: pngPath, type: 'png' });
      console.log(`✅ Generated: ${pngPath}`);
    }

    // Generate JPG
    if (CONFIG.formats.includes('jpg')) {
      const jpgPath = path.join(dir, `${outputName}.jpg`);
      await page.screenshot({
        path: jpgPath,
        type: 'jpeg',
        quality: CONFIG.jpegQuality,
      });
      console.log(`✅ Generated: ${jpgPath}`);
    }
  } finally {
    await browser.close();
  }
  */

  // For now, create placeholder files to show structure
  for (const format of CONFIG.formats) {
    const filePath = path.join(dir, `${outputName}.${format}`);
    fs.writeFileSync(
      filePath,
      `Placeholder for ${outputName}.${format} (${width}×${height})\n` +
      `To generate real images, uncomment Puppeteer code in scripts/generate-og-preview.ts\n` +
      `Or use the existing script: npm run og:generate`
    );
  }
  
  console.log(`✅ Placeholder created: ${outputName}.{png,jpg}`);
}

/**
 * Predefined image templates
 */
const TEMPLATES: ImageGenerationOptions[] = [
  {
    outputName: 'default',
    title: 'Hexadigitall',
    subtitle: 'Your All-in-One Digital Partner',
    bullets: [
      'Web & Mobile Development',
      'Digital Marketing',
      'Business Planning',
      'Training & Mentoring',
    ],
    badge: 'Nigeria #1',
    icon: '🚀',
  },
  {
    outputName: 'jhema-wears-proposal',
    title: 'Jhema Wears',
    subtitle: 'E-commerce Fashion Store Solution',
    bullets: [
      'Custom Online Store',
      'Payment Integration',
      'Inventory Management',
      'Mobile Responsive',
    ],
    badge: 'Tailored for You',
    price: 'Starting at ₦199,000',
    icon: '👗',
    gradientFrom: '#ec4899',
    gradientTo: '#8b5cf6',
  },
  {
    outputName: 'contact-us',
    title: 'Get In Touch',
    subtitle: "Let's Build Something Great Together",
    bullets: [
      'Free Consultation',
      'Custom Solutions',
      'Fast Response',
      'Trusted Partner',
    ],
    badge: 'Available Now',
    icon: '📧',
    gradientFrom: '#10b981',
    gradientTo: '#06b6d4',
  },
];

/**
 * Main execution
 */
async function main(): Promise<void> {
  console.log('🎨 OG Preview Generator\n');
  
  // Ensure directories exist
  ensureDirectories();
  
  console.log('\n📦 Generating images...\n');
  
  // Generate all templates
  for (const template of TEMPLATES) {
    await generateImage(template);
  }
  
  console.log('\n✨ Generation complete!');
  console.log('\n📁 Output locations:');
  console.log(`   - ${CONFIG.outputDirs.og}`);
  console.log(`   - ${CONFIG.outputDirs.social}`);
  console.log('\n💡 To generate actual images with Puppeteer:');
  console.log('   1. Ensure puppeteer is installed: npm install puppeteer');
  console.log('   2. Uncomment the Puppeteer code in this script');
  console.log('   3. Run: npx ts-node scripts/generate-og-preview.ts');
  console.log('\n   Or use the existing generator:');
  console.log('   - npm run og:generate (for services)');
  console.log('   - npm run og:generate:courses (for courses)');
}

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}

// Export for use as module
export { generateImage, generateHTML, CONFIG, type ImageGenerationOptions };
