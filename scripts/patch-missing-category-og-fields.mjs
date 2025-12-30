import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_UPDATE_TOKEN,
  useCdn: false,
  apiVersion: '2023-12-30',
});

const PATCHES = [
  {
    title: 'Business Planning & Branding',
    ogTitle: 'Business Planning & Branding | Hexadigitall',
    ogDescription: 'Unlock your business potential with expert planning, branding, and growth strategies from Hexadigitall.'
  },
  {
    title: 'Mentoring & Consulting',
    ogTitle: 'Mentoring & Consulting | Hexadigitall',
    ogDescription: 'Accelerate your career and business with professional mentoring and consulting services from Hexadigitall.'
  },
  {
    title: 'Profile & Portfolio Building',
    ogTitle: 'Profile & Portfolio Building | Hexadigitall',
    ogDescription: 'Build a standout profile and portfolio to showcase your skills and achievements with Hexadigitall.'
  },
  {
    title: 'Digital Marketing & Growth',
    ogTitle: 'Digital Marketing & Growth | Hexadigitall',
    ogDescription: 'Drive digital growth and marketing success with proven strategies and solutions from Hexadigitall.'
  },
  {
    title: 'Web & Mobile Development',
    ogTitle: 'Web & Mobile Development | Hexadigitall',
    ogDescription: 'Transform your ideas into powerful web and mobile solutions with Hexadigitall development services.'
  }
];

async function patchMissingCategoryOgFields() {
  for (const patch of PATCHES) {
    const cat = await client.fetch(`*[_type == 'serviceCategory' && title == $title][0]{_id}`, { title: patch.title });
    if (!cat || !cat._id) {
      console.warn(`Category not found: ${patch.title}`);
      continue;
    }
    try {
      await client.patch(cat._id)
        .set({ ogTitle: patch.ogTitle, ogDescription: patch.ogDescription })
        .commit();
      console.log(`Patched [${patch.title}] with ogTitle and ogDescription.`);
    } catch (err) {
      console.error(`Failed to patch [${patch.title}]:`, err.message);
    }
  }
}

patchMissingCategoryOgFields().catch(console.error);
