import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  useCdn: false,
});

async function run() {
  const imprints = await client.fetch(`*[_type == "imprint"] { title, slug, level, author, authors, status }`);
  console.log(JSON.stringify(imprints, null, 2));
}
run();
