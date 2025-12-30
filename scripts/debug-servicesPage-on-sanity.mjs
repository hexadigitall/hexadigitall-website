// scripts/debug-servicesPage-on-sanity.mjs
// Script to debug why servicesPage is not showing up in Sanity
import path from 'path';
import { fileURLToPath } from 'url';

// Dynamically import the TypeScript client for ESM compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientPath = path.join(__dirname, '../src/sanity/client.ts');

async function getClient() {
  const mod = await import(clientPath + '?ts');
  return mod.client;
}

async function main() {
  try {
    const client = await getClient();
    // 1. List all document types in the dataset
    const types = await client.fetch('array::unique(*[!(_id in path("drafts.**"))]._type)');
    console.log('All document types in dataset:', types);

    // 2. Try to fetch the servicesPage document
    const servicesPage = await client.fetch('*[_type == "servicesPage"][0]');
    if (!servicesPage) {
      console.error('❌ No servicesPage document found!');
    } else {
      console.log('✅ servicesPage document found:', servicesPage);
    }

    // 3. List all documents of type servicesPage (should be 0 or 1)
    const allServicesPages = await client.fetch('*[_type == "servicesPage"]{_id, title, _createdAt, _updatedAt, _rev}');
    console.log('All servicesPage docs:', allServicesPages);

    // 4. Check for draft servicesPage documents
    const draftServicesPages = await client.fetch('*[_id match "drafts.*" && _type == "servicesPage"]{_id, title, _createdAt, _updatedAt, _rev}');
    if (draftServicesPages.length > 0) {
      console.warn('⚠️ Draft servicesPage docs found:', draftServicesPages);
    }

    // 5. Print helpful next steps
    if (!servicesPage) {
      console.log('\nNext steps:');
      console.log('- Create and publish a document of type "servicesPage" in Sanity Studio.');
      console.log('- Make sure it is published (not just a draft).');
      console.log('- If you see a draft, publish it.');
    } else {
      console.log('\nservicesPage is present and should be visible to the frontend.');
    }
  } catch (err) {
    console.error('Error debugging servicesPage:', err);
  }
}

main();
