// fix-blog-keys.js
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

async function recreateBlogPostsWithKeys() {
  try {
    console.log('🗑️  Recreating blog posts with proper keys...\n');

    // Delete existing blog posts that might have key issues
    const existingPosts = await client.fetch('*[_type == "post"]');
    console.log(`🗑️  Deleting ${existingPosts.length} existing blog posts...`);
    
    for (const post of existingPosts) {
      await client.delete(post._id);
    }

    // Create new blog posts with proper structure
    const newPosts = [
      {
        _type: 'post',
        title: 'Beyond the Code: Why Your Great Idea Needs More Than Just a Website',
        slug: {
          _type: 'slug',
          current: 'beyond-code-great-idea-needs-more-than-website'
        },
        publishedAt: new Date('2024-03-15').toISOString(),
        categories: ['Business Strategy', 'Web Development'],
        body: [
          {
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'You have a brilliant business idea. You can see it clearly: the perfect website, the ideal customer experience, the seamless user journey. But here\'s the thing—having a great idea and a beautiful website is just the beginning.',
                marks: []
              }
            ]
          },
          {
            _type: 'block',
            _key: generateKey(),
            style: 'h2',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'The Reality Check: Ideas Are Just the Starting Point',
                marks: []
              }
            ]
          },
          {
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'Every day, we meet passionate entrepreneurs who come to us with amazing concepts. They\'ve done their research, identified their target market, and have a clear vision of what they want to build. But when we dig deeper, we often discover gaps that could make or break their success.',
                marks: []
              }
            ]
          }
        ]
      },
      {
        _type: 'post',
        title: '10 Essential Cybersecurity Tips for Small Businesses',
        slug: {
          _type: 'slug',
          current: '10-cybersecurity-tips-small-business'
        },
        publishedAt: new Date('2024-01-15').toISOString(),
        categories: ['Cybersecurity', 'Small Business'],
        body: [
          {
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'In today\'s digital landscape, cybersecurity is not just a concern for large corporations. Small businesses are increasingly becoming targets for cybercriminals, often because they have fewer security measures in place.',
                marks: []
              }
            ]
          },
          {
            _type: 'block',
            _key: generateKey(),
            style: 'h2',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'Why Small Businesses Are at Risk',
                marks: []
              }
            ]
          },
          {
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'Cybercriminals often view small businesses as easy targets because they typically have limited IT resources and may not have comprehensive security protocols in place. Here are 10 essential tips to protect your business...',
                marks: []
              }
            ]
          }
        ]
      },
      {
        _type: 'post',
        title: 'Cloud Migration: A Complete Guide for Nigerian Businesses',
        slug: {
          _type: 'slug',
          current: 'cloud-migration-guide-nigerian-businesses'
        },
        publishedAt: new Date('2024-02-20').toISOString(),
        categories: ['Cloud Computing', 'Business Strategy'],
        body: [
          {
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'Cloud migration has become a critical strategy for businesses looking to improve efficiency, reduce costs, and enhance scalability. For Nigerian businesses, the journey to the cloud presents unique opportunities and considerations.',
                marks: []
              }
            ]
          },
          {
            _type: 'block',
            _key: generateKey(),
            style: 'h2',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'Understanding the Nigerian Market Context',
                marks: []
              }
            ]
          },
          {
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'Nigeria\'s rapidly growing digital economy presents both opportunities and challenges for cloud adoption. With improving internet infrastructure and increasing digital literacy, businesses are well-positioned to leverage cloud technologies.',
                marks: []
              }
            ]
          }
        ]
      },
      {
        _type: 'post',
        title: 'The Future of Web Development: Trends to Watch in 2024',
        slug: {
          _type: 'slug',
          current: 'future-web-development-trends-2024'
        },
        publishedAt: new Date('2024-02-01').toISOString(),
        categories: ['Web Development', 'Technology Trends'],
        body: [
          {
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'The web development landscape continues to evolve at a rapid pace. As we move through 2024, several key trends are shaping how we build and interact with web applications.',
                marks: []
              }
            ]
          },
          {
            _type: 'block',
            _key: generateKey(),
            style: 'h2',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'AI-Powered Development Tools',
                marks: []
              }
            ]
          },
          {
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'Artificial intelligence is revolutionizing how developers write code, debug applications, and optimize performance. From AI-assisted coding to automated testing, these tools are becoming indispensable.',
                marks: []
              }
            ]
          }
        ]
      }
    ];

    console.log(`✨ Creating ${newPosts.length} new blog posts with proper keys...`);
    
    for (const post of newPosts) {
      await client.create(post);
      console.log(`✅ Created blog post: ${post.title}`);
    }

    console.log('\n🎉 All blog posts have been recreated with proper keys!');

  } catch (error) {
    console.error('💥 Error recreating blog posts:', error);
    process.exit(1);
  }
}

// Run the recreation
recreateBlogPostsWithKeys();
