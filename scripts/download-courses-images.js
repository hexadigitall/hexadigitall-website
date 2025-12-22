// download-courses-images.js
// Download Unsplash images for each course in the schools structure
// Usage: node scripts/download-courses-images.js

const https = require('https');
const fs = require('fs');
const path = require('path');

const UNSPLASH_ACCESS_KEY = 'PHXMsDU1rr_gnii2KT11bgjZ1WG9S-fRJyjOLULR_8U';
const OUTPUT_DIR = path.join(__dirname, '../public/course-images');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Define the courses (copy from schools-course-reorg.js or import if modularized)
const schoolsStructure = require('./schools-structure.cjs'); // You may need to export this structure

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
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

function searchUnsplash(query) {
  return new Promise((resolve, reject) => {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
    https.get(url, {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    }, (response) => {
      let data = '';
      response.on('data', (chunk) => { data += chunk; });
      response.on('end', () => {
        if (response.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Unsplash API error: ${response.statusCode}`));
        }
      });
    }).on('error', reject);
  });
}

async function downloadCourseImages() {
  console.log('🖼️  Downloading Unsplash images for courses...');
  for (const [school, schoolData] of Object.entries(schoolsStructure)) {
    for (const course of schoolData.courses) {
      const query = course.title;
      const filename = `${query.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jpg`;
      const filepath = path.join(OUTPUT_DIR, filename);
      try {
        const results = await searchUnsplash(query);
        if (results.results && results.results[0]) {
          const imageUrl = results.results[0].urls.regular;
          await downloadImage(imageUrl, filepath);
          console.log(`   ✓ Downloaded: ${filename}`);
        } else {
          console.log(`   ✗ No image found for: ${query}`);
        }
        await new Promise(res => setTimeout(res, 1000)); // Rate limit
      } catch (err) {
        console.log(`   ✗ Failed: ${filename} - ${err.message}`);
      }
    }
  }
  console.log('✅ All course images downloaded!');
}

downloadCourseImages().catch(console.error);
