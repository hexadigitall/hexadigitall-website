import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local from the root directory
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

if (!process.env.SANITY_API_TOKEN) {
  console.error("❌ Error: SANITY_API_TOKEN is missing from .env.local");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN, // WRITE token required
  useCdn: false,
  apiVersion: '2024-01-01',
});

async function cleanup() {
  console.log('💥 Starting NUCLEAR CLEANUP of Service Categories...');
  
  // 1. Find ALL documents of type 'serviceCategory' (Ghost or Real)
  const ids = await client.fetch(`*[_type == "serviceCategory"]._id`);
  
  if (ids.length === 0) {
    console.log('   ✅ Database is already clean. No service categories found.');
    return;
  }

  console.log(`   Found ${ids.length} documents. Deleting them all...`);

  // 2. Delete them sequentially (safest way to ensure they are gone)
  const transaction = client.transaction();
  ids.forEach(id => transaction.delete(id));
  
  await transaction.commit();
  console.log('   ✨ SUCCESS: All Service Categories deleted.');
  console.log('   👉 Now run "npx tsx scripts/sync-content.ts" to upload the fresh data.');
}

cleanup().catch((err) => {
  console.error('❌ Cleanup failed:', err.message);
  process.exit(1);
});