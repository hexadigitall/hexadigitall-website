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

async function removeDuplicateAndUpdatePricing() {
  console.log('🔧 Removing duplicate Ethical Hacking course and updating pricing...\n');

  // Course to delete (the newer duplicate)
  const courseToDelete = 'nU0fPQ1qDJT9kNK3rXN5oG';
  
  // Course to keep and update (the older "Masterclass")
  const courseToKeep = 'ethical-hacking-penetration-testing';

  try {
    // First, get the course we're keeping to see its current state
    console.log('📋 Fetching course to keep...');
    const existingCourse = await client.fetch(
      `*[_type == "course" && _id == $id][0]`,
      { id: courseToKeep }
    );

    console.log(`\nCurrent state of "${existingCourse.title}":`);
    console.log(`- Price: $${existingCourse.price || 'N/A'}`);
    console.log(`- Duration: ${existingCourse.duration || 'N/A'}`);
    console.log(`- Difficulty: ${existingCourse.difficulty || 'N/A'}`);

    // Update the kept course with proper pricing and details
    console.log('\n📝 Updating course with proper pricing and details...');
    
    const updates = {
      price: 699, // Standard pricing for advanced cybersecurity courses
      difficulty: 'Intermediate',
      description: 'Learn offensive security with hands-on labs. Master Kali Linux, Metasploit, network scanning, web application testing, and wireless security. This comprehensive masterclass covers the complete penetration testing methodology from planning and reconnaissance to exploitation and reporting.',
    };

    await client
      .patch(courseToKeep)
      .set(updates)
      .commit();

    console.log('✅ Course updated successfully!');
    console.log(`- New Price: $${updates.price}`);
    console.log(`- Difficulty: ${updates.difficulty}`);
    console.log(`- Description updated`);

    // Now delete the duplicate
    console.log(`\n🗑️  Deleting duplicate course (ID: ${courseToDelete})...`);
    
    await client.delete(courseToDelete);
    
    console.log('✅ Duplicate course deleted successfully!');

    // Verify the changes
    console.log('\n🔍 Verifying changes...');
    const updatedCourse = await client.fetch(
      `*[_type == "course" && _id == $id][0] {
        _id,
        title,
        slug,
        price,
        difficulty,
        duration,
        description
      }`,
      { id: courseToKeep }
    );

    console.log('\n✅ Final state of kept course:');
    console.log(`ID: ${updatedCourse._id}`);
    console.log(`Title: ${updatedCourse.title}`);
    console.log(`Slug: ${updatedCourse.slug.current}`);
    console.log(`Price: $${updatedCourse.price}`);
    console.log(`Difficulty: ${updatedCourse.difficulty}`);
    console.log(`Duration: ${updatedCourse.duration}`);
    console.log(`\nDescription:`);
    console.log(updatedCourse.description);

    // Check for remaining ethical hacking courses
    console.log('\n\n📊 Remaining Ethical Hacking courses:');
    const remainingCourses = await client.fetch(
      `*[_type == "course" && title match "*Ethical Hacking*"] {
        _id,
        title,
        slug,
        price
      } | order(title asc)`
    );

    remainingCourses.forEach((course, index) => {
      console.log(`\n${index + 1}. "${course.title}"`);
      console.log(`   ID: ${course._id}`);
      console.log(`   Slug: ${course.slug?.current || 'N/A'}`);
      console.log(`   Price: $${course.price || 'N/A'}`);
    });

    console.log('\n✅ Operation completed successfully!');
    console.log('\n📌 Summary:');
    console.log('- Deleted duplicate: "Ethical Hacking & Penetration Testing"');
    console.log('- Kept and updated: "Ethical Hacking & Penetration Testing Masterclass"');
    console.log('- Updated pricing to $699');
    console.log('- Set difficulty to Intermediate');
    console.log('- Enhanced description');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

removeDuplicateAndUpdatePricing().catch(console.error);
