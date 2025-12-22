#!/usr/bin/env node

/**
 * HEXADIGITALL COURSE RESET & POPULATION (CLEAN SLATE)
 * ----------------------------------------------------
 * 1. DELETES ALL existing 'course' and 'school' documents to prevent duplicates.
 * 2. RE-CREATES them with 50% discounted pricing and correct descriptions.
 * 3. Uploads images and links everything correctly.
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

// --- HELPER: Parse Text to Portable Text Blocks ---
function parseBodyText(text) {
  const blocks = [];
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);

  lines.forEach(line => {
    if (['Who This Course Is For', 'What You\'ll Learn', 'Course Outline'].includes(line)) {
      blocks.push({
        _key: generateKey(),
        _type: 'block',
        style: 'h3',
        children: [{ _key: generateKey(), _type: 'span', text: line }]
      });
      return;
    }
    if (line.startsWith('Module')) {
      blocks.push({
        _key: generateKey(),
        _type: 'block',
        style: 'normal',
        children: [{ _key: generateKey(), _type: 'span', text: line, marks: ['strong'] }]
      });
      return;
    }
    if (line.startsWith('-')) {
      blocks.push({
        _key: generateKey(),
        _type: 'block',
        listItem: 'bullet',
        children: [{ _key: generateKey(), _type: 'span', text: line.replace(/^-\s*/, '') }]
      });
      return;
    }
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
    return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
  } catch (err) {
    console.error(`Failed to upload ${path.basename(imagePath)}:`, err.message);
    return null;
  }
}

// --- DATA DEFINITIONS ---
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

const ALL_COURSES = [
  // ... (COMBINED LIST OF ALL COURSES FROM PREVIOUS STEPS) ...
  // Executive Management
  {
    title: 'Project Management Professional (PMP)® Accelerator',
    slug: 'pmp-certification-prep',
    schoolSlug: 'school-of-executive-management',
    imageFile: 'project-management-fundamentals.jpg',
    pricing: { usd: 37.5, ngn: 35000 },
    meta: { level: 'Advanced', duration: 12, hours: 6, modules: 6, lessons: 24 },
    summary: 'Fast-track your PMP certification with expert mentorship covering PMBOK 7th Ed, Agile, and exam strategy.',
    description: `Master the Project Management Body of Knowledge (PMBOK) and the Agile Practice Guide. This accelerator is designed to help you pass the rigorous PMP exam on your first attempt.

Who This Course Is For
- Senior Project Managers
- Team Leads and Executives

What You'll Learn
- Master the 3 PMP Domains: People, Process, and Business Environment.
- Understand predictive, agile, and hybrid project methodologies.
- Learn to manage conflict, lead virtual teams.
- Develop a personalized exam strategy.

Course Outline
Module 1: Creating a High-Performance Team
Module 2: Starting the Project & Planning
Module 3: Doing the Work & Managing Conflict
Module 4: Keeping the Team on Track`
  },
  {
    title: 'Executive Agile Leadership & Transformation',
    slug: 'executive-agile-leadership',
    schoolSlug: 'school-of-executive-management',
    imageFile: 'executive-agile-leadership-transformation.jpg',
    pricing: { usd: 37.5, ngn: 35000 },
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
    pricing: { usd: 22.5, ngn: 15000 },
    meta: { level: 'Intermediate', duration: 6, hours: 5, modules: 4, lessons: 12 },
    summary: 'Become a servant-leader. Master the Scrum framework to lead high-performing teams.',
    description: `Practical training to become a highly effective Scrum Master. Learn the theory, ceremonies, and artifacts of Scrum.

Who This Course Is For
- Aspiring Scrum Masters
- Project Managers

What You'll Learn
- Master Scrum ceremonies.
- Facilitate team collaboration.
- Understand Scrum Roles.
- Prepare for CSM exam.

Course Outline
Module 1: Agile Manifesto & Scrum Basics
Module 2: Scrum Roles & Artifacts
Module 3: Scrum Events & Ceremonies`
  },
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
Module 3: Building MVPs`
  },

  // Cloud & DevOps
  {
    title: 'AWS Certified Solutions Architect (Associate)',
    slug: 'aws-certified-solutions-architect',
    schoolSlug: 'school-of-cloud-and-devops',
    imageFile: 'aws-certified-solutions-architect-associate-professional-.jpg',
    pricing: { usd: 37.5, ngn: 35000 },
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
Module 4: Databases & Security`
  },
  {
    title: 'DevOps Engineering & Kubernetes Mastery',
    slug: 'devops-kubernetes-mastery',
    schoolSlug: 'school-of-cloud-and-devops',
    imageFile: 'devops-engineering-kubernetes-mastery.jpg',
    pricing: { usd: 37.5, ngn: 31250 },
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
Module 3: Kubernetes Fundamentals
Module 4: Monitoring & Logging`
  },
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
Module 4: Advanced Shell Automation`
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

  // Cybersecurity
  {
    title: 'CISSP®: Senior Security Professional Prep',
    slug: 'cissp-certification-prep',
    schoolSlug: 'school-of-cybersecurity',
    imageFile: 'cissp-senior-security-professional-prep.jpg',
    pricing: { usd: 43.75, ngn: 35000 },
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
Module 4: Identity and Access Management`
  },
  {
    title: 'Ethical Hacking & Penetration Testing Masterclass',
    slug: 'ethical-hacking-penetration-testing',
    schoolSlug: 'school-of-cybersecurity',
    imageFile: 'ethical-hacking-penetration-testing-masterclass.jpg',
    pricing: { usd: 31.25, ngn: 25000 },
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
Module 4: Web Application Security`
  },
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

  // Data & AI
  {
    title: 'AI Engineering: Building LLMs & Neural Networks',
    slug: 'ai-engineering-llms',
    schoolSlug: 'school-of-data-and-ai',
    imageFile: 'ai-engineering-building-llms-neural-networks.jpg',
    pricing: { usd: 37.5, ngn: 31250 },
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
    pricing: { usd: 20, ngn: 12500 },
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
Module 4: Deep Learning Basics`
  },

  // Software Mastery
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
Module 4: Security & API Gateways`
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

  // Coding & Development
  {
    title: 'Full Stack Web Development Bootcamp',
    slug: 'full-stack-web-development',
    schoolSlug: 'school-of-coding-and-development',
    imageFile: 'full-stack-web-development-bootcamp-zero-to-hero-.jpg',
    pricing: { usd: 25, ngn: 15625 },
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
Module 4: Backend Engineering with Node.js`
  },
  {
    title: 'Frontend Mastery with React & Next.js',
    slug: 'frontend-mastery-react',
    schoolSlug: 'school-of-coding-and-development',
    imageFile: 'frontend-mastery-with-react-next-js.jpg',
    pricing: { usd: 20, ngn: 12500 },
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

  // Infrastructure
  {
    title: 'Cisco Certified Network Associate (CCNA)',
    slug: 'ccna-networking',
    schoolSlug: 'school-of-infrastructure',
    imageFile: 'cisco-certified-network-associate-ccna-200-301.jpg',
    pricing: { usd: 18.75, ngn: 12500 },
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

  // Design
  {
    title: 'Product Design (UI/UX) Bootcamp',
    slug: 'ui-ux-product-design',
    schoolSlug: 'school-of-design',
    imageFile: 'product-design-ui-ux-professional-bootcamp.jpg',
    pricing: { usd: 15, ngn: 10000 },
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

  // Growth & Marketing
  {
    title: 'Integrated Digital Marketing Strategy',
    slug: 'integrated-digital-marketing',
    schoolSlug: 'school-of-growth-and-marketing',
    imageFile: 'integrated-digital-marketing-growth-strategy.jpg',
    pricing: { usd: 12.5, ngn: 7500 },
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
Module 4: Link Building Authority`
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

  // Fundamentals
  {
    title: 'Digital Literacy & Computer Operations',
    slug: 'digital-literacy-computer-operations',
    schoolSlug: 'school-of-fundamentals',
    imageFile: 'digital-literacy-computer-operations.jpg',
    pricing: { usd: 7.5, ngn: 6250 },
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
    pricing: { usd: 7.5, ngn: 6250 },
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

// --- MAIN EXECUTION ---
async function main() {
  console.log('🚀 Starting Sanity CLEAN SLATE Migration...');
  console.log('⚠️  This will DELETE all existing schools and courses to prevent duplicates.');

  // 1. DELETE EXISTING DATA
  console.log('\n🗑️  Deleting existing data...');
  const deleteCourses = await client.delete({ query: '*[_type == "course"]' });
  const deleteSchools = await client.delete({ query: '*[_type == "school"]' });
  console.log(`   Deleted existing courses.`);
  console.log(`   Deleted existing schools.`);

  // 2. CREATE SCHOOLS
  const schoolIdMap = {};
  console.log('\n🏫 Creating Schools...');
  
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

  // 3. CREATE COURSES
  console.log('\n📚 Creating Courses...');
  for (const course of ALL_COURSES) {
    console.log(`   ► ${course.title}`);

    // Images
    const mainImgPath = path.join(IMAGES_DIR, course.imageFile);
    const ogFilename = course.imageFile.replace(/\.(jpg|jpeg|png)$/i, '.png');
    const ogImgPath = path.join(OG_IMAGES_DIR, ogFilename);

    const mainImageRef = await uploadImage(mainImgPath);
    const ogImageRef = await uploadImage(ogImgPath);

    const bodyBlocks = parseBodyText(course.description);

    const doc = {
      _type: 'course',
      _id: course.slug, // Deterministic ID
      title: course.title,
      slug: { _type: 'slug', current: course.slug },
      order: 1,
      school: { _type: 'reference', _ref: schoolIdMap[course.schoolSlug] },
      summary: course.summary,
      
      // Pricing
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

      // Content - Ensures both Short Description and Body are populated
      description: course.summary, // Short description
      body: bodyBlocks,            // Full description
      
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
      console.log(`      ✅ Created`);
    } catch (err) {
      console.error(`      ❌ Error: ${err.message}`);
    }
  }

  console.log('\n🎉 Clean Slate Population Complete!');
}

main().catch(console.error);