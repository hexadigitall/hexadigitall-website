// import-sample-content.js
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

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

const sampleTestimonials = [
  {
    _type: 'testimonial',
    quote: 'Hexadigitall transformed our business operations with their comprehensive IT solutions. Their team is professional, knowledgeable, and always available when we need support.',
    authorName: 'Adebayo Okafor',
    authorCompany: 'Green Energy Solutions Ltd'
  },
  {
    _type: 'testimonial',
    quote: 'The web application they built for us has streamlined our customer management process significantly. We saw immediate improvements in efficiency and customer satisfaction.',
    authorName: 'Sarah Johnson',
    authorCompany: 'TechStart Nigeria'
  },
  {
    _type: 'testimonial',
    quote: 'Their cybersecurity assessment helped us identify critical vulnerabilities we didn\'t know existed. The implementation of their recommendations has made our systems much more secure.',
    authorName: 'Dr. Emeka Nwankwo',
    authorCompany: 'MedLife Healthcare'
  },
  {
    _type: 'testimonial',
    quote: 'Outstanding digital marketing services! Our online presence has improved dramatically, and we\'ve seen a 300% increase in qualified leads since working with Hexadigitall.',
    authorName: 'Fatima Al-Hassan',
    authorCompany: 'Lagos Fashion Hub'
  }
];

const sampleFAQs = [
  {
    _type: 'faq',
    question: 'What types of businesses do you work with?',
    answer: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'We work with businesses of all sizes, from startups to large enterprises, across various industries including healthcare, finance, retail, education, and more. Our solutions are tailored to meet the specific needs of each client.'
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
        children: [
          {
            _type: 'span',
            text: 'Project timelines vary depending on complexity and scope. Simple websites typically take 1-2 weeks, while complex applications can take 2-6 months. We provide detailed timelines during the project planning phase.'
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
        children: [
          {
            _type: 'span',
            text: 'Yes! We offer various support packages including maintenance, updates, technical support, and system monitoring. All our projects come with an initial support period, and we offer extended support contracts.'
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
        children: [
          {
            _type: 'span',
            text: 'We typically work with a 50% upfront payment and 50% on completion for smaller projects. Larger projects may be divided into milestone-based payments. We accept various payment methods including bank transfers and online payments.'
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
        children: [
          {
            _type: 'span',
            text: 'Absolutely! We specialize in integrating with existing systems and infrastructure. We conduct thorough assessments to ensure seamless integration and minimal disruption to your current operations.'
          }
        ]
      }
    ],
    category: 'technical'
  }
];

const samplePosts = [
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
        children: [
          {
            _type: 'span',
            text: 'In today\'s digital landscape, cybersecurity is not just a concern for large corporations. Small businesses are increasingly becoming targets for cybercriminals. Here are 10 essential tips to protect your business...'
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
        children: [
          {
            _type: 'span',
            text: 'The web development landscape continues to evolve at a rapid pace. As we move through 2024, several key trends are shaping how we build and interact with web applications...'
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
        children: [
          {
            _type: 'span',
            text: 'Cloud migration has become a critical strategy for businesses looking to improve efficiency, reduce costs, and enhance scalability. For Nigerian businesses, the journey to the cloud presents unique opportunities and considerations...'
          }
        ]
      }
    ]
  }
];

const sampleProjects = [
  {
    _type: 'project',
    title: 'E-commerce Platform for Fashion Retailer',
    slug: {
      _type: 'slug',
      current: 'fashion-ecommerce-platform'
    },
    industry: 'Retail & Fashion',
    description: 'A comprehensive e-commerce solution with inventory management, payment processing, and customer analytics.'
  },
  {
    _type: 'project',
    title: 'Hospital Management System',
    slug: {
      _type: 'slug',
      current: 'hospital-management-system'
    },
    industry: 'Healthcare',
    description: 'Complete patient management system with appointment scheduling, medical records, and billing integration.'
  },
  {
    _type: 'project',
    title: 'Fintech Mobile Application',
    slug: {
      _type: 'slug',
      current: 'fintech-mobile-app'
    },
    industry: 'Financial Services',
    description: 'Mobile banking application with secure transactions, budgeting tools, and financial analytics.'
  }
];

async function importSampleContent() {
  try {
    console.log('🚀 Starting import of sample content...');

    // Import testimonials
    console.log('\n📝 Importing testimonials...');
    for (const testimonial of sampleTestimonials) {
      try {
        await client.create(testimonial);
        console.log(`✨ Created testimonial by ${testimonial.authorName}`);
      } catch (error) {
        console.error(`❌ Error creating testimonial: ${error.message}`);
      }
    }

    // Import FAQs
    console.log('\n❓ Importing FAQs...');
    for (const faq of sampleFAQs) {
      try {
        await client.create(faq);
        console.log(`✨ Created FAQ: ${faq.question.substring(0, 50)}...`);
      } catch (error) {
        console.error(`❌ Error creating FAQ: ${error.message}`);
      }
    }

    // Import blog posts
    console.log('\n📰 Importing blog posts...');
    for (const post of samplePosts) {
      try {
        await client.create(post);
        console.log(`✨ Created blog post: ${post.title}`);
      } catch (error) {
        console.error(`❌ Error creating blog post: ${error.message}`);
      }
    }

    // Import portfolio projects
    console.log('\n💼 Importing portfolio projects...');
    for (const project of sampleProjects) {
      try {
        await client.create(project);
        console.log(`✨ Created project: ${project.title}`);
      } catch (error) {
        console.error(`❌ Error creating project: ${error.message}`);
      }
    }

    console.log('\n✅ Sample content import completed!');
    console.log('🎉 Your Sanity studio now has sample content for all sections!');
    console.log('   Visit: http://localhost:3000/studio to see everything');

  } catch (error) {
    console.error('💥 Import failed:', error);
    process.exit(1);
  }
}

// Run the import
importSampleContent();
