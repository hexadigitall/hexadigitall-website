#!/usr/bin/env node

/**
 * HEXADIGITALL COURSE POPULATION SCRIPT (PRICING UPDATE - 50% OFF)
 * --------------------------------------------------
 * 1. Creates/Updates Schools
 * 2. Uploads Main & OG Images
 * 3. Converts Text to Portable Text with REQUIRED _KEYs
 * 4. Creates/Updates Courses with NEW LOWER PRICES
 */

import { createClient } from 'next-sanity';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

// ESM replacement for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// --- VALIDATION ---
if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ Missing SANITY_API_TOKEN. Please add it to your .env.local file.');
  process.exit(1);
}

// --- CONFIGURATION ---
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const IMAGES_DIR = path.join(process.cwd(), 'public', 'course-images');
const OG_IMAGES_DIR = path.join(process.cwd(), 'promotional-campaign', 'images', 'courses-og', 'landscape_1200x630');

// --- HELPER: Generate Unique Key (CRITICAL FOR SANITY EDITING) ---
function generateKey() {
  return crypto.randomUUID();
}

// --- DATA: SCHOOLS ---
const SCHOOLS = [
  { title: 'School of Executive Management', slug: 'school-of-executive-management', order: 1, icon: 'chart', desc: 'High-level strategic training for leaders.' },
  { title: 'School of Cloud & DevOps', slug: 'school-of-cloud-and-devops', order: 2, icon: 'cloud', desc: 'Master cloud infrastructure and CI/CD.' },
  { title: 'School of Cybersecurity', slug: 'school-of-cybersecurity', order: 3, icon: 'shield', desc: 'Defend the digital world.' },
  { title: 'School of Data & AI', slug: 'school-of-data-and-ai', order: 4, icon: 'database', desc: 'Unlock the power of data and AI.' },
  { title: 'School of Software Mastery', slug: 'school-of-software-mastery', order: 5, icon: 'code', desc: 'Specialized tracks for developers.' },
  { title: 'School of Coding & Development', slug: 'school-of-coding-and-development', order: 6, icon: 'terminal', desc: 'Flagship software engineering bootcamps.' },
  { title: 'School of Infrastructure', slug: 'school-of-infrastructure', order: 7, icon: 'server', desc: 'Networking and hardware engineering.' },
  { title: 'School of Design', slug: 'school-of-design', order: 8, icon: 'pen-tool', desc: 'UI/UX and Graphic Design.' },
  { title: 'School of Growth & Marketing', slug: 'school-of-growth-and-marketing', order: 9, icon: 'trending-up', desc: 'Digital marketing and SEO.' },
  { title: 'School of Fundamentals', slug: 'school-of-fundamentals', order: 10, icon: 'book', desc: 'Digital literacy and productivity.' },
];

// --- DATA: COURSES (PRICES REDUCED BY 50%) ---
const COURSES = [
  // 1. Executive Management
  {
    title: 'Project Management Professional (PMP)® Accelerator',
    slug: 'pmp-certification-prep',
    schoolSlug: 'school-of-executive-management',
    imageFile: 'project-management-fundamentals.jpg',
    pricing: { usd: 37.5, ngn: 35000 }, // Was 75 / 70k
    meta: { level: 'Advanced', duration: 12, hours: 6, modules: 6, lessons: 24 },
    summary: 'Fast-track your PMP certification with expert mentorship covering PMBOK 7th Ed, Agile, and exam strategy.',
    description: `Master the Project Management Body of Knowledge (PMBOK) and the Agile Practice Guide. This accelerator is designed to help you pass the rigorous PMP exam on your first attempt.

Who This Course Is For
- Senior Project Managers
- Team Leads and Executives
- Experienced professionals seeking PMP credential

What You'll Learn
- Master the 3 PMP Domains: People, Process, and Business Environment.
- Understand predictive, agile, and hybrid project methodologies.
- Learn to manage conflict, lead virtual teams, and negotiate project agreements.
- Develop a personalized exam strategy to pass on your first try.

Course Outline
Module 1: Creating a High-Performance Team
Module 2: Starting the Project & Planning
Module 3: Doing the Work & Managing Conflict
Module 4: Keeping the Team on Track
Module 5: Keeping the Business in Mind`
  },
  {
    title: 'Executive Agile Leadership & Transformation',
    slug: 'executive-agile-leadership',
    schoolSlug: 'school-of-executive-management',
    imageFile: 'executive-agile-leadership-transformation.jpg',
    pricing: { usd: 37.5, ngn: 35000 }, // Was 75 / 70k
    meta: { level: 'Advanced', duration: 8, hours: 4, modules: 4, lessons: 16 },
    summary: 'Learn to scale Agile across organizations. Ideal for executives leading digital transformation.',
    description: `Maps the complexities of organizational change. This course moves beyond team-level Scrum to teach you how to implement Agile frameworks at an enterprise scale.

Who This Course Is For
- Executives
- Directors
- Change Management Consultants

What You'll Learn
- Scale Agile using frameworks like SAFe and LeSS.
- Align organizational strategy with execution.
- Foster a culture of innovation and continuous improvement.
- Manage lean portfolios and value streams.

Course Outline
Module 1: The Case for Business Agility
Module 2: Leading Change and Transformation
Module 3: Scaling Agile Frameworks (SAFe)
Module 4: Lean Portfolio Management`
  },
  {
    title: 'Certified Scrum Master (CSM)® Bootcamp',
    slug: 'certified-scrum-master-csm',
    schoolSlug: 'school-of-executive-management',
    imageFile: 'certified-scrum-master-csm-bootcamp.jpg',
    pricing: { usd: 22.5, ngn: 15000 }, // Was 45 / 30k
    meta: { level: 'Intermediate', duration: 6, hours: 5, modules: 4, lessons: 12 },
    summary: 'Become a servant-leader. Master the Scrum framework to lead high-performing teams.',
    description: `Practical training to become a highly effective Scrum Master. Learn the theory, ceremonies, and artifacts of Scrum.

Who This Course Is For
- Aspiring Scrum Masters
- Project Managers
- Team Leads

What You'll Learn
- Master Scrum ceremonies: Sprint Planning, Daily Scrum, Review, and Retrospective.
- Facilitate team collaboration and remove impediments.
- Understand the roles of Product Owner, Scrum Master, and Development Team.
- Prepare for the CSM certification exam.

Course Outline
Module 1: Agile Manifesto & Scrum Basics
Module 2: Scrum Roles & Artifacts
Module 3: Scrum Events & Ceremonies
Module 4: Servant Leadership`
  },

  // 2. Cloud & DevOps
  {
    title: 'AWS Certified Solutions Architect (Associate)',
    slug: 'aws-certified-solutions-architect',
    schoolSlug: 'school-of-cloud-and-devops',
    imageFile: 'aws-certified-solutions-architect-associate-professional-.jpg',
    pricing: { usd: 37.5, ngn: 35000 }, // Was 75 / 70k
    meta: { level: 'Advanced', duration: 16, hours: 8, modules: 5, lessons: 40 },
    summary: 'Deep dive into AWS cloud architecture. Prepare for the SAA-C03 exam with hands-on labs.',
    description: `Master the art of designing resilient, high-performance, and cost-effective architectures on Amazon Web Services.

Who This Course Is For
- System Administrators
- Developers
- Aspiring Cloud Architects

What You'll Learn
- Design secure and robust architectures using EC2, S3, and VPC.
- Implement high availability and fault tolerance.
- Master IAM security policies and database management.
- Deploy infrastructure as code using Terraform basics.

Course Outline
Module 1: AWS Fundamentals & IAM
Module 2: Compute (EC2) & Storage (S3)
Module 3: Networking (VPC) & Content Delivery
Module 4: Databases & Security
Module 5: Architecture Design Principles`
  },
  {
    title: 'DevOps Engineering & Kubernetes Mastery',
    slug: 'devops-kubernetes-mastery',
    schoolSlug: 'school-of-cloud-and-devops',
    imageFile: 'devops-engineering-kubernetes-mastery.jpg',
    pricing: { usd: 37.5, ngn: 31250 }, // Was 75 / 62.5k
    meta: { level: 'Advanced', duration: 16, hours: 8, modules: 4, lessons: 32 },
    summary: 'Automate everything. Master CI/CD, Docker containerization, and Kubernetes orchestration.',
    description: `Bridge the gap between development and operations. Learn to automate software delivery and manage containerized applications at scale.

Who This Course Is For
- Developers managing infrastructure
- SysAdmins transitioning to DevOps

What You'll Learn
- Build CI/CD pipelines using Jenkins and GitHub Actions.
- Containerize applications with Docker.
- Orchestrate containers at scale using Kubernetes (K8s).
- Monitor applications with Prometheus and Grafana.

Course Outline
Module 1: DevOps Culture & CI/CD Pipelines
Module 2: Containerization with Docker
Module 3: Kubernetes Fundamentals & Architecture
Module 4: Deploying to the Cloud & Monitoring`
  },

  // 3. Cybersecurity
  {
    title: 'CISSP®: Senior Security Professional Prep',
    slug: 'cissp-certification-prep',
    schoolSlug: 'school-of-cybersecurity',
    imageFile: 'cissp-senior-security-professional-prep.jpg',
    pricing: { usd: 43.75, ngn: 35000 }, // Was 87.5 / 70k
    meta: { level: 'Advanced', duration: 24, hours: 8, modules: 8, lessons: 48 },
    summary: 'Comprehensive preparation for the rigorous CISSP exam covering all 8 domains.',
    description: `Prepare for the most prestigious certification in information security. This intensive course covers the 8 domains of the (ISC)² CISSP Common Body of Knowledge.

Who This Course Is For
- Experienced security practitioners
- IT Managers
- Security Executives

What You'll Learn
- Master Security and Risk Management.
- Understand Security Architecture and Engineering.
- Learn Identity and Access Management (IAM).
- Prepare specifically for the CISSP CAT exam.

Course Outline
Module 1: Security and Risk Management
Module 2: Asset Security & Architecture
Module 3: Communication and Network Security
Module 4: Identity and Access Management
Module 5: Security Assessment and Testing`
  },
  {
    title: 'Ethical Hacking & Penetration Testing Masterclass',
    slug: 'ethical-hacking-penetration-testing',
    schoolSlug: 'school-of-cybersecurity',
    imageFile: 'ethical-hacking-penetration-testing-masterclass.jpg',
    pricing: { usd: 31.25, ngn: 25000 }, // Was 62.5 / 50k
    meta: { level: 'Intermediate', duration: 16, hours: 6, modules: 5, lessons: 30 },
    summary: 'Learn offensive security. Hands-on labs with Kali Linux, Metasploit, and network scanning.',
    description: `Learn to think like a hacker to defend your organization. Hands-on labs with Kali Linux tools.

Who This Course Is For
- IT professionals
- Aspiring Penetration Testers
- Network Administrators

What You'll Learn
- Perform network scanning and enumeration (Nmap).
- Exploit vulnerabilities using Metasploit.
- Crack passwords and bypass authentication.
- Write professional penetration testing reports.

Course Outline
Module 1: Introduction to Ethical Hacking
Module 2: Reconnaissance & Scanning
Module 3: Exploitation Techniques
Module 4: Web Application Security
Module 5: Post-Exploitation & Reporting`
  },

  // 4. Data & AI
  {
    title: 'AI Engineering: Building LLMs & Neural Networks',
    slug: 'ai-engineering-llms',
    schoolSlug: 'school-of-data-and-ai',
    imageFile: 'ai-engineering-building-llms-neural-networks.jpg',
    pricing: { usd: 37.5, ngn: 31250 }, // Was 75 / 62.5k
    meta: { level: 'Advanced', duration: 16, hours: 10, modules: 4, lessons: 32 },
    summary: 'Learn to build, fine-tune, and deploy custom AI models and agents.',
    description: `Step into the future of technology. Learn the architecture behind models like GPT-4 and Llama.

Who This Course Is For
- Software Developers
- Data Scientists
- AI Enthusiasts

What You'll Learn
- Understand Neural Networks and Transformers.
- Build and fine-tune Large Language Models (LLMs).
- Deploy AI models using Hugging Face and PyTorch.
- Create custom AI agents and chatbots.

Course Outline
Module 1: Neural Networks Fundamentals
Module 2: Introduction to Transformers & NLP
Module 3: Fine-Tuning LLMs
Module 4: Deploying AI Applications`
  },
  {
    title: 'Python for Data Science & Analytics',
    slug: 'python-data-science-analytics',
    schoolSlug: 'school-of-data-and-ai',
    imageFile: 'python-for-data-science-analytics.jpg',
    pricing: { usd: 20, ngn: 12500 }, // Was 40 / 25k
    meta: { level: 'Beginner', duration: 12, hours: 5, modules: 4, lessons: 24 },
    summary: 'Learn Python programming specifically for data analysis using Pandas, NumPy, and Matplotlib.',
    description: `Turn raw data into insights. The perfect entry point for data careers.

Who This Course Is For
- Beginners
- Business Analysts
- Marketing Analysts

What You'll Learn
- Master Python syntax for data analysis.
- Manipulate dataframes with Pandas.
- Perform numerical analysis with NumPy.
- Create stunning visualizations with Matplotlib.

Course Outline
Module 1: Python Basics for Data
Module 2: Data Manipulation with Pandas
Module 3: Numerical Computing with NumPy
Module 4: Data Visualization`
  },

  // 5. Coding & Development (FLAGSHIP)
  {
    title: 'Full Stack Web Development Bootcamp',
    slug: 'full-stack-web-development',
    schoolSlug: 'school-of-coding-and-development',
    imageFile: 'full-stack-web-development-bootcamp-zero-to-hero-.jpg',
    pricing: { usd: 25, ngn: 15625 }, // Was 50 / 31250
    meta: { level: 'All Levels', duration: 24, hours: 10, modules: 5, lessons: 50 },
    featured: true,
    summary: 'Become a complete software engineer. Master HTML, CSS, JavaScript, React, Node.js, and Databases.',
    description: `This is the complete package. We take you from writing your first line of HTML to building complex, database-driven web applications.

Who This Course Is For
- Complete beginners
- Career switchers
- Anyone wanting a high-paying tech job

What You'll Learn
- Master HTML5, CSS3, and Modern JavaScript (ES6+).
- Build dynamic user interfaces with React.js and Next.js.
- Create robust backends with Node.js, Express, and MongoDB.
- Deploy applications to the cloud and build a professional portfolio.

Course Outline
Module 1: Web Fundamentals (HTML/CSS)
Module 2: JavaScript Deep Dive
Module 3: Frontend Engineering with React
Module 4: Backend Engineering with Node.js
Module 5: Full Stack Capstone Project`
  },
  {
    title: 'Frontend Mastery with React & Next.js',
    slug: 'frontend-mastery-react',
    schoolSlug: 'school-of-coding-and-development',
    imageFile: 'frontend-mastery-with-react-next-js.jpg',
    pricing: { usd: 20, ngn: 12500 }, // Was 40 / 25k
    meta: { level: 'Intermediate', duration: 16, hours: 6, modules: 4, lessons: 32 },
    summary: 'Specialize in building beautiful, interactive user interfaces with React and Next.js.',
    description: `Become a React Specialist. Master hooks, state management, and modern UI patterns.

Who This Course Is For
- Frontend Developers
- Designers who code
- JavaScript Developers

What You'll Learn
- Build complex UIs with React Components.
- Manage global state with Redux and Context API.
- Build SEO-friendly apps with Next.js (SSR/SSG).
- Style apps with Tailwind CSS.

Course Outline
Module 1: Advanced React Patterns
Module 2: State Management
Module 3: Next.js & Server Side Rendering
Module 4: Performance Optimization`
  },

  // 6. Infrastructure
  {
    title: 'Cisco Certified Network Associate (CCNA)',
    slug: 'ccna-networking',
    schoolSlug: 'school-of-infrastructure',
    imageFile: 'cisco-certified-network-associate-ccna-200-301.jpg',
    pricing: { usd: 18.75, ngn: 12500 }, // Was 37.5 / 25k
    meta: { level: 'Intermediate', duration: 12, hours: 6, modules: 4, lessons: 24 },
    summary: 'The foundation of networking careers. Routing, Switching, IP services, and Security.',
    description: `This course covers everything you need to install, configure, and troubleshoot enterprise networks and pass the CCNA 200-301 exam.

Who This Course Is For
- Aspiring Network Engineers
- Help Desk Technicians
- IT Professionals

What You'll Learn
- Configure routers and switches.
- Understand IPv4/IPv6 addressing and subnetting.
- Implement IP services like DHCP, DNS, and NAT.
- Master network security fundamentals.

Course Outline
Module 1: Network Fundamentals
Module 2: Network Access & Connectivity
Module 3: IP Connectivity & Routing
Module 4: Security Fundamentals`
  },

  // 7. Design
  {
    title: 'Product Design (UI/UX) Bootcamp',
    slug: 'ui-ux-product-design',
    schoolSlug: 'school-of-design',
    imageFile: 'product-design-ui-ux-professional-bootcamp.jpg',
    pricing: { usd: 15, ngn: 10000 }, // Was 30 / 20k
    meta: { level: 'Beginner', duration: 12, hours: 5, modules: 4, lessons: 24 },
    featured: true,
    summary: 'Design user-centric digital products. Master Figma, wireframing, prototyping, and user research.',
    description: `Design the digital products people love to use. This course combines user research (UX) with visual design (UI).

Who This Course Is For
- Creative Professionals
- Empathetic Problem Solvers
- Aspiring Designers

What You'll Learn
- Master Figma for wireframing and prototyping.
- Conduct user research and create user personas.
- Understand design systems, typography, and color theory.
- Build a professional design portfolio.

Course Outline
Module 1: Introduction to User Experience (UX)
Module 2: User Research & Information Architecture
Module 3: Visual Design (UI) Principles
Module 4: Prototyping & Testing with Figma`
  },

  // 8. Growth & Marketing
  {
    title: 'Integrated Digital Marketing Strategy',
    slug: 'integrated-digital-marketing',
    schoolSlug: 'school-of-growth-and-marketing',
    imageFile: 'integrated-digital-marketing-growth-strategy.jpg',
    pricing: { usd: 12.5, ngn: 7500 }, // Was 25 / 15k
    meta: { level: 'Intermediate', duration: 8, hours: 4, modules: 4, lessons: 16 },
    summary: 'Master the full digital stack: Social Media, Email, Content, and Paid Ads.',
    description: `Stop guessing and start growing. Learn the comprehensive set of skills needed to acquire customers online.

Who This Course Is For
- Entrepreneurs
- Marketing Managers
- Freelancers

What You'll Learn
- Run profitable ad campaigns on Meta and Google.
- Build email marketing funnels that convert.
- Create content strategies that drive organic traffic.
- Analyze performance using data.

Course Outline
Module 1: Marketing Strategy & Buyer Personas
Module 2: Social Media Marketing & Ads
Module 3: Email Marketing & Automation
Module 4: Analytics & Optimization`
  },

  // 9. Fundamentals
  {
    title: 'Digital Literacy & Computer Operations',
    slug: 'digital-literacy-computer-operations',
    schoolSlug: 'school-of-fundamentals',
    imageFile: 'digital-literacy-computer-operations.jpg',
    pricing: { usd: 7.5, ngn: 6250 }, // Was 15 / 12.5k
    meta: { level: 'Beginner', duration: 4, hours: 3, modules: 4, lessons: 12 },
    summary: 'Gain confidence with computers. File management, internet safety, and essential operations.',
    description: `In the 21st century, computer skills are life skills. Take yourself from fear to confidence.

Who This Course Is For
- Absolute beginners
- Seniors
- Anyone feeling "left behind" by tech

What You'll Learn
- Navigate Windows/Mac OS confidently.
- Master typing and file management.
- Use the internet safely for research.
- Understand basic cybersecurity.

Course Outline
Module 1: Hardware & Software Basics
Module 2: Mastering the Desktop
Module 3: Internet & Email
Module 4: Online Safety`
  },
  {
    title: 'Professional Office 365 Mastery',
    slug: 'professional-office-365',
    schoolSlug: 'school-of-fundamentals',
    imageFile: 'professional-office-365-suite-mastery.jpg',
    pricing: { usd: 7.5, ngn: 6250 }, // Was 15 / 12.5k
    meta: { level: 'Beginner', duration: 6, hours: 4, modules: 3, lessons: 18 },
    summary: 'Master Word, Excel, and PowerPoint for the corporate world.',
    description: `Boost your workplace productivity with advanced Office skills.

Who This Course Is For
- Students
- Office Workers
- Administrative Assistants

What You'll Learn
- Create professional documents in Word.
- Analyze data with Excel formulas and pivot tables.
- Design engaging presentations in PowerPoint.
- Collaborate using cloud features.

Course Outline
Module 1: Microsoft Word Mastery
Module 2: Excel for Business
Module 3: PowerPoint Presentations`
  }
];

// --- HELPER: Parse Text to Portable Text Blocks (With Keys) ---
function parseBodyText(text) {
  const blocks = [];
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);

  lines.forEach(line => {
    // Headers
    if (['Who This Course Is For', 'What You\'ll Learn', 'Course Outline'].includes(line)) {
      blocks.push({
        _key: generateKey(),
        _type: 'block',
        style: 'h3',
        children: [{ _key: generateKey(), _type: 'span', text: line }]
      });
      return;
    }

    // Module Items (Course Outline)
    if (line.startsWith('Module')) {
      blocks.push({
        _key: generateKey(),
        _type: 'block',
        style: 'normal',
        children: [{ _key: generateKey(), _type: 'span', text: line, marks: ['strong'] }]
      });
      return;
    }

    // Bullet Points (Handles standard dashes)
    if (line.startsWith('-')) {
      blocks.push({
        _key: generateKey(),
        _type: 'block',
        listItem: 'bullet',
        children: [{ _key: generateKey(), _type: 'span', text: line.replace(/^-\s*/, '') }]
      });
      return;
    }

    // Standard Paragraphs
    blocks.push({
      _key: generateKey(),
      _type: 'block',
      style: 'normal',
      children: [{ _key: generateKey(), _type: 'span', text: line }]
    });
  });

  return blocks;
}

// --- HELPER: Upload Image ---
async function uploadImage(imagePath) {
  if (!fs.existsSync(imagePath)) return null;
  try {
    const buffer = fs.readFileSync(imagePath);
    const asset = await client.assets.upload('image', buffer, { filename: path.basename(imagePath) });
    return { 
      _type: 'image', 
      asset: { 
        _type: 'reference', 
        _ref: asset._id 
      } 
    };
  } catch (err) {
    console.error(`Failed to upload ${path.basename(imagePath)}:`, err.message);
    return null;
  }
}

// --- MAIN EXECUTION ---
async function main() {
  console.log('🚀 Starting Sanity Content Population (Prices Reduced)...');

  // 1. Process Schools
  const schoolIdMap = {}; // slug -> _id
  console.log('\n🏫 Processing Schools...');
  
  for (const school of SCHOOLS) {
    const doc = {
      _type: 'school',
      _id: school.slug, // Deterministic ID
      title: school.title,
      slug: { _type: 'slug', current: school.slug },
      description: school.desc,
      order: school.order,
      icon: school.icon
    };

    const res = await client.createOrReplace(doc);
    schoolIdMap[school.slug] = res._id;
    console.log(`   ✓ ${school.title}`);
  }

  // 2. Process Courses
  console.log('\n📚 Processing Courses...');
  for (const course of COURSES) {
    console.log(`   ► ${course.title}`);

    // Images
    const mainImgPath = path.join(IMAGES_DIR, course.imageFile);
    // Attempt to find OG image
    const ogFilename = course.imageFile.replace(/\.(jpg|jpeg|png)$/i, '.png');
    const ogImgPath = path.join(OG_IMAGES_DIR, ogFilename);

    const mainImageRef = await uploadImage(mainImgPath);
    const ogImageRef = await uploadImage(ogImgPath);

    // Convert Body Text (Now safely includes keys)
    const bodyBlocks = parseBodyText(course.description);

    const doc = {
      _type: 'course',
      _id: course.slug, // Deterministic ID
      title: course.title,
      slug: { _type: 'slug', current: course.slug },
      order: 1, // Default order
      school: { _type: 'reference', _ref: schoolIdMap[course.schoolSlug] },
      summary: course.summary,
      
      // Pricing Logic
      courseType: 'live',
      billingType: 'monthly',
      hourlyRateUSD: course.pricing.usd,
      hourlyRateNGN: course.pricing.ngn,

      // Metadata
      durationWeeks: course.meta.duration,
      hoursPerWeek: course.meta.hours,
      duration: `${course.meta.duration} Weeks`,
      level: course.meta.level,
      modules: course.meta.modules,
      lessons: course.meta.lessons,
      certificate: true,
      featured: course.featured || false,

      // Content
      description: course.summary, // Short description
      body: bodyBlocks,
      
      // Images
      mainImage: mainImageRef,
      ogImage: ogImageRef,
      
      // SEO
      ogTitle: course.title,
      ogDescription: course.summary,
      seo: {
        title: `${course.title} | Hexadigitall`,
        description: course.summary,
        image: ogImageRef
      }
    };

    try {
      await client.createOrReplace(doc);
      console.log(`      ✅ Created/Updated`);
    } catch (err) {
      console.error(`      ❌ Error: ${err.message}`);
    }
  }

  console.log('\n🎉 Population Complete!');
}

main().catch(console.error);