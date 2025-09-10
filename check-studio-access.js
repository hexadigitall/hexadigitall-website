import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'puzezel0',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-08-30',
  token: process.env.SANITY_API_TOKEN,
});

console.log('🔍 Checking Sanity Studio Access and Permissions...\n');

async function checkStudioAccess() {
  try {
    // Test read permissions
    console.log('📖 Testing read permissions...');
    const courses = await client.fetch('*[_type == "course"][0..2]{_id, title}');
    console.log(`✅ Read access: Found ${courses.length} courses`);
    
    // Test write permissions
    console.log('\n✏️  Testing write permissions...');
    const testDoc = {
      _type: 'course',
      title: 'Test Access Course - DELETE ME',
      slug: { _type: 'slug', current: 'test-access-delete-me' },
      summary: 'This is a test document to verify write access',
    };
    
    const created = await client.create(testDoc);
    console.log(`✅ Write access: Created test document with ID ${created._id}`);
    
    // Clean up test document
    await client.delete(created._id);
    console.log('✅ Cleanup: Test document deleted successfully');
    
    console.log('\n🎉 All permissions are working correctly!');
    console.log('\nIf you still can\'t edit in Studio, check:');
    console.log('1. Are you logged into Sanity Studio with the correct account?');
    console.log('2. Is your browser blocking cookies or JavaScript?');
    console.log('3. Try opening Studio in an incognito/private window');
    console.log('4. Check browser console for any error messages');
    
  } catch (error) {
    console.error('❌ Error checking permissions:', error.message);
    
    if (error.message.includes('Unauthorized')) {
      console.log('\n🔑 Permission Issues Found:');
      console.log('- Your API token might not have write permissions');
      console.log('- Check that you\'re using a token with "Editor" or "Administrator" role');
      console.log('- Generate a new token at: https://sanity.io/manage');
    }
    
    if (error.message.includes('not found')) {
      console.log('\n📋 Project Issues Found:');
      console.log('- Verify your project ID: puzezel0');
      console.log('- Verify your dataset: production');
      console.log('- Check your Sanity project dashboard');
    }
  }
}

async function checkUserInfo() {
  try {
    console.log('\n👤 Checking user information...');
    const userInfo = await client.request({
      uri: '/users/me',
      withCredentials: true,
    });
    console.log(`✅ Logged in as: ${userInfo.displayName} (${userInfo.email})`);
    console.log(`✅ User role: ${userInfo.role}`);
  } catch (error) {
    console.log('❌ Could not fetch user info - you might need to log in to Studio');
    console.log('Visit: http://localhost:3000/studio and log in with your Sanity account');
  }
}

checkStudioAccess().then(() => checkUserInfo());
