#!/usr/bin/env node

/**
 * HEXADIGITALL PROMOTIONAL IMAGE GENERATOR V2
 * Creates stunning promotional graphics with real people
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'images', 'designed');
const RAW_IMAGES_DIR = path.join(__dirname, 'images', 'raw');

// Ensure directories exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Brand colors (Hexadigitall official)
const BRAND_COLORS = {
  primary: '#0A4D68',     // Deep Blue
  secondary: '#066d7f',   // Darker Teal
  accent: '#92591B',      // Deep Orange
  dark: '#333333',
  light: '#F4F7F6',
};

// Campaign templates
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
    color: BRAND_COLORS.primary,
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
 * Get person image for theme
 */
function getPersonImage(theme) {
  if (!fs.existsSync(RAW_IMAGES_DIR)) {
    return null;
  }

  const files = fs.readdirSync(RAW_IMAGES_DIR)
    .filter(f => f.includes('person') && f.endsWith('.jpg'));
  
  if (files.length === 0) return null;
  
  const themeMapping = {
    'tech': 'person-tech',
    'marketing': 'person-marketing',
    'business': 'person-business',
    'education': 'person-education'
  };
  
  const preferredPrefix = themeMapping[theme] || 'person';
  let matchedFiles = files.filter(f => f.startsWith(preferredPrefix));
  
  if (matchedFiles.length === 0) {
    matchedFiles = files;
  }
  
  const randomFile = matchedFiles[Math.floor(Math.random() * matchedFiles.length)];
  return `file://${path.join(RAW_IMAGES_DIR, randomFile)}`;
}

/**
 * Generate HTML template
 */
function generateTemplate(campaign, format, personImage) {
  const isSquare = format.width === format.height;
  const isStory = format.height > format.width * 1.5;
  
  const css = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; }
    
    .canvas {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
      background: ${campaign.color};
    }
    
    .person-image {
      position: absolute;
      ${isStory ? 'top: 0; right: 0; width: 100%; height: 60%;' : 'right: 0; top: 0; bottom: 0; width: ' + (isSquare ? '50%' : '45%') + ';'}
      object-fit: cover;
      object-position: center;
    }
    
    .gradient-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        ${isStory ? '180deg' : isSquare ? '135deg' : '90deg'},
        ${campaign.color}f5 0%,
        ${campaign.color}e8 ${isStory ? '50%' : '35%'},
        ${campaign.color}95 ${isStory ? '100%' : '70%'},
        transparent 100%
      );
      z-index: 1;
    }
    
    .logo {
      position: ${isStory ? 'relative' : 'absolute'};
      ${!isStory ? 'top: 40px; left: 60px; z-index: 3;' : 'margin-bottom: 30px;'}
      font-family: 'Poppins', sans-serif;
      font-size: ${isStory ? '24px' : '20px'};
      font-weight: 900;
      letter-spacing: -0.5px;
      color: white;
      text-transform: uppercase;
      text-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }
    
    .logo span { color: ${BRAND_COLORS.accent}; }
    
    .content {
      position: relative;
      z-index: 2;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: ${isStory ? 'flex-end' : 'center'};
      padding: ${isStory ? '60px 50px' : isSquare ? '60px' : '60px 50px 60px 60px'};
      color: white;
      ${!isStory && !isSquare ? 'max-width: 55%;' : ''}
    }
    
    .tagline {
      font-size: ${isStory ? '16px' : '14px'};
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
      border-radius: 8px;
      display: inline-block;
      margin-bottom: 24px;
      text-shadow: 0 2px 8px rgba(0,0,0,0.4);
      box-shadow: 0 6px 16px rgba(0,0,0,0.3);
    }
    
    .cta-button {
      display: inline-block;
      background: white;
      color: ${BRAND_COLORS.primary};
      padding: ${isStory ? '20px 45px' : '16px 35px'};
      border-radius: 50px;
      font-size: ${isStory ? '18px' : '16px'};
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2);
      border: none;
    }
    
    .footer {
      margin-top: 30px;
      font-size: ${isStory ? '16px' : '14px'};
      font-weight: 600;
    }
    
    .website {
      color: white;
      text-shadow: 0 2px 6px rgba(0,0,0,0.4);
    }
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
        ${personImage ? `<img src="${personImage}" alt="Professional" class="person-image">` : ''}
        <div class="gradient-overlay"></div>
        
        ${!isStory ? `<div class="logo">HEXA<span>DIGITALL</span></div>` : ''}
        
        <div class="content">
          ${isStory ? `<div class="logo">HEXA<span>DIGITALL</span></div>` : ''}
          <div>
            <div class="tagline">${campaign.tagline}</div>
            <h1 class="title">${campaign.title}</h1>
            <div class="subtitle">${campaign.subtitle}</div>
            <div class="cta-button">${campaign.cta}</div>
          </div>
          <div class="footer">
            <div class="website">hexadigitall.com</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
}

/**
 * Generate image with Puppeteer
 */
async function generateImage(browser, campaign, format, personImage) {
  const page = await browser.newPage();
  
  await page.setViewport({
    width: format.width,
    height: format.height,
    deviceScaleFactor: 2,
  });

  const html = generateTemplate(campaign, format, personImage);
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const filename = `${campaign.name}-${format.name}.jpg`;
  const filepath = path.join(OUTPUT_DIR, filename);

  await page.screenshot({
    path: filepath,
    type: 'jpeg',
    quality: 95,
  });

  await page.close();
  return filepath;
}

/**
 * Main function
 */
async function main() {
  console.log('🎨 Hexadigitall Promotional Image Generator\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let totalGenerated = 0;
  let totalFailed = 0;

  for (const campaign of CAMPAIGNS) {
    console.log(`📸 ${campaign.title}`);
    
    const personImage = getPersonImage(campaign.theme);
    if (personImage) {
      console.log(`   Using: ${path.basename(personImage)}`);
    } else {
      console.log(`   ⚠️  No person images found`);
    }

    for (const format of FORMATS) {
      try {
        const filepath = await generateImage(browser, campaign, format, personImage);
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
  console.log(`   📁 Location: ${OUTPUT_DIR}\n`);
}

main().catch(console.error);
