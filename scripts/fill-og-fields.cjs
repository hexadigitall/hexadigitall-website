// scripts/fill-og-fields.cjs
// Script to fill ogTitle and ogDescription for all projects in Sanity
// Usage: node scripts/fill-og-fields.cjs

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
  apiVersion: '2023-12-30',
});

async function main() {
  console.log('Token:', process.env.SANITY_API_READ_TOKEN);
  console.log('Project:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
  console.log('Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET);

  // Minimal test: try to update the first project only
  const projects = await client.fetch('*[_type == "project"]{_id, title, description}')
  if (projects.length === 0) {
    console.log('No projects found.');
    return;
  }
  const project = projects[0];
  const ogTitle = project.title ? `Case Study: ${project.title} | Hexadigitall` : 'Case Study | Hexadigitall';
  const ogDescription = project.description || 'Explore this project by Hexadigitall. See how we deliver results for our clients.';
  try {
    const result = await client.patch(project._id)
      .set({ ogTitle, ogDescription })
      .commit();
    console.log(`Updated ${project.title} (${project._id}) successfully.`);
    console.log('Result:', result);
  } catch (err) {
    console.error('Failed to update project:', project._id, err);
    process.exit(1);
  }
  console.log('Minimal patch test complete. If this works, you can re-enable the full update loop.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
