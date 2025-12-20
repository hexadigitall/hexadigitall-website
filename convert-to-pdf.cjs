#!/usr/bin/env node

/**
 * Convert all campaign markdown documents to searchable PDFs
 * Outputs searchable HTML PDFs with professional styling
 */

const fs = require('fs');
const path = require('path');

// Files to convert
const FILES_TO_CONVERT = [
  'promotional-campaign/MASTER_PLAYBOOK.md',
  'promotional-campaign/LAUNCH_DAY_CHECKLIST.md',
  'promotional-campaign/CONTENT_CALENDAR_30DAYS.md',
  'promotional-campaign/SWIPE_FILE.md',
  'promotional-campaign/CAMPAIGN_TRACKING_GUIDE.md',
  'promotional-campaign/EMAIL_NURTURE_SEQUENCES.md',
  'promotional-campaign/CAMPAIGN_STRATEGY.md',
  'promotional-campaign/README.md',
  'promotional-campaign/content/SOCIAL_MEDIA_CONTENT.md',
  'promotional-campaign/content/SEO_CONTENT_STRATEGY.md',
  'promotional-campaign/content/SALES_STRATEGY.md',
  'docs/SOCIAL_SHARE_GUIDE.md',
];

const OUTPUT_DIR = 'promotional-campaign/pdfs';
const PROJECT_ROOT = process.cwd();

// Ensure output directory exists
if (!fs.existsSync(path.join(PROJECT_ROOT, OUTPUT_DIR))) {
  fs.mkdirSync(path.join(PROJECT_ROOT, OUTPUT_DIR), { recursive: true });
  console.log(`✓ Created output directory: ${OUTPUT_DIR}`);
}

/**
 * Convert markdown to searchable HTML
 */
function markdownToHtml(markdownContent, filename) {
  const title = path.basename(filename, '.md').replace(/-/g, ' ').toUpperCase();
  
  // Simple markdown to HTML converter
  let html = markdownContent
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Code blocks (must be before other replacements)
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    // Undo escaped content inside code
    .replace(/<code>([\s\S]*?)<\/code>/g, (match) => {
      return match
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
    })
    // Headers
    .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
    // Inline code
    .replace(/`(.*?)`/g, '<code>$1</code>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr>')
    // Tables
    .replace(/^\|(.+)\|$/gm, '<tr><td>$1</td></tr>')
    // Line breaks
    .replace(/\n\n+/g, '</p><p>')
    // Unordered lists
    .replace(/^\s*[-*]\s+(.+)$/gm, '<li>$1</li>')
    // Ordered lists
    .replace(/^\s*\d+\.\s+(.+)$/gm, '<li>$1</li>')
    // Wrap non-HTML content in paragraphs
    .split('\n')
    .map(line => {
      if (line.trim() === '' || line.match(/^<[^>]+>/) || line.match(/<\/[^>]+>$/)) {
        return line;
      }
      if (line.trim() && !line.match(/^</) && !line.match(/>$/)) {
        return `<p>${line}</p>`;
      }
      return line;
    })
    .join('\n');

  // Wrap in complete HTML document
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    @page {
      size: A4;
      margin: 1in;
    }
    
    html, body {
      width: 100%;
      min-height: 100%;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      line-height: 1.65;
      color: #333;
      background: white;
      padding: 0;
    }
    
    .document {
      padding: 40px;
      max-width: 900px;
      margin: 0 auto;
    }
    
    .title-block {
      border-bottom: 3px solid #00D9FF;
      padding-bottom: 20px;
      margin-bottom: 30px;
      page-break-after: avoid;
    }
    
    .title-block h1 {
      font-size: 2.5em;
      color: #001F3F;
      margin: 0 0 10px 0;
      line-height: 1.2;
    }
    
    .title-block .meta {
      font-size: 0.9em;
      color: #666;
      font-style: italic;
    }
    
    h1 {
      font-size: 2.2em;
      margin: 40px 0 15px 0;
      color: #001F3F;
      border-bottom: 2px solid #00D9FF;
      padding-bottom: 8px;
      page-break-after: avoid;
      page-break-before: auto;
    }
    
    h2 {
      font-size: 1.6em;
      margin: 35px 0 12px 0;
      color: #1B4D5C;
      page-break-after: avoid;
    }
    
    h3 {
      font-size: 1.2em;
      margin: 20px 0 10px 0;
      color: #00D9FF;
      page-break-after: avoid;
    }
    
    p {
      margin: 12px 0;
      text-align: justify;
    }
    
    strong {
      font-weight: 700;
      color: #001F3F;
    }
    
    em {
      font-style: italic;
      color: #555;
    }
    
    code {
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
      color: #d63384;
    }
    
    pre {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 5px;
      overflow: auto;
      margin: 15px 0;
      border-left: 4px solid #00D9FF;
      page-break-inside: avoid;
      font-family: 'Courier New', monospace;
      font-size: 0.85em;
      line-height: 1.4;
    }
    
    pre code {
      background: none;
      padding: 0;
      color: inherit;
    }
    
    ul, ol {
      margin: 15px 0 15px 30px;
    }
    
    li {
      margin: 8px 0;
      line-height: 1.6;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 0.9em;
      page-break-inside: avoid;
    }
    
    th, td {
      padding: 10px 12px;
      border: 1px solid #ddd;
      text-align: left;
    }
    
    th {
      background: #001F3F;
      color: white;
      font-weight: 700;
    }
    
    tr:nth-child(even) {
      background: #f9f9f9;
    }
    
    a {
      color: #00D9FF;
      text-decoration: none;
      word-break: break-word;
    }
    
    a:visited {
      color: #00a8cc;
    }
    
    blockquote {
      border-left: 4px solid #00D9FF;
      padding-left: 15px;
      margin: 15px 0;
      color: #666;
      font-style: italic;
    }
    
    hr {
      border: none;
      border-top: 2px solid #00D9FF;
      margin: 30px 0;
      page-break-before: always;
    }
    
    .footer {
      text-align: center;
      color: #999;
      font-size: 0.9em;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
    }
    
    @media print {
      body {
        margin: 0;
        padding: 0;
      }
      
      .document {
        max-width: 100%;
        padding: 40px;
      }
      
      h1, h2, h3 {
        page-break-after: avoid;
      }
      
      h1 {
        page-break-before: always;
      }
      
      table, pre, blockquote {
        page-break-inside: avoid;
      }
      
      a {
        color: #0066cc;
      }
    }
  </style>
</head>
<body>
  <div class="document">
    <div class="title-block">
      <h1>${title}</h1>
      <div class="meta">Generated: ${new Date().toLocaleString()} | Hexadigitall Campaign</div>
    </div>
    
    ${html}
    
    <hr>
    <div class="footer">
      <p>This document is part of the Hexadigitall Aggressive Market Penetration Campaign (Dec 19, 2025 – Feb 17, 2026)<br>For questions, contact: Campaign Manager</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Convert a markdown file to searchable HTML
 */
function convertFile(mdPath) {
  try {
    const fullPath = path.join(PROJECT_ROOT, mdPath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`✗ File not found: ${mdPath}`);
      return false;
    }
    
    const filename = path.basename(mdPath, '.md');
    const outputPath = path.join(PROJECT_ROOT, OUTPUT_DIR, `${filename}.html`);
    
    // Read markdown
    const markdownContent = fs.readFileSync(fullPath, 'utf8');
    
    // Convert to HTML
    const htmlContent = markdownToHtml(markdownContent, mdPath);
    
    // Write HTML file (fully searchable)
    fs.writeFileSync(outputPath, htmlContent);
    
    console.log(`✓ Converted: ${mdPath} → ${filename}.html (searchable)`);
    return true;
    
  } catch (error) {
    console.error(`✗ Error converting ${mdPath}:`, error.message);
    return false;
  }
}

/**
 * Main conversion process
 */
function main() {
  console.log('🚀 Converting campaign documents to searchable HTML...\n');
  
  let successful = 0;
  let failed = 0;
  
  for (const file of FILES_TO_CONVERT) {
    const result = convertFile(file);
    if (result) {
      successful++;
    } else {
      failed++;
    }
  }
  
  console.log(`\n✅ Conversion complete!`);
  console.log(`   Successfully converted: ${successful}/${FILES_TO_CONVERT.length}`);
  if (failed > 0) {
    console.log(`   Failed: ${failed}`);
  }
  
  console.log(`\n📁 Searchable documents saved to: ${OUTPUT_DIR}/`);
  console.log(`\n💡 These HTML files are:
   • Fully searchable (Ctrl+F / Cmd+F)
   • Print-friendly (convert to PDF via browser: Ctrl+P)
   • Mobile-responsive
   • Professional formatting with Hexadigitall branding colors
  
  To convert HTML to PDF via browser:
   1. Open the HTML file in your browser
   2. Press Ctrl+P (or Cmd+P on Mac)
   3. Select "Save as PDF"
   4. Choose location and save
  
  All documents will maintain full searchability in PDF format.`);
}

main();
