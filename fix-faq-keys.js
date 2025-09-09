// fix-faq-keys.js
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import crypto from 'crypto';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-08-30',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// Generate a random key for Sanity
function generateKey() {
  return crypto.randomBytes(6).toString('hex');
}

// Fix portable text structure by adding missing keys
function fixPortableTextStructure(content) {
  if (Array.isArray(content)) {
    return content.map(block => {
      if (block._type === 'block') {
        return {
          ...block,
          _key: block._key || generateKey(),
          children: block.children?.map(child => ({
            ...child,
            _key: child._key || generateKey()
          })) || []
        };
      }
      return {
        ...block,
        _key: block._key || generateKey()
      };
    });
  }
  return content;
}

async function fixFAQKeys() {
  try {
    console.log('🔧 Fixing FAQ keys...\n');

    // Get all FAQs
    const faqs = await client.fetch('*[_type == "faq"]');
    console.log(`📋 Found ${faqs.length} FAQs to fix`);

    let fixed = 0;

    for (const faq of faqs) {
      try {
        // Check if answer needs fixing
        const needsFixing = faq.answer && Array.isArray(faq.answer) && 
          faq.answer.some(block => !block._key || (block.children && block.children.some(child => !child._key)));

        if (needsFixing) {
          console.log(`🔄 Fixing FAQ: ${faq.question.substring(0, 50)}...`);
          
          // Fix the answer structure
          const fixedAnswer = fixPortableTextStructure(faq.answer);

          // Update the FAQ
          await client
            .patch(faq._id)
            .set({ answer: fixedAnswer })
            .commit();

          fixed++;
        } else {
          console.log(`✅ FAQ already has keys: ${faq.question.substring(0, 50)}...`);
        }

      } catch (error) {
        console.error(`❌ Error fixing FAQ ${faq.question}: ${error.message}`);
      }
    }

    console.log(`\n✅ Fixed ${fixed} FAQs with missing keys`);
    console.log(`📋 Total FAQs: ${faqs.length}`);
    console.log('\n🎉 All FAQ keys have been fixed! You should now be able to edit them in Sanity Studio.');

  } catch (error) {
    console.error('💥 Error fixing FAQ keys:', error);
    process.exit(1);
  }
}

// Alternative: Delete and recreate FAQs with proper structure
async function recreateFAQsWithKeys() {
  try {
    console.log('🗑️  Recreating FAQs with proper keys...\n');

    // Delete existing FAQs
    const existingFAQs = await client.fetch('*[_type == "faq"]');
    console.log(`🗑️  Deleting ${existingFAQs.length} existing FAQs...`);
    
    for (const faq of existingFAQs) {
      await client.delete(faq._id);
    }

    // Create new FAQs with proper structure
    const newFAQs = [
      {
        _type: 'faq',
        question: 'What types of businesses do you work with?',
        answer: [
          {
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'We work with businesses of all sizes, from startups to large enterprises, across various industries including healthcare, finance, retail, education, and more. Our solutions are tailored to meet the specific needs of each client.',
                marks: []
              }
            ]
          }
        ],
        category: 'general'
      },
      {
        _type: 'faq',
        question: 'How long does a typical project take?',
        answer: [
          {
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'Project timelines vary depending on complexity and scope. Simple websites typically take 1-2 weeks, while complex applications can take 2-6 months. We provide detailed timelines during the project planning phase.',
                marks: []
              }
            ]
          }
        ],
        category: 'general'
      },
      {
        _type: 'faq',
        question: 'Do you provide ongoing support after project completion?',
        answer: [
          {
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'Yes! We offer various support packages including maintenance, updates, technical support, and system monitoring. All our projects come with an initial support period, and we offer extended support contracts.',
                marks: []
              }
            ]
          }
        ],
        category: 'support'
      },
      {
        _type: 'faq',
        question: 'What are your payment terms?',
        answer: [
          {
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'We typically work with a 50% upfront payment and 50% on completion for smaller projects. Larger projects may be divided into milestone-based payments. We accept various payment methods including bank transfers and online payments.',
                marks: []
              }
            ]
          }
        ],
        category: 'billing'
      },
      {
        _type: 'faq',
        question: 'Can you work with our existing IT infrastructure?',
        answer: [
          {
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'Absolutely! We specialize in integrating with existing systems and infrastructure. We conduct thorough assessments to ensure seamless integration and minimal disruption to your current operations.',
                marks: []
              }
            ]
          }
        ],
        category: 'technical'
      },
      {
        _type: 'faq',
        question: 'What makes Hexadigitall different from other agencies?',
        answer: [
          {
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'We offer a holistic approach that combines business planning, technical development, and marketing strategy. Unlike agencies that focus on just one area, we help you succeed across all aspects of your digital journey.',
                marks: []
              }
            ]
          }
        ],
        category: 'general'
      }
    ];

    console.log(`✨ Creating ${newFAQs.length} new FAQs with proper keys...`);
    
    for (const faq of newFAQs) {
      await client.create(faq);
      console.log(`✅ Created FAQ: ${faq.question}`);
    }

    console.log('\n🎉 All FAQs have been recreated with proper keys!');

  } catch (error) {
    console.error('💥 Error recreating FAQs:', error);
    process.exit(1);
  }
}

// Check command line arguments
const action = process.argv[2];

if (action === 'recreate') {
  recreateFAQsWithKeys();
} else {
  fixFAQKeys();
}
