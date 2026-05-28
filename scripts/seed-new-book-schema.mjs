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
  console.log('Fetching all books...');
  const books = await client.fetch(`*[_type == "book"]{_id, title}`);
  
  console.log(`Found ${books.length} books. Patching new schema defaults...`);

  let count = 0;
  for (const book of books) {
    try {
      await client.patch(book._id)
        .setIfMissing({
          directDownloadEnabled: true,
          hasStudentVersion: true,
          hasTeacherVersion: true,
          pricing: {
            usd: 45,
            ngn: 30000
          }
        })
        .commit();
      
      count++;
      if (count % 10 === 0) console.log(`Patched ${count}/${books.length}`);
    } catch (e) {
      console.error(`Failed to patch ${book.title}`, e.message);
    }
  }

  console.log('✅ Successfully applied schema defaults to all books!');
}

main().catch(console.error);