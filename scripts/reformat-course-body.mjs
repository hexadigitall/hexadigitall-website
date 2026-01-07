#!/usr/bin/env node
/**
 * Reformat course body field to match proper markdown structure
 * Format:
 * - Intro/overview paragraph
 * - "Who This Course Is For" section with bullet points
 * - "What You'll Learn" section with bullet points
 * - "Course Outline" section with module list
 */

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
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

const APPLY = process.env.APPLY === '1'

// Course-specific sections (title => { who, learn, outline })
const courseContent = {
  'Azure Security Technologies (AZ-500)': {
    who: ['Security Architects', 'Cloud Engineers', 'IT Security Professionals'],
    learn: [
      'Design and implement Azure security services',
      'Implement identity and access management',
      'Protect Azure infrastructure and applications',
      'Manage data security and compliance',
      'Respond to security incidents'
    ],
    outline: [
      'Module 1: Azure Security Architecture',
      'Module 2: Identity and Access Management',
      'Module 3: Platform and Data Security',
      'Module 4: Application Security',
      'Module 5: Incident Response & Compliance'
    ]
  },
  'Microsoft Cybersecurity Architect (SC-100)': {
    who: ['Senior Security Engineers', 'Security Architects', 'Enterprise Security Leaders'],
    learn: [
      'Design zero-trust security architectures',
      'Architect identity governance solutions',
      'Design threat protection strategies',
      'Architect compliance frameworks',
      'Lead security transformation initiatives'
    ],
    outline: [
      'Module 1: Security Architecture Fundamentals',
      'Module 2: Zero-Trust Architecture',
      'Module 3: Identity Governance & Protection',
      'Module 4: Threat Protection & Management',
      'Module 5: Compliance & Data Protection'
    ]
  },
  'Security Operations Analyst (SC-200)': {
    who: ['SOC Analysts', 'Security Operators', 'Threat Hunters'],
    learn: [
      'Configure Microsoft Sentinel monitoring',
      'Detect and investigate security threats',
      'Respond to security incidents',
      'Hunt for advanced threats',
      'Manage SIEM operations'
    ],
    outline: [
      'Module 1: Threat Detection & Analysis',
      'Module 2: Incident Investigation',
      'Module 3: Threat Hunting',
      'Module 4: SIEM Operations',
      'Module 5: Incident Response Automation'
    ]
  },
  'Cybersecurity Fundamentals: Network & Systems Defense': {
    who: ['IT Professionals transitioning to Security', 'Network Administrators', 'System Administrators'],
    learn: [
      'Understand network security principles',
      'Configure firewalls and access controls',
      'Implement intrusion detection systems',
      'Perform vulnerability assessments',
      'Apply security best practices'
    ],
    outline: [
      'Module 1: Network Security Fundamentals',
      'Module 2: Systems Hardening',
      'Module 3: Firewalls & Access Control',
      'Module 4: Intrusion Detection & Prevention',
      'Module 5: Vulnerability Management'
    ]
  },
  'Application Security (AppSec) Specialist': {
    who: ['Developers', 'QA Engineers', 'Security Testers'],
    learn: [
      'Understand OWASP Top 10 vulnerabilities',
      'Perform secure code reviews',
      'Implement secure coding practices',
      'Test APIs for security',
      'Deploy applications securely'
    ],
    outline: [
      'Module 1: AppSec Fundamentals & OWASP',
      'Module 2: Secure Code Review',
      'Module 3: API Security',
      'Module 4: Application Testing & Scanning',
      'Module 5: Deployment Security'
    ]
  },
  'Ethical Hacking & Penetration Testing': {
    who: ['Penetration Testers', 'Security Auditors', 'Red Team Operators'],
    learn: [
      'Conduct reconnaissance and scanning',
      'Identify vulnerabilities ethically',
      'Execute controlled exploits',
      'Document findings professionally',
      'Provide remediation recommendations'
    ],
    outline: [
      'Module 1: Reconnaissance & Information Gathering',
      'Module 2: Vulnerability Scanning & Analysis',
      'Module 3: Exploitation Techniques',
      'Module 4: Post-Exploitation & Persistence',
      'Module 5: Reporting & Remediation'
    ]
  },
  'DevOps Engineering & Cloud Infrastructure': {
    who: ['DevOps Engineers', 'Infrastructure Engineers', 'Platform Architects'],
    learn: [
      'Design and build CI/CD pipelines',
      'Containerize and orchestrate applications',
      'Manage infrastructure as code',
      'Implement monitoring and logging',
      'Scale applications efficiently'
    ],
    outline: [
      'Module 1: CI/CD Pipeline Design',
      'Module 2: Containerization with Docker',
      'Module 3: Kubernetes Orchestration',
      'Module 4: Infrastructure as Code (Terraform)',
      'Module 5: Monitoring, Logging & Scaling'
    ]
  },
  'DevSecOps Engineering: Automating Security': {
    who: ['DevOps Engineers', 'Security Engineers', 'Pipeline Architects'],
    learn: [
      'Integrate security into CI/CD pipelines',
      'Automate vulnerability scanning',
      'Implement container security',
      'Enforce compliance checks',
      'Create secure deployment workflows'
    ],
    outline: [
      'Module 1: DevSecOps Fundamentals',
      'Module 2: SAST & DAST Automation',
      'Module 3: Container & Image Scanning',
      'Module 4: Infrastructure Security Automation',
      'Module 5: Compliance & Policy Enforcement'
    ]
  },
  'Enterprise Cloud Solutions Architect': {
    who: ['Cloud Architects', 'Enterprise Architects', 'Solution Designers'],
    learn: [
      'Design multi-cloud strategies',
      'Architect hybrid deployments',
      'Implement high availability solutions',
      'Optimize cloud costs',
      'Ensure enterprise security & compliance'
    ],
    outline: [
      'Module 1: Cloud Architecture Patterns',
      'Module 2: Multi-Cloud & Hybrid Strategy',
      'Module 3: High Availability & Disaster Recovery',
      'Module 4: Cost Optimization & Governance',
      'Module 5: Enterprise Security & Compliance'
    ]
  },
  'Frontend Engineering: React & Next.js Mastery': {
    who: ['Frontend Developers', 'Full-Stack Developers', 'Web Developers'],
    learn: [
      'Master React component patterns',
      'Implement state management solutions',
      'Build SSR apps with Next.js',
      'Optimize performance and SEO',
      'Deploy production-grade applications'
    ],
    outline: [
      'Module 1: React Fundamentals & Hooks',
      'Module 2: Advanced Patterns & Performance',
      'Module 3: Next.js Architecture & SSR',
      'Module 4: State Management (Redux, Zustand)',
      'Module 5: Testing & Production Deployment'
    ]
  },
  'Backend Engineering: Scalable Architectures': {
    who: ['Backend Developers', 'Full-Stack Developers', 'Software Architects'],
    learn: [
      'Design scalable backend systems',
      'Build RESTful and GraphQL APIs',
      'Optimize databases and caching',
      'Implement asynchronous processing',
      'Deploy microservices architectures'
    ],
    outline: [
      'Module 1: Backend Architecture Patterns',
      'Module 2: API Design (REST & GraphQL)',
      'Module 3: Database Optimization & Caching',
      'Module 4: Async Processing & Message Queues',
      'Module 5: Microservices & Deployment'
    ]
  },
  'Mobile Engineering: Cross-Platform Development': {
    who: ['Mobile Developers', 'Full-Stack Developers', 'Cross-Platform Developers'],
    learn: [
      'Build iOS and Android apps from one codebase',
      'Access native device capabilities',
      'Optimize mobile performance',
      'Deploy to app stores',
      'Debug and monitor mobile apps'
    ],
    outline: [
      'Module 1: Cross-Platform Fundamentals',
      'Module 2: Native Module Integration',
      'Module 3: Mobile UI/UX Patterns',
      'Module 4: Performance & Battery Optimization',
      'Module 5: App Store Deployment & Monitoring'
    ]
  },
  'Professional Data Engineering': {
    who: ['Data Engineers', 'ETL Developers', 'Analytics Engineers'],
    learn: [
      'Design data architecture and pipelines',
      'Process large-scale data efficiently',
      'Implement data warehouses',
      'Orchestrate complex workflows',
      'Optimize data performance'
    ],
    outline: [
      'Module 1: Data Architecture & Pipelines',
      'Module 2: ETL/ELT Patterns',
      'Module 3: Distributed Processing (Spark)',
      'Module 4: Workflow Orchestration (Airflow)',
      'Module 5: Data Warehouse & Performance Tuning'
    ]
  },
  'AI Engineering & MLOps': {
    who: ['ML Engineers', 'AI Specialists', 'Data Scientists', 'Platform Engineers'],
    learn: [
      'Develop and train ML models',
      'Operationalize machine learning',
      'Deploy models to production',
      'Monitor model performance',
      'Manage ML infrastructure'
    ],
    outline: [
      'Module 1: ML Development & Model Selection',
      'Module 2: Model Training & Evaluation',
      'Module 3: MLOps & Model Deployment',
      'Module 4: Model Monitoring & Retraining',
      'Module 5: ML Infrastructure & Scaling'
    ]
  }
}

function toPortableText(text) {
  return [
    {
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          marks: [],
          text,
        },
      ],
    },
  ]
}

function buildBody(content) {
  const blocks = []

  // Intro (single paragraph)
  blocks.push(...toPortableText(content.intro || 'Course description'))

  // Who This Course Is For
  blocks.push(...toPortableText('Who This Course Is For'))
  content.who.forEach((item) => {
    blocks.push(...toPortableText(`• ${item}`))
  })

  // What You'll Learn
  blocks.push(...toPortableText('What You\'ll Learn'))
  content.learn.forEach((item) => {
    blocks.push(...toPortableText(`• ${item}`))
  })

  // Course Outline
  blocks.push(...toPortableText('Course Outline'))
  content.outline.forEach((module) => {
    blocks.push(...toPortableText(module))
  })

  return blocks
}

async function main() {
  console.log('\nReformat course body to structured markdown (dry-run by default)\n')

  for (const [title, content] of Object.entries(courseContent)) {
    console.log(`→ ${title}`)

    const courses = await client.fetch(`*[_type == "course" && title == $title]`, { title })
    if (courses.length === 0) {
      console.log('   ⚠️  Not found\n')
      continue
    }

    const body = buildBody({ ...content, intro: courses[0].description || courses[0].summary })

    if (!APPLY) {
      console.log('   dry-run: would reformat body\n')
      continue
    }

    await client.patch(courses[0]._id).set({ body }).commit()
    console.log('   ✅ reformatted\n')
  }

  if (APPLY) {
    console.log('✅ All course bodies reformatted.')
  } else {
    console.log('⏭️  Dry-run complete. Set APPLY=1 to write changes.')
  }
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
