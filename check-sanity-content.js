// check-sanity-content.js
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-08-30',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function checkSanityContent() {
  try {
    console.log('🔍 Checking Sanity content...\n');
    
    console.log('📊 Environment Variables:');
    console.log(`   Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
    console.log(`   Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`);
    console.log(`   Has Token: ${process.env.SANITY_API_TOKEN ? 'Yes' : 'No'}\n`);

    // Check service categories
    const serviceCategories = await client.fetch('*[_type == "serviceCategory"]');
    console.log(`📦 Service Categories: ${serviceCategories.length} found`);
    serviceCategories.forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.title} (${cat.packages?.length || 0} packages)`);
    });

    // Check testimonials
    const testimonials = await client.fetch('*[_type == "testimonial"]');
    console.log(`\n💬 Testimonials: ${testimonials.length} found`);
    testimonials.forEach((test, index) => {
      console.log(`   ${index + 1}. ${test.authorName} - ${test.authorCompany}`);
    });

    // Check FAQs
    const faqs = await client.fetch('*[_type == "faq"]');
    console.log(`\n❓ FAQs: ${faqs.length} found`);
    faqs.forEach((faq, index) => {
      console.log(`   ${index + 1}. ${faq.question.substring(0, 50)}...`);
    });

    // Check blog posts
    const posts = await client.fetch('*[_type == "post"]');
    console.log(`\n📰 Blog Posts: ${posts.length} found`);
    posts.forEach((post, index) => {
      console.log(`   ${index + 1}. ${post.title}`);
    });

    // Check projects
    const projects = await client.fetch('*[_type == "project"]');
    console.log(`\n💼 Portfolio Projects: ${projects.length} found`);
    projects.forEach((proj, index) => {
      console.log(`   ${index + 1}. ${proj.title} (${proj.industry})`);
    });

    // Check all document types
    const allDocs = await client.fetch('*[!(_type match "sanity.*")] | order(_type asc)');
    console.log(`\n📋 All Documents by Type:`);
    const typeCount = {};
    allDocs.forEach(doc => {
      typeCount[doc._type] = (typeCount[doc._type] || 0) + 1;
    });
    
    Object.entries(typeCount).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} documents`);
    });

    console.log(`\n✅ Total Documents: ${allDocs.length}`);

  } catch (error) {
    console.error('❌ Error checking Sanity content:', error);
    console.error('Full error:', error.message);
  }
}

// Run the check
checkSanityContent();
