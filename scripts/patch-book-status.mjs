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
  const books = await client.fetch(`*[_type == "book"]{_id, title, slug, status, coverImage}`);
  console.log(`Found ${books.length} books in Sanity.`);
  
  for (const book of books) {
    if (book.coverImage) {
      console.log(`- ${book.title} (Slug: ${book.slug?.current}) [Status: ${book.status}] - HAS COVER`);
    } else {
      console.log(`- ${book.title} (Slug: ${book.slug?.current}) [Status: ${book.status}]`);
    }
  }

  // Find the three books that have covers (or are likely the uploaded ones)
  const uploadedBooks = books.filter(b => b.coverImage || b.slug?.current.includes('dunce'));
  
  for (const book of uploadedBooks) {
    if (book.status !== 'available') {
      console.log(`Patching ${book.title} to available...`);
      await client.patch(book._id).set({ status: 'available' }).commit();
      console.log(`✅ Patched ${book.title}`);
    }
  }
}

main().catch(console.error);