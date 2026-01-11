import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2024-01-11',
  token: process.env.SANITY_API_TOKEN,
});

async function checkEthicalHackingCourses() {
  console.log('🔍 Searching for Ethical Hacking courses...\n');

  // Search for courses with similar names
  const query = `*[_type == "course" && title match "*Ethical Hacking*"] {
    _id,
    title,
    slug,
    description,
    price,
    "school": school->name,
    "coverImage": coverImage.asset->url,
    "coverImageRef": coverImage.asset._ref,
    difficulty,
    duration,
    _createdAt,
    _updatedAt
  } | order(title asc)`;

  const courses = await client.fetch(query);

  if (courses.length === 0) {
    console.log('❌ No Ethical Hacking courses found.');
    return;
  }

  console.log(`✅ Found ${courses.length} Ethical Hacking course(s):\n`);

  courses.forEach((course, index) => {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`Course ${index + 1}:`);
    console.log(`${'='.repeat(80)}`);
    console.log(`ID: ${course._id}`);
    console.log(`Title: ${course.title}`);
    console.log(`Slug: ${course.slug?.current || 'N/A'}`);
    console.log(`School: ${course.school || 'N/A'}`);
    console.log(`Price: $${course.price || 'N/A'}`);
    console.log(`Difficulty: ${course.difficulty || 'N/A'}`);
    console.log(`Duration: ${course.duration || 'N/A'}`);
    console.log(`Created: ${course._createdAt}`);
    console.log(`Updated: ${course._updatedAt}`);
    console.log(`Cover Image: ${course.coverImage || 'N/A'}`);
    console.log(`Cover Image Ref: ${course.coverImageRef || 'N/A'}`);
    console.log(`\nDescription (first 200 chars):`);
    console.log(course.description?.substring(0, 200) || 'N/A');
  });

  // Analyze for duplicates
  console.log(`\n\n${'='.repeat(80)}`);
  console.log('ANALYSIS:');
  console.log(`${'='.repeat(80)}`);

  if (courses.length >= 2) {
    const course1 = courses[0];
    const course2 = courses[1];

    console.log('\n📊 Comparison:');
    console.log(`\nCourse 1: "${course1.title}"`);
    console.log(`Course 2: "${course2.title}"`);
    
    const similarities = [];
    const differences = [];

    if (course1.school === course2.school) {
      similarities.push('Same school');
    } else {
      differences.push(`Different schools: ${course1.school} vs ${course2.school}`);
    }

    if (course1.price === course2.price) {
      similarities.push('Same price');
    } else {
      differences.push(`Different prices: $${course1.price} vs $${course2.price}`);
    }

    if (course1.difficulty === course2.difficulty) {
      similarities.push('Same difficulty');
    } else {
      differences.push(`Different difficulty: ${course1.difficulty} vs ${course2.difficulty}`);
    }

    if (course1.description === course2.description) {
      similarities.push('Identical description');
    } else {
      differences.push('Different descriptions');
    }

    console.log('\n✅ Similarities:');
    similarities.forEach(s => console.log(`  - ${s}`));
    
    console.log('\n⚠️  Differences:');
    differences.forEach(d => console.log(`  - ${d}`));

    // Check cover images
    console.log('\n🖼️  Cover Image Status:');
    console.log(`Course 1: ${course1.coverImage ? '✅ Has image' : '❌ No image'}`);
    console.log(`Course 2: ${course2.coverImage ? '✅ Has image' : '❌ No image'}`);

    // Recommendation
    console.log('\n💡 Recommendation:');
    if (similarities.length >= 2 && course1.school === course2.school) {
      console.log('⚠️  These courses appear to be DUPLICATES.');
      
      if (course1.coverImage && !course2.coverImage) {
        console.log(`\n✅ KEEP: "${course1.title}" (ID: ${course1._id})`);
        console.log(`❌ DELETE: "${course2.title}" (ID: ${course2._id})`);
      } else if (!course1.coverImage && course2.coverImage) {
        console.log(`❌ DELETE: "${course1.title}" (ID: ${course1._id})`);
        console.log(`✅ KEEP: "${course2.title}" (ID: ${course2._id})`);
      } else if (course1._createdAt < course2._createdAt) {
        console.log(`✅ KEEP: "${course1.title}" (ID: ${course1._id}) - Created earlier`);
        console.log(`❌ DELETE: "${course2.title}" (ID: ${course2._id})`);
      } else {
        console.log(`✅ KEEP: "${course2.title}" (ID: ${course2._id}) - Created earlier`);
        console.log(`❌ DELETE: "${course1.title}" (ID: ${course1._id})`);
      }
    } else {
      console.log('ℹ️  These courses appear to be DIFFERENT courses.');
      console.log('   Consider updating their titles, descriptions, and pricing to make the differences clearer.');
    }
  }

  return courses;
}

checkEthicalHackingCourses().catch(console.error);
