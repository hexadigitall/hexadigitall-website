// Check all document types for unknown fields
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-08-30',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const DOCUMENT_TYPES = [
  'course',
  'courseCategory',
  'enrollment',
  'pendingEnrollment',
  'service',
  'serviceCategory',
  'serviceCaseStudy',
  'serviceRequest',
  'post',
  'project',
  'faq',
  'testimonial',
];

async function checkAllTypes() {
  console.log('🔍 Checking for fields across all document types...\n');
  
  for (const type of DOCUMENT_TYPES) {
    try {
      const docs = await client.fetch(`*[_type == "${type}"][0...1][0]`);
      
      if (docs) {
        const fields = Object.keys(docs).filter(k => !k.startsWith('_'));
        console.log(`\n📄 ${type}:`);
        console.log(`   Fields: ${fields.join(', ')}`);
      }
    } catch (error) {
      console.log(`\n❌ ${type}: Error - ${error.message}`);
    }
  }
}

checkAllTypes();
