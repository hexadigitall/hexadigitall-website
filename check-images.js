import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'puzezel0',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-08-30',
  token: process.env.SANITY_API_TOKEN,
});

const course = await client.fetch('*[_type == "course" && defined(mainImage)][0]{title, mainImage}');
console.log('Course with image:', JSON.stringify(course, null, 2));
