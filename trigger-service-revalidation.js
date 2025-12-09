// Script to manually trigger revalidation for all service category pages
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'puzezel0',
  dataset: 'production',
  apiVersion: '2024-08-30',
  useCdn: false,
  token: 'skEBJFljYzhStVjWECsCT2qQJSF1cspN7iMECxIWU05Cm6MQCbwWEEu26IXmEUFSUaZKZlVLrq8pplCzx9J4oCPucECW8oesQ4ZYG2dGeUyEPnJfL04wCcKbIPXVbcGHaZq2DhkqeICpCKbX7Mml7dtX3rSjy4gmqGpedyPSDVrrefBUvltT'
});

const REVALIDATE_SECRET = '5u/XgPtEswqMDXhGg8cS4Q2h3TiPhF37mXDzeluwIjw=';
const SITE_URL = 'https://hexadigitall.com';

async function triggerRevalidation() {
  console.log('🔄 Fetching all service categories from Sanity...\n');
  
  const categories = await client.fetch(`*[_type == 'serviceCategory'] {
    _id,
    title,
    slug
  }`);
  
  console.log(`Found ${categories.length} service categories\n`);
  
  for (const category of categories) {
    console.log(`📦 Revalidating: ${category.title} (${category.slug.current})`);
    
    try {
      const response = await fetch(
        `${SITE_URL}/api/revalidate?secret=${encodeURIComponent(REVALIDATE_SECRET)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            _type: 'serviceCategory',
            slug: category.slug
          })
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ Success: ${JSON.stringify(data)}`);
      } else {
        console.log(`   ❌ Failed: ${response.status} ${response.statusText}`);
        const text = await response.text();
        console.log(`   Response: ${text}`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n✨ Revalidation complete!');
  console.log('🌐 Check your service pages, they should now show the latest data');
}

triggerRevalidation().catch(console.error);
