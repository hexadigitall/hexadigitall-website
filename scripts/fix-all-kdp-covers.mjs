import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
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

const BOOKS_TO_FIX = [
  {
    slug: 'architecting-landing-zones',
    imageSearchDir: 'public/textbooks/kdp/architecting-landing-zones/covers',
    imagePattern: 'kindle-cover.jpg'
  },
  {
    slug: 'devops-engineering-cloud-infrastructure-core',
    imageSearchDir: 'public/textbooks/kdp/devops-engineering-cloud-infrastructure-core/covers',
    imagePattern: 'kindle-cover.jpg'
  },
  {
    slug: 'dunce-to-midjourney-pro',
    imageSearchDir: 'public/textbooks/kdp/dunce-to-midjourney-pro/covers',
    imagePattern: 'kindle-cover.jpg'
  }
];

async function main() {
  for (const item of BOOKS_TO_FIX) {
    console.log(`\nProcessing: ${item.slug}`);
    
    // Find the book in Sanity
    const book = await client.fetch(`*[_type == "book" && slug.current == "${item.slug}"][0]`);
    if (!book) {
      console.log(`❌ Book not found in Sanity: ${item.slug}`);
      continue;
    }

    // Find the image file
    const searchPath = path.join(__dirname, '..', item.imageSearchDir);
    if (!fs.existsSync(searchPath)) {
      console.log(`❌ Search path does not exist: ${searchPath}`);
      continue;
    }

    const files = fs.readdirSync(searchPath);
    const targetFile = files.find(f => f.toLowerCase().includes('cover') && (f.endsWith('.jpg') || f.endsWith('.png')));
    
    if (!targetFile) {
      console.log(`❌ No cover image found in ${searchPath}`);
      continue;
    }

    const imagePath = path.join(searchPath, targetFile);
    console.log(`Uploading ${imagePath} to Sanity...`);
    
    const imageAsset = await client.assets.upload('image', fs.createReadStream(imagePath), {
      filename: targetFile
    });

    console.log(`Patching book document with asset ${imageAsset._id}...`);
    await client.patch(book._id)
      .set({
        coverImage: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset._id
          }
        }
      })
      .commit();
    
    console.log(`✅ Fixed cover for ${item.slug}`);
  }
}

main().catch(console.error);