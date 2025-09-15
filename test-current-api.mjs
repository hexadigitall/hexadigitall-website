// test-current-api.mjs - Test the current cached API
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Import the cached API function
console.log('🔍 Testing current cached API...\n');

// Since we can't directly import the cached API (it uses React components), let's test the underlying client
import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-08-30",
  useCdn: false,
});

async function testCurrentAPI() {
  try {
    console.log('1️⃣ Testing basic client connection...');
    const start = Date.now();
    
    const result = await client.fetch(`*[_type == "courseCategory"] | order(title asc) {
      _id,
      title,
      description[0...200],
      "courses": *[_type == "course" && references(^._id)] | order(title asc) {
        _id,
        title,
        slug,
        summary[0...200],
        "mainImage": mainImage.asset->url,
        description[0...300],
        duration,
        level,
        instructor,
        nairaPrice,
        dollarPrice,
        price,
        featured
      }
    }`);
    
    const end = Date.now();
    console.log(`✅ Query completed in ${end - start}ms`);
    console.log(`📦 Found ${result?.length || 0} categories`);
    
    if (result && result.length > 0) {
      result.forEach((cat, i) => {
        console.log(`   ${i + 1}. ${cat.title} (${cat.courses?.length || 0} courses)`);
      });
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ Current API test failed:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack?.split('\n')[0]
    });
  }
}

testCurrentAPI();