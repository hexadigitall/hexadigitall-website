#!/usr/bin/env node

/**
 * HEXADIGITALL PROMOTIONAL IMAGE GENERATOR V5
 * Official brand colors, logo, and full-bleed people images
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
let sharp;
try {
  sharp = await import('sharp');
} catch (e) {
  void e;
}

const OUTPUT_DIR = path.join(__dirname, 'images', 'designed');
const RAW_IMAGES_DIR = path.join(__dirname, 'images', 'raw');
const LOGO_PATH = path.join(__dirname, '..', 'public', 'hexadigitall-logo-transparent.png');

// Ensure directories exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Brand colors (Official Hexadigitall palette)
const BRAND_COLORS = {
  primary: '#001F3F',        // Deep Navy Blue
  primaryAccent: '#00D9FF',  // Electric Cyan
  secondary: '#1B4D5C',      // Deep Slate Teal
  action: '#FF6B4A',         // Vibrant Coral Orange
  special: '#00FF41',        // Bright Lime Green
  background: '#FFFFFF',    // White
  text: '#2C3E50',           // Dark Slate Grey
};

// Campaign templates
const CAMPAIGNS = [
  {
    name: 'ecommerce-promo',
    title: 'E-Commerce Store',
    subtitle: 'Starting at ₦199,000',
    tagline: 'Your Brand Online in 4 Weeks',
    cta: 'Get Started',
    theme: 'business',
    color: BRAND_COLORS.primary,
    accentColor: BRAND_COLORS.primaryAccent,
  },
  {
    name: 'social-media-promo',
    title: 'Social Media Marketing',
    subtitle: 'From ₦250,000',
    tagline: 'Dominate Your Market This Season',
    cta: 'Let\'s Grow',
    theme: 'marketing',
    color: BRAND_COLORS.secondary,
    accentColor: BRAND_COLORS.action,
  },
  {
    name: 'web-development-promo',
    title: 'Professional Websites',
    subtitle: 'Starting at ₦299,000',
    tagline: 'Turn Your Idea Into Reality Fast',
    cta: 'Get a Free Quote',
    theme: 'tech',
    color: BRAND_COLORS.primary,
    accentColor: BRAND_COLORS.primaryAccent,
  },
  {
    name: 'business-plan-promo',
    title: 'Business Planning',
    subtitle: 'From ₦199,000',
    tagline: 'Get Approved for That Loan',
    cta: 'Get Your Plan',
    theme: 'business',
    color: BRAND_COLORS.action,
    accentColor: BRAND_COLORS.primaryAccent,
  },
  {
    name: 'courses-promo',
    title: 'Learn Tech Skills',
    subtitle: 'From ₦25,000',
    tagline: 'Learn a ₦500k/Month Skill',
    cta: 'Browse Courses',
    theme: 'education',
    color: BRAND_COLORS.primary,
    accentColor: BRAND_COLORS.special,
  },
  {
    name: 'digital-marketing-promo',
    title: 'Digital Marketing',
    subtitle: 'From ₦300,000/month',
    tagline: 'Triple Your Reach in 30 Days',
    cta: 'Start Growing Now',
    theme: 'marketing',
    color: BRAND_COLORS.secondary,
    accentColor: BRAND_COLORS.action,
  },
  {
    name: 'portfolio-promo',
    title: 'Professional Portfolio',
    subtitle: 'Starting at ₦299,000',
    tagline: 'Your 24/7 Salesperson',
    cta: 'Build Your Portfolio',
    theme: 'business',
    color: BRAND_COLORS.primary,
    accentColor: BRAND_COLORS.primaryAccent,
  },
  {
    name: 'new-year-offer',
    title: '2026 Fresh Start',
    subtitle: 'Limited Time Deals',
    tagline: 'New Year, New Business',
    cta: 'Claim Your Discount',
    theme: 'business',
    color: BRAND_COLORS.action,
    accentColor: BRAND_COLORS.primaryAccent,
  },
];

// Map campaigns to specific images so visuals match the content/context
const CAMPAIGN_IMAGE_MAP = {
  'ecommerce-promo': 'person-screen-1.jpg',        // person at laptop fits ecommerce build context
  'business-plan-promo': 'person-business-1.jpg',  // formal business look for planning/loans
  'digital-marketing-promo': 'person-marketing-1.jpg', // marketer with phone/desk vibe
  'portfolio-promo': 'person-business-3.jpg',      // professional portrait for portfolio showcase
  'new-year-offer': 'person-screen-2.jpg',         // laptop setting works for promo/offer theme
};

// Platform formats
const FORMATS = [
  { name: 'instagram-feed', width: 1080, height: 1080 },
  { name: 'instagram-story', width: 1080, height: 1920 },
  { name: 'facebook-post', width: 1200, height: 630 },
  { name: 'linkedin-post', width: 1200, height: 627 },
  { name: 'twitter-card', width: 1200, height: 675 },
];

/**
 * Get logo as base64
 */
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

/**
 * Get person image as base64 data URI
 */
function getPersonImageBase64(theme, campaignName) {
  if (!fs.existsSync(RAW_IMAGES_DIR)) {
    return null;
  }

  const files = fs.readdirSync(RAW_IMAGES_DIR)
    .filter(f => f.includes('person') && f.endsWith('.jpg'));
  
  if (files.length === 0) return null;
  
  // Campaign-specific image override when provided and exists
  const preferredFile = CAMPAIGN_IMAGE_MAP[campaignName];
  let chosenFile = preferredFile && files.includes(preferredFile) ? preferredFile : null;

  if (!chosenFile) {
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

    chosenFile = matchedFiles[Math.floor(Math.random() * matchedFiles.length)];
  }

  const filepath = path.join(RAW_IMAGES_DIR, chosenFile);
  
  try {
    const imageBuffer = fs.readFileSync(filepath);
    const base64 = imageBuffer.toString('base64');
    return { dataUri: `data:image/jpeg;base64,${base64}`, filepath };
  } catch (err) {
    console.error(`Failed to read image: ${filepath}`, err.message);
    return { dataUri: null, filepath: null };
  }
}

/**
 * Image-specific placement rules
 */
const IMAGE_PLACEMENT_RULES = {
  'person-business-1.jpg': { placement: 'bottom-center', align: 'center', stackText: true },
  'person-business-2.jpg': { placement: 'left', align: 'left', stackText: true },
  'person-business-3.jpg': { placement: 'right-bottom', align: 'right', stackText: true },
  'person-education-1.jpg': { placement: 'left-bottom', align: 'left', stackText: true },
  'person-education-2.jpg': { placement: 'center-bottom', align: 'center', stackText: false },
  'person-marketing-1.jpg': { placement: 'left-or-right', align: 'left-or-right', stackText: true },
  'person-marketing-2.jpg': { placement: 'center-bottom', align: 'center', stackText: false },
  'person-screen-1.jpg': { placement: 'left-bottom', align: 'left', stackText: true },
  'person-screen-2.jpg': { placement: 'bottom-center', align: 'center', stackText: true },
  'person-screen-3.jpg': { placement: 'right', align: 'right', stackText: true },
  'person-tech-1.jpg': { placement: 'right', align: 'right', stackText: true },
  'person-tech-2.jpg': { placement: 'left-bottom', align: 'left', stackText: true },
  'person-tech-3.jpg': { placement: 'right-bottom', align: 'right', stackText: true },
};

/**
 * Analyze image to find low-detail region and average color for panel blending
 */
async function analyzeImage(filepath, format) {
  const isStory = format.height > format.width * 1.5;
  // removed unused isSquare
  
  // Extract filename from path
  const filename = filepath ? path.basename(filepath) : null;
  
  // Check for custom rules
  const customRule = filename && IMAGE_PLACEMENT_RULES[filename];
  
  // Default: stories should use bottom-center, others use center-bottom
  const defaultPlacement = isStory ? 'bottom-center' : 'center-bottom';
  const defaultAlign = 'center';
  const defaultStackText = isStory;
  
  if (!sharp || !filepath) {
    return { 
      placement: customRule?.placement || defaultPlacement, 
      align: customRule?.align || defaultAlign,
      stackText: customRule?.stackText !== undefined ? customRule.stackText : defaultStackText,
      color: 'rgba(0,0,0,0.55)', 
      textColor: '#FFFFFF' 
    };
  }
  
  try {
    const size = 128;
    const img = sharp(filepath).resize(size, size, { fit: 'cover' }).removeAlpha();
    const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
    const w = info.width, h = info.height;
    
    // Define regions with preference for bottom and center
    const regions = [
      { key: 'bottom', x0: 0, x1: w, y0: Math.floor(h * 0.55), y1: h },
      { key: 'center-bottom', x0: Math.floor(w * 0.25), x1: Math.floor(w * 0.75), y0: Math.floor(h * 0.5), y1: h },
      { key: 'bottom-center', x0: Math.floor(w * 0.2), x1: Math.floor(w * 0.8), y0: Math.floor(h * 0.6), y1: h },
      { key: 'left-bottom', x0: 0, x1: Math.floor(w/2), y0: Math.floor(h * 0.5), y1: h },
      { key: 'right-bottom', x0: Math.floor(w/2), x1: w, y0: Math.floor(h * 0.5), y1: h },
      { key: 'left', x0: 0, x1: Math.floor(w * 0.4), y0: 0, y1: h },
      { key: 'right', x0: Math.floor(w * 0.6), x1: w, y0: 0, y1: h },
    ];
    
    function regionStats(r) {
      let sumL = 0, sumL2 = 0, count = 0;
      let sumR = 0, sumG = 0, sumB = 0;
      for (let y = r.y0; y < r.y1; y++) {
        for (let x = r.x0; x < r.x1; x++) {
          const idx = (y * w + x) * 3;
          const R = data[idx], G = data[idx+1], B = data[idx+2];
          const L = 0.2126*R + 0.7152*G + 0.0722*B;
          sumL += L; sumL2 += L*L; count++;
          sumR += R; sumG += G; sumB += B;
        }
      }
      const meanL = sumL / count;
      const varL = sumL2 / count - meanL*meanL;
      const meanR = Math.round(sumR / count);
      const meanG = Math.round(sumG / count);
      const meanB = Math.round(sumB / count);
      return { variance: varL, meanColor: `rgba(${meanR}, ${meanG}, ${meanB}, 0.6)`, meanL };
    }
    
    const stats = regions.map(r => ({ key: r.key, ...regionStats(r) }));
    
    let placement = defaultPlacement;
    let align = defaultAlign;
    let stackText = defaultStackText;
    
    if (customRule) {
      // Use custom placement rule
      if (customRule.placement === 'left-or-right') {
        // Choose between left and right based on variance
        const leftStats = stats.find(s => s.key === 'left');
        const rightStats = stats.find(s => s.key === 'right');
        placement = (leftStats && rightStats && leftStats.variance < rightStats.variance) ? 'left' : 'right';
        align = placement === 'left' ? 'left' : 'right';
      } else {
        placement = customRule.placement;
        align = customRule.align === 'left-or-right' ? (placement.includes('left') ? 'left' : 'right') : customRule.align;
      }
      stackText = customRule.stackText;
    } else {
      // Default logic
      stats.sort((a,b) => a.variance - b.variance);
      const best = stats.find(s => s.key === 'bottom-center' || s.key === 'center-bottom' || s.key === 'bottom');
      
      if (best) {
        placement = best.key;
      } else {
        const bottomOriented = stats.filter(s => s.key.includes('bottom'));
        placement = bottomOriented.length > 0 ? bottomOriented[0].key : stats[0].key;
      }
    }
    
    const selectedStats = stats.find(s => s.key === placement) || stats[0];
    const textColor = selectedStats.meanL < 140 ? '#FFFFFF' : '#001F3F';
    
    return { placement, align, stackText, color: selectedStats.meanColor, textColor };
  } catch {
    return { 
      placement: customRule?.placement || defaultPlacement, 
      align: customRule?.align || defaultAlign,
      stackText: customRule?.stackText !== undefined ? customRule.stackText : defaultStackText,
      color: 'rgba(0,0,0,0.55)', 
      textColor: '#FFFFFF' 
    };
  }
}

/**
 * Generate HTML template
 */
function generateTemplate(campaign, format, personImageDataUri, logoDataUri, analysis) {
  // removed unused isSquare
  const isStory = format.height > format.width * 1.5;
  
  // Scale multiplier based on image dimensions
  const scaleMultiplier = format.width / 1000;
  
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
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      z-index: 0;
    }
    
    .gradient-overlay {
      position: absolute;
      inset: 0;
      background: transparent;
      z-index: 1;
    }
    
    .logo-container {
      position: absolute;
      top: ${Math.round(20 * scaleMultiplier)}px;
      ${isStory ? `right: ${Math.round(20 * scaleMultiplier)}px;` : `left: ${Math.round(20 * scaleMultiplier)}px;`}
      z-index: 5;
      width: ${Math.round(isStory ? 100 : 120) * scaleMultiplier}px;
      height: auto;
    }
    
    .logo-container img {
      width: 100%;
      height: auto;
      display: block;
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
    }
    
    .content {
      position: relative;
      z-index: 2;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      padding: ${Math.round(60 * scaleMultiplier)}px;
      color: white;
      text-align: left;
    }
    
    .text-background {
      position: absolute;
      padding: ${Math.round(isStory ? 30 : 24) * scaleMultiplier}px ${Math.round(40 * scaleMultiplier)}px;
      display: flex;
      flex-direction: column;
      align-items: ${analysis?.align === 'left' ? 'flex-start' : analysis?.align === 'right' ? 'flex-end' : 'center'};
      text-align: ${analysis?.align || 'center'};
      width: ${isStory ? '86%' : (analysis?.align === 'center' ? '70%' : '48%')};
      max-width: ${Math.round(isStory ? 900 : (analysis?.align === 'center' ? 800 : 560)) * scaleMultiplier}px;
      background: ${analysis?.color || 'rgba(0,0,0,0.45)'};
      border-radius: ${Math.round(16 * scaleMultiplier)}px;
      backdrop-filter: blur(2px);
      box-shadow: 0 6px 18px rgba(0,0,0,0.25);
    }
    
    .tagline {
      font-size: ${Math.round(isStory ? 18 : 16) * scaleMultiplier}px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: ${campaign.accentColor};
      margin-bottom: ${Math.round(isStory ? 16 : 12) * scaleMultiplier}px;
      text-shadow: 0 1px 4px rgba(0,0,0,0.45);
      white-space: ${analysis?.stackText ? 'normal' : 'nowrap'};
    }
    
    .title {
      font-family: 'Poppins', sans-serif;
      font-size: ${Math.round(isStory ? 76 : 64) * scaleMultiplier}px;
      font-weight: 900;
      line-height: ${analysis?.stackText ? '1.1' : '1'};
      margin-bottom: ${Math.round(isStory ? 20 : 12) * scaleMultiplier}px;
      color: ${analysis?.textColor || 'white'};
      text-shadow: 0 2px 10px rgba(0,0,0,0.55);
      letter-spacing: -0.5px;
      white-space: ${analysis?.stackText ? 'normal' : 'nowrap'};
    }
    
    .subtitle {
      font-size: ${Math.round(isStory ? 38 : 32) * scaleMultiplier}px;
      font-weight: 900;
      color: ${analysis?.textColor || 'white'};
      margin-bottom: ${Math.round(isStory ? 28 : 18) * scaleMultiplier}px;
      text-shadow: 0 2px 8px rgba(0,0,0,0.5);
      letter-spacing: 0px;
      white-space: ${analysis?.stackText ? 'normal' : 'nowrap'};
    }
    
    .cta-button {
      display: inline-block;
      background: ${campaign.accentColor};
      color: ${BRAND_COLORS.background};
      padding: ${Math.round(20 * scaleMultiplier)}px ${Math.round(50 * scaleMultiplier)}px;
      border-radius: 50px;
      font-size: ${Math.round(20 * scaleMultiplier)}px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 1px;
      box-shadow: 0 6px 18px rgba(0,0,0,0.35);
      border: none;
      text-shadow: none;
    }
    
    .footer {
      position: absolute;
      bottom: ${Math.round(20 * scaleMultiplier)}px;
      ${analysis?.align === 'left' ? `left: ${Math.round(20 * scaleMultiplier)}px;` : 
        analysis?.align === 'right' ? `right: ${Math.round(20 * scaleMultiplier)}px;` :
        'left: 50%; transform: translateX(-50%);'}
      font-size: ${Math.round(14 * scaleMultiplier)}px;
      font-weight: 700;
      z-index: 10;
      padding: ${Math.round(8 * scaleMultiplier)}px ${Math.round(16 * scaleMultiplier)}px;
      background: rgba(0,0,0,0.4);
      border-radius: ${Math.round(8 * scaleMultiplier)}px;
      backdrop-filter: blur(4px);
    }
    
    .website {
      color: white;
      text-shadow: 0 2px 6px rgba(0,0,0,0.8);
    }
  `;

  // Compute inline positioning based on analysis
  let panelPos = '';
  const bottomOffset = isStory ? 100 : 70;
  
  switch (analysis?.placement) {
    case 'bottom-center':
    case 'center-bottom':
    case 'bottom':
      panelPos = `left: 50%; transform: translateX(-50%); bottom: ${Math.round(bottomOffset * scaleMultiplier)}px;`;
      break;
    case 'left-bottom':
      panelPos = `left: ${Math.round(40 * scaleMultiplier)}px; bottom: ${Math.round(bottomOffset * scaleMultiplier)}px;`;
      break;
    case 'right-bottom':
      panelPos = `right: ${Math.round(40 * scaleMultiplier)}px; bottom: ${Math.round(bottomOffset * scaleMultiplier)}px;`;
      break;
    case 'left':
      panelPos = `left: ${Math.round(40 * scaleMultiplier)}px; top: 50%; transform: translateY(-50%);`;
      break;
    case 'right':
      panelPos = `right: ${Math.round(40 * scaleMultiplier)}px; top: 50%; transform: translateY(-50%);`;
      break;
    default:
      panelPos = `left: 50%; transform: translateX(-50%); bottom: ${Math.round(bottomOffset * scaleMultiplier)}px;`;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>${css}</style>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    </head>
    <body>
      <div class="canvas">
        ${personImageDataUri ? `<img src="${personImageDataUri}" alt="Professional" class="person-image">` : ''}
        <div class="gradient-overlay"></div>
        
        ${logoDataUri ? `<div class="logo-container"><img src="${logoDataUri}" alt="Hexadigitall Logo"></div>` : ''}
        
        <div class="text-background" style="${panelPos}">
          <div class="tagline">${campaign.tagline}</div>
          <h1 class="title">${campaign.title}</h1>
          <div class="subtitle">${campaign.subtitle}</div>
          <div class="cta-button">${campaign.cta}</div>
        </div>
        
        <div class="footer">
          <div class="website">hexadigitall.com</div>
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
async function generateImage(browser, campaign, format, personImageObj, logoDataUri) {
  const page = await browser.newPage();
  
  await page.setViewport({
    width: format.width,
    height: format.height,
    deviceScaleFactor: 2,
  });

  const analysis = await analyzeImage(personImageObj?.filepath || null, format);
  const html = generateTemplate(
    campaign,
    format,
    personImageObj?.dataUri || null,
    logoDataUri,
    analysis
  );
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
  console.log('🎨 Hexadigitall Promotional Image Generator V5\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Load logo once
  const logoDataUri = getLogoBase64();
  if (logoDataUri) {
    console.log('✓ Logo loaded successfully\n');
  } else {
    console.log('⚠️  Logo not found - continuing without logo\n');
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let totalGenerated = 0;
  let totalFailed = 0;

  for (const campaign of CAMPAIGNS) {
    console.log(`📸 ${campaign.title}`);
    
    const personImage = getPersonImageBase64(campaign.theme, campaign.name);
    if (personImage && personImage.dataUri) {
      console.log(`   ✓ Loaded person image`);
    } else {
      console.log(`   ⚠️  No person images found`);
    }

    for (const format of FORMATS) {
      try {
        await generateImage(browser, campaign, format, personImage, logoDataUri);
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
  console.log('\n🎨 Brand Colors Used:');
  console.log(`   Primary: ${BRAND_COLORS.primary} (Deep Navy Blue)`);
  console.log(`   Primary Accent: ${BRAND_COLORS.primaryAccent} (Electric Cyan)`);
  console.log(`   Secondary: ${BRAND_COLORS.secondary} (Deep Slate Teal)`);
  console.log(`   Action: ${BRAND_COLORS.action} (Vibrant Coral Orange)`);
  console.log(`   Special: ${BRAND_COLORS.special} (Bright Lime Green)\n`);
}

main().catch(console.error);
