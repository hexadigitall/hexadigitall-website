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
  const q = `*[_type == "author" && name == "FVMMD"][0] { _id, name, slug }`;
  const author = await client.fetch(q);
  console.log("Author:", JSON.stringify(author, null, 2));
}
run();
