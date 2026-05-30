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
  const q = `*[_type in ["book", "imprint", "publication"] && slug.current == "love-is-nothing" && !(_id in path("drafts.**"))][0] {
    resources
  }`;
  
  const book = await client.fetch(q);
  console.log("Resources:", JSON.stringify(book?.resources, null, 2));
}
run();
