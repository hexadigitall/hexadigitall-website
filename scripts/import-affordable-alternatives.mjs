// scripts/import-affordable-alternatives.mjs
// Create affordable, creatively-named alternatives to expensive popular courses
// Target: Courses people want but can't afford - give them a taste!
// Pricing: NGN 25k-40k/month (6,250-10,000/hr)

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-08-30',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
}

function createBlock(text, style = 'normal') {
  return {
    _type: 'block',
    style,
    markDefs: [],
    children: [{ _type: 'span', marks: [], text }],
  }
}

function buildBody(course) {
  const body = [
    createBlock(course.description, 'blockquote'),
    createBlock('Who This Course Is For', 'h3'),
    createBlock(course.audience),
    createBlock("What You'll Learn", 'h3'),
    ...course.learnItems.map(item => createBlock(item)),
    createBlock('Course Outline', 'h3'),
    ...course.modules.map(mod => createBlock(mod)),
  ]
  return body
}

// Affordable alternatives to expensive popular courses
const AFFORDABLE_COURSES = [
  // Cloud & DevOps - alternatives to expensive certification courses
  {
    schoolTitle: 'School of Cloud & DevOps',
    title: 'AWS Crash Course for Beginners',
    summary: 'Fast-track your AWS journey: core services, deployments, and cloud fundamentals in 8 weeks.',
    description: 'Learn essential AWS services without the certification pressure. Perfect for developers and IT pros who want hands-on cloud skills fast.',
    audience: 'Developers, IT professionals, and career switchers wanting practical AWS skills without certification costs',
    hourlyRateNGN: 8750,
    hourlyRateUSD: 7,
    level: 'Beginner',
    learnItems: [
      '✅ AWS core services: EC2, S3, RDS, Lambda',
      '✅ Deploy real applications to AWS',
      '✅ Cloud security and IAM basics',
      '✅ Cost management and optimization',
      '✅ Build a cloud portfolio project',
    ],
    modules: [
      'Module 1: AWS Fundamentals & Account Setup',
      'Module 2: Compute & Storage Services',
      'Module 3: Databases & Networking',
      'Module 4: Deploy Your First Cloud App',
    ],
  },
  {
    schoolTitle: 'School of Cloud & DevOps',
    title: 'Kubernetes Quick Start',
    summary: 'Master container orchestration basics: deploy, scale, and manage containerized apps.',
    description: 'Learn Kubernetes without the complexity. Get your apps running in containers with practical, hands-on training.',
    audience: 'Developers wanting to containerize applications and learn modern deployment strategies',
    hourlyRateNGN: 10000,
    hourlyRateUSD: 8,
    level: 'Intermediate',
    learnItems: [
      '✅ Docker and containerization basics',
      '✅ Kubernetes architecture and concepts',
      '✅ Deploy and scale applications',
      '✅ Services, ingress, and networking',
      '✅ Real-world deployment project',
    ],
    modules: [
      'Module 1: Containers & Docker Essentials',
      'Module 2: Kubernetes Fundamentals',
      'Module 3: Deployments & Scaling',
      'Module 4: Production-Ready Apps',
    ],
  },
  
  // Coding & Development - alternatives to expensive bootcamps
  {
    schoolTitle: 'School of Coding & Development',
    title: 'React Essentials Bootcamp',
    summary: 'Build modern web apps with React: components, hooks, state management, and deployment.',
    description: 'Learn React the practical way. Build 3 real projects and deploy them. No fluff, just hands-on coding.',
    audience: 'Developers with JavaScript basics wanting to build modern React applications',
    hourlyRateNGN: 9375,
    hourlyRateUSD: 7.5,
    level: 'Beginner',
    learnItems: [
      '✅ React components and JSX',
      '✅ Hooks: useState, useEffect, useContext',
      '✅ API integration and data fetching',
      '✅ Routing with React Router',
      '✅ Deploy 3 portfolio-ready projects',
    ],
    modules: [
      'Module 1: React Fundamentals',
      'Module 2: State Management & Hooks',
      'Module 3: Working with APIs',
      'Module 4: Building Real Projects',
    ],
  },
  {
    schoolTitle: 'School of Coding & Development',
    title: 'Full Stack Jumpstart (MERN)',
    summary: 'Build and deploy full-stack web apps with MongoDB, Express, React, and Node.js.',
    description: 'Go from zero to full-stack developer in 8 weeks. Build a complete app from database to deployment.',
    audience: 'Aspiring full-stack developers ready to build complete web applications',
    hourlyRateNGN: 10000,
    hourlyRateUSD: 8,
    level: 'Intermediate',
    learnItems: [
      '✅ MongoDB database design',
      '✅ RESTful APIs with Express & Node',
      '✅ React frontend development',
      '✅ Authentication and authorization',
      '✅ Deploy your full-stack app',
    ],
    modules: [
      'Module 1: Backend with Node & Express',
      'Module 2: MongoDB & Database Design',
      'Module 3: React Frontend',
      'Module 4: Full-Stack Integration & Deploy',
    ],
  },
  
  // Cybersecurity - alternatives to expensive certifications
  {
    schoolTitle: 'School of Cybersecurity',
    title: 'Ethical Hacking Fast Track',
    summary: 'Learn penetration testing basics: reconnaissance, exploitation, and vulnerability assessment.',
    description: 'Start ethical hacking without expensive certifications. Learn core skills to find and exploit vulnerabilities responsibly.',
    audience: 'Security enthusiasts and IT professionals wanting practical penetration testing skills',
    hourlyRateNGN: 10000,
    hourlyRateUSD: 8,
    level: 'Beginner',
    learnItems: [
      '✅ Reconnaissance and information gathering',
      '✅ Vulnerability scanning and assessment',
      '✅ Basic exploitation techniques',
      '✅ Web application security testing',
      '✅ Write your first penetration test report',
    ],
    modules: [
      'Module 1: Ethical Hacking Fundamentals',
      'Module 2: Reconnaissance & Scanning',
      'Module 3: Exploitation Basics',
      'Module 4: Web Security Testing',
    ],
  },
  {
    schoolTitle: 'School of Cybersecurity',
    title: 'Network Security Essentials',
    summary: 'Secure networks from threats: firewalls, IDS/IPS, VPNs, and security monitoring.',
    description: 'Protect networks like a pro. Learn essential security tools and techniques used by security administrators.',
    audience: 'IT professionals and network administrators wanting to secure infrastructure',
    hourlyRateNGN: 9375,
    hourlyRateUSD: 7.5,
    level: 'Intermediate',
    learnItems: [
      '✅ Network security fundamentals',
      '✅ Firewall configuration and management',
      '✅ Intrusion detection and prevention',
      '✅ VPN setup and secure remote access',
      '✅ Security monitoring and incident response',
    ],
    modules: [
      'Module 1: Network Security Foundations',
      'Module 2: Firewalls & Access Control',
      'Module 3: IDS/IPS & Monitoring',
      'Module 4: Securing Your Network',
    ],
  },
  
  // Data & AI - alternatives to expensive ML courses
  {
    schoolTitle: 'School of Data & AI',
    title: 'Machine Learning Crash Course',
    summary: 'Build your first ML models: regression, classification, and deployment with Python.',
    description: 'Learn machine learning without the math overwhelm. Build practical models and deploy them.',
    audience: 'Developers and data enthusiasts wanting to build and deploy machine learning models',
    hourlyRateNGN: 10000,
    hourlyRateUSD: 8,
    level: 'Intermediate',
    learnItems: [
      '✅ Python for machine learning',
      '✅ Supervised learning: regression & classification',
      '✅ Model training and evaluation',
      '✅ Deploy ML models to production',
      '✅ Build 3 ML portfolio projects',
    ],
    modules: [
      'Module 1: ML Fundamentals & Python',
      'Module 2: Regression Models',
      'Module 3: Classification Models',
      'Module 4: Deploy Your ML Model',
    ],
  },
  {
    schoolTitle: 'School of Data & AI',
    title: 'Data Analysis Fast Track',
    summary: 'Analyze data like a pro: Python, Pandas, visualization, and storytelling with data.',
    description: 'Turn data into insights. Learn the tools and techniques data analysts use daily.',
    audience: 'Aspiring data analysts, business professionals, and career switchers',
    hourlyRateNGN: 8750,
    hourlyRateUSD: 7,
    level: 'Beginner',
    learnItems: [
      '✅ Python basics for data analysis',
      '✅ Data cleaning and manipulation with Pandas',
      '✅ Data visualization with Matplotlib & Seaborn',
      '✅ Statistical analysis fundamentals',
      '✅ Build a data analysis portfolio',
    ],
    modules: [
      'Module 1: Python & Data Basics',
      'Module 2: Data Cleaning with Pandas',
      'Module 3: Visualization & Insights',
      'Module 4: Complete Analysis Project',
    ],
  },
  
  // Design - alternatives to expensive design bootcamps
  {
    schoolTitle: 'School of Design',
    title: 'UI/UX Quick Start for Developers',
    summary: 'Design better interfaces: user research, wireframing, prototyping, and usability.',
    description: 'Developers who want to design. Learn essential UI/UX skills to build better products.',
    audience: 'Developers, product managers, and entrepreneurs wanting design skills',
    hourlyRateNGN: 8750,
    hourlyRateUSD: 7,
    level: 'Beginner',
    learnItems: [
      '✅ User research and personas',
      '✅ Wireframing and information architecture',
      '✅ Prototyping with Figma',
      '✅ Usability testing and iteration',
      '✅ Design a mobile app from scratch',
    ],
    modules: [
      'Module 1: UX Research & User Needs',
      'Module 2: Wireframing & IA',
      'Module 3: Visual Design & Prototyping',
      'Module 4: Testing & Refinement',
    ],
  },
  {
    schoolTitle: 'School of Design',
    title: 'Graphic Design Crash Course',
    summary: 'Create stunning visuals: logo design, branding, social media graphics, and print.',
    description: 'Master graphic design tools and principles. Create professional designs for clients or your business.',
    audience: 'Entrepreneurs, marketers, and creatives wanting professional design skills',
    hourlyRateNGN: 7500,
    hourlyRateUSD: 6,
    level: 'Beginner',
    learnItems: [
      '✅ Design principles and color theory',
      '✅ Adobe Photoshop and Illustrator basics',
      '✅ Logo and brand identity design',
      '✅ Social media graphics',
      '✅ Build a design portfolio',
    ],
    modules: [
      'Module 1: Design Fundamentals',
      'Module 2: Tools Mastery (Photoshop/Illustrator)',
      'Module 3: Branding & Logo Design',
      'Module 4: Portfolio Projects',
    ],
  },
  
  // Executive Management - alternatives to expensive MBA-style courses
  {
    schoolTitle: 'School of Executive Management',
    title: 'Agile Project Management Essentials',
    summary: 'Lead agile teams: sprints, standups, retrospectives, and delivering value fast.',
    description: 'Manage projects the agile way without costly certifications. Get teams delivering results.',
    audience: 'Team leads, project coordinators, and aspiring project managers',
    hourlyRateNGN: 9375,
    hourlyRateUSD: 7.5,
    level: 'Beginner',
    learnItems: [
      '✅ Agile principles and mindset',
      '✅ Scrum framework and ceremonies',
      '✅ Sprint planning and estimation',
      '✅ Managing backlogs and priorities',
      '✅ Lead your first agile project',
    ],
    modules: [
      'Module 1: Agile Fundamentals',
      'Module 2: Scrum Framework',
      'Module 3: Sprint Execution',
      'Module 4: Your First Agile Project',
    ],
  },
  {
    schoolTitle: 'School of Executive Management',
    title: 'Product Management Quick Start',
    summary: 'Build products people love: strategy, roadmaps, user stories, and launch.',
    description: 'Become a product manager. Learn to identify opportunities, prioritize features, and ship products.',
    audience: 'Aspiring product managers, entrepreneurs, and developers transitioning to product',
    hourlyRateNGN: 10000,
    hourlyRateUSD: 8,
    level: 'Intermediate',
    learnItems: [
      '✅ Product strategy and vision',
      '✅ User research and validation',
      '✅ Product roadmapping',
      '✅ Writing user stories and PRDs',
      '✅ Launch and measure product success',
    ],
    modules: [
      'Module 1: Product Thinking',
      'Module 2: Discovery & Validation',
      'Module 3: Roadmaps & Prioritization',
      'Module 4: Launch Your Product',
    ],
  },
  
  // Marketing - alternatives to expensive marketing courses
  {
    schoolTitle: 'School of Growth & Marketing',
    title: 'SEO Fast Track: Rank on Google',
    summary: 'Boost your rankings: keyword research, on-page SEO, link building, and analytics.',
    description: 'Rank your website on Google without expensive agencies. Learn proven SEO strategies that work.',
    audience: 'Business owners, marketers, and content creators wanting organic traffic',
    hourlyRateNGN: 8750,
    hourlyRateUSD: 7,
    level: 'Beginner',
    learnItems: [
      '✅ Keyword research and strategy',
      '✅ On-page SEO optimization',
      '✅ Technical SEO fundamentals',
      '✅ Link building strategies',
      '✅ Rank your first website',
    ],
    modules: [
      'Module 1: SEO Foundations',
      'Module 2: Keyword Research & Strategy',
      'Module 3: On-Page Optimization',
      'Module 4: Link Building & Results',
    ],
  },
  {
    schoolTitle: 'School of Growth & Marketing',
    title: 'Social Media Marketing Accelerator',
    summary: 'Grow your audience: content strategy, engagement, ads, and analytics across platforms.',
    description: 'Master social media marketing. Build engaged communities and drive business results.',
    audience: 'Business owners, marketers, and influencers wanting social media growth',
    hourlyRateNGN: 7500,
    hourlyRateUSD: 6,
    level: 'Beginner',
    learnItems: [
      '✅ Platform strategies (Instagram, TikTok, LinkedIn, Twitter)',
      '✅ Content creation and scheduling',
      '✅ Community engagement tactics',
      '✅ Social media advertising basics',
      '✅ Analytics and optimization',
    ],
    modules: [
      'Module 1: Platform Selection & Strategy',
      'Module 2: Content That Converts',
      'Module 3: Community Building',
      'Module 4: Ads & Growth Hacking',
    ],
  },
  
  // Software Mastery - alternatives to expensive specialized courses
  {
    schoolTitle: 'School of Software Mastery',
    title: 'Backend Development Crash Course',
    summary: 'Build scalable APIs: Node.js, databases, authentication, and deployment.',
    description: 'Master backend development without the overwhelm. Build production-ready APIs.',
    audience: 'Frontend developers wanting backend skills or aspiring full-stack developers',
    hourlyRateNGN: 10000,
    hourlyRateUSD: 8,
    level: 'Intermediate',
    learnItems: [
      '✅ Node.js and Express fundamentals',
      '✅ RESTful API design',
      '✅ Database design and SQL/NoSQL',
      '✅ Authentication and security',
      '✅ Deploy production APIs',
    ],
    modules: [
      'Module 1: Node.js & Express',
      'Module 2: Database Design',
      'Module 3: Security & Authentication',
      'Module 4: Deploy Your API',
    ],
  },
  {
    schoolTitle: 'School of Software Mastery',
    title: 'Mobile App Development Quick Start',
    summary: 'Build cross-platform mobile apps with React Native for iOS and Android.',
    description: 'Ship mobile apps fast. Learn React Native and deploy to app stores.',
    audience: 'Web developers wanting to build mobile apps or aspiring mobile developers',
    hourlyRateNGN: 10000,
    hourlyRateUSD: 8,
    level: 'Intermediate',
    learnItems: [
      '✅ React Native fundamentals',
      '✅ Mobile UI components and navigation',
      '✅ API integration and state management',
      '✅ Native features (camera, location, notifications)',
      '✅ Deploy to iOS and Android stores',
    ],
    modules: [
      'Module 1: React Native Basics',
      'Module 2: Building Mobile UIs',
      'Module 3: Native Features & APIs',
      'Module 4: Deploy to App Stores',
    ],
  },
  
  // Writing - alternatives for professional writing skills
  {
    schoolTitle: 'School of Writing & Communication',
    title: 'Technical Writing Essentials',
    summary: 'Write clear documentation: API docs, user guides, tutorials, and knowledge bases.',
    description: 'Master technical writing. Create documentation developers and users actually read.',
    audience: 'Developers, product managers, and aspiring technical writers',
    hourlyRateNGN: 7500,
    hourlyRateUSD: 6,
    level: 'Beginner',
    learnItems: [
      '✅ Technical writing fundamentals',
      '✅ API documentation best practices',
      '✅ User guides and tutorials',
      '✅ Documentation tools and workflows',
      '✅ Build a technical writing portfolio',
    ],
    modules: [
      'Module 1: Technical Writing Foundations',
      'Module 2: API Documentation',
      'Module 3: User Guides & Tutorials',
      'Module 4: Portfolio & Career',
    ],
  },
  {
    schoolTitle: 'School of Writing & Communication',
    title: 'Copywriting Crash Course',
    summary: 'Write copy that sells: landing pages, emails, ads, and sales pages.',
    description: 'Learn to write persuasive copy. Drive conversions with words that sell.',
    audience: 'Marketers, entrepreneurs, and freelancers wanting copywriting skills',
    hourlyRateNGN: 8750,
    hourlyRateUSD: 7,
    level: 'Beginner',
    learnItems: [
      '✅ Copywriting principles and psychology',
      '✅ Landing page copy that converts',
      '✅ Email sequences and campaigns',
      '✅ Ad copy for social media and Google',
      '✅ Build a copywriting portfolio',
    ],
    modules: [
      'Module 1: Copywriting Fundamentals',
      'Module 2: Landing Pages & Sales Copy',
      'Module 3: Email Marketing Copy',
      'Module 4: Portfolio & Freelancing',
    ],
  },
]

async function getSchoolIdByTitle(title) {
  const school = await client.fetch(`*[_type == "school" && title == $title][0]{ _id }`, { title })
  if (!school?._id) {
    throw new Error(`School not found: "${title}"`)
  }
  return school._id
}

async function upsertCourse(schoolId, course) {
  const slug = slugify(course.title)
  const existing = await client.fetch(`*[_type == "course" && slug.current == $slug][0]{ _id }`, { slug })

  const body = buildBody(course)

  const doc = {
    _type: 'course',
    title: course.title,
    slug: { current: slug },
    order: 3, // Low order = appears early
    school: { _type: 'reference', _ref: schoolId },
    summary: course.summary,
    description: course.description,
    body: body,
    courseType: 'live',
    billingType: 'monthly',
    hourlyRateNGN: course.hourlyRateNGN,
    hourlyRateUSD: course.hourlyRateUSD,
    level: course.level,
    durationWeeks: 8,
    hoursPerWeek: 2,
    duration: '8 weeks • 2 hrs/week',
    modules: 4,
    lessons: 12,
    instructor: 'Hexadigitall Mentor',
    featured: true,
    ogTitle: course.title,
    ogDescription: course.summary,
  }

  if (existing?._id) {
    await client.patch(existing._id).set(doc).commit()
    console.log(`🔁 Updated: ${course.title}`)
    return existing._id
  } else {
    const created = await client.create(doc)
    console.log(`✅ Created: ${course.title}`)
    return created._id
  }
}

async function run() {
  try {
    console.log('🚀 Importing affordable course alternatives...\n')
    console.log('💰 Campaign: "Learn in-demand skills from NGN 25,000/month!"\n')

    const results = []
    for (const course of AFFORDABLE_COURSES) {
      const schoolId = await getSchoolIdByTitle(course.schoolTitle)
      const id = await upsertCourse(schoolId, course)
      results.push({ school: course.schoolTitle.replace('School of ', ''), title: course.title, price: `NGN ${course.hourlyRateNGN.toLocaleString()}/hr`, id })
    }

    console.log('\n\n🎉 Import complete! Summary:\n')
    results.forEach((r, i) => {
      console.log(`${i + 1}. ${r.title}`)
      console.log(`   ${r.school} | ${r.price} | ${r.id}`)
    })
    
    console.log('\n💡 Marketing Message:')
    console.log('   "Want to learn React? Kubernetes? Machine Learning?"')
    console.log('   "Start with our affordable Fast Track courses from just NGN 25,000/month!"')
  } catch (err) {
    console.error('❌ Import failed:', err)
    process.exit(1)
  }
}

run()
