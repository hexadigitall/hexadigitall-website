#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@sanity/client';

const root = process.cwd();
const curriculumDir = path.join(root, 'public', 'curriculums');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'puzezel0',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-08-30',
  useCdn: false,
});

const COURSE_BLUEPRINTS = {
  'advanced-ansible-automation': {
    track: 'devops',
    topics: [
      'Ansible Control Node Setup, Inventory Structure, and SSH Access',
      'Host Patterns, Group Variables, and Fact Gathering',
      'Playbook Structure, Tasks, and Idempotent Execution',
      'Variables, Templates, Loops, and Conditionals',
      'Handlers, Tags, Blocks, and Error Recovery',
      'Roles, Collections, and Reusable Automation Design',
      'Secrets Management with Ansible Vault',
      'Package, Service, and File Automation at Scale',
      'User Provisioning, Access Baselines, and Server Hardening',
      'AWX or Automation Controller Architecture and Job Templates',
      'Inventories, Credentials, RBAC, and Workflow Templates',
      'Dynamic Inventory for Cloud and Virtual Environments',
      'CI/CD Integration for Ansible Projects',
      'Testing Playbooks with Molecule, Linting, and Validation',
      'Patch Management, Compliance Checks, and Drift Control',
      'Network Automation with Vendor Modules and APIs',
      'Windows Automation with WinRM and PowerShell Patterns',
      'Container and Kubernetes Automation Use Cases',
      'Operational Reporting, Logging, and Governance Standards',
      'Capstone: Enterprise Automation Pipeline and Operations Handover',
    ],
  },
  'advanced-javascript-mastery': {
    track: 'programming',
    topics: [
      'Execution Context, Scope Chain, and Closures',
      'Objects, Prototypes, and Inheritance Patterns',
      'this, bind, call, apply, and Function Invocation',
      'Promises, Async or Await, and Event Loop Internals',
      'Error Handling, Retries, and Async Control Flow',
      'ES Modules, Bundling, and Code Organization',
      'Functional Patterns and Immutability Basics',
      'Design Patterns in Modern JavaScript',
      'DOM Performance and Rendering Costs',
      'Profiling, Memory Leaks, and Optimization',
      'Testing JavaScript with Unit and Integration Approaches',
      'Capstone: Architect and Optimize a Complex JavaScript Application',
    ],
  },
  'ai-engineering-mlops': {
    track: 'data',
    topics: [
      'Python Environments, Notebooks, and Reproducible Workspaces',
      'Data Collection, Labeling, and Dataset Hygiene',
      'Exploratory Data Analysis and Feature Quality Checks',
      'Feature Engineering and Dataset Splitting Strategy',
      'Baseline Models and Classical Machine Learning Workflow',
      'Model Evaluation, Metrics, and Error Analysis',
      'Hyperparameter Tuning and Experiment Tracking',
      'Packaging Models for Reuse and Deployment',
      'Data Versioning and Artifact Management',
      'MLflow for Experiment Tracking and Model Registry',
      'Containerizing Training and Inference Workloads',
      'Serving Models with FastAPI or Inference APIs',
      'Batch Inference versus Real-Time Inference',
      'Workflow Orchestration with Airflow or Kubeflow',
      'CI/CD for Machine Learning Pipelines',
      'Automated Testing for Data Pipelines and Models',
      'Feature Stores and Reusable Data Pipelines',
      'Monitoring Model Performance and Data Drift',
      'Retraining Triggers and Model Lifecycle Governance',
      'Cloud Training Jobs and Managed ML Services',
      'Security, Secrets, and Access Control for ML Systems',
      'Responsible AI, Bias, Explainability, and Auditability',
      'Capstone Build: End-to-End MLOps Platform',
      'Capstone Review, Hardening, and Stakeholder Handover',
    ],
  },
  'aws-certified-solutions-architect': {
    track: 'cloud',
    topics: [
      'AWS Global Infrastructure and Shared Responsibility Model',
      'IAM Users, Groups, Roles, and Policy Evaluation',
      'EC2 Instance Types, EBS, and Pricing Models',
      'AMIs, Auto Scaling, and Elastic Load Balancing',
      'S3 Storage Classes, Lifecycle Rules, and Static Hosting',
      'EBS, EFS, Backup, and Durable Storage Choices',
      'VPC Design, Subnets, Route Tables, and NAT',
      'Security Groups, NACLs, and Hybrid Connectivity Basics',
      'Route 53, CloudFront, and Edge Delivery Patterns',
      'RDS, DynamoDB, and Database Selection Trade-Offs',
      'CloudWatch Monitoring, Logs, and Operational Visibility',
      'High Availability, Fault Tolerance, and Disaster Recovery',
      'KMS, Secrets Management, and Security Hardening',
      'Serverless Foundations with Lambda and API Gateway',
      'Well-Architected Review and Exam Scenario Practice',
      'Capstone: Design a Secure Multi-Tier AWS Architecture',
    ],
  },
  'backend-engineering-scalable-architectures': {
    track: 'backend',
    topics: [
      'Backend Architecture Fundamentals and Request Lifecycle',
      'API Design Principles and Resource Modeling',
      'REST Conventions, Validation, and Error Contracts',
      'Node.js Runtime, Event Loop, and Concurrency Basics',
      'Service Layer Design and Clean Project Structure',
      'Relational Modeling and Query Design',
      'Indexing, Query Tuning, and Data Access Patterns',
      'Caching with Redis and HTTP Cache Strategies',
      'Authentication, Sessions, JWT, and Access Control',
      'Background Jobs, Queues, and Event-Driven Workflows',
      'File Storage, Object Stores, and CDN Integration',
      'Structured Logs, Metrics, Traces, and Observability',
      'Rate Limiting, Idempotency, and API Safety Controls',
      'Transactions, Consistency, and Distributed Trade-Offs',
      'Horizontal Scaling and Stateless Service Design',
      'Messaging, Pub/Sub, and Asynchronous Integration',
      'Retries, Circuit Breakers, Timeouts, and Resilience',
      'Containerization and Deployment Basics for Services',
      'CI/CD, Automated Testing, and Quality Gates',
      'Security Hardening, Secrets, and Dependency Risk',
      'Microservices Boundaries and Service Collaboration',
      'Performance Profiling and Bottleneck Analysis',
      'Capstone Build: Scalable Backend Service',
      'Capstone Review, Operations Readiness, and Technical Defense',
    ],
  },
  'css-fundamentals': {
    track: 'frontend',
    topics: [
      'CSS Syntax, Selectors, Cascade, and Specificity',
      'Box Model, Display, and Normal Document Flow',
      'Spacing, Sizing, and Positioning Systems',
      'Typography, Color, and Visual Hierarchy',
      'Flexbox Fundamentals for One-Dimensional Layouts',
      'Responsive Design with Media Queries',
      'CSS Grid for Two-Dimensional Layouts',
      'Complex Layout Patterns and Alignment Techniques',
      'Transitions, Transforms, and Micro-Interactions',
      'Keyframe Animations and Motion Basics',
      'Component Styling, Naming Conventions, and Reuse',
      'Capstone: Responsive Multi-Section Landing Page',
    ],
  },
  'devops-engineering-cloud-infrastructure': {
    track: 'devops',
    topics: [
      'DevOps Culture, Linux, and Shell Workflow',
      'Git Strategy, Branching, and Team Collaboration',
      'CI Pipelines with Automated Build and Test',
      'Containerization with Docker and Image Design',
      'Container Networking, Volumes, and Runtime Debugging',
      'Kubernetes Architecture and Workload Basics',
      'Kubernetes Services, Ingress, and Traffic Routing',
      'ConfigMaps, Secrets, and Stateful Workloads',
      'Helm and Kubernetes Release Management',
      'Terraform Fundamentals and Module Structure',
      'Terraform Remote State, Environments, and Drift Control',
      'Cloud Networking, IAM, and Core Platform Services',
      'CI/CD Release Strategies and Deployment Safety',
      'Observability with Metrics, Logs, and Traces',
      'DevSecOps Controls and Pipeline Security',
      'GitOps Workflows and Platform Operations',
      'Reliability Engineering and Incident Response',
      'FinOps, Capacity Planning, and Performance Tuning',
      'Capstone Platform Build',
      'Capstone Hardening and Executive Defense',
    ],
  },
  'enterprise-cloud-solutions-architect': {
    track: 'cloud',
    topics: [
      'Cloud Architecture Principles and Well-Architected Trade-Offs',
      'Identity, Access, and Tenant or Account Strategy',
      'Landing Zones, Governance, and Resource Organization',
      'Network Topology, Segmentation, and Connectivity Patterns',
      'Compute Patterns: Virtual Machines, Containers, and Serverless',
      'Storage Architecture and Data Lifecycle Design',
      'Relational, NoSQL, and Analytics Data Platforms',
      'Messaging, Eventing, and Integration Architecture',
      'API Design, Gateways, and Service Exposure',
      'Observability, Logging, and Operational Telemetry',
      'High Availability, Backup, and Disaster Recovery Design',
      'Security Baselines and Policy Enforcement',
      'Infrastructure as Code and Environment Promotion',
      'CI/CD for Platform and Application Delivery',
      'Cost Optimization and FinOps Decision-Making',
      'Multi-Region and Global Traffic Strategies',
      'Hybrid Connectivity and Enterprise Integration',
      'Kubernetes and Platform Engineering Foundations',
      'Data Protection, Encryption, and Secrets Management',
      'Compliance, Audit Evidence, and Risk Controls',
      'Migration Strategies and Workload Modernization',
      'Reference Architecture for an Enterprise Workload',
      'Capstone Review Board Simulation',
      'Final Solution Defense and Handover Pack',
    ],
  },
  'frontend-engineering-react-next-js-mastery': {
    track: 'frontend',
    topics: [
      'HTML, CSS, and Modern Frontend Tooling Refresh',
      'Modern JavaScript for React Applications',
      'React Component Architecture and JSX Patterns',
      'Props, State, and One-Way Data Flow',
      'Events, Forms, and Controlled Inputs',
      'Side Effects, Data Flow, and Lifecycle Thinking',
      'Custom Hooks and Reusable Logic',
      'Client-Side Routing and Navigation Patterns',
      'Next.js App Router and Project Structure',
      'Server Components versus Client Components',
      'Data Fetching, Caching, and Revalidation',
      'Authentication, Sessions, and Protected Routes',
      'Styling Systems and Design System Integration',
      'Building Accessible User Interface Components',
      'Forms, Validation, and Mutation Workflows',
      'API Integration and Error Handling',
      'Global State Management and Server State',
      'Testing React Components and Next.js Pages',
      'Performance Profiling and Bundle Optimization',
      'SEO, Metadata, and Content Rendering in Next.js',
      'Observability, Logging, and Frontend Reliability',
      'Deployment Pipelines and Production Environments',
      'Capstone Build: Product-Grade Next.js Application',
      'Capstone Polish, QA, and Technical Defense',
    ],
  },
  'full-stack-web-development': {
    track: 'fullstack',
    topics: [
      'HTML Semantics, Page Structure, and Forms',
      'CSS Layouts, Responsive Styling, and Components',
      'JavaScript Fundamentals for the Browser',
      'DOM Manipulation and Event-Driven UI',
      'Async JavaScript, APIs, and Fetch Workflows',
      'React Component Fundamentals',
      'State, Forms, and Routing in React',
      'Advanced Frontend Patterns and UI Reuse',
      'Node.js Runtime, npm, and Express Basics',
      'REST API Design and Middleware',
      'MongoDB Modeling and CRUD Operations',
      'Authentication, Sessions, and Authorization',
      'File Uploads, Validation, and Error Handling',
      'Deployment, Environment Variables, and Monitoring',
      'Capstone Build: Full-Stack Product Application',
      'Capstone Testing, Debugging, and Demo Delivery',
    ],
  },
  'git-github-beginners': {
    track: 'programming',
    topics: [
      'Version Control Concepts and Repository Setup',
      'Tracking Changes with Commits and History',
      'Branching for Features and Fixes',
      'Merging, Rebasing, and Conflict Resolution',
      'Ignoring Files, Tags, and Release Snapshots',
      'GitHub Repositories, Issues, and README Hygiene',
      'Pull Requests and Code Review Workflow',
      'Collaborative Branch Protection and Permissions',
      'Managing Remote Branches and Fork-Based Contribution',
      'Git Troubleshooting, Recovery, and Reflog Basics',
      'Open Source Contribution Simulation',
      'Capstone: Team Workflow from Issue to Merge',
    ],
  },
  'html-fundamentals': {
    track: 'frontend',
    topics: [
      'HTML Document Anatomy and Semantic Structure',
      'Headings, Text, Lists, and Link Patterns',
      'Images, Audio, Video, and Embedded Content',
      'Tables, Forms, and Input Validation Basics',
      'Labels, Fieldsets, and Accessible Form Structure',
      'Page Landmarks, Navigation, and Content Hierarchy',
      'SEO Metadata, Open Graph, and Structured Basics',
      'Accessibility Essentials: Alt Text, Labels, and Keyboard Flow',
      'Reusable Page Sections: Header, Main, Aside, and Footer',
      'Clean Markup, Validation, and Debugging',
      'Multi-Page Site Structure and Linking Strategy',
      'Capstone: Accessible Personal or Business Website',
    ],
  },
  'intro-to-algorithms-problem-solving': {
    track: 'programming',
    topics: [
      'Computational Thinking and Problem Decomposition',
      'Step-by-Step Algorithms and Pseudocode',
      'Variables, State, and Trace Tables',
      'Arrays, Lists, and Basic Data Handling',
      'Searching Techniques: Linear and Binary Search',
      'Sorting Concepts: Bubble, Selection, and Insertion',
      'Functions, Reuse, and Breaking Problems into Parts',
      'Recursion Fundamentals and Base Cases',
      'Intro to Complexity and Big O Reasoning',
      'Stacks, Queues, and Practical Data Structures',
      'Solving Interview-Style Logic Problems',
      'Capstone: Algorithm Walkthrough and Code Translation',
    ],
  },
  'intro-to-cloud-computing': {
    track: 'cloud',
    topics: [
      'Cloud Computing Basics and Shared Responsibility',
      'Service Models: IaaS, PaaS, and SaaS',
      'Public, Private, and Hybrid Cloud Models',
      'Core Cloud Services: Compute, Storage, and Networking',
      'Identity, Access, and Account Security Basics',
      'Virtual Machines, Containers, and Serverless Overview',
      'Cloud Databases and Managed Services',
      'Scalability, Elasticity, and High Availability',
      'Monitoring, Logging, and Cost Awareness',
      'Security, Compliance, and Backup Basics',
      'Comparing AWS, Azure, and Google Cloud',
      'Capstone: Design a Simple Cloud Solution',
    ],
  },
  'intro-to-coding': {
    track: 'programming',
    topics: [
      'How Programs Work: Input, Output, and Instructions',
      'Variables, Data Types, and Operators',
      'Conditions and Boolean Logic',
      'Loops and Repetition Patterns',
      'Functions and Reusable Code Blocks',
      'Lists, Objects, and Basic Data Structures',
      'Debugging, Errors, and Reading Stack Messages',
      'User Input, Validation, and Program Flow',
      'Working with Files or Simple Persistent Data',
      'Building a Small Console or Browser Project',
      'Refactoring, Naming, and Clean Beginner Code',
      'Capstone: Build and Present Your First Working App',
    ],
  },
  'intro-to-cybersecurity': {
    track: 'security',
    topics: [
      'Security Mindset, CIA Triad, and Attack Surface',
      'Password Security, MFA, and Identity Basics',
      'Malware, Phishing, and Social Engineering',
      'Network Security Basics and Safe Browsing',
      'Operating System Hardening and Update Hygiene',
      'Encryption, Hashing, and Data Protection',
      'Web Security Basics: HTTPS, Cookies, and Sessions',
      'Endpoint Protection and Common Security Tools',
      'Logging, Monitoring, and Incident Awareness',
      'Risk Assessment and Security Policies',
      'Personal and Small-Business Security Checklist',
      'Capstone: Secure a Sample Digital Environment',
    ],
  },
  'intro-to-data-ai': {
    track: 'data',
    topics: [
      'Data Types, Sources, and Data Quality Basics',
      'Spreadsheets, Tables, and Simple Analysis Workflows',
      'Descriptive Statistics and Summary Measures',
      'Charts, Dashboards, and Data Visualization Basics',
      'Asking Better Questions with Data',
      'Introduction to Machine Learning Concepts',
      'Supervised versus Unsupervised Learning',
      'AI Use Cases, Limitations, and Ethics',
      'Model Inputs, Outputs, and Evaluation Basics',
      'Data Cleaning and Basic Feature Thinking',
      'Telling Stories with Data and AI Insights',
      'Capstone: Simple Data-to-Insight Project',
    ],
  },
  'intro-to-design': {
    track: 'design',
    topics: [
      'Design Principles: Contrast, Alignment, and Hierarchy',
      'Color Theory and Mood in Visual Design',
      'Typography Basics and Type Pairing',
      'Layout, Spacing, and Composition',
      'Using Grids and Visual Rhythm',
      'Working with Images, Icons, and Shapes',
      'Design Tool Workflow and File Organization',
      'Designing for Screens versus Print',
      'Brand Basics: Consistency and Style',
      'Feedback, Critique, and Iteration',
      'Building a Small Design System Starter',
      'Capstone: Poster, Social Graphic, or Landing Visual',
    ],
  },
  'intro-to-digital-literacy': {
    track: 'literacy',
    topics: [
      'Computer Hardware, Operating Systems, and File Management',
      'Keyboard Shortcuts and Basic Productivity Habits',
      'Internet Browsers, Search, and Web Safety',
      'Email Setup, Etiquette, and Attachment Handling',
      'Documents, Spreadsheets, and Presentations Basics',
      'Cloud Storage and File Sharing Workflows',
      'Video Calls, Chat Tools, and Remote Collaboration',
      'Passwords, Privacy, and Online Safety',
      'Downloading, Installing, and Updating Software',
      'Troubleshooting Common Device and App Issues',
      'Organizing Work with Folders, Notes, and Calendars',
      'Capstone: Complete a Real-World Digital Office Task Set',
    ],
  },
  'intro-to-digital-marketing': {
    track: 'marketing',
    topics: [
      'Digital Marketing Channels and Funnel Basics',
      'Audience Research and Customer Personas',
      'Brand Messaging, Offers, and Positioning',
      'Social Media Content Planning',
      'SEO Fundamentals and Search Intent',
      'Email Marketing and List Building Basics',
      'Paid Ads Overview: Search, Social, and Display',
      'Landing Pages and Conversion Basics',
      'Analytics, KPIs, and Campaign Measurement',
      'Content Calendars and Workflow Management',
      'Budget Allocation and Campaign Optimization Basics',
      'Capstone: Build a Starter Marketing Plan',
    ],
  },
  'intro-to-digital-media-buying': {
    track: 'marketing',
    topics: [
      'Media Buying Fundamentals and Auction Economics',
      'CPM, CPC, CPA, and Performance Metrics',
      'Search, Social, Video, and Programmatic Channels',
      'Audience Targeting and Segmentation',
      'Budget Allocation, Bids, and Pacing',
      'Creative Briefs and Ad Format Selection',
      'Media Plans, Flighting, and Channel Mix',
      'Tracking, Pixels, and Attribution Basics',
      'Reading Platform Reports and Diagnosing Performance',
      'Brand Safety, Fraud, and Quality Controls',
      'Optimization Loops and Reporting to Stakeholders',
      'Capstone: Build and Defend a Basic Media Plan',
    ],
  },
  'intro-to-leadership-management': {
    track: 'leadership',
    topics: [
      'Leadership versus Management: Roles and Responsibilities',
      'Self-Awareness, Values, and Leadership Style',
      'Communication, Active Listening, and Clarity',
      'Delegation, Accountability, and Follow-Through',
      'Goal Setting and Prioritization',
      'Decision-Making Frameworks and Trade-Offs',
      'Giving Feedback and Running 1:1 Conversations',
      'Motivating Teams and Handling Conflict',
      'Meetings, Planning, and Execution Rhythm',
      'Coaching, Performance, and Development',
      'Managing Change and Team Alignment',
      'Capstone: Lead a Team Scenario with Action Plan',
    ],
  },
  'intro-to-networking-infrastructure': {
    track: 'cloud',
    topics: [
      'Networks, LAN or WAN, and Core Terminology',
      'OSI Model and TCP/IP in Practice',
      'IP Addressing, Subnets, and DNS Basics',
      'Routers, Switches, and Wireless Access',
      'DHCP, NAT, and Internet Connectivity',
      'Common Protocols: HTTP, HTTPS, DNS, and SMTP',
      'Cabling, Physical Infrastructure, and Topology',
      'Basic Firewall Rules and Network Security',
      'Monitoring Connectivity with Ping, Traceroute, and Logs',
      'Small Office Network Design and Documentation',
      'Troubleshooting Connectivity and Device Failures',
      'Capstone: Design and Validate a Basic Network',
    ],
  },
  'javascript-fundamentals': {
    track: 'programming',
    topics: [
      'Variables, Types, and Operators in JavaScript',
      'Conditions, Loops, and Control Flow',
      'Functions, Scope, and Reuse',
      'Arrays, Objects, and Common Methods',
      'DOM Selection and Event Handling',
      'Forms, Validation, and User Input',
      'Fetch API and Async JavaScript Basics',
      'ES6 Features: Destructuring, Spread, and Modules',
      'Error Handling, Debugging, and Developer Tools',
      'Local Storage and Browser APIs',
      'Project Structure and Clean JavaScript Habits',
      'Capstone: Build a Browser-Based JavaScript Application',
    ],
  },
  'javascript-only-projects': {
    track: 'frontend',
    topics: [
      'DOM Selection, Events, and User Interface State Basics',
      'Form Handling and Client-Side Validation',
      'Timers, Animations, and Interactive Widgets',
      'Consuming APIs with Fetch and Async or Await',
      'Local Storage and Browser Persistence',
      'Modular JavaScript and Project Organization',
      'Building a To-Do or Notes Application',
      'Building a Quiz, Game, or Calculator',
      'Search, Filter, and Sort Interface Patterns',
      'Charts, Dashboards, or Data-Driven Mini Apps',
      'Debugging, Refactoring, and Project Polish',
      'Capstone: Ship a Multi-Feature JavaScript Application',
    ],
  },
  'react-essentials-bootcamp': {
    track: 'frontend',
    topics: [
      'React Setup, JSX, and Component Basics',
      'Props, Component Composition, and Reuse',
      'Local State with useState',
      'Effects, Lifecycle Thinking, and useEffect',
      'Forms, Controlled Inputs, and Validation',
      'Lists, Conditional Rendering, and Keys',
      'Routing and Multi-Page React Applications',
      'Data Fetching, Loading States, and Error Handling',
      'Context and Shared State Patterns',
      'Performance Basics and Component Debugging',
      'Portfolio-Ready React Project Build',
      'Capstone: Deploy, Test, and Present a React Application',
    ],
  },
  'react-native-mobile-dev': {
    track: 'frontend',
    topics: [
      'React Native Project Setup and Core Components',
      'Flexbox Layout and Mobile Interface Patterns',
      'Navigation Stacks, Tabs, and Screen Flow',
      'State Management and Form Handling on Mobile',
      'Working with APIs and Async Storage',
      'Camera, Location, and Native Device Permissions',
      'Lists, Gestures, and Performance Basics',
      'Authentication and Secure Token Storage',
      'Offline Handling and Sync Considerations',
      'Testing on Devices and Debugging Builds',
      'App Store Readiness and Release Process',
      'Capstone: Build and Demo a Cross-Platform Mobile App',
    ],
  },
  'system-design-interviews': {
    track: 'system-design',
    topics: [
      'Interview Frameworks and Requirement Clarification',
      'Estimation, Capacity Planning, and Back-of-the-Envelope Math',
      'APIs, Clients, and Request Flow Modeling',
      'Load Balancers, Reverse Proxies, and CDN Basics',
      'Caching Strategies and Cache Invalidation',
      'Databases: SQL versus NoSQL Trade-Offs',
      'Indexing, Sharding, and Replication',
      'Message Queues and Asynchronous Processing',
      'Consistency, Availability, and CAP Trade-Offs',
      'Object Storage, Blobs, and Media Delivery',
      'Rate Limiting, Idempotency, and Abuse Protection',
      'Search Systems and Ranking Basics',
      'Real-Time Systems: WebSockets, Pub/Sub, and Streams',
      'Monitoring, Logging, and Operational Signals',
      'Reliability, Redundancy, and Disaster Recovery',
      'Security, Authentication, and Multi-Tenant Isolation',
      'Designing a URL Shortener',
      'Designing a Chat or Notification System',
      'Designing a News Feed or Social Timeline',
      'Designing an E-Commerce Checkout or Order System',
      'Designing Video or File Upload Platforms',
      'Whiteboard Practice: End-to-End Architecture Defense',
      'Mock Interview Round and Feedback Integration',
      'Final Interview Playbook, Trade-Off Narration, and Review',
    ],
  },
  'ui-ux-fundamentals': {
    track: 'design',
    topics: [
      'UX Foundations, User Needs, and Problem Framing',
      'User Research Methods and Interview Basics',
      'Personas, Journeys, and Problem Statements',
      'Information Architecture and User Flows',
      'Wireframing Low-Fidelity Screens',
      'Visual Hierarchy, Layout, and UI Principles',
      'Color, Typography, and Component Basics',
      'Prototyping in Figma',
      'Usability Testing and Insight Synthesis',
      'Iteration, Feedback, and Design Decisions',
      'Building a Small Design System Starter',
      'Capstone: From Research to Interactive Prototype',
    ],
  },
  'ui-ux-product-design': {
    track: 'design',
    topics: [
      'Product Discovery and Problem Definition',
      'User Research Planning and Interview Synthesis',
      'Personas, Jobs to Be Done, and Experience Mapping',
      'Information Architecture and Feature Prioritization',
      'Wireframes for Core User Flows',
      'High-Fidelity User Interface Design in Figma',
      'Components, Variants, and Design Systems',
      'Interactive Prototypes and Micro-Interactions',
      'Usability Testing and Design Iteration',
      'Handoff Specifications and Developer Collaboration',
      'Portfolio Case Study Structure and Storytelling',
      'Capstone: End-to-End Product Design Case Study',
    ],
  },
  'uiux-quick-start-for-developers': {
    track: 'design',
    topics: [
      'Thinking Like a User: UX Fundamentals for Developers',
      'Reading Requirements as User Flows and Journeys',
      'Wireframes, Layout Planning, and Information Architecture',
      'Accessibility Basics Every Developer Should Know',
      'Visual Hierarchy, Spacing, and Typography in User Interfaces',
      'Design Systems, Tokens, and Reusable Components',
      'Working in Figma as a Developer',
      'Prototyping Interactions and State Changes',
      'Forms, Error States, and Usability Patterns',
      'Testing Interfaces with Real Users or Teammates',
      'Turning Feedback into Interface Iterations',
      'Capstone: Design and Build a Developer-Friendly Product Screen',
    ],
  },
};

const TRACK_RESOURCES = {
  programming: ['VS Code or another code editor', 'Git and GitHub for version control', 'Official language documentation and MDN', 'A debugger or browser developer tools'],
  frontend: ['VS Code, browser developer tools, and npm', 'React or frontend framework documentation where relevant', 'Figma or screenshots for layout reference', 'GitHub repository for weekly code review'],
  fullstack: ['VS Code, Node.js, and npm', 'Browser developer tools and API testing tool', 'GitHub repository for source control', 'Local database or cloud sandbox for backend labs'],
  backend: ['VS Code and API testing tools', 'Database client and log viewer', 'GitHub repository and CI pipeline access', 'Cloud sandbox or local container environment'],
  cloud: ['Cloud free-tier or sandbox account', 'CLI tools and console access', 'Architecture diagramming tool', 'Official provider documentation and pricing calculators'],
  security: ['Virtual lab or sandbox machine', 'Password manager and MFA-enabled accounts', 'Basic network inspection tools', 'Documentation notebook for risks and findings'],
  devops: ['Linux shell environment', 'GitHub repository and CI runner', 'Docker and Kubernetes tooling where applicable', 'Cloud sandbox for infrastructure exercises'],
  design: ['Figma or equivalent design tool', 'Screenshot library or reference board', 'Design critique notes and iteration log', 'Portfolio workspace for exported assets'],
  marketing: ['Spreadsheet for planning and reporting', 'Analytics demo account or screenshots', 'Campaign brief and creative template', 'Presentation deck for strategy reviews'],
  leadership: ['Reflection journal or decision log', 'Meeting agenda and feedback templates', 'Scenario worksheets for role-play practice', 'Team planning and prioritization board'],
  literacy: ['Laptop or desktop with office software', 'Web browser and email account', 'Cloud drive for file sharing practice', 'Task checklist for repeatable workflows'],
  data: ['Spreadsheet or notebook environment', 'Sample datasets for analysis practice', 'Charting or visualization tool', 'Experiment log and findings document'],
  'system-design': ['Whiteboard or diagramming tool', 'Capacity estimation worksheet', 'Template for architecture reviews', 'Mock interview prompts and timer'],
};

const TRACK_TIPS = {
  programming: ['Code every week instead of only reading.', 'Keep a short debugging log so patterns become obvious.', 'Explain your solution aloud before refactoring it.'],
  frontend: ['Check layouts on mobile and desktop every week.', 'Use browser developer tools aggressively for debugging.', 'Treat accessibility as part of the main build, not a final add-on.'],
  fullstack: ['Validate both happy paths and failure paths.', 'Keep frontend and backend contracts documented.', 'Test environment variable and deployment assumptions early.'],
  backend: ['Measure before optimizing.', 'Log enough detail to reproduce failures quickly.', 'Design APIs as products with clear contracts and error semantics.'],
  cloud: ['Draw the architecture before provisioning it.', 'Review security and cost impact for every new service.', 'Document rollback steps before making major changes.'],
  security: ['Think in terms of assets, threats, and controls.', 'Record evidence for every finding or mitigation.', 'Practice explaining technical risks in plain business language.'],
  devops: ['Automate the repeatable steps first.', 'Prefer observable systems over clever but opaque systems.', 'Treat documentation and runbooks as production assets.'],
  design: ['Show work early and iterate often.', 'Tie every design choice to a user need or product goal.', 'Build component consistency before polishing small details.'],
  marketing: ['Start with audience and offer before channel tactics.', 'Review performance in terms of business outcome, not vanity metrics.', 'Keep test plans small enough to learn from them quickly.'],
  leadership: ['Use reflection to improve judgment from week to week.', 'Separate urgency from importance when planning.', 'Give feedback that is specific, observable, and actionable.'],
  literacy: ['Repeat the core workflows until they feel automatic.', 'Organize files the same way every time.', 'Pause before clicking unknown links or attachments.'],
  data: ['Question the quality of the data before trusting the output.', 'Use charts to clarify decisions, not to decorate reports.', 'Document assumptions behind every conclusion.'],
  'system-design': ['Clarify requirements before drawing architecture.', 'State trade-offs explicitly instead of implying them.', 'Practice communicating structure under time pressure.'],
};

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function fileToSlug(file) {
  return file.replace(/^curriculum-/, '').replace(/\.html$/, '');
}

function textFromPortableBlock(block) {
  if (!block || typeof block !== 'object') return '';
  if (Array.isArray(block.children)) {
    return block.children.map((child) => (typeof child?.text === 'string' ? child.text : '')).join('').trim();
  }
  return '';
}

function collectStrings(value, out = []) {
  if (value == null) return out;
  if (typeof value === 'string') {
    const text = value.trim();
    if (text) out.push(text);
    return out;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, out);
    return out;
  }
  if (typeof value === 'object') {
    if (value._type === 'block') {
      const text = textFromPortableBlock(value);
      if (text) out.push(text);
      return out;
    }
    for (const inner of Object.values(value)) collectStrings(inner, out);
  }
  return out;
}

function dedupe(items) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const key = item.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(item);
    }
  }
  return out;
}

function cleanPoint(text = '') {
  return String(text)
    .replace(/^[-*\u2022\s]+/, '')
    .replace(/^[\u2705\u2714\u2713\u25CF\u25A0\u25AA\u25B6\u27A4\u2794\u27A1\uD83D\uDD39\uD83D\uDD38]+\s*/g, '')
    .trim();
}

function parseCourseSignals(course) {
  const lines = (Array.isArray(course.body) ? course.body : [])
    .map((block) => textFromPortableBlock(block))
    .filter(Boolean);

  const moduleTitles = dedupe(
    lines
      .filter((line) => /^Module\s+\d+\s*:/i.test(line))
      .map((line) => line.replace(/^Module\s+\d+\s*:\s*/i, '').trim())
      .filter(Boolean)
  );

  let inLearn = false;
  const learnPoints = [];
  for (const line of lines) {
    if (/^What You'll Learn$/i.test(line)) {
      inLearn = true;
      continue;
    }
    if (/^(Who This Course Is For|Course Outline|Module\s+\d+\s*:)/i.test(line)) {
      inLearn = false;
    }
    if (inLearn) learnPoints.push(cleanPoint(line));
  }

  const prerequisites = dedupe(collectStrings(course.prerequisites)).slice(0, 8);
  const outcomes = dedupe([...collectStrings(course.learningOutcomes), ...learnPoints]).slice(0, 10);
  const overview = [course.overview, course.summary, course.description].find((item) => typeof item === 'string' && item.trim()) || `This curriculum develops professional competence in ${course.title}.`;

  return {
    moduleTitles,
    learnPoints: dedupe(learnPoints).slice(0, 10),
    prerequisites,
    outcomes,
    overview,
  };
}

function extractImageFromExisting(html) {
  const match = html.match(/<img[^>]+src="([^"]+)"/i);
  return match?.[1] || '../og-images/school-of-coding-and-development.jpg';
}

function capstoneItems(track, topic, title) {
  const resources = TRACK_RESOURCES[track] || [];
  return [
    `Scope the final solution for ${title} around ${topic}.`,
    `Map architecture, workflow, or delivery decisions to explicit success criteria.`,
    `Integrate the strongest techniques from earlier weeks into a single coherent solution.`,
    `Prepare a clean implementation, prototype, plan, or architecture package for review.`,
    `Run end-to-end validation and capture evidence for the final demonstration.`,
    `Address risks, limitations, and trade-offs discovered during the build.`,
    `Document handover notes, next steps, and improvement opportunities.`,
    `Present the capstone using ${resources[0] || 'the course tooling'} and supporting artifacts.`,
  ];
}

function buildWeekItems(track, topic, title) {
  if (/capstone|case study|defense|handover|mock interview|final review|final solution/i.test(topic)) {
    return capstoneItems(track, topic, title);
  }

  const common = {
    programming: [
      `${topic} concepts, terminology, and implementation patterns.`,
      'Core syntax, control flow, or language behavior that matters for this week.',
      'Typical mistakes, edge cases, and debugging cues students should learn to spot early.',
      'How this topic supports larger application logic and maintainable code.',
      'Implement guided exercises focused on the weekly topic.',
      'Trace outputs, fix defects, and test expected behavior.',
      'Refactor the weekly solution for naming, structure, and reuse.',
      'Submit working code and short notes that explain the final approach.',
    ],
    frontend: [
      `${topic} principles and the user-interface decisions behind them.`,
      'Accessibility, responsiveness, and usability considerations for the weekly interface work.',
      'Layout, state, or interaction patterns that make the implementation production-ready.',
      'Common browser, rendering, or component pitfalls to catch during review.',
      'Build a working interface exercise centered on the weekly topic.',
      'Inspect behavior with developer tools and fix layout or state issues.',
      'Polish the result for clarity, responsiveness, and component reuse.',
      'Submit the weekly build with implementation notes and screenshots.',
    ],
    fullstack: [
      `${topic} architecture and how the frontend and backend responsibilities connect.`,
      'Data flow, validation, and integration concerns tied to this week’s feature set.',
      'Reliability, security, and developer-experience considerations for the implementation.',
      'Common failure modes and debugging checkpoints students should expect to encounter.',
      'Build the weekly feature across client, server, or database layers as required.',
      'Validate requests, responses, and persistence behavior with realistic test cases.',
      'Refine the implementation for maintainability and clear project structure.',
      'Submit source changes, test evidence, and a concise delivery summary.',
    ],
    backend: [
      `${topic} responsibilities within a scalable backend architecture.`,
      'Data modeling, performance, and reliability considerations for the weekly backend topic.',
      'Security, validation, and operational concerns linked to the implementation.',
      'Trade-offs and bottlenecks that appear when the design is pushed toward scale.',
      `Build or extend a service feature focused on ${topic}.`,
      'Test queries, contracts, logs, or queue behavior under expected load.',
      'Review failure handling and tighten the implementation where needed.',
      'Submit code, architecture notes, and validation evidence for the weekly feature.',
    ],
    cloud: [
      `${topic} concepts, service roles, and architectural boundaries.`,
      'Security, identity, and governance implications of the weekly cloud design choice.',
      'Reliability, performance, and cost trade-offs connected to the services in scope.',
      'Operational checkpoints, logs, and recovery concerns that matter in production.',
      'Provision or configure a lab environment focused on the weekly architecture goal.',
      'Validate permissions, networking, and service behavior with guided tests.',
      'Document misconfigurations, corrections, and final architecture choices.',
      'Submit diagrams, screenshots, or command output that prove the weekly build.',
    ],
    security: [
      `${topic} threats, controls, and defensive concepts.`,
      'How the weekly topic affects confidentiality, integrity, and availability.',
      'Detection, response, and hardening considerations tied to the controls in scope.',
      'Policy, user behavior, or technology risks students should learn to identify.',
      'Run a lab, checklist, or simulation centered on the weekly topic.',
      'Verify that the selected controls reduce exposure or improve visibility.',
      'Record findings, remediation steps, and remaining residual risk.',
      'Submit evidence, screenshots, or a short security review for the week.',
    ],
    devops: [
      `${topic} practices and how they improve delivery reliability.`,
      'Automation, observability, and operational controls related to the weekly workflow.',
      'Security, scale, and change-management concerns for the implementation.',
      'Common implementation failures and troubleshooting checkpoints to watch closely.',
      'Build or configure the weekly workflow around the topic in scope.',
      'Run validation checks, pipeline steps, or deployment tests.',
      'Capture fixes, rollback notes, and final operating guidance.',
      'Submit automation artifacts, logs, and a concise runbook update.',
    ],
    design: [
      `${topic} principles and the user or product problem it addresses.`,
      'Visual hierarchy, accessibility, and consistency considerations for the design work.',
      'Research, structure, or interface decisions that strengthen the weekly output.',
      'Common design mistakes and critique points that should be visible during review.',
      'Create the weekly wireframe, visual design, or prototype artifact.',
      'Review the work against usability goals and iterate on feedback.',
      'Prepare rationale that connects design choices to user needs.',
      'Submit the week’s design file, exports, and short reflection notes.',
    ],
    marketing: [
      `${topic} strategy and its role in the wider acquisition funnel.`,
      'Audience, message, offer, and measurement considerations for the weekly campaign work.',
      'Budget, creative, or targeting decisions that shape performance.',
      'Common execution mistakes and optimization opportunities to identify early.',
      'Build the weekly campaign asset, plan, or reporting worksheet.',
      'Review metrics or scenarios and diagnose what drives performance.',
      'Refine the plan based on business goals and audience response.',
      'Submit the strategy output with clear assumptions and next actions.',
    ],
    leadership: [
      `${topic} concepts and why they matter for effective leadership practice.`,
      'Team behavior, communication, and decision-making implications of the weekly theme.',
      'Common management mistakes and healthier alternatives relevant to the scenario.',
      'How the weekly lesson supports execution, trust, and accountability.',
      'Practice the week’s framework through a scenario, role-play, or planning exercise.',
      'Reflect on trade-offs, stakeholder impact, and communication choices.',
      'Translate the lesson into an actionable team or personal leadership plan.',
      'Submit notes, templates, or a short leadership memo for the week.',
    ],
    literacy: [
      `${topic} workflow and the practical skills needed to do it confidently.`,
      'Safety, accuracy, and repeatable habits related to the weekly workflow.',
      'Common user errors and the simplest way to avoid them.',
      'How this topic fits into day-to-day digital work.',
      `Complete the weekly task sequence for ${topic}.`,
      'Fix errors, organize outputs, and repeat the workflow correctly.',
      'Record the steps so the process can be repeated without confusion.',
      'Submit the finished task outputs and a short checklist.',
    ],
    data: [
      `${topic} concepts and the role they play in data or AI work.`,
      'Data quality, interpretation, and methodology concerns related to the weekly topic.',
      'How the weekly topic influences analysis, modeling, or decision quality.',
      'Common analytical mistakes and validation checks students should perform.',
      'Run the weekly analysis, notebook, or model workflow for the topic in scope.',
      'Inspect outputs, evaluate quality, and correct issues in the data or results.',
      'Summarize what the outputs mean and where caution is required.',
      'Submit the analysis artifact, charts, or experiment notes for the week.',
    ],
    'system-design': [
      `${topic} as a recurring system design interview problem space.`,
      'Scale assumptions, trade-offs, and bottlenecks that should be surfaced explicitly.',
      'Storage, consistency, latency, and reliability concerns relevant to the scenario.',
      'How to explain the weekly design clearly under interview time pressure.',
      'Draft a system design diagram or whiteboard walkthrough for the weekly prompt.',
      'Defend component choices with concrete reasoning and estimated scale.',
      'Review weak spots, missing assumptions, and recovery strategies.',
      'Submit the design summary and a timed explanation outline.',
    ],
  };

  return common[track] || common.programming;
}

function buildRoadmap(topics) {
  const labels = ['Foundation', 'Build', 'Integration', 'Capstone'];
  const size = Math.ceil(topics.length / 4);
  return labels.map((label, index) => {
    const start = index * size;
    const slice = topics.slice(start, start + size);
    const weekStart = start + 1;
    const weekEnd = start + slice.length;
    return {
      label,
      weeks: `Weeks ${weekStart}-${weekEnd}`,
      highlights: slice.slice(0, 3),
    };
  }).filter((item) => item.highlights.length > 0);
}

function buildProjects(title, topics, track) {
  const first = topics[Math.min(3, topics.length - 1)] || topics[0] || title;
  const middle = topics[Math.floor(topics.length / 2)] || first;
  const last = topics[topics.length - 1] || middle;

  const descriptions = {
    programming: ['Build a working code artifact that demonstrates core syntax, logic, and debugging discipline.', 'Combine mid-course skills into a cleaner, more maintainable implementation with documentation.', 'Deliver a final application or problem solution with clear explanation and reusable structure.'],
    frontend: ['Produce a polished interface build that demonstrates layout, interaction, and accessibility basics.', 'Integrate routing, state, or data-driven behavior into a more realistic user-facing feature set.', 'Ship a production-style interface or application with responsiveness, polish, and implementation notes.'],
    fullstack: ['Create a first end-to-end feature that connects UI behavior to a backend or persistence layer.', 'Expand the application with authentication, data management, or deployment concerns.', 'Deliver a full-stack capstone with testing, documentation, and a clean demo path.'],
    backend: ['Implement a core backend service with sound API and data design decisions.', 'Add scalability, reliability, or integration layers to the service and validate the behavior.', 'Present a backend capstone with architecture reasoning, operational evidence, and risk notes.'],
    cloud: ['Design and configure a foundational cloud solution with the right service boundaries.', 'Extend the solution with security, networking, or resilience controls.', 'Defend an end-to-end architecture with diagrams, configuration evidence, and operational rationale.'],
    security: ['Assess and improve the security posture of a sample environment or workflow.', 'Add layered controls, monitoring, and response readiness to the target environment.', 'Present a final security review with prioritized findings, mitigations, and evidence.'],
    devops: ['Automate a repeatable delivery or infrastructure workflow with validation built in.', 'Expand the platform with observability, security, or release-management controls.', 'Deliver a production-style DevOps platform artifact with runbooks and hardening evidence.'],
    design: ['Create a first design artifact that demonstrates structure, hierarchy, and intention.', 'Turn research or feedback into a more realistic, higher-fidelity design system or flow.', 'Present a final design case study with rationale, iterations, and polished deliverables.'],
    marketing: ['Build a channel or campaign plan grounded in audience, offer, and measurement.', 'Add optimization logic, reporting, and stakeholder-friendly presentation structure.', 'Deliver a final growth or media strategy package with assumptions, KPIs, and recommendations.'],
    leadership: ['Produce a leadership action plan rooted in communication, accountability, and execution.', 'Develop management tools for feedback, planning, or conflict handling in a realistic scenario.', 'Present a final team-leadership playbook with decisions, trade-offs, and next actions.'],
    literacy: ['Complete a realistic digital workflow and prove repeatable competence on the basic tools.', 'Bundle several office, internet, and collaboration tasks into a coordinated workflow.', 'Deliver a final practical task set that mirrors everyday digital work with confidence and accuracy.'],
    data: ['Produce a first analysis or model workflow with clean inputs and interpretable outputs.', 'Expand the work with deeper evaluation, storytelling, or operational discipline.', 'Deliver a final data or AI project with findings, limitations, and stakeholder-ready communication.'],
    'system-design': ['Solve a focused system design prompt and explain the architecture clearly.', 'Handle a more complex distributed-design scenario with trade-off analysis and scale estimates.', 'Deliver a full mock interview package with diagrams, assumptions, and polished communication.'],
  };

  const desc = descriptions[track] || descriptions.programming;

  return [
    {
      title: `Project 1: ${first}`,
      desc: desc[0],
      scope: ['Core implementation or planning artifact', 'Validation evidence and review notes', 'Short explanation of key design decisions'],
    },
    {
      title: `Project 2: ${middle}`,
      desc: desc[1],
      scope: ['Expanded workflow or integration artifact', 'Quality checks, testing, or critique evidence', 'Trade-off summary and improvement log'],
    },
    {
      title: `Project 3: ${last}`,
      desc: desc[2],
      scope: ['Final deliverable package', 'Professional walkthrough or presentation materials', 'Portfolio-ready documentation and next-step recommendations'],
    },
  ];
}

function weekBlock(week, studyTime) {
  return `
            <div class="week-block">
                <div class="week-header">
                    <span class="week-number">Week ${week.num}</span>
                    <span class="week-duration">${escapeHtml(studyTime)}</span>
                </div>
                <div class="week-topic">${escapeHtml(week.topic)}</div>
                <div class="week-content">
                    <ul>
                        ${week.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
                    </ul>
                </div>
            </div>`;
}

function renderCourse(course, existingHtml, blueprint) {
  const signals = parseCourseSignals(course);
  const imageSrc = extractImageFromExisting(existingHtml);
  const studyTime = `${course.hoursPerWeek || 2} hours/week + labs`;
  const level = course.level || 'Intermediate';
  const title = course.title;
  const slug = course.slug.current;
  const topics = blueprint.topics;
  const track = blueprint.track;
  const prerequisites = signals.prerequisites.length ? signals.prerequisites : [
    'Commitment to weekly practice, review, and project delivery.',
    'Basic digital confidence with a computer and internet-based tools.',
    'Willingness to document work and iterate based on feedback.',
  ];
  const outcomes = signals.outcomes.length ? signals.outcomes : [
    `Demonstrate practical competence in ${title}.`,
    'Apply professional workflows, terminology, and review habits to course assignments.',
    'Produce portfolio-quality outputs, documentation, or delivery artifacts.',
  ];
  const roadmap = buildRoadmap(topics);
  const resources = TRACK_RESOURCES[track] || TRACK_RESOURCES.programming;
  const tips = TRACK_TIPS[track] || TRACK_TIPS.programming;
  const weeks = topics.map((topic, index) => ({
    num: index + 1,
    topic,
    items: buildWeekItems(track, topic, title),
  }));
  const projects = buildProjects(title, topics, track);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)} - Course Curriculum</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
            --primary-color: #0078D4;
            --secondary-color: #50E6FF;
            --dark-blue: #002050;
            --text-dark: #1F1F1F;
            --text-light: #605E5C;
            --bg-light: #F5F5F5;
            --bg-white: #FFFFFF;
            --border-color: #EDEBE9;
        }
        body { font-family: 'Inter', sans-serif; line-height: 1.6; color: var(--text-dark); background: var(--bg-white); font-size: 14px; }
        .container { max-width: 1200px; margin: 0 auto; padding: 40px; }
        .brand-bar { display: flex; align-items: center; justify-content: space-between; gap: 20px; border: 1px solid var(--border-color); border-radius: 12px; padding: 16px 20px; margin-bottom: 20px; box-shadow: 0 4px 18px rgba(0, 32, 80, 0.08); }
        .brand-meta { display: flex; align-items: center; gap: 16px; }
        .brand-meta img { width: 60px; height: auto; }
        .brand-name { font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 700; color: var(--dark-blue); }
        .brand-link { color: var(--primary-color); font-weight: 600; text-decoration: none; }
        .qr-block { display: flex; align-items: center; gap: 12px; background: var(--bg-light); padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-color); }
        .qr-block img { width: 86px; height: 86px; }
        .qr-text { font-size: 12px; color: var(--text-light); max-width: 220px; line-height: 1.5; }
        .course-hero { background: linear-gradient(135deg, #E8F4FD 0%, #F5F9FF 100%); border: 1px solid var(--border-color); border-radius: 12px; padding: 18px; margin-bottom: 24px; display: grid; grid-template-columns: 1fr 320px; gap: 20px; align-items: center; box-shadow: 0 6px 18px rgba(0, 32, 80, 0.08); }
        .course-hero img { width: 100%; border-radius: 12px; border: 1px solid var(--border-color); }
        .course-hero h2 { font-family: 'Space Grotesk', sans-serif; color: var(--dark-blue); margin-bottom: 10px; font-size: 22px; }
        .header { background: linear-gradient(135deg, var(--dark-blue) 0%, var(--primary-color) 100%); color: white; padding: 60px 40px; border-radius: 12px; margin-bottom: 40px; box-shadow: 0 10px 30px rgba(0, 120, 212, 0.2); }
        .header h1 { font-family: 'Space Grotesk', sans-serif; font-size: 42px; font-weight: 700; margin-bottom: 16px; letter-spacing: -0.5px; }
        .header .subtitle { font-size: 18px; opacity: 0.95; margin-bottom: 24px; }
        .course-meta { display: flex; flex-wrap: wrap; gap: 24px; margin-top: 32px; }
        .meta-item { display: flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.15); padding: 12px 20px; border-radius: 8px; }
        .section { margin-bottom: 48px; break-inside: avoid; }
        .section-title { font-family: 'Space Grotesk', sans-serif; font-size: 28px; color: var(--dark-blue); margin-bottom: 24px; padding-bottom: 12px; border-bottom: 3px solid var(--primary-color); display: flex; align-items: center; gap: 12px; }
        .section-title::before { content: ''; width: 6px; height: 32px; background: linear-gradient(180deg, var(--primary-color), var(--secondary-color)); border-radius: 3px; }
        .card { background: var(--bg-white); border: 1px solid var(--border-color); border-radius: 10px; padding: 24px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); }
        .card ul { margin-left: 20px; }
        .card li { margin: 6px 0; }
        .roadmap-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
        .roadmap-card { border: 1px solid var(--border-color); border-radius: 12px; padding: 18px; background: linear-gradient(135deg, #F8FBFF 0%, #FFFFFF 100%); }
        .roadmap-card h4 { color: var(--dark-blue); font-size: 18px; margin-bottom: 6px; }
        .roadmap-card p { color: var(--text-light); font-size: 13px; margin-bottom: 10px; }
        .roadmap-card ul { margin-left: 18px; }
        .week-block { border: 1px solid var(--border-color); border-left: 6px solid var(--primary-color); border-radius: 12px; padding: 16px; margin-bottom: 14px; }
        .week-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .week-number { font-weight: 700; color: var(--dark-blue); }
        .week-duration { font-size: 12px; color: var(--text-light); }
        .week-topic { color: var(--primary-color); font-family: 'Space Grotesk', sans-serif; font-size: 18px; margin-bottom: 10px; }
        .week-content ul { margin-left: 20px; }
        .week-content li { margin: 6px 0; }
        .project-card { border: 1px solid var(--border-color); border-radius: 10px; padding: 16px; margin-bottom: 12px; background: linear-gradient(135deg, #f3f8ff 0%, #ffffff 100%); }
        .project-card h4 { color: var(--dark-blue); margin-bottom: 8px; }
        .project-card p { color: var(--text-light); margin-bottom: 8px; }
        .project-card ul { margin-left: 20px; }
        .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-color); color: var(--text-light); font-size: 12px; }
        @media (max-width: 900px) {
            .course-hero { grid-template-columns: 1fr; }
            .roadmap-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="brand-bar">
            <div class="brand-meta">
                <img src="../hexadigitall-logo-transparent.png" alt="Hexadigitall logo">
                <div>
                    <div class="brand-name">Hexadigitall Academy (Hexadigitall Technologies)</div>
                    <a class="brand-link" href="https://www.hexadigitall.com">www.hexadigitall.com</a>
                </div>
            </div>
            <div class="qr-block">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://www.hexadigitall.com/courses/${escapeHtml(slug)}" alt="Course QR Code">
                <div class="qr-text">Scan to view the course page, enrollment options, and mentorship details.</div>
            </div>
        </div>

        <div class="course-hero">
            <div>
                <h2>${escapeHtml(title)}</h2>
                <p>${escapeHtml(signals.overview)}</p>
            </div>
            <img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(title)}" onerror="this.style.display='none'">
        </div>

        <div class="header">
            <h1>${escapeHtml(title)}</h1>
            <p class="subtitle">A professionally structured weekly curriculum aligned to the level, tooling, and delivery expectations of this course.</p>
            <div class="course-meta">
                <div class="meta-item"><strong>Duration:</strong> ${topics.length} Weeks</div>
                <div class="meta-item"><strong>Level:</strong> ${escapeHtml(level)}</div>
                <div class="meta-item"><strong>Study Time:</strong> ${escapeHtml(studyTime)}</div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Prerequisites</h2>
            <div class="card">
                <ul>${prerequisites.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Learning Outcomes</h2>
            <div class="card">
                <ul>${outcomes.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Learning Resources and Tooling</h2>
            <div class="card">
                <ul>${resources.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Learning Roadmap</h2>
            <div class="roadmap-grid">
                ${roadmap.map((item) => `<div class="roadmap-card"><h4>${escapeHtml(item.label)}</h4><p>${escapeHtml(item.weeks)}</p><ul>${item.highlights.map((point) => `<li>${escapeHtml(point)}</li>`).join('')}</ul></div>`).join('')}
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Detailed Weekly Curriculum</h2>
${weeks.map((week) => weekBlock(week, studyTime)).join('\n')}
        </div>

        <div class="section">
            <h2 class="section-title">Capstone Projects</h2>
            ${projects.map((project) => `<div class="project-card"><h4>${escapeHtml(project.title)}</h4><p>${escapeHtml(project.desc)}</p><ul>${project.scope.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div>`).join('')}
        </div>

        <div class="section">
            <h2 class="section-title">Study Tips</h2>
            <div class="card">
                <ul>${tips.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
            </div>
        </div>

        <div class="footer">
            <p>&copy; 2026 Hexadigitall Academy (Hexadigitall Technologies). Curriculum authored for ${escapeHtml(title)}.</p>
        </div>
    </div>
</body>
</html>`;
}

async function main() {
  const slugs = Object.keys(COURSE_BLUEPRINTS);
  const query = `*[_type == "course" && slug.current in $slugs]{
    title,
    slug,
    overview,
    summary,
    description,
    level,
    durationWeeks,
    hoursPerWeek,
    prerequisites,
    learningOutcomes,
    body
  }`;

  const courses = await client.fetch(query, { slugs });
  const bySlug = new Map(courses.map((course) => [course.slug?.current, course]));

  let rebuilt = 0;
  let missing = 0;

  for (const slug of slugs) {
    const fileName = `curriculum-${slug}.html`;
    const fullPath = path.join(curriculumDir, fileName);
    const course = bySlug.get(slug);
    const blueprint = COURSE_BLUEPRINTS[slug];

    if (!course || !fs.existsSync(fullPath)) {
      missing += 1;
      continue;
    }

    const existingHtml = fs.readFileSync(fullPath, 'utf8');
    const nextHtml = renderCourse(course, existingHtml, blueprint);
    fs.writeFileSync(fullPath, nextHtml, 'utf8');
    rebuilt += 1;
    console.log(`Rebuilt ${fileName}`);
  }

  console.log(`Professional curriculum rebuild complete. Rebuilt: ${rebuilt}, Missing: ${missing}, Targeted: ${slugs.length}`);
}

main().catch((error) => {
  console.error('Failed to rebuild professional curriculums:', error.message);
  process.exit(1);
});
