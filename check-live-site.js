import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'puzezel0',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-08-30',
});

console.log('🌐 Checking live site for course content...\n');

// Your live site URL - update this to your actual domain
const LIVE_SITE_URL = 'https://hexadigitall.vercel.app'; // Update this

async function checkLiveSiteContent() {
  try {
    // First, let's check if we can access the courses page
    const coursesPageResponse = await fetch(`${LIVE_SITE_URL}/courses`);
    
    if (coursesPageResponse.ok) {
      console.log('✅ Live site is accessible');
      
      // Try to get individual course pages
      const courses = await client.fetch('*[_type == "course"]{ title, slug }');
      
      console.log(`\n🔍 Checking ${courses.length} course pages on live site:\n`);
      
      for (const course of courses) {
        if (course.slug?.current) {
          try {
            const courseUrl = `${LIVE_SITE_URL}/courses/${course.slug.current}`;
            const courseResponse = await fetch(courseUrl);
            
            if (courseResponse.ok) {
              const htmlContent = await courseResponse.text();
              
              // Check if the page has substantial content (more than just the title)
              const hasRichContent = htmlContent.length > 5000; // Rough estimate
              const hasDescription = htmlContent.includes('description') || htmlContent.includes('learn');
              
              console.log(`   ${course.title}`);
              console.log(`     URL: ${courseUrl}`);
              console.log(`     Status: ${courseResponse.status}`);
              console.log(`     Content size: ${htmlContent.length} chars`);
              console.log(`     Likely has rich content: ${hasRichContent ? '✅' : '❌'}`);
              console.log('');
              
            } else {
              console.log(`   ${course.title} - ❌ Not found (${courseResponse.status})`);
            }
          } catch (error) {
            console.log(`   ${course.title} - ❌ Error: ${error.message}`);
          }
        }
      }
      
    } else {
      console.log(`❌ Live site not accessible: ${coursesPageResponse.status}`);
      console.log('The live site might be down or the URL might be incorrect.');
      console.log(`Attempted URL: ${LIVE_SITE_URL}`);
    }
    
  } catch (error) {
    console.log(`❌ Error checking live site: ${error.message}`);
    console.log('Make sure the LIVE_SITE_URL is correct in the script.');
  }
}

async function checkForBackups() {
  console.log('\n📁 Checking for any backup files or exports...\n');
  
  // Check if there are any export files or backups in the current directory
  const fs = await import('fs');
  const path = await import('path');
  
  const files = fs.readdirSync('.');
  const backupFiles = files.filter(file => 
    file.includes('backup') || 
    file.includes('export') || 
    file.includes('sanity') && (file.endsWith('.json') || file.endsWith('.ndjson'))
  );
  
  if (backupFiles.length > 0) {
    console.log('📁 Found potential backup files:');
    backupFiles.forEach(file => {
      const stats = fs.statSync(file);
      console.log(`   - ${file} (${Math.round(stats.size/1024)}KB, modified: ${stats.mtime.toLocaleDateString()})`);
    });
  } else {
    console.log('📁 No backup files found in current directory');
  }
}

async function main() {
  await checkLiveSiteContent();
  await checkForBackups();
  
  console.log('\n💡 Recovery Options:');
  console.log('1. If live site has content: We can scrape and reconstruct');
  console.log('2. If backup files exist: We can restore from those');
  console.log('3. Manual recreation: Use the detailed course outlines you provided');
  console.log('4. Check Sanity Studio UI for any revision history');
}

main().catch(console.error);
