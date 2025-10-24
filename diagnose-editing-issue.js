import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'puzezel0',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-08-30',
  token: process.env.SANITY_API_TOKEN,
});

console.log('🔍 Diagnosing Sanity Studio Editing Issues...\n');

async function checkDocumentStructure() {
  console.log('📋 Checking document structure and permissions...\n');
  
  try {
    // Get one course with full details
    const course = await client.fetch('*[_type == "course"][0]');
    
    if (!course) {
      console.log('❌ No courses found');
      return;
    }
    
    console.log('📚 Sample Course Analysis:');
    console.log(`Title: ${course.title}`);
    console.log(`ID: ${course._id}`);
    console.log(`Type: ${course._type}`);
    console.log(`Created: ${course._createdAt}`);
    console.log(`Updated: ${course._updatedAt}`);
    console.log(`Revision: ${course._rev}`);
    
    // Check body structure
    console.log('\n📄 Body Content Structure:');
    if (course.body) {
      console.log(`Body array length: ${course.body.length}`);
      console.log('First few blocks:');
      course.body.slice(0, 3).forEach((block, index) => {
        console.log(`  Block ${index + 1}:`);
        console.log(`    _key: ${block._key || 'MISSING!'}`);
        console.log(`    _type: ${block._type}`);
        console.log(`    style: ${block.style || 'normal'}`);
        if (block.children && block.children[0]) {
          console.log(`    text: "${block.children[0].text?.substring(0, 50)}..."`);
          console.log(`    child _key: ${block.children[0]._key || 'MISSING!'}`);
        }
      });
    } else {
      console.log('❌ No body content found');
    }
    
    // Check if document is locked or has special properties
    console.log('\n🔒 Document Permissions Check:');
    console.log(`Document is published: ${!course._id.startsWith('draft.')}`);
    console.log(`Has draft version: ${await checkForDraft(course._id)}`);
    
  } catch (error) {
    console.error('❌ Error checking document:', error.message);
  }
}

async function checkForDraft(documentId) {
  try {
    const draftId = documentId.startsWith('draft.') ? documentId : `draft.${documentId}`;
    const draft = await client.fetch('*[_id == $draftId][0]', { draftId });
    return !!draft;
  } catch {
    return false;
  }
}

async function testCreateAndEdit() {
  console.log('\n🧪 Testing document creation and editing...\n');
  
  try {
    // Create a simple test document
    console.log('Creating test document...');
    const testDoc = {
      _type: 'course',
      title: 'TEST COURSE - DELETE ME',
      slug: { _type: 'slug', current: 'test-delete-me' },
      summary: 'This is a test document',
      body: [
        {
          _key: `test-block-${Date.now()}`,
          _type: 'block',
          style: 'normal',
          children: [{
            _key: `test-span-${Date.now()}`,
            _type: 'span',
            text: 'This is a test paragraph that should be editable.',
            marks: []
          }],
          markDefs: []
        }
      ]
    };
    
    const created = await client.create(testDoc);
    console.log(`✅ Created test document: ${created._id}`);
    
    // Try to update it
    console.log('Testing document update...');
  await client.patch(created._id).set({ title: 'UPDATED TEST COURSE' }).commit();
  console.log(`✅ Updated document successfully`);
    
    // Clean up
    await client.delete(created._id);
    console.log('✅ Test document deleted');
    
    console.log('\n✅ Create/Edit operations work correctly via API');
    
  } catch (error) {
    console.error('❌ Error in create/edit test:', error.message);
  }
}

async function checkStudioSpecificIssues() {
  console.log('\n🎛️  Checking Studio-specific issues...\n');
  
  // Check if there are any validation errors or schema issues
  try {
    const courses = await client.fetch('*[_type == "course"]{_id, title, _updatedAt}');
    console.log(`Found ${courses.length} courses in database`);
    
    // Check for any documents that might be corrupted
    const problemCourses = await client.fetch(`
      *[_type == "course" && (!defined(body) || !defined(title) || !defined(_id))]
    `);
    
    if (problemCourses.length > 0) {
      console.log(`⚠️  Found ${problemCourses.length} courses with missing required fields`);
    } else {
      console.log('✅ All courses have required fields');
    }
    
  } catch (error) {
    console.error('❌ Error checking courses:', error.message);
  }
}

async function suggestSolutions() {
  console.log('\n💡 Potential Solutions:\n');
  
  console.log('1. 🔄 Browser/Studio Issues:');
  console.log('   - Hard refresh Studio: Ctrl+F5 or Cmd+Shift+R');
  console.log('   - Clear browser cache and cookies');
  console.log('   - Try incognito/private browsing mode');
  console.log('   - Try a different browser');
  
  console.log('\n2. 👤 Authentication Issues:');
  console.log('   - Make sure you\'re signed into Studio with the right account');
  console.log('   - Check your user role at: https://sanity.io/manage/project/puzezel0');
  console.log('   - Try signing out and back in');
  
  console.log('\n3. 🔧 Studio Configuration:');
  console.log('   - Restart your dev server (npm run dev)');
  console.log('   - Check for JavaScript errors in browser console');
  console.log('   - Verify Studio is accessible at the correct URL');
  
  console.log('\n4. 📋 Document Issues:');
  console.log('   - Try editing a different course');
  console.log('   - Try creating a new course manually in Studio');
  console.log('   - Check if the issue affects all fields or just specific ones');
  
  console.log('\n5. 🌐 Network/CDN Issues:');
  console.log('   - Check internet connection');
  console.log('   - Try accessing Studio from a different network');
  console.log('   - Check if Sanity services are down');
}

async function main() {
  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ SANITY_API_TOKEN environment variable is required');
    process.exit(1);
  }

  await checkDocumentStructure();
  await testCreateAndEdit();
  await checkStudioSpecificIssues();
  await suggestSolutions();
  
  console.log('\n🔍 Diagnosis complete. Please try the suggested solutions above.');
}

main().catch(console.error);
