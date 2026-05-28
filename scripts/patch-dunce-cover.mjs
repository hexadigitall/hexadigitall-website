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

async function main() {
  const slug = 'dunce-to-midjourney-pro';
  
  // Find the book
  const book = await client.fetch(`*[_type == "book" && slug.current == "${slug}"][0]`);
  if (!book) {
    console.error('Book not found!');
    return;
  }

  // Target image file
  const imagePath = path.join(__dirname, '..', 'public', 'textbooks', 'kdp', 'dunce-to-midjourney-pro', 'covers', 'dunce-to-midjourney-pro-kindle-cover.jpg');
  
  if (!fs.existsSync(imagePath)) {
    console.error('Image not found at path:', imagePath);
    return;
  }

  console.log(`Uploading ${imagePath} to Sanity...`);
  
  // Upload image
  const imageAsset = await client.assets.upload('image', fs.createReadStream(imagePath), {
    filename: path.basename(imagePath)
  });

  console.log('Image uploaded. Asset ID:', imageAsset._id);

  console.log('Patching book document...');
  // Update book
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

  console.log('✅ Successfully updated Dunce to Midjourney Pro cover image!');
}

main().catch(console.error);