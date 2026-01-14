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

async function updateEthicalHackingPricing() {
  console.log('🔧 Updating Ethical Hacking & Penetration Testing Masterclass pricing and duration...\n');

  const courseId = 'ethical-hacking-penetration-testing';

  try {
    // Get current state
    console.log('📋 Fetching current course state...');
    const existingCourse = await client.fetch(
      `*[_type == "course" && _id == $id][0] {
        _id,
        title,
        price,
        duration,
        priceNGN,
        pricePerMonth,
        pricePerMonthNGN,
        pricePerHour,
        pricePerHourNGN
      }`,
      { id: courseId }
    );

    console.log(`\nCurrent state of "${existingCourse.title}":`);
    console.log(`- Price: $${existingCourse.price || 'N/A'}`);
    console.log(`- Duration: ${existingCourse.duration || 'N/A'}`);
    console.log(`- Price (NGN): ₦${existingCourse.priceNGN || 'N/A'}`);
    console.log(`- Price per month: $${existingCourse.pricePerMonth || 'N/A'}`);
    console.log(`- Price per month (NGN): ₦${existingCourse.pricePerMonthNGN || 'N/A'}`);
    console.log(`- Price per hour: $${existingCourse.pricePerHour || 'N/A'}`);
    console.log(`- Price per hour (NGN): ₦${existingCourse.pricePerHourNGN || 'N/A'}`);

    // Calculate new pricing
    // 20 weeks = ~5 months at $130/month = $650 total
    // NGN: 20 weeks = ~5 months at NGN150k/month = NGN750,000 total
    const updates = {
      duration: '20 Weeks',
      price: 650, // $130/month × 5 months
      priceNGN: 750000, // NGN150k/month × 5 months
      pricePerMonth: 130,
      pricePerMonthNGN: 150000,
      pricePerHour: 32.5,
      pricePerHourNGN: 37500,
    };

    console.log('\n📝 Updating course with new pricing and duration...');
    
    await client
      .patch(courseId)
      .set(updates)
      .commit();

    console.log('✅ Course updated successfully!');
    console.log('\nNew values:');
    console.log(`- Duration: ${updates.duration} (was: 16 Weeks)`);
    console.log(`- Total Price: $${updates.price} (was: $699)`);
    console.log(`- Total Price (NGN): ₦${updates.priceNGN.toLocaleString()}`);
    console.log(`- Price per month: $${updates.pricePerMonth} (was: $100)`);
    console.log(`- Price per month (NGN): ₦${updates.pricePerMonthNGN.toLocaleString()} (was: ₦100,000)`);
    console.log(`- Price per hour: $${updates.pricePerHour} (was: $25)`);
    console.log(`- Price per hour (NGN): ₦${updates.pricePerHourNGN.toLocaleString()} (was: ₦25,000)`);

    // Verify the changes
    console.log('\n🔍 Verifying changes...');
    const updatedCourse = await client.fetch(
      `*[_type == "course" && _id == $id][0] {
        _id,
        title,
        slug,
        price,
        priceNGN,
        duration,
        pricePerMonth,
        pricePerMonthNGN,
        pricePerHour,
        pricePerHourNGN
      }`,
      { id: courseId }
    );

    console.log('\n✅ Verified - Final state:');
    console.log(`Title: ${updatedCourse.title}`);
    console.log(`Duration: ${updatedCourse.duration}`);
    console.log(`Total Price: $${updatedCourse.price} / ₦${updatedCourse.priceNGN?.toLocaleString()}`);
    console.log(`Monthly: $${updatedCourse.pricePerMonth} / ₦${updatedCourse.pricePerMonthNGN?.toLocaleString()}`);
    console.log(`Hourly: $${updatedCourse.pricePerHour} / ₦${updatedCourse.pricePerHourNGN?.toLocaleString()}`);

    console.log('\n✅ Operation completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

updateEthicalHackingPricing().catch(console.error);
