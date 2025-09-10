import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'puzezel0',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-08-30',
  token: process.env.SANITY_API_TOKEN,
});

console.log('🔄 Complete Course Restoration Script');
console.log('This will DELETE all current courses and categories and recreate them with rich content\n');

// Rich course content definitions
const courseCategories = [
  {
    title: 'Web & Mobile Development',
    slug: 'web-mobile-development',
    description: 'Master modern web and mobile app development with hands-on projects and industry-standard tools.',
    order: 1
  },
  {
    title: 'Business & Entrepreneurship',
    slug: 'business-entrepreneurship',
    description: 'Learn essential business skills, project management, and entrepreneurial strategies for success.',
    order: 2
  },
  {
    title: 'Digital Marketing & SEO',
    slug: 'digital-marketing-seo',
    description: 'Drive traffic, improve search rankings, and master digital marketing strategies that convert.',
    order: 3
  },
  {
    title: 'Data & Analytics',
    slug: 'data-analytics',
    description: 'Unlock insights from data with Python, analytics tools, and data-driven decision making.',
    order: 4
  },
  {
    title: 'Cybersecurity & Certification',
    slug: 'cybersecurity-certification',
    description: 'Protect systems, earn industry certifications, and build a career in cybersecurity.',
    order: 5
  },
  {
    title: 'Foundational Tech Skills',
    slug: 'foundational-tech-skills',
    description: 'Master the essential tools and skills every developer needs to succeed in tech.',
    order: 6
  }
];

const courses = [
  // Web & Mobile Development
  {
    title: 'Web Development Bootcamp: From Zero to Hero',
    slug: 'web-development-bootcamp',
    categorySlug: 'web-mobile-development',
    summary: 'A comprehensive bootcamp covering HTML, CSS, JavaScript, React, Node.js, and database integration. Build real-world projects and deploy them live.',
    price: 199,
    duration: '12 weeks',
    level: 'Beginner to Intermediate',
    featured: true,
    image: {
      alt: 'Web Development Bootcamp course illustration'
    },
    body: [
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Transform yourself from a complete beginner to a job-ready web developer in just 12 weeks. This comprehensive bootcamp covers everything you need to know to build modern, responsive websites and web applications.'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'What You\'ll Learn'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'HTML5 & CSS3 fundamentals and advanced techniques'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'JavaScript ES6+ and modern programming concepts'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'React.js for building interactive user interfaces'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Node.js and Express.js for server-side development'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'MongoDB and database design principles'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Git version control and GitHub workflows'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Responsive design and mobile-first development'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'API integration and RESTful services'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Deployment strategies with Netlify and Heroku'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'Course Projects'
        }]
      },
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Build 5+ real-world projects including:'
        }]
      },
      {
        _type: 'block',
        listItem: 'number',
        children: [{
          _type: 'span',
          text: 'Personal Portfolio Website - Showcase your skills with a stunning, responsive portfolio'
        }]
      },
      {
        _type: 'block',
        listItem: 'number',
        children: [{
          _type: 'span',
          text: 'E-commerce Store - Full-stack online store with payment integration'
        }]
      },
      {
        _type: 'block',
        listItem: 'number',
        children: [{
          _type: 'span',
          text: 'Social Media Dashboard - Real-time data visualization and user management'
        }]
      },
      {
        _type: 'block',
        listItem: 'number',
        children: [{
          _type: 'span',
          text: 'Task Management App - Complete CRUD application with user authentication'
        }]
      },
      {
        _type: 'block',
        listItem: 'number',
        children: [{
          _type: 'span',
          text: 'Weather App - API integration with geolocation services'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'Career Support'
        }]
      },
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'This bootcamp includes comprehensive career support to help you land your first developer job:'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Resume and portfolio review sessions'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Mock technical interviews and coding challenges'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Job search strategies and networking tips'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Access to our exclusive job board and hiring partners'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Lifetime access to course materials and community'
        }]
      }
    ]
  },
  {
    title: 'React Native: Build Mobile Apps for iOS & Android',
    slug: 'react-native-mobile-apps',
    categorySlug: 'web-mobile-development',
    summary: 'Learn to build native mobile applications for both iOS and Android using React Native. Includes app store deployment and best practices.',
    price: 149,
    duration: '8 weeks',
    level: 'Intermediate',
    featured: true,
    image: {
      alt: 'React Native mobile development course'
    },
    body: [
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Master React Native and build professional mobile applications that run on both iOS and Android. Learn from industry experts and build real apps that you can publish to app stores.'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'Course Curriculum'
        }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{
          _type: 'span',
          text: 'Module 1: React Native Fundamentals'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Setting up React Native development environment'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Understanding React Native components and JSX'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Styling with Flexbox and StyleSheet'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Handling user input and events'
        }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{
          _type: 'span',
          text: 'Module 2: Navigation and State Management'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'React Navigation for screen transitions'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'State management with Redux and Context API'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Async storage and data persistence'
        }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{
          _type: 'span',
          text: 'Module 3: Native Features and APIs'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Camera, GPS, and device sensors'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Push notifications and background tasks'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Integrating third-party libraries'
        }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{
          _type: 'span',
          text: 'Module 4: Performance and Deployment'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Performance optimization techniques'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Testing React Native applications'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Publishing to App Store and Google Play'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'Build Real Apps'
        }]
      },
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Throughout the course, you\'ll build three complete mobile applications:'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Instagram Clone - Photo sharing app with user authentication'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Expense Tracker - Personal finance management with charts'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Real-time Chat App - Messaging with push notifications'
        }]
      }
    ]
  },

  // Business & Entrepreneurship
  {
    title: 'Project Management Fundamentals',
    slug: 'project-management-fundamentals',
    categorySlug: 'business-entrepreneurship',
    summary: 'Master project management methodologies, tools, and techniques. Learn Agile, Scrum, and traditional project management approaches.',
    price: 99,
    duration: '6 weeks',
    level: 'Beginner',
    featured: false,
    image: {
      alt: 'Project management course illustration'
    },
    body: [
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Learn the essential skills to successfully plan, execute, and deliver projects on time and within budget. This course covers both traditional and agile project management methodologies.'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'What You\'ll Master'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Project initiation and planning techniques'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Stakeholder management and communication'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Risk assessment and mitigation strategies'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Agile and Scrum methodologies'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Project monitoring and control'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Quality management and continuous improvement'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'Tools and Templates'
        }]
      },
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Get hands-on experience with industry-standard tools and receive ready-to-use templates:'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Microsoft Project and Asana'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Gantt charts and work breakdown structures'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Project charter and scope documents'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Risk registers and communication plans'
        }]
      }
    ]
  },
  {
    title: 'The Lean Startup: Build Your MVP',
    slug: 'lean-startup-mvp',
    categorySlug: 'business-entrepreneurship',
    summary: 'Learn how to validate business ideas quickly and build minimum viable products. Apply lean startup methodology to reduce risk and accelerate learning.',
    price: 129,
    duration: '4 weeks',
    level: 'Beginner to Intermediate',
    featured: true,
    image: {
      alt: 'Lean startup methodology course'
    },
    body: [
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Master the lean startup methodology and learn how to build successful businesses by testing ideas quickly, learning from customers, and iterating based on feedback.'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'The Lean Startup Process'
        }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{
          _type: 'span',
          text: '1. Build-Measure-Learn Cycle'
        }]
      },
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Understand how to rapidly test business hypotheses and learn from real customer feedback.'
        }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{
          _type: 'span',
          text: '2. Minimum Viable Product (MVP)'
        }]
      },
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Learn how to identify the core features needed to test your value proposition and build an MVP that validates your assumptions.'
        }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{
          _type: 'span',
          text: '3. Validated Learning'
        }]
      },
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Master techniques for measuring what matters and making data-driven decisions about your product development.'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'Real-World Application'
        }]
      },
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Work through practical exercises and case studies:'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Identify and validate your value proposition'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Design experiments to test key assumptions'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Build and launch your MVP'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Measure customer behavior and feedback'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Pivot or persevere based on data'
        }]
      }
    ]
  },
  {
    title: 'Digital Marketing for Small Businesses',
    slug: 'digital-marketing-small-business',
    categorySlug: 'business-entrepreneurship',
    summary: 'Complete digital marketing strategy for small businesses. Learn social media marketing, email campaigns, content marketing, and lead generation.',
    price: 119,
    duration: '8 weeks',
    level: 'Beginner',
    featured: false,
    image: {
      alt: 'Digital marketing for small businesses'
    },
    body: [
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Transform your small business with proven digital marketing strategies. Learn how to attract, engage, and convert customers online with practical, budget-friendly techniques.'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'Marketing Channels You\'ll Master'
        }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{
          _type: 'span',
          text: 'Social Media Marketing'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Facebook and Instagram advertising strategies'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'LinkedIn marketing for B2B businesses'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Content creation and community building'
        }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{
          _type: 'span',
          text: 'Email Marketing'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Building and segmenting email lists'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Creating high-converting email campaigns'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Automation and drip sequences'
        }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{
          _type: 'span',
          text: 'Content Marketing'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Blog content that drives traffic'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Video marketing and YouTube optimization'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Lead magnets and content upgrades'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'Practical Tools and Templates'
        }]
      },
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Get access to the same tools and templates used by successful small businesses:'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Content calendar templates'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Email marketing templates'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Social media post templates'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Marketing budget calculators'
        }]
      }
    ]
  },

  // Digital Marketing & SEO
  {
    title: 'Advanced SEO: Rank #1 on Google',
    slug: 'advanced-seo-google-ranking',
    categorySlug: 'digital-marketing-seo',
    summary: 'Master advanced SEO techniques to dominate search results. Learn technical SEO, content optimization, link building, and local SEO strategies.',
    price: 179,
    duration: '10 weeks',
    level: 'Intermediate to Advanced',
    featured: true,
    image: {
      alt: 'Advanced SEO course for Google rankings'
    },
    body: [
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Master the advanced SEO strategies used by top-ranking websites. Learn the latest techniques to outrank your competitors and drive massive organic traffic to your site.'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'Advanced SEO Strategies'
        }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{
          _type: 'span',
          text: 'Technical SEO Mastery'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Core Web Vitals optimization and page speed'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Mobile-first indexing and responsive design'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Structured data and schema markup'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'XML sitemaps and robots.txt optimization'
        }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{
          _type: 'span',
          text: 'Content Optimization'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Semantic SEO and entity optimization'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Topic clustering and content hubs'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Featured snippets and SERP features'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Content gap analysis and competitor research'
        }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{
          _type: 'span',
          text: 'Authority Building'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Advanced link building strategies'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Digital PR and brand mention campaigns'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Local SEO and Google My Business optimization'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'SEO Tools & Analytics'
        }]
      },
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Master professional SEO tools and learn to analyze data like an expert:'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Google Search Console advanced features'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'SEMrush, Ahrefs, and Screaming Frog'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Rank tracking and competitive analysis'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'ROI measurement and reporting'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'Case Studies & Real Results'
        }]
      },
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Learn from real case studies where we\'ve achieved #1 rankings:'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'E-commerce site: 500% increase in organic traffic'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Local business: Dominated local search results'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'SaaS company: Ranked for high-competition keywords'
        }]
      }
    ]
  },

  // Data & Analytics
  {
    title: 'Data Analysis with Python',
    slug: 'data-analysis-python',
    categorySlug: 'data-analytics',
    summary: 'Learn data analysis and visualization using Python, pandas, NumPy, and matplotlib. Work with real datasets and create insightful reports.',
    price: 159,
    duration: '10 weeks',
    level: 'Beginner to Intermediate',
    featured: true,
    image: {
      alt: 'Python data analysis course'
    },
    body: [
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Master data analysis with Python and transform raw data into actionable insights. Learn the essential tools and techniques used by data analysts at top companies.'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'Python for Data Analysis'
        }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{
          _type: 'span',
          text: 'Core Libraries'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'NumPy for numerical computing'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Pandas for data manipulation and analysis'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Matplotlib and Seaborn for data visualization'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Jupyter Notebooks for interactive analysis'
        }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{
          _type: 'span',
          text: 'Data Processing Skills'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Data cleaning and preprocessing techniques'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Handling missing data and outliers'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Data transformation and feature engineering'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Merging and joining datasets'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'Statistical Analysis'
        }]
      },
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Learn statistical concepts and apply them to real-world data:'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Descriptive statistics and distributions'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Hypothesis testing and confidence intervals'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Correlation and regression analysis'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Time series analysis'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'Real-World Projects'
        }]
      },
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Work on industry-relevant projects with real datasets:'
        }]
      },
      {
        _type: 'block',
        listItem: 'number',
        children: [{
          _type: 'span',
          text: 'Sales Performance Analysis - Analyze retail sales data and identify trends'
        }]
      },
      {
        _type: 'block',
        listItem: 'number',
        children: [{
          _type: 'span',
          text: 'Customer Segmentation - Use clustering to group customers'
        }]
      },
      {
        _type: 'block',
        listItem: 'number',
        children: [{
          _type: 'span',
          text: 'Stock Price Prediction - Time series analysis of financial data'
        }]
      },
      {
        _type: 'block',
        listItem: 'number',
        children: [{
          _type: 'span',
          text: 'A/B Test Analysis - Statistical testing for business decisions'
        }]
      }
    ]
  },
  {
    title: 'Google Analytics 4: From Beginner to Expert',
    slug: 'google-analytics-4-expert',
    categorySlug: 'data-analytics',
    summary: 'Master Google Analytics 4 (GA4) with advanced tracking, custom reports, and data-driven insights for better business decisions.',
    price: 139,
    duration: '6 weeks',
    level: 'Beginner to Advanced',
    featured: false,
    image: {
      alt: 'Google Analytics 4 course'
    },
    body: [
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Master Google Analytics 4 and unlock the full potential of your website data. Learn advanced tracking, custom reporting, and how to turn data into actionable business insights.'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'GA4 Fundamentals'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Understanding the new GA4 data model'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Setting up GA4 properties and data streams'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Events vs. pageviews in GA4'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Enhanced e-commerce tracking'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'Advanced Tracking & Configuration'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Custom events and conversions'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Google Tag Manager integration'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Cross-domain and subdomain tracking'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Attribution modeling and analysis'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'Reporting & Analysis'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Exploration reports and custom dimensions'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Audience building and analysis'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'BigQuery integration for advanced analysis'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Data visualization and dashboard creation'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'Business Applications'
        }]
      },
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Learn how to apply GA4 data to real business scenarios:'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Measuring marketing campaign effectiveness'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Understanding user journey and behavior'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Optimizing conversion rates'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Creating executive-level reports'
        }]
      }
    ]
  },

  // Cybersecurity & Certification
  {
    title: 'CISSP Certification Prep Course',
    slug: 'cissp-certification-prep',
    categorySlug: 'cybersecurity-certification',
    summary: 'Comprehensive CISSP exam preparation covering all 8 domains. Includes practice tests, study materials, and expert guidance for certification success.',
    price: 249,
    duration: '16 weeks',
    level: 'Advanced',
    featured: true,
    image: {
      alt: 'CISSP certification preparation course'
    },
    body: [
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Prepare for the CISSP certification with comprehensive coverage of all eight domains. This course is designed for experienced security professionals seeking to advance their careers.'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'CISSP 8 Domains Covered'
        }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{
          _type: 'span',
          text: 'Domain 1: Security and Risk Management'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Information security governance and risk management'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Legal, regulatory, and compliance requirements'
        }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{
          _type: 'span',
          text: 'Domain 2: Asset Security'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Information and asset classification'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Data handling and retention'
        }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{
          _type: 'span',
          text: 'Domain 3: Security Architecture and Engineering'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Security models and architecture'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Security design principles'
        }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{
          _type: 'span',
          text: 'Domain 4: Communication and Network Security'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Network protocols and secure communications'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Network attacks and countermeasures'
        }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{
          _type: 'span',
          text: 'Domains 5-8: IAM, Security Assessment, Security Operations, Software Development Security'
        }]
      },
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Complete coverage of all remaining domains with practical examples and real-world applications.'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'Exam Preparation'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: '1000+ practice questions with detailed explanations'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Full-length practice exams'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Study guides and quick reference materials'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Exam tips and test-taking strategies'
        }]
      }
    ]
  },
  {
    title: 'Ethical Hacking for Beginners',
    slug: 'ethical-hacking-beginners',
    categorySlug: 'cybersecurity-certification',
    summary: 'Learn ethical hacking fundamentals, penetration testing, and cybersecurity defense strategies. Hands-on labs with real-world scenarios.',
    price: 169,
    duration: '12 weeks',
    level: 'Beginner to Intermediate',
    featured: true,
    image: {
      alt: 'Ethical hacking course for beginners'
    },
    body: [
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Learn ethical hacking from the ground up and develop the skills to identify and fix security vulnerabilities. This hands-on course covers penetration testing, security assessment, and defensive strategies.'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'Hacking Fundamentals'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Ethics and legal aspects of penetration testing'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Information gathering and reconnaissance'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Vulnerability assessment methodologies'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Network scanning and enumeration'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'Attack Techniques'
        }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{
          _type: 'span',
          text: 'System Hacking'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Password cracking techniques'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Privilege escalation methods'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Backdoors and rootkits'
        }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{
          _type: 'span',
          text: 'Web Application Security'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'OWASP Top 10 vulnerabilities'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'SQL injection and XSS attacks'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Web application testing tools'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'Tools and Techniques'
        }]
      },
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Master industry-standard tools used by professional penetration testers:'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Kali Linux and essential security distributions'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Nmap for network discovery and security auditing'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Metasploit Framework for penetration testing'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Burp Suite for web application testing'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Wireshark for network protocol analysis'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'Hands-On Labs'
        }]
      },
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Practice your skills in safe, controlled environments:'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Virtual lab environment setup'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Capture the Flag (CTF) challenges'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Real-world penetration testing scenarios'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Report writing and documentation'
        }]
      }
    ]
  },

  // Foundational Tech Skills
  {
    title: 'Mastering the Command Line',
    slug: 'mastering-command-line',
    categorySlug: 'foundational-tech-skills',
    summary: 'Master Linux/Unix command line, shell scripting, and system administration. Essential skills for developers and IT professionals.',
    price: 89,
    duration: '4 weeks',
    level: 'Beginner to Intermediate',
    featured: false,
    image: {
      alt: 'Command line mastery course'
    },
    body: [
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Master the command line and unlock the full power of your computer. Learn essential Unix/Linux commands, shell scripting, and system administration skills that every developer needs.'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'Command Line Fundamentals'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Navigation and file system basics'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'File operations and permissions'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Text processing with grep, sed, and awk'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Pipes, redirection, and command chaining'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'Advanced Techniques'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Shell scripting and automation'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Process management and job control'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Environment variables and configuration'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Network commands and troubleshooting'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'Practical Applications'
        }]
      },
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Learn how to apply command line skills in real development workflows:'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Development workflow automation'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Server management and deployment'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Log analysis and system monitoring'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Database operations from command line'
        }]
      }
    ]
  },
  {
    title: 'Git & GitHub for Beginners',
    slug: 'git-github-beginners',
    categorySlug: 'foundational-tech-skills',
    summary: 'Master version control with Git and GitHub. Learn branching, merging, collaboration workflows, and best practices for team development.',
    price: 79,
    duration: '3 weeks',
    level: 'Beginner',
    featured: false,
    image: {
      alt: 'Git and GitHub course for beginners'
    },
    body: [
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Master Git and GitHub, the essential version control tools used by developers worldwide. Learn to manage code, collaborate with teams, and contribute to open-source projects.'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'Git Fundamentals'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Understanding version control concepts'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Git installation and configuration'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Basic Git workflow: add, commit, push, pull'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Working with repositories and remotes'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'Branching and Merging'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Creating and switching between branches'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Merging strategies and conflict resolution'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Rebasing and interactive rebasing'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Git workflows: Feature branches, Gitflow'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'GitHub Collaboration'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'GitHub account setup and repository creation'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Pull requests and code reviews'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Issues, project boards, and collaboration tools'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Forking and contributing to open-source projects'
        }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{
          _type: 'span',
          text: 'Best Practices'
        }]
      },
      {
        _type: 'block',
        children: [{
          _type: 'span',
          text: 'Learn industry best practices for using Git and GitHub:'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Writing effective commit messages'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: '.gitignore files and repository organization'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'GitHub Actions for CI/CD'
        }]
      },
      {
        _type: 'block',
        listItem: 'bullet',
        children: [{
          _type: 'span',
          text: 'Security and access management'
        }]
      }
    ]
  }
];

async function deleteAllDocuments() {
  console.log('🗑️  Step 1: Deleting all existing courses and categories...\n');
  
  try {
    // Delete all courses
    const courses = await client.fetch('*[_type == "course"]._id');
    if (courses.length > 0) {
      console.log(`Found ${courses.length} courses to delete`);
      const deleteCoursesTransaction = client.transaction();
      courses.forEach(id => deleteCoursesTransaction.delete(id));
      await deleteCoursesTransaction.commit();
      console.log('✅ All courses deleted successfully');
    } else {
      console.log('No courses found to delete');
    }

    // Delete all course categories
    const categories = await client.fetch('*[_type == "courseCategory"]._id');
    if (categories.length > 0) {
      console.log(`Found ${categories.length} categories to delete`);
      const deleteCategoriesTransaction = client.transaction();
      categories.forEach(id => deleteCategoriesTransaction.delete(id));
      await deleteCategoriesTransaction.commit();
      console.log('✅ All categories deleted successfully');
    } else {
      console.log('No categories found to delete');
    }

    console.log('\n✅ All existing documents deleted successfully!\n');
    
  } catch (error) {
    console.error('❌ Error deleting documents:', error);
    throw error;
  }
}

async function createCategories() {
  console.log('📂 Step 2: Creating new course categories...\n');
  
  try {
    const transaction = client.transaction();
    
    for (const category of courseCategories) {
      const categoryDoc = {
        _type: 'courseCategory',
        title: category.title,
        slug: {
          _type: 'slug',
          current: category.slug
        },
        description: category.description,
        order: category.order
      };
      
      transaction.create(categoryDoc);
      console.log(`✓ Prepared category: ${category.title}`);
    }
    
    await transaction.commit();
    console.log('\n✅ All categories created successfully!\n');
    
  } catch (error) {
    console.error('❌ Error creating categories:', error);
    throw error;
  }
}

async function createCourses() {
  console.log('📚 Step 3: Creating new courses with rich content...\n');
  
  try {
    // First, get all category references
    const categoryRefs = {};
    for (const category of courseCategories) {
      const categoryDoc = await client.fetch(
        '*[_type == "courseCategory" && slug.current == $slug][0]',
        { slug: category.slug }
      );
      if (categoryDoc) {
        categoryRefs[category.slug] = {
          _type: 'reference',
          _ref: categoryDoc._id
        };
      }
    }
    
    const transaction = client.transaction();
    
    for (const course of courses) {
      const courseDoc = {
        _type: 'course',
        title: course.title,
        slug: {
          _type: 'slug',
          current: course.slug
        },
        summary: course.summary,
        body: course.body,
        price: course.price,
        duration: course.duration,
        level: course.level,
        featured: course.featured,
        category: categoryRefs[course.categorySlug],
        image: course.image
      };
      
      transaction.create(courseDoc);
      console.log(`✓ Prepared course: ${course.title}`);
    }
    
    await transaction.commit();
    console.log('\n✅ All courses created successfully!\n');
    
  } catch (error) {
    console.error('❌ Error creating courses:', error);
    throw error;
  }
}

async function verifyResults() {
  console.log('✅ Step 4: Verifying results...\n');
  
  try {
    const categories = await client.fetch('*[_type == "courseCategory"] | order(order)');
    const courses = await client.fetch('*[_type == "course"] | order(title)');
    
    console.log(`📂 Categories created: ${categories.length}`);
    categories.forEach(cat => {
      console.log(`   - ${cat.title} (${cat.slug.current})`);
    });
    
    console.log(`\n📚 Courses created: ${courses.length}`);
    courses.forEach(course => {
      const hasRichBody = course.body && course.body.length > 1;
      console.log(`   - ${course.title} ${hasRichBody ? '✅ Rich content' : '⚠️  No rich content'}`);
    });
    
    console.log('\n🎉 Course restoration completed successfully!');
    console.log('All courses now have detailed content and are properly organized in categories.');
    
  } catch (error) {
    console.error('❌ Error verifying results:', error);
    throw error;
  }
}

async function main() {
  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ SANITY_API_TOKEN environment variable is required');
    console.log('Please set it using: export SANITY_API_TOKEN="your_token_here"');
    process.exit(1);
  }

  try {
    await deleteAllDocuments();
    await createCategories();
    await createCourses();
    await verifyResults();
    
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

main();
