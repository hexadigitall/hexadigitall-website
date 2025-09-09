// import-service-categories.js
import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-08-30',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Make sure this is set in your .env.local
});

async function importServiceCategories() {
  try {
    console.log('🚀 Starting import of service categories...');
    
    // Read the import.ndjson file
    const filePath = path.join(__dirname, 'import.ndjson');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse each line as JSON
    const serviceCategories = fileContent
      .trim()
      .split('\n')
      .map(line => JSON.parse(line));
    
    console.log(`📦 Found ${serviceCategories.length} service categories to import`);
    
    // Check if service categories already exist
    const existingCategories = await client.fetch('*[_type == "serviceCategory"]');
    console.log(`📋 Found ${existingCategories.length} existing service categories`);
    
    if (existingCategories.length > 0) {
      console.log('⚠️  Service categories already exist. Do you want to:');
      console.log('   1. Skip import (exit now)');
      console.log('   2. Delete existing and import fresh (delete all existing)');
      console.log('   3. Update existing with new data (merge)');
      console.log('');
      console.log('💡 For now, we\'ll proceed with import. Existing items with same slug will be updated.');
    }
    
    // Import each service category
    let imported = 0;
    let updated = 0;
    
    for (const category of serviceCategories) {
      try {
        // Check if category with this slug already exists
        const existingCategory = existingCategories.find(
          existing => existing.slug?.current === category.slug?.current
        );
        
        if (existingCategory) {
          // Update existing category
          console.log(`🔄 Updating service category: ${category.title}`);
          await client
            .patch(existingCategory._id)
            .set(category)
            .commit();
          updated++;
        } else {
          // Create new category
          console.log(`✨ Creating service category: ${category.title}`);
          await client.create(category);
          imported++;
        }
        
      } catch (error) {
        console.error(`❌ Error importing ${category.title}:`, error.message);
      }
    }
    
    console.log('');
    console.log('✅ Import completed!');
    console.log(`   📝 ${imported} new service categories created`);
    console.log(`   🔄 ${updated} existing service categories updated`);
    console.log('');
    console.log('🎉 Your service categories are now available in Sanity Studio!');
    console.log('   Visit: http://localhost:3000/studio to see them');
    console.log('');
    
  } catch (error) {
    console.error('💥 Import failed:', error);
    process.exit(1);
  }
}

// Run the import
importServiceCategories();
