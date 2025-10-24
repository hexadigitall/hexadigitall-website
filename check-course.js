/* eslint-disable @typescript-eslint/no-require-imports */
const { client } = require('./src/sanity/client');
const { groq } = require('next-sanity');

async function checkCourse() {
  try {
    const course = await client.fetch(
      groq`*[_type == "course" && _id == "33fc6abe-ba92-4c0e-beaa-f9d363b0d9f1"][0]{_id, title, price}`
    );
    console.log('📚 Course from Sanity:', course);
    
    if (course) {
      console.log(`💰 Price: ₦${course.price.toLocaleString()}`);
      console.log(`💰 Price in kobo: ${course.price * 100}`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkCourse();
