#!/usr/bin/env node

/**
 * HEXADIGITALL PROMOTIONAL IMAGE GENERATOR
 * Creates stunning promotional graphics for all platforms
 * 
 * Generates:
 * - Instagram Feed (1080x1080)
 * - Instagram Story (1080x1920)
 * - Facebook Post (1200x630)
 * - LinkedIn Post (1200x627)
 * - Twitter Card (1200x675)
 * - TikTok Cover (1080x1920)
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.join(__dirname, 'templates');
const OUTPUT_DIR = path.join(__dirname, 'images', 'designed');
const RAW_IMAGES_DIR = path.join(__dirname, 'images', 'raw');

// Ensure directories exist
[OUTPUT_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Brand colors (Hexadigitall official colors)
const BRAND_COLORS = {
  primary: '#0A4D68',     // Deep Blue
  secondary: '#066d7f',   // Darker Teal
  accent: '#92591B',      // Deep Orange
  dark: '#333333',        // Dark Text
  light: '#F4F7F6',       // Light Gray
  success: '#4facfe',     // Success Blue
};

// Campaign templates configuration
const CAMPAIGNS = [
  {
    name: 'web-development-promo',
    title: 'Professional Websites',
    subtitle: 'Starting at ₦299,000',
    tagline: 'Turn Your Idea Into Reality in 7 Days',
    cta: 'Get a Free Quote',
    theme: 'tech',
    color: BRAND_COLORS.primary,
  },
  {
    name: 'digital-marketing-promo',
    title: 'Digital Marketing',
    subtitle: 'From ₦300,000/month',
    tagline: 'Triple Your Reach in 30 Days',
    cta: 'Start Growing Now',
    theme: 'marketing',
    color: BRAND_COLORS.secondary,
  },
  {
    name: 'business-plan-promo',
    title: 'Business Planning',
    subtitle: 'Starting at ₦199,000',
    tagline: 'Get Approved for That Loan',
    cta: 'Get Your Plan',
    theme: 'business',
    color: BRAND_COLORS.accent,
  },
  {
    name: 'courses-promo',
    title: 'Learn Tech Skills',
    subtitle: 'From ₦25,000',
    tagline: 'Learn a ₦500k/Month Skill',
    cta: 'Browse Courses',
    theme: 'education',
    color: BRAND_COLORS.success,
  },
  {
    name: 'portfolio-promo',
    title: 'Professional Portfolio',
    subtitle: 'Starting at ₦299,000',
    tagline: 'Your 24/7 Salesperson',
    cta: 'Build Your Portfolio',
    theme: 'business',
    color: BRAND_COLORS.primary,
  },
  {
    name: 'new-year-offer',
    title: '2026 Fresh Start',
    subtitle: 'Save ₦500,000',
    tagline: 'New Year, New Business',
    cta: 'Claim Your Discount',
    theme: 'business',
    color: BRAND_COLORS.accent,
  },
];

// Platform formats
const FORMATS = [
  { name: 'instagram-feed', width: 1080, height: 1080 },
  { name: 'instagram-story', width: 1080, height: 1920 },
  { name: 'facebook-post', width: 1200, height: 630 },
  { name: 'linkedin-post', width: 1200, height: 627 },
  { name: 'twitter-card', width: 1200, height: 675 },
];

/**
 * Generate HTML template for promotional graphic
 */
function generateTemplate(campaign, format, backgroundImage, personImage) {
  const isSquare = format.width === format.height;
  const isStory = format.height > format.width * 1.5;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${campaign.name}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Poppins:wght@700;800;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Inter', sans-serif;
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }

    .canvas {
      width: ${format.width}px;
      height: ${format.height}px;
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, ${campaign.color}15 0%, ${campaign.color}05 100%);
    }

    .background-image {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 1;
    }

    .person-image {
      position: absolute;
      ${isStory ? 'top: 0; right: 0; bottom: 40%;' : 'right: 0; top: 0; bottom: 0;'}
      width: ${isStory ? '100%' : isSquare ? '50%' : '45%'};
      object-fit: cover;
      object-position: center;
    }

    .gradient-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(${isStory ? '180deg' : isSquare ? '135deg' : '90deg'}, 
        ${campaign.color}f5 0%, 
        ${campaign.color}e8 ${isStory ? '50%' : '35%'}, 
        ${campaign.color}95 ${isStorflex-end' : 'center'};
      padding: ${isStory ? '60px 50px' : isSquare ? '60px' : '60px 50px 60px 60px'};
      color: white;
      ${!isStory && !isSquare ? 'max-width: 55%;' : ''}
    }

    .content {
      position: relative;
      z-index: 2;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: ${isStory ? 'space-between' : 'center'};
      padding: ${isStory ? '80px 60px' : '60px'};
      color: white;
    }

    .logo {
      font-family: 'Poppins', s4px' : '20px'};
      font-weight: 900;
      letter-spacing: -0.5px;
      color: white;
      text-transform: uppercase;
      margin-bottom: ${isStory ? '30px' : '40px'};
      text-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ${isStory ? '' : 'position: absolute; top: 40px; left: 60px; z-index: 3;'}
      margin-bottom: ${isStory ? 'auto' : '40px'};
    }

    .logo span {
      color: ${BRAND_COLORS.accent};
    }

    .main-content {
      text-align: ${isSquare ? 'center' : 'left'};
    }16px' : '14px'};
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: white;
      background: rgba(146, 89, 27, 0.9);
      padding: 8px 16px;
      border-radius: 6px;
      display: inline-block;
      margin-bottom: 20px;
      text-shadow: 0 2px 6px rgba(0,0,0,0.3);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .title {
      font-family: 'Poppins', sans-serif;
      font-size: ${isStory ? '56px' : isSquare ? '48px' : '44px'};
      font-weight: 900;
      line-height: 1.1;
      margin-bottom: 18px;
      text-shadow: 0 3px 12px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.8);
    }

    .subtitle {
      font-size: ${isStory ? '28px' : '24px'};
      font-weight: 800;
      color: white;
      background: ${BRAND_COLORS.accent};
      padding: 12px 20px;
      border-radiuwhite;
      color: ${BRAND_COLORS.primary};
      padding: ${isStory ? '20px 45px' : '16px 35px'};
      border-radius: 50px;
      font-size: ${isStory ? '18px' : '16px'};
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2);
      border: non
    .cta-button {
      display: inline-block;
      background: ${BRAND_COLORS.accent};
      color: ${BRAND_COLORS.dark};
      padding: ${isStory ? '22px 50px' : '18px 40px'};
      border-radius: 50px;
      font-size: ${isStory ? '20px' : '18px'};
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      box-shadow: 0 10px 40px rgba(245, 158, 11, 0.5);
      border: 3px solid white;
    }

    .footer {
      margin-top: ${isStory ? 'auto' : '40px'};
      text-align: center;
      font-size: ${isStory ? '16px' : '14px'};
      optext-align: left;
        max-width: 50%;
      }
      .person-image {
        filter: brightness(0.95);
      }
    ` : ''}
    
    ${isStory ? `
      .person-image {
        filter: brightness(0.9)ng: 1px;
    }

    ${isSquare ? `
      .content {
      personImage ? `<img src="${personImage}" alt="Professional" class="person-image">` : ''}
    <div class="gradient-overlay"></div>
    
    <div class="logo">HEXA<span>DIGITALL</span></div>
    
    <div class="content">  position: absolute;
        top: 40px;
        left: 60px;
      }
    ` : ''}
  </style>
</head>
<body>
  <div class="canvas">
    ${backgroundImage ? `<img src="${backgroundImage}" alt="background" class="background-image">` : ''}
    <div class="gradient-overlay"></div>
    
    <div class="content">
      <div class="logo">HEXA<span>DIGITALL</span></div>
      
      <div class="main-content">
        <div class="tagline">${campaign.tagline}</div>
        <h1 class="title">${campaign.title}</h1>
        <div class="subtitle">${campaign.subtitle}</div>
        <div class="cta-button">${campaign.cta}</div>
      </div>
      personImage = null) {
  const page = await browser.newPage();
  
  await page.setViewport({
    width: format.width,
    height: format.height,
    deviceScaleFactor: 2, // High DPI
  });

  const html = generateTemplate(campaign, format, null, person

/**
 * Generate promotional image
 */
async function generateImage(browser, campaign, format, backgroundImage = null) {
  const page = await browser.newPage();
  
  await page.setViewport({
    width: format.width,
    height: format.height,
    deviceScaleFactor: 2, // High DPI
  });

  const html = generateTemplate(campaign, format, backgroundImage);
  await page.setContent(html, { waitUntil: 'networkidle0' });
  
  // Wait for fonts to load
  await new Promise(resolve => setTimeout(resolve, 500));

  const filename = `${campaign.name}-${format.name}.png`;
  const filepath = path.join(OUTPUT_DIR, filename);
  
  await page.screenshot({
    path: filepath,
    type: 'png',
    fullPage: false,
  });

  await page.close();
  returperson image for campaign
 */
function getPersonImage(theme) {
  if (!fs.existsSync(RAW_IMAGES_DIR)) {
    return null;
  }

  const files = fs.readdirSync(RAW_IMAGES_DIR)
    .filter(f => f.includes('person') && f.endsWith('.jpg'));
  
  if (files.length === 0) return null;
  
  // Map themes to specific person types
  const themeMapping = {
    'tech': 'person-tech',
    'marketing': 'person-marketing',
    'business': 'person-business',
    'education': 'person-education'
  };
  
  const preferredPrefix = themeMapping[theme] || 'person';
  let matchedFiles = files.filter(f => f.startsWith(preferredPrefix));
  
  if (matchedFiles.length === 0) {
    matchedFiles = files; // Fallback to any person image
  }
  
  const randomFile = matchedFiles[Math.floor(Math.random() * matchedFg'));
  
  if (files.length === 0) return null;
  
  const randomFile = files[Math.floor(Math.random() * files.length)];
  return `personImage = getPersonImage(campaign.theme);
    if (personImage) {
      console.log(`   Using person image: ${path.basename(personImage)}`);
    } else {
      console.log(`   ⚠️  No person images found. Run download-people-images.cjs first!`);
    }

    for (const format of FORMATS) {
      try {
        const filename = await generateImage(browser, campaign, format, person

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let totalGenerated = 0;

  for (const campaign of CAMPAIGNS) {
    console.log(`\n📸 Generating: "${campaign.title}"`);
    
    const backgroundImage = getRandomBackgroundImage(campaign.theme);
    if (backgroundImage) {
      console.log(`   Using background from: ${path.basename(backgroundImage)}`);
    }

    for (const format of FORMATS) {
      try {
        const filename = await generateImage(browser, campaign, format, backgroundImage);
        console.log(`   ✓ ${format.name}: ${filename}`);
        totalGenerated++;
      } catch (err) {
        console.log(`   ✗ Failed ${format.name}: ${err.message}`);
      }
    }
  }

  await browser.close();

  console.log(`\n\n✅ Generation complete!`);
  console.log(`📁 ${totalGenerated} images saved to: ${OUTPUT_DIR}`);
  console.log(`\n💡 Next steps:`);
  console.log(`   1. Review images in ${OUTPUT_DIR}`);
  console.log(`   2. Upload to social media`);
  console.log(`   3. Track performance\n`);
}

// Run
if (require.main === module) {
  generateAllImages().catch(console.error);
}

module.exports = { generateAllImages };
