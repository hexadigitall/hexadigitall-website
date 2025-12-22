/**
 * HEXADIGITALL PROMO ASSET GENERATOR (Multi-Platform)
 * * Generates optimized promotional images for Social Media:
 * - Landscape (LinkedIn, Facebook, Link Previews)
 * - Square (Instagram Feed, Facebook Feed)
 * - Vertical (TikTok, Reels, Stories, WhatsApp Status)
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
const INPUT_DIR = path.join(__dirname, '..', 'public', 'course-images');
const OUTPUT_ROOT = path.join(__dirname, '..', 'promotional-campaign', 'images', 'courses-og');
const LOGO_PATH = path.join(__dirname, '..', 'public', 'hexadigitall-logo-transparent.png');

// Brand Configuration
const BRAND = {
  url: 'hexadigitall.com',
  colors: {
    primary: '#001F3F',
    accent: '#00D9FF',
    glass: 'rgba(0, 31, 63, 0.85)'
  }
};

// Platforms & Dimensions
const FORMATS = [
  { 
    id: 'landscape', 
    name: 'LinkedIn-FB-Landscape', 
    width: 1200, 
    height: 630,
    folder: 'landscape_1200x630'
  },
  { 
    id: 'square', 
    name: 'Instagram-Square', 
    width: 1080, 
    height: 1080,
    folder: 'square_1080x1080'
  },
  { 
    id: 'vertical', 
    name: 'Story-Reel-Vertical', 
    width: 1080, 
    height: 1920,
    folder: 'vertical_1080x1920'
  }
];

// Known Acronyms
const ACRONYMS = [
  'AWS', 'PMP', 'CSM', 'CISSP', 'CEH', 'AI', 'LLM', 'LLMS', 'SEO', 'GA4', 
  'API', 'CCNA', 'UI', 'UX', 'IAC', 'VFX', 'MVP', 'IOS', 'SQL', 'IT', 'PHP',
  'SERP', 'SaaS', 'B2B', 'DOTNET', 'JS'
];

// --- FILE LIST ---
const IMAGE_FILES = [
  'advanced-ansible-automation-iac.jpg',
  'advanced-backend-engineering-node-js-microservices-.jpg',
  'advanced-seo-rank-1-on-google.jpg',
  'advanced-seo-serp-ranking-mastery.jpg',
  'ai-engineering-building-llms-neural-networks.jpg',
  'applied-machine-learning-data-science.jpg',
  'aws-certified-solutions-architect-associate-professional-.jpg',
  'aws-certified-solutions-architect-associate-professional-2.jpg',
  'aws-certified-solutions-architect-associate-professional-3.jpg',
  'c-net-core-architecture.jpg',
  'certified-scrum-master-csm-bootcamp-0.jpg',
  'certified-scrum-master-csm-bootcamp-2.jpg',
  'certified-scrum-master-csm-bootcamp.jpg',
  'cisco-certified-network-associate-ccna-200-301.jpg',
  'cissp-certification-prep-course.jpg',
  'cissp-senior-security-professional-prep.jpg',
  'cloud-infrastructure-deployment-strategy.jpg',
  'computer-hardware-engineering-system-maintenance.jpg',
  'cross-platform-mobile-app-development-react-native-.jpg',
  'cross-platform-mobile-app-development-react-native-2.jpg',
  'data-analysis-with-python.jpg',
  'devops-engineering-kubernetes-mastery.jpg',
  'devops-fundamentals-git-github-mastery.jpg',
  'digital-literacy-computer-operations-2.jpg',
  'digital-literacy-computer-operations.jpg',
  'digital-marketing-for-small-businesses-2.jpg',
  'digital-marketing-for-small-businesses-3.jpg',
  'digital-marketing-for-small-businesses.jpg',
  'enterprise-security-risk-management.jpg',
  'ethical-hacking-for-beginners.jpg',
  'ethical-hacking-penetration-testing-masterclass.jpg',
  'executive-agile-leadership-transformation.jpg',
  'frontend-mastery-with-react-next-js.jpg',
  'full-stack-web-development-bootcamp-zero-to-hero-.jpg',
  'git-github-for-beginners.jpg',
  'google-analytics-4-from-beginner-to-expert.jpg',
  'google-analytics-4-ga4-data-mastery.jpg',
  'integrated-digital-marketing-growth-strategy.jpg',
  'java-enterprise-development.jpg',
  'linux-administration-shell-scripting-pro.jpg',
  'mobile-office-business-productivity-from-your-phone.jpg',
  'modern-javascript-algorithms-data-structures.jpg',
  'motion-graphics-visual-effects.jpg',
  'network-security-administration.jpg',
  'product-design-ui-ux-professional-bootcamp.jpg',
  'product-strategy-the-lean-startup-building-mvps.jpg',
  'professional-office-365-suite-mastery-2.jpg',
  'professional-office-365-suite-mastery.jpg',
  'project-management-fundamentals.jpg',
  'python-for-data-science-analytics.jpg',
  'react-native-build-mobile-apps-for-ios-android.jpg',
  'social-media-marketing-community-growth-2.jpg',
  'social-media-marketing-community-growth.jpg',
  'technical-writing-api-documentation.jpg',
  'the-lean-startup-build-your-mvp.jpg',
  'visual-brand-design-graphic-artistry.jpg',
  'web-development-bootcamp-from-zero-to-hero.jpg'
];

/**
 * Setup Directories: Cleans and creates output folders
 */
function setupDirectories() {
  if (fs.existsSync(OUTPUT_ROOT)) {
    fs.rmSync(OUTPUT_ROOT, { recursive: true, force: true });
  }
  fs.mkdirSync(OUTPUT_ROOT, { recursive: true });

  FORMATS.forEach(fmt => {
    fs.mkdirSync(path.join(OUTPUT_ROOT, fmt.folder), { recursive: true });
  });
}

function filenameToTitle(filename) {
  let name = filename.replace(/\.(jpg|png|jpeg)$/i, '');
  name = name.replace(/[-_]\d*$/, ''); 
  name = name.replace(/[-_]/g, ' ');
  
  return name.split(' ').map(word => {
    const cleanWord = word.replace(/[^a-zA-Z0-9]/g, ''); 
    if (ACRONYMS.includes(cleanWord.toUpperCase())) {
      return word.toUpperCase();
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
}

function loadFileAsBase64(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath);
      const ext = path.extname(filePath).slice(1);
      return `data:image/${ext};base64,${data.toString('base64')}`;
    }
  } catch (err) {
    console.warn(`Could not load file: ${filePath}`);
  }
  return null;
}

/**
 * Generates the HTML for the OG Image with Responsive CSS
 */
function getHtmlTemplate(imagePath, title, logoDataUri, format) {
  
  // -- RESPONSIVE CONFIGURATION --
  let cssConfig = '';

  if (format.id === 'landscape') {
    // Standard OG (1200x630)
    cssConfig = `
      .logo-container { top: 50px; left: 50px; }
      .url-container { top: 50px; right: 50px; font-size: 24px; padding: 12px 35px; }
      .content-wrapper { bottom: 50px; left: 50px; max-width: 800px; }
      h1 { font-size: 42px; margin-bottom: 15px; }
      .course-label { font-size: 16px; margin-bottom: 8px; }
      .cta-badge { font-size: 18px; padding: 12px 35px; }
      .logo-img { height: 140px; }
    `;
  } else if (format.id === 'square') {
    // Instagram Feed (1080x1080)
    cssConfig = `
      .logo-container { top: 70px; left: 70px; }
      .url-container { top: 70px; right: 70px; font-size: 28px; padding: 15px 40px; }
      .content-wrapper { bottom: 80px; left: 70px; max-width: 900px; }
      h1 { font-size: 60px; margin-bottom: 20px; line-height: 1.1; }
      .course-label { font-size: 20px; margin-bottom: 12px; }
      .cta-badge { font-size: 24px; padding: 16px 45px; }
      .logo-img { height: 180px; }
    `;
  } else if (format.id === 'vertical') {
    // Stories/Reels (1080x1920)
    // CRITICAL: Safe Zones for UI
    cssConfig = `
      .logo-container { top: 160px; left: 60px; } /* Lowered for top UI */
      .url-container { top: 160px; right: 60px; font-size: 28px; padding: 15px 40px; }
      
      /* Raised drastically to avoid bottom swipe/reply UI */
      .content-wrapper { bottom: 450px; left: 60px; max-width: 960px; }
      
      h1 { font-size: 68px; margin-bottom: 25px; line-height: 1.1; }
      .course-label { font-size: 24px; margin-bottom: 15px; }
      .cta-badge { font-size: 28px; padding: 20px 60px; }
      .logo-img { height: 200px; }
      
      /* Darker bottom gradient for readability on tall images */
      .overlay-gradient {
        background: linear-gradient(
          to bottom,
          rgba(0,31,63,0.1) 0%,
          rgba(0,31,63,0.1) 50%,
          rgba(0,31,63,0.85) 80%,
          rgba(0,31,63,0.98) 100%
        );
      }
    `;
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Lato:wght@400;700&display=swap');
    
    body {
      margin: 0;
      padding: 0;
      width: ${format.width}px;
      height: ${format.height}px;
      font-family: 'Montserrat', sans-serif;
      overflow: hidden;
      background: #000;
    }

    /* Background Image */
    .bg-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('${imagePath}');
      background-size: cover;
      background-position: center center;
      z-index: 1;
    }

    /* Base Gradient Overlay */
    .overlay-gradient {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        to bottom,
        rgba(0,31,63,0.05) 0%,   
        rgba(0,31,63,0.2) 40%,
        rgba(0,31,63,0.7) 75%,
        rgba(0,31,63,0.95) 100% 
      );
      z-index: 2;
    }

    /* --- GLASSMORPHISM MIXIN --- */
    .glass-panel {
      background: ${BRAND.colors.glass};
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 15px 35px 0 rgba(0, 0, 0, 0.4);
    }

    /* Top Left Logo - "Soft Lift" Effect */
    .logo-container {
      position: absolute;
      z-index: 20;
      display: flex;
      align-items: center;
    }

    .logo-img {
      width: auto;
      filter: 
        drop-shadow(0px 0px 1px rgba(255, 255, 255, 1))
        drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.8));
    }

    .logo-text {
      font-size: 56px;
      font-weight: 900;
      color: white;
      text-transform: uppercase;
      letter-spacing: 2px;
      filter: drop-shadow(0 5px 15px rgba(0,0,0,0.8));
    }

    /* Top Right URL Container */
    .url-container {
      position: absolute;
      z-index: 10;
      border-radius: 50px;
      color: ${BRAND.colors.accent};
      font-family: 'Lato', sans-serif;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      text-shadow: 0 2px 10px rgba(0,217,255,0.4);
    }

    /* Main Content Area */
    .content-wrapper {
      position: absolute;
      z-index: 10;
    }

    /* Title Box */
    .title-box {
      padding: 30px 40px;
      border-radius: 20px;
      border-left: 10px solid ${BRAND.colors.accent};
    }

    .course-label {
      color: ${BRAND.colors.accent};
      font-family: 'Lato', sans-serif;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 3px;
      display: block;
      text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    }

    h1 {
      color: white;
      font-weight: 800;
      text-shadow: 0 4px 10px rgba(0,0,0,0.5);
    }

    /* CTA Button */
    .cta-badge {
      display: inline-block;
      background: linear-gradient(135deg, ${BRAND.colors.accent} 0%, #007EA7 100%);
      color: #001F3F;
      font-weight: 800;
      text-transform: uppercase;
      border-radius: 60px; 
      box-shadow: 0 5px 25px rgba(0, 217, 255, 0.6);
      border: 2px solid rgba(255,255,255,0.3);
    }

    /* Inject Platform Specific Overrides */
    ${cssConfig}

  </style>
</head>
<body>

  <div class="bg-image"></div>
  <div class="overlay-gradient"></div>

  <div class="logo-container">
    ${logoDataUri 
      ? `<img src="${logoDataUri}" class="logo-img" />` 
      : `<span class="logo-text">HEXADIGITALL</span>`
    }
  </div>

  <div class="url-container glass-panel">
    ${BRAND.url}
  </div>

  <div class="content-wrapper">
    <div class="title-box glass-panel">
      <span class="course-label">Professional Certification</span>
      <h1>${title}</h1>
      <div class="cta-badge">Enroll Now</div>
    </div>
  </div>

</body>
</html>
  `;
}

async function main() {
  console.log('🚀 Starting Hexadigitall PROMO Asset Generator...');
  
  setupDirectories();
  console.log(`📂 Input: ${INPUT_DIR}`);
  console.log(`📂 Output Root: ${OUTPUT_ROOT}`);
  
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });

  const logoData = loadFileAsBase64(LOGO_PATH);
  if (!logoData) console.warn('⚠️  Logo not found at ' + LOGO_PATH);
  else console.log('✅ Logo loaded successfully');

  let successCount = 0;

  for (const filename of IMAGE_FILES) {
    const inputPath = path.join(INPUT_DIR, filename);
    
    if (!fs.existsSync(inputPath)) {
      console.warn(`⚠️  Skipping missing: ${filename}`);
      continue;
    }

    const title = filenameToTitle(filename);
    const imageData = loadFileAsBase64(inputPath);

    // Generate for ALL formats
    for (const format of FORMATS) {
      const html = getHtmlTemplate(imageData, title, logoData, format);
      
      const outputFilename = filename.replace(/\.(jpg|jpeg|png)$/i, '.png'); 
      const outputPath = path.join(OUTPUT_ROOT, format.folder, outputFilename);

      const page = await browser.newPage();
      await page.setViewport({ width: format.width, height: format.height });

      try {
        await page.setContent(html, { waitUntil: 'load', timeout: 60000 });
        await page.screenshot({ path: outputPath, type: 'png' });
        console.log(`✅ [${format.id}] Generated: ${outputFilename}`);
        successCount++;
      } catch (err) {
        console.error(`❌ [${format.id}] Failed: ${filename}`, err.message);
      } finally {
        await page.close();
      }
    }
  }

  await browser.close();
  console.log(`\n🎉 DONE! Generated ${successCount} assets in ${OUTPUT_ROOT}`);
}

main().catch(console.error);