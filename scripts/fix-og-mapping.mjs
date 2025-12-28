#!/usr/bin/env node
/**
 * 🔧 OG IMAGE MAPPING FIXER
 * Instantly fixes the "Missing Image" issue on social media by
 * copying your existing short-name images to match your Production URL slugs.
 */

import fs from 'node:fs';
import path from 'node:path';

// --- CONFIGURATION ---
const BASE_DIR = path.resolve('public/og-images');
const FOLDERS = ['', 'posts', 'stories']; // Process root and subfolders

// 🗺️ THE MAPPING: [Current Short Name] -> [Production URL Slug]
const REPAIRS = [
  { 
    current: 'service-web-development', 
    target: 'web-and-mobile-software-development' 
  },
  { 
    current: 'service-business-planning', 
    target: 'business-plan-and-logo-design' 
  },
  { 
    current: 'service-digital-marketing', 
    target: 'social-media-advertising-and-marketing' 
  },
  { 
    current: 'service-portfolio', 
    target: 'profile-and-portfolio-building' 
  },
  { 
    current: 'service-mentoring', 
    target: 'mentoring-and-consulting' 
  },
  { 
    current: 'service-ecommerce', 
    target: 'ecommerce-store' 
  }
];

console.log('🚀 Starting OG Mapping Repair...\n');

let successCount = 0;

// Loop through each folder (Landscape, Posts, Stories)
FOLDERS.forEach(folder => {
  const dirPath = path.join(BASE_DIR, folder);
  if (!fs.existsSync(dirPath)) return;

  console.log(`📂 Processing: public/og-images/${folder || '(root)'}`);

  REPAIRS.forEach(item => {
    // We check for both .jpg and .png just in case
    ['jpg', 'png'].forEach(ext => {
      const srcFile = `${item.current}.${ext}`;
      const destFile = `${item.target}.${ext}`;
      
      const srcPath = path.join(dirPath, srcFile);
      const destPath = path.join(dirPath, destFile);

      if (fs.existsSync(srcPath)) {
        // Copy the file
        fs.copyFileSync(srcPath, destPath);
        console.log(`   ✅ Fixed: ${destFile}`);
        successCount++;
      } else if (folder === '' && ext === 'jpg') {
        // Only warn for root jpgs to avoid spam
        // console.warn(`   ⚠️  Source not found: ${srcFile}`);
      }
    });
  });
  console.log('');
});

console.log(`🎉 Repair Complete! ${successCount} images mapped to production URLs.`);
console.log('👉 You can now share your long links, and the images will show.');