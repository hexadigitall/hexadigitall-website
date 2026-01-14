import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2024-01-11',
  token: process.env.SANITY_API_TOKEN,
});

// Course mapping: slug to local image file
const courseImageMappings = {
  'autocad-masterclass': 'autocad-masterclass.jpg',
  'archicad-professional': 'archicad-professional.jpg',
  'adobe-creative-cloud-suite': 'adobe-creative-cloud-suite.jpg',
  'vector-graphics-mastery-coreldraw': 'vector-graphics-mastery-coreldraw.jpg',
  'visual-communication-infographics': 'visual-communication-infographics.jpg',
  'business-intelligence-analytics': 'business-intelligence-bi-and-analytics.jpg',
  'advanced-excel-business': 'advanced-excel-for-business.jpg',
  'programming-data-management': 'programming-data-management.jpg',
  'sql-relational-database-design': 'sql-relational-database-design.jpg',
  'nosql-cloud-database-architecture': 'nosql-cloud-database-architecture.jpg',
  'rapid-app-development-low-code': 'rapid-app-development-low-code.jpg',
  'microsoft-access-business-apps': 'microsoft-access-business-apps.jpg',
  'executive-presentation-public-speaking': 'executive-presentation-and-public-speaking.jpg',
  'microsoft-365-ai-integration': 'microsoft-365-ai-integration.jpg'
};

// List of non-existent mapping entries (we'll create minimal ones)
const missingMappings = {
  'programming-data-management': 'data-analysis-with-python.jpg',
  'sql-relational-database-design': 'advanced-backend-engineering-node-js-microservices-.jpg',
  'nosql-cloud-database-architecture': 'aws-certified-solutions-architect-associate-professional-.jpg',
  'rapid-app-development-low-code': 'cross-platform-mobile-app-development-react-native-.jpg',
  'microsoft-access-business-apps': 'digital-literacy-computer-operations.jpg',
  'microsoft-365-ai-integration': 'digital-literacy-computer-operations-2.jpg'
};

// Update mappings with fallbacks
Object.entries(missingMappings).forEach(([key, value]) => {
  if (!fs.existsSync(path.join(__dirname, 'public/assets/images/courses', courseImageMappings[key]))) {
    courseImageMappings[key] = value;
  }
});

async function uploadImageToSanity(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const fileName = path.basename(imagePath);
    
    const asset = await client.assets.upload('image', imageBuffer, {
      filename: fileName,
    });
    
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    };
  } catch (error) {
    console.error(`Error uploading image ${imagePath}:`, error.message);
    return null;
  }
}

async function checkAndUploadImages() {
  console.log('📸 Checking and uploading course images...\n');
  
  const results = {};
  const coursesDir = path.join(__dirname, 'public/assets/images/courses');

  for (const [slug, fileName] of Object.entries(courseImageMappings)) {
    const imagePath = path.join(coursesDir, fileName);
    
    if (!fs.existsSync(imagePath)) {
      console.warn(`⚠️  Not found: ${fileName}`);
      continue;
    }

    console.log(`📤 Uploading: ${fileName}`);
    const sanityImage = await uploadImageToSanity(imagePath);
    
    if (sanityImage) {
      results[slug] = sanityImage;
      console.log(`   ✅ Uploaded successfully\n`);
    }
  }

  return results;
}

async function validateSchema() {
  console.log('🔍 Validating course schema...\n');
  
  // Fetch one course to check schema
  const existingCourse = await client.fetch(
    `*[_type == "course"][0] {
      _id,
      title,
      hourlyRateUSD,
      hourlyRateNGN,
      pricePerMonth,
      pricePerMonthNGN,
      pricePerHour,
      pricePerHourNGN,
      mainImage,
      bannerBackgroundImage,
      ogImage,
      seo
    }`
  );

  if (existingCourse) {
    console.log('✅ Found existing course. Schema fields:');
    console.log('  - hourlyRateUSD:', typeof existingCourse.hourlyRateUSD);
    console.log('  - hourlyRateNGN:', typeof existingCourse.hourlyRateNGN);
    console.log('  - mainImage:', existingCourse.mainImage ? 'Yes' : 'No');
    console.log('  - bannerBackgroundImage:', existingCourse.bannerBackgroundImage ? 'Yes' : 'No');
    console.log('  - ogImage:', existingCourse.ogImage ? 'Yes' : 'No');
    console.log('  - seo:', existingCourse.seo ? 'Yes' : 'No');
  }
  
  console.log('\n');
}

console.log('📊 COURSE IMPORT PREPARATION\n');
console.log('='.repeat(60));
console.log('\nThis script will:');
console.log('1. ✓ Validate the course schema');
console.log('2. ⏳ Upload course images to Sanity');
console.log('3. ⏳ Generate OG images for courses');
console.log('4. ⏳ Import courses with all fields');
console.log('\nRun this first to prepare, then we\'ll do the full import.');
console.log('='.repeat(60) + '\n');

await validateSchema();
const uploadedImages = await checkAndUploadImages();

console.log('='.repeat(60));
console.log('\n✅ PREPARATION COMPLETE');
console.log(`\n📊 Summary:`);
console.log(`   - Images to upload: ${Object.keys(courseImageMappings).length}`);
console.log(`   - Images uploaded: ${Object.keys(uploadedImages).length}`);
console.log(`\n📌 Next Steps:`);
console.log('   1. Run: node generate-course-og-images.mjs');
console.log('   2. Run: node import-courses-full.mjs');
console.log('\n' + '='.repeat(60));
