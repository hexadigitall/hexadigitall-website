import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import QRCode from 'qrcode';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Course data with titles, descriptions, and URLs
const coursesData = [
  {
    slug: 'autocad-masterclass',
    title: 'AutoCAD Masterclass',
    description: 'Master 2D Drafting & 3D Modeling',
    image: 'autocad-masterclass.jpg'
  },
  {
    slug: 'archicad-professional',
    title: 'ArchiCAD Professional',
    description: 'BIM Fundamentals & Visualization',
    image: 'archicad-professional.jpg'
  },
  {
    slug: 'adobe-creative-cloud-suite',
    title: 'Adobe Creative Cloud Suite',
    description: 'Vector & Photo Compositing',
    image: 'adobe-creative-cloud-suite.jpg'
  },
  {
    slug: 'vector-graphics-mastery-coreldraw',
    title: 'Vector Graphics Mastery',
    description: 'Print Design & Illustration',
    image: 'vector-graphics-mastery-coreldraw.jpg'
  },
  {
    slug: 'visual-communication-infographics',
    title: 'Visual Communication',
    description: 'Design Principles & Data Viz',
    image: 'digital-literacy-computer-operations.jpg'
  },
  {
    slug: 'business-intelligence-analytics',
    title: 'Business Intelligence & Analytics',
    description: 'Power BI, Tableau & Dashboards',
    image: 'business-intelligence-bi-and-analytics.jpg'
  },
  {
    slug: 'advanced-excel-business',
    title: 'Advanced Excel for Business',
    description: 'Formulas, Pivot Tables & Macros',
    image: 'advanced-excel-for-business.jpg'
  },
  {
    slug: 'programming-data-management',
    title: 'Programming for Data Management',
    description: 'Python, Pandas & NumPy',
    image: 'data-analysis-with-python.jpg'
  },
  {
    slug: 'sql-relational-database-design',
    title: 'SQL & Relational Database Design',
    description: 'Complex Queries & Normalization',
    image: 'advanced-backend-engineering-node-js-microservices-.jpg'
  },
  {
    slug: 'nosql-cloud-database-architecture',
    title: 'NoSQL & Cloud DB Architecture',
    description: 'MongoDB, AWS & Azure',
    image: 'aws-certified-solutions-architect-associate-professional-.jpg'
  },
  {
    slug: 'rapid-app-development-low-code',
    title: 'Rapid App Development',
    description: 'Low-Code/No-Code Solutions',
    image: 'cross-platform-mobile-app-development-react-native-.jpg'
  },
  {
    slug: 'microsoft-access-business-apps',
    title: 'Microsoft Access',
    description: 'Business Database Applications',
    image: 'digital-literacy-computer-operations.jpg'
  },
  {
    slug: 'executive-presentation-public-speaking',
    title: 'Executive Presentation',
    description: 'Public Speaking & Slide Design',
    image: 'executive-presentation-and-public-speaking.jpg'
  },
  {
    slug: 'microsoft-365-ai-integration',
    title: 'Microsoft 365 & AI',
    description: 'Copilot, Teams & Collaboration',
    image: 'digital-literacy-computer-operations-2.jpg'
  }
];

async function generateQRCode(url) {
  try {
    return await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'H',
      type: 'image/jpeg',
      width: 200,
      margin: 1,
      color: { dark: '#001F3F', light: '#FFFFFF' }
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
}

function loadImageAsBase64(imagePath) {
  try {
    if (fs.existsSync(imagePath)) {
      return `data:image/jpeg;base64,${fs.readFileSync(imagePath).toString('base64')}`;
    }
  } catch (error) {
    console.error(`Error loading image ${imagePath}:`, error);
  }
  return null;
}

function generateOGHTML(course, logoData, bgImageData, qrCode) {
  const baseUrl = 'https://www.hexadigitall.com';
  const courseUrl = `${baseUrl}/schools/school-of-design/${course.slug}`;
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      width: 1200px;
      height: 630px;
      font-family: 'Montserrat', sans-serif;
      overflow: hidden;
      position: relative;
      background: #001F3F;
    }
    
    .bg-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
    
    .bg-image {
      width: 100%;
      height: 100%;
      background-image: url('${bgImageData}');
      background-size: cover;
      background-position: center;
      object-fit: cover;
    }
    
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(0, 31, 63, 0.8) 0%, rgba(0, 31, 63, 0.4) 50%, rgba(0, 217, 255, 0.05) 100%);
      z-index: 2;
    }
    
    .logo {
      position: absolute;
      top: 20px;
      left: 30px;
      height: 60px;
      z-index: 4;
    }
    
    .content {
      position: absolute;
      left: 40px;
      top: 120px;
      width: 700px;
      z-index: 3;
    }
    
    .tag {
      display: inline-block;
      background: linear-gradient(135deg, #00D9FF, #0099CC);
      color: white;
      padding: 8px 20px;
      border-radius: 20px;
      font-weight: 800;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 16px;
      box-shadow: 0 4px 15px rgba(0, 217, 255, 0.3);
    }
    
    h1 {
      font-size: 56px;
      font-weight: 800;
      color: white;
      line-height: 1.2;
      margin-bottom: 12px;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    }
    
    .divider {
      width: 80px;
      height: 4px;
      background: linear-gradient(90deg, #00D9FF, #0099CC);
      margin-bottom: 16px;
      border-radius: 2px;
    }
    
    .description {
      font-size: 18px;
      color: #E2E8F0;
      line-height: 1.5;
      margin-bottom: 20px;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }
    
    .cta {
      display: inline-block;
      background: linear-gradient(135deg, #00D9FF, #0099CC);
      color: #001F3F;
      padding: 12px 32px;
      border-radius: 25px;
      font-weight: 800;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
      text-decoration: none;
      box-shadow: 0 4px 15px rgba(0, 217, 255, 0.4);
    }
    
    .qr-section {
      position: absolute;
      right: 40px;
      bottom: 40px;
      z-index: 4;
      text-align: center;
    }
    
    .qr-code {
      width: 120px;
      height: 120px;
      background: white;
      padding: 8px;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      margin-bottom: 8px;
    }
    
    .qr-text {
      font-size: 10px;
      color: #E2E8F0;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    
    .footer {
      position: absolute;
      bottom: 20px;
      left: 40px;
      z-index: 4;
      color: rgba(255, 255, 255, 0.7);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="bg-container">
    <div class="bg-image"></div>
    <div class="overlay"></div>
  </div>
  
  ${logoData ? `<img src="${logoData}" class="logo" alt="Hexadigitall">` : ''}
  
  <div class="content">
    <div class="tag">Professional Course</div>
    <h1>${course.title}</h1>
    <div class="divider"></div>
    <p class="description">${course.description}</p>
    <div class="cta">Enroll Now</div>
  </div>
  
  <div class="qr-section">
    ${qrCode ? `<img src="${qrCode}" class="qr-code" alt="Enroll QR Code">` : ''}
    <div class="qr-text">SCAN TO ENROLL</div>
  </div>
  
  <div class="footer">
    hexadigitall.com
  </div>
</body>
</html>`;
}

async function generateOGImages() {
  console.log('🎨 Generating OG Images for Courses\n');
  console.log('='.repeat(60));
  
  const outputDir = path.join(__dirname, 'public/og-images');
  const coursesImgDir = path.join(__dirname, 'public/assets/images/courses');
  const logoPath = path.join(__dirname, 'public/hexadigitall-logo-transparent.png');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const logoData = loadImageAsBase64(logoPath);
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const course of coursesData) {
    try {
      const outputPath = path.join(outputDir, `${course.slug}.jpg`);
      
      // Skip if already exists
      if (fs.existsSync(outputPath)) {
        console.log(`⏩ ${course.slug}: Already exists`);
        continue;
      }
      
      console.log(`🖼️  ${course.slug}`);
      
      // Load background image
      const bgImagePath = path.join(coursesImgDir, course.image);
      const bgImageData = loadImageAsBase64(bgImagePath);
      
      if (!bgImageData) {
        console.log(`   ⚠️  Background image not found: ${course.image}`);
        errorCount++;
        continue;
      }
      
      // Generate QR code
      const courseUrl = `https://www.hexadigitall.com/courses/${course.slug}`;
      const qrCode = await generateQRCode(courseUrl);
      
      // Generate HTML
      const html = generateOGHTML(course, logoData, bgImageData, qrCode);
      
      // Create page and render
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 630 });
      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      
      // Screenshot
      await page.screenshot({ path: outputPath, type: 'jpeg', quality: 92 });
      await page.close();
      
      console.log(`   ✅ Generated: ${outputPath}`);
      successCount++;
      
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
      errorCount++;
    }
  }
  
  await browser.close();
  
  console.log('\n' + '='.repeat(60));
  console.log(`\n✅ Generation Complete:`);
  console.log(`   - Successfully generated: ${successCount}`);
  console.log(`   - Errors: ${errorCount}`);
  console.log(`   - Output directory: ${outputDir}`);
  console.log('\n' + '='.repeat(60));
}

generateOGImages().catch(console.error);
