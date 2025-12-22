#!/usr/bin/env node

/**
 * HEXADIGITALL REMAINING COURSES POPULATION SCRIPT
 * ------------------------------------------------
 * Adds the remaining courses that were not in the first batch.
 * Uses 50% discounted pricing.
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

// --- HELPER: Generate Unique Key ---
function generateKey() {
  return crypto.randomUUID();
}

// --- DATA: REMAINING COURSES ---
const COURSES = [
  // SCHOOL OF CLOUD & DEVOPS
  {
    title: 'Advanced Ansible Automation & IaC',
    slug: 'advanced-ansible-automation',
    schoolSlug: 'school-of-cloud-and-devops',
    imageFile: 'advanced-ansible-automation-iac.jpg',
    pricing: { usd: 37.5, ngn: 31250 },
    meta: { level: 'Advanced', duration: 8, hours: 6, modules: 4, lessons: 20 },
    summary: 'Master Infrastructure as Code (IaC) with Ansible. Automate configuration management and deployment.',
    description: `Stop managing servers manually. Learn to automate complex infrastructure tasks using Ansible.

Who This Course Is For
- SysAdmins and DevOps Engineers
- Infrastructure Architects

What You'll Learn
- Write complex Ansible Playbooks and Roles.
- Manage configuration for hundreds of servers.
- Implement Ansible Tower/AWX for enterprise automation.
- Integrate Ansible into CI/CD pipelines.

Course Outline
Module 1: Ansible Architecture & Inventory
Module 2: Advanced Playbooks & Roles
Module 3: Ansible Tower & AWX
Module 4: Security & Best Practices`
  },
  {
    title: 'Linux Administration & Shell Scripting Pro',
    slug: 'linux-administration-shell-scripting',
    schoolSlug: 'school-of-cloud-and-devops',
    imageFile: 'linux-administration-shell-scripting-pro.jpg',
    pricing: { usd: 25, ngn: 20000 },
    meta: { level: 'Intermediate', duration: 10, hours: 5, modules: 5, lessons: 25 },
    summary: 'Deep dive into Linux server management and Bash scripting automation.',
    description: `The backbone of the internet is Linux. Master the command line and automate your daily tasks.

Who This Course Is For
- Aspiring SysAdmins
- Developers wanting to master the terminal

What You'll Learn
- User and permission management (chmod, chown).
- Process management and system monitoring.
- Advanced Bash scripting and automation.
- Network configuration and troubleshooting.

Course Outline
Module 1: Linux Filesystem & Permissions
Module 2: Process Management & Services
Module 3: Bash Scripting Fundamentals
Module 4: Advanced Shell Automation
Module 5: Networking & Security`
  },
  {
    title: 'Cloud Infrastructure Deployment Strategy',
    slug: 'cloud-infrastructure-strategy',
    schoolSlug: 'school-of-cloud-and-devops',
    imageFile: 'cloud-infrastructure-deployment-strategy.jpg',
    pricing: { usd: 37.5, ngn: 31250 },
    meta: { level: 'Advanced', duration: 12, hours: 6, modules: 4, lessons: 24 },
    summary: 'Strategic planning for cloud migration and hybrid infrastructure.',
    description: `Learn how to design scalable, secure, and cost-effective cloud infrastructures.

Who This Course Is For
- Cloud Architects
- IT Managers

What You'll Learn
- Assess workloads for cloud migration.
- Design for high availability and disaster recovery.
- Optimize cloud costs (FinOps).
- Manage hybrid and multi-cloud environments.

Course Outline
Module 1: Cloud Migration Strategies
Module 2: High Availability Design
Module 3: Cost Optimization (FinOps)
Module 4: Governance & Compliance`
  },

  // SCHOOL OF SOFTWARE MASTERY
  {
    title: 'Advanced Backend: Node.js & Microservices',
    slug: 'advanced-backend-nodejs',
    schoolSlug: 'school-of-software-mastery',
    imageFile: 'advanced-backend-engineering-node-js-microservices-.jpg',
    pricing: { usd: 37.5, ngn: 31250 },
    meta: { level: 'Advanced', duration: 14, hours: 8, modules: 5, lessons: 35 },
    summary: 'Build scalable microservices with Node.js, Docker, RabbitMQ, and Redis.',
    description: `Move beyond monolithic apps. Learn to architect and build distributed systems using Node.js.

Who This Course Is For
- Backend Developers
- Full Stack Engineers

What You'll Learn
- Design microservices architecture patterns.
- Implement message queues with RabbitMQ/Kafka.
- Cache strategies with Redis.
- Secure inter-service communication.

Course Outline
Module 1: Microservices Patterns
Module 2: Message Queues & Event-Driven Arch
Module 3: Caching & Performance
Module 4: Security & API Gateways
Module 5: Deployment & Orchestration`
  },
  {
    title: 'C# .NET Core Architecture',
    slug: 'c-sharp-net-core',
    schoolSlug: 'school-of-software-mastery',
    imageFile: 'c-net-core-architecture.jpg',
    pricing: { usd: 30, ngn: 25000 },
    meta: { level: 'Intermediate', duration: 12, hours: 6, modules: 4, lessons: 24 },
    summary: 'Master enterprise application development with C# and .NET Core.',
    description: `Build high-performance, cross-platform applications using the modern .NET ecosystem.

Who This Course Is For
- Enterprise Developers
- Backend Engineers

What You'll Learn
- Advanced C# concepts and LINQ.
- Build REST APIs with ASP.NET Core.
- Entity Framework Core for data access.
- Dependency Injection and Design Patterns.

Course Outline
Module 1: C# Advanced Concepts
Module 2: ASP.NET Core Web API
Module 3: Data Access with EF Core
Module 4: Enterprise Architecture Patterns`
  },
  {
    title: 'Java Enterprise Development',
    slug: 'java-enterprise-development',
    schoolSlug: 'school-of-software-mastery',
    imageFile: 'java-enterprise-development.jpg',
    pricing: { usd: 30, ngn: 25000 },
    meta: { level: 'Intermediate', duration: 12, hours: 6, modules: 4, lessons: 24 },
    summary: 'Build robust enterprise systems with Java, Spring Boot, and Hibernate.',
    description: `The standard for large-scale enterprise systems. Master Java and the Spring ecosystem.

Who This Course Is For
- Java Developers
- Enterprise Software Engineers

What You'll Learn
- Spring Boot application development.
- Hibernate and JPA for database interactions.
- RESTful API design with Spring MVC.
- Security with Spring Security.

Course Outline
Module 1: Java Core & Collections
Module 2: Spring Boot Fundamentals
Module 3: Data Persistence with Hibernate
Module 4: Spring Security & JWT`
  },
  {
    title: 'Technical Writing & API Documentation',
    slug: 'technical-writing-api-docs',
    schoolSlug: 'school-of-software-mastery',
    imageFile: 'technical-writing-api-documentation.jpg',
    pricing: { usd: 20, ngn: 15000 },
    meta: { level: 'All Levels', duration: 8, hours: 4, modules: 4, lessons: 16 },
    summary: 'Launch a career in technical writing. Learn Markdown, Swagger/OpenAPI, and user guides.',
    description: `Bridge the gap between code and users. Technical writers are in high demand in the tech industry.

Who This Course Is For
- Developers who write
- Aspiring Technical Writers

What You'll Learn
- Create clear and concise documentation.
- Document APIs using Swagger/OpenAPI.
- Master Markdown and Git for docs.
- Structure user manuals and developer guides.

Course Outline
Module 1: Principles of Technical Writing
Module 2: API Documentation (OpenAPI)
Module 3: Docs-as-Code Workflow
Module 4: Creating User Guides`
  },

  // SCHOOL OF GROWTH & MARKETING
  {
    title: 'Advanced SEO: Rank #1 on Google',
    slug: 'advanced-seo-mastery',
    schoolSlug: 'school-of-growth-and-marketing',
    imageFile: 'advanced-seo-rank-1-on-google.jpg',
    pricing: { usd: 30, ngn: 25000 },
    meta: { level: 'Advanced', duration: 10, hours: 5, modules: 5, lessons: 25 },
    summary: 'Technical SEO, Backlink strategies, and Content optimization to dominate SERPs.',
    description: `Go beyond basic keywords. Learn the technical and strategic side of Search Engine Optimization.

Who This Course Is For
- Marketing Managers
- Content Creators
- Web Developers

What You'll Learn
- Technical SEO audits and fixes.
- Advanced keyword research strategies.
- Link building and outreach.
- Local SEO and Google Business Profile.

Course Outline
Module 1: Technical SEO Fundamentals
Module 2: Advanced Keyword Strategy
Module 3: On-Page Optimization
Module 4: Link Building Authority
Module 5: Analytics & Reporting`
  },
  {
    title: 'Social Media Marketing & Community Growth',
    slug: 'social-media-community-growth',
    schoolSlug: 'school-of-growth-and-marketing',
    imageFile: 'social-media-marketing-community-growth.jpg',
    pricing: { usd: 20, ngn: 15000 },
    meta: { level: 'Intermediate', duration: 8, hours: 4, modules: 4, lessons: 16 },
    summary: 'Build loyal communities and drive engagement on Instagram, LinkedIn, and Twitter.',
    description: `Don't just post—engage. Learn to build thriving communities around your brand.

Who This Course Is For
- Social Media Managers
- Brand Builders

What You'll Learn
- Content strategy for high engagement.
- Community management best practices.
- Influencer marketing strategies.
- Analytics and ROI measurement.

Course Outline
Module 1: Platform-Specific Strategies
Module 2: Content Creation & Curation
Module 3: Community Management
Module 4: Crisis Management & Analytics`
  },
  {
    title: 'Digital Marketing for Small Businesses',
    slug: 'digital-marketing-small-business',
    schoolSlug: 'school-of-growth-and-marketing',
    imageFile: 'digital-marketing-for-small-businesses.jpg',
    pricing: { usd: 15, ngn: 12500 },
    meta: { level: 'Beginner', duration: 6, hours: 4, modules: 3, lessons: 15 },
    summary: 'Cost-effective marketing strategies specifically for SMEs and startups.',
    description: `Grow your small business on a budget. Focus on high-impact, low-cost digital strategies.

Who This Course Is For
- Small Business Owners
- Solo Entrepreneurs

What You'll Learn
- Setup Google Business Profile.
- Run low-budget Facebook Ads.
- Email marketing for customer retention.
- Basic social media presence.

Course Outline
Module 1: Setting Up Your Online Presence
Module 2: Low-Cost Advertising
Module 3: Customer Retention Strategies`
  },

  // SCHOOL OF DATA & AI
  {
    title: 'Google Analytics 4 (GA4) Mastery',
    slug: 'google-analytics-4-mastery',
    schoolSlug: 'school-of-data-and-ai',
    imageFile: 'google-analytics-4-ga4-data-mastery.jpg',
    pricing: { usd: 25, ngn: 20000 },
    meta: { level: 'Intermediate', duration: 8, hours: 4, modules: 4, lessons: 16 },
    summary: 'Master data tracking, reporting, and insights with the new GA4.',
    description: `Data is the new oil. Learn to extract actionable insights from your website traffic.

Who This Course Is For
- Marketing Analysts
- Business Owners

What You'll Learn
- GA4 vs Universal Analytics differences.
- Setting up events and conversions.
- Creating custom exploration reports.
- Analyzing user journeys.

Course Outline
Module 1: GA4 Configuration
Module 2: Events & Conversions
Module 3: Reporting & Exploration
Module 4: Attribution Modeling`
  },
  {
    title: 'Applied Machine Learning & Data Science',
    slug: 'applied-machine-learning',
    schoolSlug: 'school-of-data-and-ai',
    imageFile: 'applied-machine-learning-data-science.jpg',
    pricing: { usd: 37.5, ngn: 31250 },
    meta: { level: 'Advanced', duration: 16, hours: 8, modules: 5, lessons: 30 },
    summary: 'Build predictive models using Scikit-Learn, TensorFlow, and Python.',
    description: `Transition from analysis to prediction. Build real-world machine learning models.

Who This Course Is For
- Data Analysts
- Aspiring Data Scientists

What You'll Learn
- Supervised vs Unsupervised Learning.
- Feature engineering and selection.
- Model evaluation and tuning.
- Deploying models to production.

Course Outline
Module 1: ML Fundamentals
Module 2: Supervised Learning Algorithms
Module 3: Unsupervised Learning
Module 4: Deep Learning Basics
Module 5: Model Deployment`
  },

  // SCHOOL OF CYBERSECURITY
  {
    title: 'Enterprise Security Risk Management',
    slug: 'enterprise-security-risk',
    schoolSlug: 'school-of-cybersecurity',
    imageFile: 'enterprise-security-risk-management.jpg',
    pricing: { usd: 37.5, ngn: 31250 },
    meta: { level: 'Advanced', duration: 12, hours: 6, modules: 4, lessons: 20 },
    summary: 'Identify, assess, and mitigate security risks at an organizational level.',
    description: `Security is a business issue. Learn to speak the language of risk to executives.

Who This Course Is For
- Security Managers
- GRC Professionals

What You'll Learn
- Risk assessment methodologies (NIST, ISO).
- Business Continuity Planning.
- Compliance and Governance.
- Incident Response frameworks.

Course Outline
Module 1: Risk Assessment Frameworks
Module 2: Governance & Compliance
Module 3: Business Continuity
Module 4: Incident Response`
  },
  {
    title: 'Network Security Administration',
    slug: 'network-security-admin',
    schoolSlug: 'school-of-cybersecurity',
    imageFile: 'network-security-administration.jpg',
    pricing: { usd: 30, ngn: 25000 },
    meta: { level: 'Intermediate', duration: 12, hours: 6, modules: 4, lessons: 24 },
    summary: 'Secure network infrastructure. Firewalls, VPNs, IDS/IPS, and hardening.',
    description: `The first line of defense. Learn to harden networks against external and internal threats.

Who This Course Is For
- Network Engineers
- System Administrators

What You'll Learn
- Firewall configuration and management.
- VPN setup and secure remote access.
- Intrusion Detection Systems (IDS).
- Network hardening best practices.

Course Outline
Module 1: Perimeter Security
Module 2: Secure Access (VPN/NAC)
Module 3: Monitoring & IDS/IPS
Module 4: Wireless Security`
  },
  {
    title: 'Ethical Hacking for Beginners',
    slug: 'ethical-hacking-beginners',
    schoolSlug: 'school-of-cybersecurity',
    imageFile: 'ethical-hacking-for-beginners.jpg',
    pricing: { usd: 20, ngn: 15000 },
    meta: { level: 'Beginner', duration: 8, hours: 4, modules: 4, lessons: 16 },
    summary: 'Your first step into cybersecurity. Learn the basics of white-hat hacking.',
    description: `Start your journey into cybersecurity with safe, legal, and ethical hacking techniques.

Who This Course Is For
- Students
- IT Support Staff

What You'll Learn
- Cybersecurity fundamentals.
- Setting up a hacking lab.
- Basic reconnaissance.
- Introduction to Kali Linux.

Course Outline
Module 1: Introduction to InfoSec
Module 2: Virtual Labs Setup
Module 3: Linux Basics for Hackers
Module 4: Basic Scanning`
  },

  // SCHOOL OF CODING & DEVELOPMENT
  {
    title: 'React Native: Cross-Platform Mobile Apps',
    slug: 'react-native-mobile-dev',
    schoolSlug: 'school-of-coding-and-development',
    imageFile: 'cross-platform-mobile-app-development-react-native-.jpg',
    pricing: { usd: 30, ngn: 25000 },
    meta: { level: 'Intermediate', duration: 12, hours: 6, modules: 4, lessons: 24 },
    summary: 'Build native iOS and Android apps using JavaScript and React.',
    description: `One codebase, two platforms. Build high-performance mobile apps with React Native.

Who This Course Is For
- Web Developers
- React Developers

What You'll Learn
- React Native core components.
- Navigation and Routing.
- Native device features (Camera, GPS).
- Publishing to App Stores.

Course Outline
Module 1: React Native Basics
Module 2: Navigation & State
Module 3: Native Device API
Module 4: Deployment`
  },
  {
    title: 'Git & GitHub for Beginners',
    slug: 'git-github-beginners',
    schoolSlug: 'school-of-coding-and-development',
    imageFile: 'git-github-for-beginners.jpg',
    pricing: { usd: 10, ngn: 8000 },
    meta: { level: 'Beginner', duration: 4, hours: 3, modules: 3, lessons: 12 },
    summary: 'Version control essentials. Commit, branch, merge, and collaborate.',
    description: `The most important tool for any developer. Learn to manage your code history.

Who This Course Is For
- All Developers
- Students

What You'll Learn
- Git repositories and commits.
- Branching and Merging strategies.
- Pull Requests and Code Reviews.
- Resolving merge conflicts.

Course Outline
Module 1: Git Basics
Module 2: Branching & Merging
Module 3: Collaboration on GitHub`
  },

  // SCHOOL OF DESIGN
  {
    title: 'Motion Graphics & Visual Effects',
    slug: 'motion-graphics-vfx',
    schoolSlug: 'school-of-design',
    imageFile: 'motion-graphics-visual-effects.jpg',
    pricing: { usd: 30, ngn: 25000 },
    meta: { level: 'Intermediate', duration: 10, hours: 5, modules: 4, lessons: 20 },
    summary: 'Bring designs to life with Adobe After Effects and Premiere Pro.',
    description: `Add motion to your designs. Create stunning animations and visual effects.

Who This Course Is For
- Graphic Designers
- Video Editors

What You'll Learn
- Keyframe animation fundamentals.
- Visual effects and compositing.
- Motion tracking.
- Rendering and optimization.

Course Outline
Module 1: After Effects Interface
Module 2: Animation Principles
Module 3: Visual Effects (VFX)
Module 4: Rendering & Output`
  },
  {
    title: 'Visual Brand Design & Identity',
    slug: 'visual-brand-design',
    schoolSlug: 'school-of-design',
    imageFile: 'visual-brand-design-graphic-artistry.jpg',
    pricing: { usd: 25, ngn: 20000 },
    meta: { level: 'Intermediate', duration: 8, hours: 4, modules: 4, lessons: 16 },
    summary: 'Create cohesive brand identities. Logos, typography, and color theory.',
    description: `Design isn't just about looking good. It's about communicating a brand's essence.

Who This Course Is For
- Designers
- Brand Managers

What You'll Learn
- Logo design principles.
- Color psychology and typography.
- Creating brand style guides.
- Visual storytelling.

Course Outline
Module 1: Brand Strategy
Module 2: Logo Design
Module 3: Visual Identity Systems
Module 4: Style Guides`
  },

  // SCHOOL OF INFRASTRUCTURE
  {
    title: 'Computer Hardware Engineering',
    slug: 'computer-hardware-engineering',
    schoolSlug: 'school-of-infrastructure',
    imageFile: 'computer-hardware-engineering-system-maintenance.jpg',
    pricing: { usd: 20, ngn: 15000 },
    meta: { level: 'Beginner', duration: 8, hours: 4, modules: 4, lessons: 16 },
    summary: 'Master system maintenance, troubleshooting, and hardware assembly.',
    description: `Understand the physical components of computing. Repair and maintain computer systems.

Who This Course Is For
- IT Support Techs
- Hardware Enthusiasts

What You'll Learn
- PC assembly and disassembly.
- Hardware troubleshooting.
- Operating system installation.
- Preventive maintenance.

Course Outline
Module 1: Computer Components
Module 2: Assembly & Disassembly
Module 3: Troubleshooting
Module 4: OS & Maintenance`
  },

  // SCHOOL OF EXECUTIVE MANAGEMENT
  {
    title: 'Product Strategy & Lean Startup',
    slug: 'product-strategy-lean-startup',
    schoolSlug: 'school-of-executive-management',
    imageFile: 'product-strategy-the-lean-startup-building-mvps.jpg',
    pricing: { usd: 37.5, ngn: 31250 },
    meta: { level: 'Advanced', duration: 8, hours: 4, modules: 4, lessons: 16 },
    summary: 'Build products customers want. Validating ideas, MVPs, and Pivot strategies.',
    description: `Don't waste time building products nobody wants. Learn the Lean Startup methodology.

Who This Course Is For
- Entrepreneurs
- Product Managers

What You'll Learn
- Validating business ideas.
- Building Minimum Viable Products (MVPs).
- Build-Measure-Learn feedback loops.
- Product-Market Fit.

Course Outline
Module 1: Lean Startup Principles
Module 2: Idea Validation
Module 3: Building MVPs
Module 4: Growth Metrics`
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

    // Bullet Points
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
  console.log('🚀 Starting Sanity Population (REMAINING COURSES)...');

  // Fetch existing schools to get references
  const schools = await client.fetch(`*[_type == "school"]{_id, slug}`);
  const schoolIdMap = {};
  schools.forEach(s => {
    if (s.slug && s.slug.current) {
      schoolIdMap[s.slug.current] = s._id;
    }
  });

  console.log('✅ Loaded existing schools map');

  // Process Remaining Courses
  console.log('\n📚 Processing Remaining Courses...');
  for (const course of COURSES) {
    console.log(`   ► ${course.title}`);

    // Verify School Exists
    const schoolId = schoolIdMap[course.schoolSlug];
    if (!schoolId) {
      console.warn(`      ⚠️ School slug not found: ${course.schoolSlug}. Skipping.`);
      continue;
    }

    // Images
    const mainImgPath = path.join(IMAGES_DIR, course.imageFile);
    // OG Image logic
    const ogFilename = course.imageFile.replace(/\.(jpg|jpeg|png)$/i, '.png');
    const ogImgPath = path.join(OG_IMAGES_DIR, ogFilename);

    const mainImageRef = await uploadImage(mainImgPath);
    const ogImageRef = await uploadImage(ogImgPath);

    // Convert Body Text
    const bodyBlocks = parseBodyText(course.description);

    const doc = {
      _type: 'course',
      _id: course.slug, 
      title: course.title,
      slug: { _type: 'slug', current: course.slug },
      order: 10, // Higher order for these later additions
      school: { _type: 'reference', _ref: schoolId },
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
      featured: false,

      // Content
      description: course.summary, 
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

  console.log('\n🎉 Remaining Courses Population Complete!');
}

main().catch(console.error);