const https = require('https');
const fs = require('fs');
const path = require('path');

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || 'YOUR_ACCESS_KEY_HERE';
const OUTPUT_DIR = path.join(__dirname, 'images', 'raw');

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
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

/**
 * Search Unsplash for images
 */
function searchUnsplash(query, perPage = 5) {
  return new Promise((resolve, reject) => {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`;
    
    https.get(url, {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    }, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
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

/**
 * Image search queries focused on people, trust, and professionalism
 */
const IMAGE_QUERIES = [
  // Tech professionals
  { query: 'african woman smiling laptop workspace', prefix: 'person-tech', count: 3 },
  { query: 'african man professional computer smiling', prefix: 'person-tech', count: 3 },
  { query: 'young professional coding happy', prefix: 'person-tech', count: 2 },
  
  // Business professionals
  { query: 'african business person professional portrait', prefix: 'person-business', count: 3 },
  { query: 'entrepreneur laptop office smiling', prefix: 'person-business', count: 2 },
  { query: 'professional businesswoman laptop presentation', prefix: 'person-business', count: 2 },
  
  // Marketing/Creative
  { query: 'creative professional designer workspace', prefix: 'person-marketing', count: 2 },
  { query: 'digital marketing professional laptop', prefix: 'person-marketing', count: 2 },
  { query: 'social media manager computer smiling', prefix: 'person-marketing', count: 2 },
  
  // Education/Learning
  { query: 'student online learning laptop happy', prefix: 'person-education', count: 2 },
  { query: 'instructor teaching online computer', prefix: 'person-education', count: 2 },
  
  // General professionals with laptops (showing screen)
  { query: 'person laptop screen visible workspace', prefix: 'person-screen', count: 3 },
  { query: 'professional working computer screen', prefix: 'person-screen', count: 2 },
];

/**
 * Main download function
 */
async function downloadPeopleImages() {
  console.log('🖼️  Downloading Professional People Images for Hexadigitall Campaign\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  if (UNSPLASH_ACCESS_KEY === 'YOUR_ACCESS_KEY_HERE') {
    console.error('❌ ERROR: Please set UNSPLASH_ACCESS_KEY environment variable');
    console.log('\n💡 Get your free API key at: https://unsplash.com/developers');
    console.log('   Then run: export UNSPLASH_ACCESS_KEY="your_key_here"');
    process.exit(1);
  }

  let totalDownloaded = 0;
  let totalFailed = 0;

  for (const { query, prefix, count } of IMAGE_QUERIES) {
    console.log(`\n📥 Searching: "${query}"`);
    
    try {
      const results = await searchUnsplash(query, count);
      
      if (!results.results || results.results.length === 0) {
        console.log(`   ⚠️  No results found`);
        continue;
      }

      console.log(`   Found ${results.results.length} images`);

      for (let i = 0; i < results.results.length; i++) {
        const photo = results.results[i];
        const imageUrl = photo.urls.regular; // High quality
        const filename = `${prefix}-${i + 1}.jpg`;
        const filepath = path.join(OUTPUT_DIR, filename);

        try {
          await downloadImage(imageUrl, filepath);
          console.log(`   ✓ Downloaded: ${filename}`);
          totalDownloaded++;
          
          // Rate limiting - be respectful to Unsplash API
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (err) {
          console.log(`   ✗ Failed: ${filename} - ${err.message}`);
          totalFailed++;
        }
      }
    } catch (err) {
      console.log(`   ✗ Search failed: ${err.message}`);
      totalFailed++;
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`\n✅ Download Complete!`);
  console.log(`   📥 Downloaded: ${totalDownloaded} images`);
  console.log(`   ❌ Failed: ${totalFailed}`);
  console.log(`   📁 Location: ${OUTPUT_DIR}`);
  console.log('\n💡 Next step: Run generate-images.cjs to create promotional graphics');
  console.log('   with these professional images!\n');
}

// Run if called directly
if (require.main === module) {
  downloadPeopleImages().catch(console.error);
}

module.exports = { downloadPeopleImages };
