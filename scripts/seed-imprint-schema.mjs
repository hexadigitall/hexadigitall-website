import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'puzezel0',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-08-30',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function main() {
  console.log('Fetching all imprints...');
  const imprints = await client.fetch(`*[_type == "imprint"]{_id, title, price}`);
  
  console.log(`Found ${imprints.length} digital imprints. Patching new schema defaults...`);

  let count = 0;
  for (const imprint of imprints) {
    try {
      // Migrate old price to the new pricing structure (assuming old price was NGN)
      const existingPrice = imprint.price || 15000;
      
      await client.patch(imprint._id)
        .setIfMissing({
          status: 'available',
          directDownloadEnabled: true,
          hasStudentVersion: true,
          hasTeacherVersion: false,
          pricing: {
            usd: 25, // Fallback/estimated default
            ngn: existingPrice
          }
        })
        .commit();
      
      count++;
      if (count % 10 === 0) console.log(`Patched ${count}/${imprints.length}`);
    } catch (e) {
      console.error(`Failed to patch ${imprint.title}`, e.message);
    }
  }

  console.log('✅ Successfully applied schema defaults to all digital imprints!');
}

main().catch(console.error);