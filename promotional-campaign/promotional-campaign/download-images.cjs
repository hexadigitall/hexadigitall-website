#!/usr/bin/env node

/**
 * Hexadigitall Promotional Campaign Image Downloader
 * Downloads curated images from Unsplash API for campaign use
 * 
 * Usage: node download-images.js
 * 
 * Categories:
 * - Tech/Digital workspace
 * - Business/Team collaboration
 * - Success/Achievement
 * - Education/Learning
 * - Marketing/Social media
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Unsplash Access Key (get from https://unsplash.com/developers)
// For production, use environment variable: process.env.UNSPLASH_ACCESS_KEY
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || 'YOUR_UNSPLASH_ACCESS_KEY_HERE';

const OUTPUT_DIR = path.join(__dirname, 'images', 'raw');

// Image search queries for different campaign themes
const IMAGE_QUERIES = [
  // Tech & Digital
  { query: 'laptop coding workspace', count: 5, category: 'tech' },
  { query: 'digital marketing workspace', count: 5, category: 'tech' },
  { query: 'web development coding', count: 5, category: 'tech' },
  
  // Business & Success
  { query: 'african business professional', count: 5, category: 'business' },
  { query: 'small business success', count: 5, category: 'business' },
  { query: 'entrepreneur working', count: 5, category: 'business' },
  
  // Education & Learning
  { query: 'online learning education', count: 5, category: 'education' },
  { query: 'student studying laptop', count: 5, category: 'education' },
  { query: 'mentorship teaching', count: 5, category: 'education' },
  
  // Marketing & Growth
  { query: 'social media marketing', count: 5, category: 'marketing' },
  { query: 'business growth chart', count: 5, category: 'marketing' },
  { query: 'digital strategy planning', count: 5, category: 'marketing' },
  
  // Team & Collaboration
  { query: 'team collaboration office', count: 3, category: 'team' },
  { query: 'creative agency workspace', count: 3, category: 'team' },
];

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Download image from URL
 */
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete partial file
      reject(err);
    });
  });
}

/**
 * Fetch images from Unsplash API
 */
async function fetchUnsplashImages(query, count = 5) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`;
  
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.results || []);
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

/**
 * Main download function
 */
async function downloadAllImages() {
  console.log('🚀 Starting Hexadigitall Campaign Image Download...\n');
  
  if (UNSPLASH_ACCESS_KEY === 'YOUR_UNSPLASH_ACCESS_KEY_HERE') {
    console.error('❌ ERROR: Please set UNSPLASH_ACCESS_KEY');
    console.log('\nGet your key from: https://unsplash.com/developers');
    console.log('Then set it as: export UNSPLASH_ACCESS_KEY=your_key_here\n');
    process.exit(1);
  }

  let totalDownloaded = 0;
  
  for (const { query, count, category } of IMAGE_QUERIES) {
    console.log(`📸 Fetching: "${query}" (${count} images)`);
    
    try {
      const images = await fetchUnsplashImages(query, count);
      
      if (images.length === 0) {
        console.log(`   ⚠️  No images found for "${query}"`);
        continue;
      }

      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const filename = `${category}-${query.replace(/\s+/g, '-')}-${i + 1}.jpg`;
        const filepath = path.join(OUTPUT_DIR, filename);
        
        // Download regular size (good balance of quality and file size)
        const imageUrl = image.urls.regular;
        
        try {
          await downloadImage(imageUrl, filepath);
          console.log(`   ✓ Downloaded: ${filename}`);
          totalDownloaded++;
          
          // Save image metadata
          const metaPath = filepath.replace('.jpg', '.json');
          fs.writeFileSync(metaPath, JSON.stringify({
            id: image.id,
            photographer: image.user.name,
            photographerUrl: image.user.links.html,
            downloadUrl: image.links.download_location,
            description: image.description || image.alt_description,
            downloadedAt: new Date().toISOString()
          }, null, 2));
          
          // Small delay to respect API rate limits
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (err) {
          console.log(`   ✗ Failed: ${filename} - ${err.message}`);
        }
      }
    } catch (err) {
      console.error(`   ✗ Error fetching "${query}": ${err.message}`);
    }
    
    console.log('');
  }
  
  console.log(`\n✅ Download complete!`);
  console.log(`📁 ${totalDownloaded} images saved to: ${OUTPUT_DIR}`);
  console.log(`\n💡 Attribution: Remember to credit photographers when using these images.`);
  console.log(`   Metadata saved in .json files alongside each image.\n`);
}

// Alternative: Manual download list (if API not available)
function generateManualDownloadList() {
  console.log('\n📋 MANUAL DOWNLOAD GUIDE');
  console.log('If Unsplash API is not available, download these manually:\n');
  
  const manualQueries = [
    'https://unsplash.com/s/photos/laptop-coding-workspace',
    'https://unsplash.com/s/photos/african-business-professional',
    'https://unsplash.com/s/photos/digital-marketing-workspace',
    'https://unsplash.com/s/photos/online-learning-education',
    'https://unsplash.com/s/photos/social-media-marketing',
    'https://unsplash.com/s/photos/web-development-coding',
    'https://unsplash.com/s/photos/small-business-success',
    'https://unsplash.com/s/photos/team-collaboration-office',
  ];
  
  manualQueries.forEach((url, i) => {
    console.log(`${i + 1}. ${url}`);
  });
  
  console.log('\nDownload 5-10 images from each search, save to:');
  console.log(`   ${OUTPUT_DIR}\n`);
}

// Run the downloader
if (require.main === module) {
  downloadAllImages().catch((err) => {
    console.error('Fatal error:', err);
    console.log('\n💡 Try manual download instead:');
    generateManualDownloadList();
    process.exit(1);
  });
}

module.exports = { downloadAllImages, generateManualDownloadList };
