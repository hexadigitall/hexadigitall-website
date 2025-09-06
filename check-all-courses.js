// Check all courses for price consistency issues
const https = require('https');

// Function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ error: 'Failed to parse response', raw: data });
        }
      });
    });
    req.on('error', reject);
    if (options.method === 'POST' && options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function checkAllCourses() {
  console.log('🔍 Checking all courses for price consistency...\n');
  
  try {
    // First, let's test a few known course IDs by trying different prices
    const testCourses = [
      {
        id: "33fc6abe-ba92-4c0e-beaa-f9d363b0d9f1",
        name: "Project Management Fundamentals",
        testPrices: [5000000, 9000000] // Test both 50k and 90k in kobo
      },
      {
        id: "d3f6b53f-1b1b-4a0b-b10c-1f2e7ee44788", 
        name: "The Lean Startup: Build Your MVP",
        testPrices: [8000000, 10000000, 15000000] // Test different prices
      }
    ];

    for (const course of testCourses) {
      console.log(`\n📚 Testing course: ${course.name}`);
      console.log(`🔑 Course ID: ${course.id}`);
      
      for (const testPrice of course.testPrices) {
        const cartData = {
          [course.id]: {
            id: course.id,
            name: course.name,
            price: testPrice,
            currency: "NGN",
            quantity: 1
          }
        };

        console.log(`\n💰 Testing price: ₦${(testPrice/100).toLocaleString()} (${testPrice} kobo)`);
        
        try {
          const response = await makeRequest('https://hexadigitall.com/api/checkout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(cartData)
          });

          if (response.id) {
            console.log(`✅ SUCCESS: Price ₦${(testPrice/100).toLocaleString()} is correct!`);
            console.log(`🔗 Session ID: ${response.id}`);
            break; // Found correct price, no need to test others
          } else if (response.error) {
            if (response.error.includes('Price mismatch')) {
              console.log(`❌ MISMATCH: ${response.error}`);
              // Extract the expected price from error message
              const match = response.error.match(/Expected: ₦(\d+)/);
              if (match) {
                const expectedPrice = parseInt(match[1]);
                console.log(`💡 Expected price: ₦${expectedPrice.toLocaleString()}`);
              }
            } else {
              console.log(`⚠️  OTHER ERROR: ${response.error}`);
            }
          }
        } catch (error) {
          console.error(`💥 Network error for ${course.name}:`, error.message);
        }
      }
      
      console.log('\n' + '='.repeat(60));
    }

    console.log('\n🎯 SUMMARY:');
    console.log('- Test different prices to find the correct ones for each course');
    console.log('- Look for "SUCCESS" messages to identify correct prices');
    console.log('- Look for "MISMATCH" messages to identify incorrect prices');
    console.log('- Update your Sanity CMS with the correct prices');

  } catch (error) {
    console.error('💥 Script error:', error);
  }
}

checkAllCourses();
