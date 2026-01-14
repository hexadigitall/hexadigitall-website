#!/usr/bin/env node
/**
 * Generate PDF curricula from HTML files
 * 
 * This script converts the HTML curriculum documents to PDF format
 * for easy distribution to students.
 * 
 * Requirements:
 * - npm install puppeteer
 * 
 * Usage:
 * node scripts/generate-curriculum-pdfs.mjs
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CURRICULA = [
  {
    name: 'Azure Security Technologies (AZ-500)',
    htmlFile: 'public/curriculums/curriculum-azure-security-az500.html',
    pdfFile: 'public/curriculums/curriculum-azure-security-az500.pdf'
  },
  {
    name: 'Linux Administration & Shell Scripting Pro',
    htmlFile: 'public/curriculums/curriculum-linux-shell-scripting.html',
    pdfFile: 'public/curriculums/curriculum-linux-shell-scripting.pdf'
  }
];

async function generatePDF(htmlPath, pdfPath, courseName) {
  console.log(`\n📄 Generating PDF for: ${courseName}`);
  console.log(`   Source: ${htmlPath}`);
  console.log(`   Output: ${pdfPath}`);

  try {
    // Launch browser
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Read HTML file
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    
    // Set content
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0'
    });

    // Generate PDF with professional settings
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      },
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="font-size: 10px; text-align: center; width: 100%; color: #666; padding: 5px;">
          <span class="pageNumber"></span> / <span class="totalPages"></span>
        </div>
      `
    });

    await browser.close();

    // Get file size
    const stats = fs.statSync(pdfPath);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log(`   ✅ PDF generated successfully!`);
    console.log(`   📦 File size: ${fileSizeInMB} MB`);

    return true;
  } catch (error) {
    console.error(`   ❌ Error generating PDF: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🎓 Curriculum PDF Generator');
  console.log('=' .repeat(60));

  // Check if puppeteer is installed
  try {
    await import('puppeteer');
  } catch (error) {
    console.error('\n❌ Puppeteer not found!');
    console.error('Please install it with: npm install puppeteer');
    process.exit(1);
  }

  const projectRoot = path.resolve(__dirname, '..');
  let successCount = 0;

  for (const curriculum of CURRICULA) {
    const htmlPath = path.join(projectRoot, curriculum.htmlFile);
    const pdfPath = path.join(projectRoot, curriculum.pdfFile);

    // Check if HTML file exists
    if (!fs.existsSync(htmlPath)) {
      console.error(`\n❌ HTML file not found: ${htmlPath}`);
      continue;
    }

    const success = await generatePDF(htmlPath, pdfPath, curriculum.name);
    if (success) {
      successCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✨ PDF Generation Complete: ${successCount}/${CURRICULA.length} successful`);
  
  if (successCount === CURRICULA.length) {
    console.log('\n📧 PDFs are ready to send to students!');
    console.log('📁 Location: public/curriculums');
  }
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
