/**
 * HEXADIGITALL OG IMAGE GENERATOR (V3.4 - Minimal Text Footprint)
 * * Generates conversion-optimized Open Graph images using:
 * - 3D Beveled Logo (Top Left)
 * - Minimalist Glass Text Box (Bottom Left)
 * - Maximum Image Visibility
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
const INPUT_DIR = path.join(__dirname, '..', 'public', 'course-images');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'course_og_images');
const LOGO_PATH = path.join(__dirname, '..', 'public', 'hexadigitall-logo-transparent.png');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Brand Configuration
const BRAND = {
  url: 'hexadigitall.com',
  colors: {
    primary: '#001F3F',
    accent: '#00D9FF',
    glass: 'rgba(0, 31, 63, 0.85)'
  }
};

// Known Acronyms to force Uppercase
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
 * Converts a filename to a human-readable title with Acronym logic.
 */
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

/**
 * Generates the HTML for the OG Image
 */
function getHtmlTemplate(imagePath, title, logoDataUri) {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Lato:wght@400;700&display=swap');
    
    body {
      margin: 0;
      padding: 0;
      width: 1200px;
      height: 630px;
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
      background-position: center;
      z-index: 1;
    }

    /* Gradient Overlay - CLEAR TOP to show image, DARK BOTTOM for text */
    .overlay-gradient {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        to bottom,
        rgba(0,31,63,0.05) 0%,   /* Very clear top */
        rgba(0,31,63,0.1) 40%,
        rgba(0,31,63,0.6) 70%,
        rgba(0,31,63,0.95) 100%  /* Dark bottom */
      );
      z-index: 2;
    }

    /* --- GLASSMORPHISM MIXIN --- */
    .glass-panel {
      background: ${BRAND.colors.glass};
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.4);
    }

    /* Top Left Logo - 3D BEVEL */
    .logo-container {
      position: absolute;
      top: 40px;
      left: 40px;
      z-index: 20;
      display: flex;
      align-items: center;
    }

    .logo-img {
      height: 150px; 
      width: auto;
      filter: 
        drop-shadow(0px 0px 1px rgba(255, 255, 255, 1))
        drop-shadow(0px 8px 15px rgba(0, 0, 0, 0.8));
    }

    /* Top Right URL - Smaller and unobtrusive */
    .url-container {
      position: absolute;
      top: 40px;
      right: 40px;
      z-index: 10;
      padding: 10px 25px;
      border-radius: 50px;
      color: ${BRAND.colors.accent};
      font-family: 'Lato', sans-serif;
      font-weight: 800;
      font-size: 18px; /* Reduced */
      letter-spacing: 1px;
      text-transform: uppercase;
      text-shadow: 0 2px 10px rgba(0,217,255,0.4);
    }

    /* Main Content Area - Pushed WAY DOWN */
    .content-wrapper {
      position: absolute;
      bottom: 40px;
      left: 40px;
      max-width: 800px; /* Reduced width to show more image right side */
      z-index: 10;
    }

    /* Title Box - Compact Padding */
    .title-box {
      padding: 25px 35px; /* Drastically Reduced Padding */
      border-radius: 16px;
      border-left: 8px solid ${BRAND.colors.accent};
    }

    .course-label {
      color: ${BRAND.colors.accent};
      font-family: 'Lato', sans-serif;
      font-size: 14px; /* Small */
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 3px;
      margin-bottom: 8px;
      display: block;
    }

    h1 {
      color: white;
      font-size: 42px; /* Much Smaller */
      line-height: 1.1;
      margin: 0 0 15px 0;
      text-shadow: 0 2px 8px rgba(0,0,0,0.5);
    }

    /* CTA Button - Compact Pill */
    .cta-badge {
      display: inline-block;
      background: linear-gradient(135deg, ${BRAND.colors.accent} 0%, #007EA7 100%);
      color: #001F3F;
      padding: 10px 30px; /* Compact */
      font-size: 16px; /* Small */
      font-weight: 800;
      text-transform: uppercase;
      border-radius: 50px; 
      box-shadow: 0 4px 15px rgba(0, 217, 255, 0.5);
      border: 1px solid rgba(255,255,255,0.3);
    }

  </style>
</head>
<body>

  <div class="bg-image"></div>
  <div class="overlay-gradient"></div>

  <div class="logo-container">
    ${logoDataUri 
      ? `<img src="${logoDataUri}" class="logo-img" />` 
      : `<span style="color:white; font-size:40px; font-weight:900;">HEXADIGITALL</span>`
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

async function main() {
  console.log('🚀 Starting Hexadigitall OG Image Generator (Minimalist Layout)...');
  console.log(`📂 Input: ${INPUT_DIR}`);
  console.log(`📂 Output: ${OUTPUT_DIR}`);
  
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
    const outputFilename = filename.replace(/\.(jpg|jpeg|png)$/i, '.png'); 
    const outputPath = path.join(OUTPUT_DIR, outputFilename);

    if (!fs.existsSync(inputPath)) {
      console.warn(`⚠️  Skipping missing input image: ${filename}`);
      continue;
    }

    const title = filenameToTitle(filename);
    const imageData = loadFileAsBase64(inputPath);
    const html = getHtmlTemplate(imageData, title, logoData);

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630 });

    try {
      await page.setContent(html, { 
        waitUntil: 'load',
        timeout: 60000 
      });
      
      await page.screenshot({ path: outputPath, type: 'png' });
      console.log(`✅ Generated: ${outputFilename} ("${title}")`);
      successCount++;
    } catch (err) {
      console.error(`❌ Failed to generate ${filename}:`, err.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log(`\n🎉 Process Complete! Generated ${successCount} OG images in public/course_og_images/`);
}

main().catch(console.error);