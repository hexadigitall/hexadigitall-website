import { client } from './src/sanity/client.ts';
import { groq } from 'next-sanity';

const servicesQuery = groq`*[_type == "service"] | order(title asc) {
  _id,
  title,
  slug,
  overview[0...100]
}`;

const courseCategoriesQuery = groq`*[_type == "courseCategory"] | order(title asc) {
  _id,
  title,
  description,
  "courses": *[_type == "course" && references(^._id)] | order(title asc) {
    _id,
    title,
    slug,
    summary[0...100]
  }
}`;

try {
  const [services, categories] = await Promise.all([
    client.fetch(servicesQuery),
    client.fetch(courseCategoriesQuery)
  ]);
  
  console.log(JSON.stringify({ services, categories }, null, 2));
} catch (err) {
  console.error('Error:', err.message);
}
