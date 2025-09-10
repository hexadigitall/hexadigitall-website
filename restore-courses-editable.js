import { createClient } from '@sanity/client';

// Simple UUID generator
function generateKey() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

const client = createClient({
  projectId: 'puzezel0',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-08-30',
  token: process.env.SANITY_API_TOKEN,
});

console.log('🔄 Creating Editable Courses - Fixed Version');
console.log('This will DELETE all current courses and recreate them as EDITABLE content\n');

// Helper function to create blocks with proper _key values
function createBlock(text, style = 'normal', listItem = null) {
  return {
    _key: generateKey(),
    _type: 'block',
    style: style,
    listItem: listItem,
    children: [{
      _key: generateKey(),
      _type: 'span',
      text: text,
      marks: []
    }],
    markDefs: []
  };
}

// Course categories
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

// Courses with properly structured body content
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
    body: [
      createBlock('Transform yourself from a complete beginner to a job-ready web developer in just 12 weeks. This comprehensive bootcamp covers everything you need to know to build modern, responsive websites and web applications.'),
      createBlock('What You\'ll Learn', 'h2'),
      createBlock('HTML5 & CSS3 fundamentals and advanced techniques', 'normal', 'bullet'),
      createBlock('JavaScript ES6+ and modern programming concepts', 'normal', 'bullet'),
      createBlock('React.js for building interactive user interfaces', 'normal', 'bullet'),
      createBlock('Node.js and Express.js for server-side development', 'normal', 'bullet'),
      createBlock('MongoDB and database design principles', 'normal', 'bullet'),
      createBlock('Git version control and GitHub workflows', 'normal', 'bullet'),
      createBlock('Responsive design and mobile-first development', 'normal', 'bullet'),
      createBlock('API integration and RESTful services', 'normal', 'bullet'),
      createBlock('Deployment strategies with Netlify and Heroku', 'normal', 'bullet'),
      createBlock('Course Projects', 'h2'),
      createBlock('Build 5+ real-world projects including:'),
      createBlock('Personal Portfolio Website - Showcase your skills with a stunning, responsive portfolio', 'normal', 'number'),
      createBlock('E-commerce Store - Full-stack online store with payment integration', 'normal', 'number'),
      createBlock('Social Media Dashboard - Real-time data visualization and user management', 'normal', 'number'),
      createBlock('Task Management App - Complete CRUD application with user authentication', 'normal', 'number'),
      createBlock('Weather App - API integration with geolocation services', 'normal', 'number'),
      createBlock('Career Support', 'h2'),
      createBlock('This bootcamp includes comprehensive career support to help you land your first developer job:'),
      createBlock('Resume and portfolio review sessions', 'normal', 'bullet'),
      createBlock('Mock technical interviews and coding challenges', 'normal', 'bullet'),
      createBlock('Job search strategies and networking tips', 'normal', 'bullet'),
      createBlock('Access to our exclusive job board and hiring partners', 'normal', 'bullet'),
      createBlock('Lifetime access to course materials and community', 'normal', 'bullet')
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
    body: [
      createBlock('Master React Native and build professional mobile applications that run on both iOS and Android. Learn from industry experts and build real apps that you can publish to app stores.'),
      createBlock('Course Curriculum', 'h2'),
      createBlock('Module 1: React Native Fundamentals', 'h3'),
      createBlock('Setting up React Native development environment', 'normal', 'bullet'),
      createBlock('Understanding React Native components and JSX', 'normal', 'bullet'),
      createBlock('Styling with Flexbox and StyleSheet', 'normal', 'bullet'),
      createBlock('Handling user input and events', 'normal', 'bullet'),
      createBlock('Module 2: Navigation and State Management', 'h3'),
      createBlock('React Navigation for screen transitions', 'normal', 'bullet'),
      createBlock('State management with Redux and Context API', 'normal', 'bullet'),
      createBlock('Async storage and data persistence', 'normal', 'bullet'),
      createBlock('Module 3: Native Features and APIs', 'h3'),
      createBlock('Camera, GPS, and device sensors', 'normal', 'bullet'),
      createBlock('Push notifications and background tasks', 'normal', 'bullet'),
      createBlock('Integrating third-party libraries', 'normal', 'bullet'),
      createBlock('Module 4: Performance and Deployment', 'h3'),
      createBlock('Performance optimization techniques', 'normal', 'bullet'),
      createBlock('Testing React Native applications', 'normal', 'bullet'),
      createBlock('Publishing to App Store and Google Play', 'normal', 'bullet'),
      createBlock('Build Real Apps', 'h2'),
      createBlock('Throughout the course, you\'ll build three complete mobile applications:'),
      createBlock('Instagram Clone - Photo sharing app with user authentication', 'normal', 'bullet'),
      createBlock('Expense Tracker - Personal finance management with charts', 'normal', 'bullet'),
      createBlock('Real-time Chat App - Messaging with push notifications', 'normal', 'bullet')
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
    body: [
      createBlock('Learn the essential skills to successfully plan, execute, and deliver projects on time and within budget. This course covers both traditional and agile project management methodologies.'),
      createBlock('What You\'ll Master', 'h2'),
      createBlock('Project initiation and planning techniques', 'normal', 'bullet'),
      createBlock('Stakeholder management and communication', 'normal', 'bullet'),
      createBlock('Risk assessment and mitigation strategies', 'normal', 'bullet'),
      createBlock('Agile and Scrum methodologies', 'normal', 'bullet'),
      createBlock('Project monitoring and control', 'normal', 'bullet'),
      createBlock('Quality management and continuous improvement', 'normal', 'bullet'),
      createBlock('Tools and Templates', 'h2'),
      createBlock('Get hands-on experience with industry-standard tools and receive ready-to-use templates:'),
      createBlock('Microsoft Project and Asana', 'normal', 'bullet'),
      createBlock('Gantt charts and work breakdown structures', 'normal', 'bullet'),
      createBlock('Project charter and scope documents', 'normal', 'bullet'),
      createBlock('Risk registers and communication plans', 'normal', 'bullet')
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
    body: [
      createBlock('Master the lean startup methodology and learn how to build successful businesses by testing ideas quickly, learning from customers, and iterating based on feedback.'),
      createBlock('The Lean Startup Process', 'h2'),
      createBlock('1. Build-Measure-Learn Cycle', 'h3'),
      createBlock('Understand how to rapidly test business hypotheses and learn from real customer feedback.'),
      createBlock('2. Minimum Viable Product (MVP)', 'h3'),
      createBlock('Learn how to identify the core features needed to test your value proposition and build an MVP that validates your assumptions.'),
      createBlock('3. Validated Learning', 'h3'),
      createBlock('Master techniques for measuring what matters and making data-driven decisions about your product development.'),
      createBlock('Real-World Application', 'h2'),
      createBlock('Work through practical exercises and case studies:'),
      createBlock('Identify and validate your value proposition', 'normal', 'bullet'),
      createBlock('Design experiments to test key assumptions', 'normal', 'bullet'),
      createBlock('Build and launch your MVP', 'normal', 'bullet'),
      createBlock('Measure customer behavior and feedback', 'normal', 'bullet'),
      createBlock('Pivot or persevere based on data', 'normal', 'bullet')
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
    body: [
      createBlock('Transform your small business with proven digital marketing strategies. Learn how to attract, engage, and convert customers online with practical, budget-friendly techniques.'),
      createBlock('Marketing Channels You\'ll Master', 'h2'),
      createBlock('Social Media Marketing', 'h3'),
      createBlock('Facebook and Instagram advertising strategies', 'normal', 'bullet'),
      createBlock('LinkedIn marketing for B2B businesses', 'normal', 'bullet'),
      createBlock('Content creation and community building', 'normal', 'bullet'),
      createBlock('Email Marketing', 'h3'),
      createBlock('Building and segmenting email lists', 'normal', 'bullet'),
      createBlock('Creating high-converting email campaigns', 'normal', 'bullet'),
      createBlock('Automation and drip sequences', 'normal', 'bullet'),
      createBlock('Content Marketing', 'h3'),
      createBlock('Blog content that drives traffic', 'normal', 'bullet'),
      createBlock('Video marketing and YouTube optimization', 'normal', 'bullet'),
      createBlock('Lead magnets and content upgrades', 'normal', 'bullet'),
      createBlock('Practical Tools and Templates', 'h2'),
      createBlock('Get access to the same tools and templates used by successful small businesses:'),
      createBlock('Content calendar templates', 'normal', 'bullet'),
      createBlock('Email marketing templates', 'normal', 'bullet'),
      createBlock('Social media post templates', 'normal', 'bullet'),
      createBlock('Marketing budget calculators', 'normal', 'bullet')
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
    body: [
      createBlock('Master the advanced SEO strategies used by top-ranking websites. Learn the latest techniques to outrank your competitors and drive massive organic traffic to your site.'),
      createBlock('Advanced SEO Strategies', 'h2'),
      createBlock('Technical SEO Mastery', 'h3'),
      createBlock('Core Web Vitals optimization and page speed', 'normal', 'bullet'),
      createBlock('Mobile-first indexing and responsive design', 'normal', 'bullet'),
      createBlock('Structured data and schema markup', 'normal', 'bullet'),
      createBlock('XML sitemaps and robots.txt optimization', 'normal', 'bullet'),
      createBlock('Content Optimization', 'h3'),
      createBlock('Semantic SEO and entity optimization', 'normal', 'bullet'),
      createBlock('Topic clustering and content hubs', 'normal', 'bullet'),
      createBlock('Featured snippets and SERP features', 'normal', 'bullet'),
      createBlock('Content gap analysis and competitor research', 'normal', 'bullet'),
      createBlock('Authority Building', 'h3'),
      createBlock('Advanced link building strategies', 'normal', 'bullet'),
      createBlock('Digital PR and brand mention campaigns', 'normal', 'bullet'),
      createBlock('Local SEO and Google My Business optimization', 'normal', 'bullet'),
      createBlock('SEO Tools & Analytics', 'h2'),
      createBlock('Master professional SEO tools and learn to analyze data like an expert:'),
      createBlock('Google Search Console advanced features', 'normal', 'bullet'),
      createBlock('SEMrush, Ahrefs, and Screaming Frog', 'normal', 'bullet'),
      createBlock('Rank tracking and competitive analysis', 'normal', 'bullet'),
      createBlock('ROI measurement and reporting', 'normal', 'bullet'),
      createBlock('Case Studies & Real Results', 'h2'),
      createBlock('Learn from real case studies where we\'ve achieved #1 rankings:'),
      createBlock('E-commerce site: 500% increase in organic traffic', 'normal', 'bullet'),
      createBlock('Local business: Dominated local search results', 'normal', 'bullet'),
      createBlock('SaaS company: Ranked for high-competition keywords', 'normal', 'bullet')
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
    body: [
      createBlock('Master data analysis with Python and transform raw data into actionable insights. Learn the essential tools and techniques used by data analysts at top companies.'),
      createBlock('Python for Data Analysis', 'h2'),
      createBlock('Core Libraries', 'h3'),
      createBlock('NumPy for numerical computing', 'normal', 'bullet'),
      createBlock('Pandas for data manipulation and analysis', 'normal', 'bullet'),
      createBlock('Matplotlib and Seaborn for data visualization', 'normal', 'bullet'),
      createBlock('Jupyter Notebooks for interactive analysis', 'normal', 'bullet'),
      createBlock('Data Processing Skills', 'h3'),
      createBlock('Data cleaning and preprocessing techniques', 'normal', 'bullet'),
      createBlock('Handling missing data and outliers', 'normal', 'bullet'),
      createBlock('Data transformation and feature engineering', 'normal', 'bullet'),
      createBlock('Merging and joining datasets', 'normal', 'bullet'),
      createBlock('Statistical Analysis', 'h2'),
      createBlock('Learn statistical concepts and apply them to real-world data:'),
      createBlock('Descriptive statistics and distributions', 'normal', 'bullet'),
      createBlock('Hypothesis testing and confidence intervals', 'normal', 'bullet'),
      createBlock('Correlation and regression analysis', 'normal', 'bullet'),
      createBlock('Time series analysis', 'normal', 'bullet'),
      createBlock('Real-World Projects', 'h2'),
      createBlock('Work on industry-relevant projects with real datasets:'),
      createBlock('Sales Performance Analysis - Analyze retail sales data and identify trends', 'normal', 'number'),
      createBlock('Customer Segmentation - Use clustering to group customers', 'normal', 'number'),
      createBlock('Stock Price Prediction - Time series analysis of financial data', 'normal', 'number'),
      createBlock('A/B Test Analysis - Statistical testing for business decisions', 'normal', 'number')
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
    body: [
      createBlock('Master Google Analytics 4 and unlock the full potential of your website data. Learn advanced tracking, custom reporting, and how to turn data into actionable business insights.'),
      createBlock('GA4 Fundamentals', 'h2'),
      createBlock('Understanding the new GA4 data model', 'normal', 'bullet'),
      createBlock('Setting up GA4 properties and data streams', 'normal', 'bullet'),
      createBlock('Events vs. pageviews in GA4', 'normal', 'bullet'),
      createBlock('Enhanced e-commerce tracking', 'normal', 'bullet'),
      createBlock('Advanced Tracking & Configuration', 'h2'),
      createBlock('Custom events and conversions', 'normal', 'bullet'),
      createBlock('Google Tag Manager integration', 'normal', 'bullet'),
      createBlock('Cross-domain and subdomain tracking', 'normal', 'bullet'),
      createBlock('Attribution modeling and analysis', 'normal', 'bullet'),
      createBlock('Reporting & Analysis', 'h2'),
      createBlock('Exploration reports and custom dimensions', 'normal', 'bullet'),
      createBlock('Audience building and analysis', 'normal', 'bullet'),
      createBlock('BigQuery integration for advanced analysis', 'normal', 'bullet'),
      createBlock('Data visualization and dashboard creation', 'normal', 'bullet'),
      createBlock('Business Applications', 'h2'),
      createBlock('Learn how to apply GA4 data to real business scenarios:'),
      createBlock('Measuring marketing campaign effectiveness', 'normal', 'bullet'),
      createBlock('Understanding user journey and behavior', 'normal', 'bullet'),
      createBlock('Optimizing conversion rates', 'normal', 'bullet'),
      createBlock('Creating executive-level reports', 'normal', 'bullet')
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
    body: [
      createBlock('Prepare for the CISSP certification with comprehensive coverage of all eight domains. This course is designed for experienced security professionals seeking to advance their careers.'),
      createBlock('CISSP 8 Domains Covered', 'h2'),
      createBlock('Domain 1: Security and Risk Management', 'h3'),
      createBlock('Information security governance and risk management', 'normal', 'bullet'),
      createBlock('Legal, regulatory, and compliance requirements', 'normal', 'bullet'),
      createBlock('Domain 2: Asset Security', 'h3'),
      createBlock('Information and asset classification', 'normal', 'bullet'),
      createBlock('Data handling and retention', 'normal', 'bullet'),
      createBlock('Domain 3: Security Architecture and Engineering', 'h3'),
      createBlock('Security models and architecture', 'normal', 'bullet'),
      createBlock('Security design principles', 'normal', 'bullet'),
      createBlock('Domain 4: Communication and Network Security', 'h3'),
      createBlock('Network protocols and secure communications', 'normal', 'bullet'),
      createBlock('Network attacks and countermeasures', 'normal', 'bullet'),
      createBlock('Domains 5-8: IAM, Security Assessment, Security Operations, Software Development Security', 'h3'),
      createBlock('Complete coverage of all remaining domains with practical examples and real-world applications.'),
      createBlock('Exam Preparation', 'h2'),
      createBlock('1000+ practice questions with detailed explanations', 'normal', 'bullet'),
      createBlock('Full-length practice exams', 'normal', 'bullet'),
      createBlock('Study guides and quick reference materials', 'normal', 'bullet'),
      createBlock('Exam tips and test-taking strategies', 'normal', 'bullet')
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
    body: [
      createBlock('Learn ethical hacking from the ground up and develop the skills to identify and fix security vulnerabilities. This hands-on course covers penetration testing, security assessment, and defensive strategies.'),
      createBlock('Hacking Fundamentals', 'h2'),
      createBlock('Ethics and legal aspects of penetration testing', 'normal', 'bullet'),
      createBlock('Information gathering and reconnaissance', 'normal', 'bullet'),
      createBlock('Vulnerability assessment methodologies', 'normal', 'bullet'),
      createBlock('Network scanning and enumeration', 'normal', 'bullet'),
      createBlock('Attack Techniques', 'h2'),
      createBlock('System Hacking', 'h3'),
      createBlock('Password cracking techniques', 'normal', 'bullet'),
      createBlock('Privilege escalation methods', 'normal', 'bullet'),
      createBlock('Backdoors and rootkits', 'normal', 'bullet'),
      createBlock('Web Application Security', 'h3'),
      createBlock('OWASP Top 10 vulnerabilities', 'normal', 'bullet'),
      createBlock('SQL injection and XSS attacks', 'normal', 'bullet'),
      createBlock('Web application testing tools', 'normal', 'bullet'),
      createBlock('Tools and Techniques', 'h2'),
      createBlock('Master industry-standard tools used by professional penetration testers:'),
      createBlock('Kali Linux and essential security distributions', 'normal', 'bullet'),
      createBlock('Nmap for network discovery and security auditing', 'normal', 'bullet'),
      createBlock('Metasploit Framework for penetration testing', 'normal', 'bullet'),
      createBlock('Burp Suite for web application testing', 'normal', 'bullet'),
      createBlock('Wireshark for network protocol analysis', 'normal', 'bullet'),
      createBlock('Hands-On Labs', 'h2'),
      createBlock('Practice your skills in safe, controlled environments:'),
      createBlock('Virtual lab environment setup', 'normal', 'bullet'),
      createBlock('Capture the Flag (CTF) challenges', 'normal', 'bullet'),
      createBlock('Real-world penetration testing scenarios', 'normal', 'bullet'),
      createBlock('Report writing and documentation', 'normal', 'bullet')
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
    body: [
      createBlock('Master the command line and unlock the full power of your computer. Learn essential Unix/Linux commands, shell scripting, and system administration skills that every developer needs.'),
      createBlock('Command Line Fundamentals', 'h2'),
      createBlock('Navigation and file system basics', 'normal', 'bullet'),
      createBlock('File operations and permissions', 'normal', 'bullet'),
      createBlock('Text processing with grep, sed, and awk', 'normal', 'bullet'),
      createBlock('Pipes, redirection, and command chaining', 'normal', 'bullet'),
      createBlock('Advanced Techniques', 'h2'),
      createBlock('Shell scripting and automation', 'normal', 'bullet'),
      createBlock('Process management and job control', 'normal', 'bullet'),
      createBlock('Environment variables and configuration', 'normal', 'bullet'),
      createBlock('Network commands and troubleshooting', 'normal', 'bullet'),
      createBlock('Practical Applications', 'h2'),
      createBlock('Learn how to apply command line skills in real development workflows:'),
      createBlock('Development workflow automation', 'normal', 'bullet'),
      createBlock('Server management and deployment', 'normal', 'bullet'),
      createBlock('Log analysis and system monitoring', 'normal', 'bullet'),
      createBlock('Database operations from command line', 'normal', 'bullet')
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
    body: [
      createBlock('Master Git and GitHub, the essential version control tools used by developers worldwide. Learn to manage code, collaborate with teams, and contribute to open-source projects.'),
      createBlock('Git Fundamentals', 'h2'),
      createBlock('Understanding version control concepts', 'normal', 'bullet'),
      createBlock('Git installation and configuration', 'normal', 'bullet'),
      createBlock('Basic Git workflow: add, commit, push, pull', 'normal', 'bullet'),
      createBlock('Working with repositories and remotes', 'normal', 'bullet'),
      createBlock('Branching and Merging', 'h2'),
      createBlock('Creating and switching between branches', 'normal', 'bullet'),
      createBlock('Merging strategies and conflict resolution', 'normal', 'bullet'),
      createBlock('Rebasing and interactive rebasing', 'normal', 'bullet'),
      createBlock('Git workflows: Feature branches, Gitflow', 'normal', 'bullet'),
      createBlock('GitHub Collaboration', 'h2'),
      createBlock('GitHub account setup and repository creation', 'normal', 'bullet'),
      createBlock('Pull requests and code reviews', 'normal', 'bullet'),
      createBlock('Issues, project boards, and collaboration tools', 'normal', 'bullet'),
      createBlock('Forking and contributing to open-source projects', 'normal', 'bullet'),
      createBlock('Best Practices', 'h2'),
      createBlock('Learn industry best practices for using Git and GitHub:'),
      createBlock('Writing effective commit messages', 'normal', 'bullet'),
      createBlock('.gitignore files and repository organization', 'normal', 'bullet'),
      createBlock('GitHub Actions for CI/CD', 'normal', 'bullet'),
      createBlock('Security and access management', 'normal', 'bullet')
    ]
  }
];

async function deleteAllDocuments() {
  console.log('🗑️  Step 1: Deleting all existing courses and categories...\n');
  
  try {
    const courses = await client.fetch('*[_type == "course"]._id');
    if (courses.length > 0) {
      console.log(`Found ${courses.length} courses to delete`);
      const deleteCoursesTransaction = client.transaction();
      courses.forEach(id => deleteCoursesTransaction.delete(id));
      await deleteCoursesTransaction.commit();
      console.log('✅ All courses deleted successfully');
    }

    const categories = await client.fetch('*[_type == "courseCategory"]._id');
    if (categories.length > 0) {
      console.log(`Found ${categories.length} categories to delete`);
      const deleteCategoriesTransaction = client.transaction();
      categories.forEach(id => deleteCategoriesTransaction.delete(id));
      await deleteCategoriesTransaction.commit();
      console.log('✅ All categories deleted successfully');
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
  console.log('📚 Step 3: Creating new EDITABLE courses...\n');
  
  try {
    // Get category references
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
        body: course.body, // This now has proper _key values
        price: course.price,
        duration: course.duration,
        level: course.level,
        featured: course.featured,
        category: categoryRefs[course.categorySlug]
      };
      
      transaction.create(courseDoc);
      console.log(`✓ Prepared EDITABLE course: ${course.title}`);
    }
    
    await transaction.commit();
    console.log('\n✅ All EDITABLE courses created successfully!\n');
    
  } catch (error) {
    console.error('❌ Error creating courses:', error);
    throw error;
  }
}

async function verifyResults() {
  console.log('✅ Step 4: Verifying editable content...\n');
  
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
      const hasProperKeys = course.body && course.body[0]._key;
      console.log(`   - ${course.title} ${hasRichBody ? '✅' : '⚠️ '} ${hasProperKeys ? '🔓 EDITABLE' : '🔒 NOT EDITABLE'}`);
    });
    
    console.log('\n🎉 Course restoration completed successfully!');
    console.log('✅ All courses now have EDITABLE rich content with proper _key values');
    console.log('✅ You can now edit all content in Sanity Studio!');
    
  } catch (error) {
    console.error('❌ Error verifying results:', error);
    throw error;
  }
}

async function main() {
  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ SANITY_API_TOKEN environment variable is required');
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
