#!/usr/bin/env node
/**
 * Reformat course body descriptions to correct structure:
 * Main intro + "Who This Course Is For" + "What You'll Learn" + "Course Outline"
 * Default: DRY_RUN=true (set APPLY=1 to write)
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

// Mapping of course titles to proper body format
// Using structure: Intro + Who/What/Outline sections
const bodyFormatMap = {
  'Azure Security Technologies (AZ-500)':
    'Master Microsoft Azure security technologies with hands-on labs. Cover identity & access, platform protection, data & applications security, and security operations.\n\nWho This Course Is For\nCloud security engineers, Azure architects, and IT professionals seeking advanced security certification.\n\nWhat You\'ll Learn\n✅Master Azure identity management and access controls.\n✅Implement infrastructure and platform protection.\n✅Secure data and applications in Azure.\n✅Respond to security incidents using Azure tools.\n\nCourse Outline\nModule 1: Azure Identity & Access Management\nModule 2: Infrastructure Protection & Security\nModule 3: Data & Application Security\nModule 4: Security Operations & Response',

  'Microsoft Cybersecurity Architect (SC-100)':
    'Design enterprise security solutions at architectural scale. Master zero-trust architecture, identity governance, threat protection, and compliance frameworks.\n\nWho This Course Is For\nSenior security professionals, solutions architects, and CISOs designing enterprise-wide security strategies.\n\nWhat You\'ll Learn\n✅Design zero-trust security architectures.\n✅Implement identity and access governance at scale.\n✅Architect threat protection and response systems.\n✅Ensure compliance and risk management frameworks.\n\nCourse Outline\nModule 1: Zero-Trust Architecture & Principles\nModule 2: Enterprise Identity & Access Governance\nModule 3: Threat Protection & Incident Response\nModule 4: Compliance, Risk & Governance',

  'Security Operations Analyst (SC-200)':
    'Manage security operations and incident response using Microsoft Sentinel. Monitor threats, investigate incidents, respond to alerts, and manage SIEM systems.\n\nWho This Course Is For\nSOC analysts, incident responders, and security operations professionals.\n\nWhat You\'ll Learn\n✅Configure and manage Microsoft Sentinel for threat detection.\n✅Create detection rules and hunting queries.\n✅Investigate and respond to security incidents.\n✅Automate security operations workflows.\n\nCourse Outline\nModule 1: Threat Detection & Monitoring\nModule 2: Security Incident Investigation\nModule 3: Threat Hunting & Advanced Analytics\nModule 4: Security Orchestration & Automation',

  'Cybersecurity Fundamentals: Network & Systems Defense':
    'Start your security career with foundational knowledge of networks, systems, and defense principles. Cover firewalls, intrusion detection, and vulnerability management.\n\nWho This Course Is For\nIT professionals, help desk technicians, and anyone starting a career in cybersecurity.\n\nWhat You\'ll Learn\n✅Understand network security fundamentals and architectures.\n✅Configure and monitor firewalls and IDS/IPS systems.\n✅Identify and remediate vulnerabilities.\n✅Implement security best practices for systems and networks.\n\nCourse Outline\nModule 1: Network Security Fundamentals\nModule 2: Systems Hardening & Configuration\nModule 3: Firewall & Intrusion Detection Systems\nModule 4: Vulnerability Assessment & Management',

  'Application Security (AppSec) Specialist':
    'Secure applications from development through deployment. Master OWASP principles, code review, secure coding practices, and application security testing.\n\nWho This Course Is For\nDevelopers, security engineers, and QA professionals responsible for secure code and application security.\n\nWhat You\'ll Learn\n✅Master OWASP Top 10 vulnerabilities and mitigations.\n✅Perform secure code reviews and threat modeling.\n✅Implement secure coding practices across languages.\n✅Use automated and manual security testing tools.\n\nCourse Outline\nModule 1: OWASP & Application Vulnerabilities\nModule 2: Secure Development Lifecycle (SDLC)\nModule 3: Code Review & Threat Modeling\nModule 4: Security Testing & Scanning Tools',

  'Ethical Hacking & Penetration Testing':
    'Learn to think like attackers and break systems ethically. Master reconnaissance, scanning, exploitation, and reporting for real-world penetration testing engagements.\n\nWho This Course Is For\nSecurity professionals, ethical hackers, and penetration testers seeking hands-on practical skills.\n\nWhat You\'ll Learn\n✅Conduct active reconnaissance and passive gathering.\n✅Use scanning and enumeration tools effectively.\n✅Exploit vulnerabilities in controlled environments.\n✅Document findings and create professional penetration test reports.\n\nCourse Outline\nModule 1: Reconnaissance & Information Gathering\nModule 2: Scanning, Enumeration & Vulnerability Assessment\nModule 3: Exploitation Techniques & Tools\nModule 4: Post-Exploitation & Reporting',

  'DevOps Engineering & Cloud Infrastructure':
    'Master DevOps practices with containerization, orchestration, and infrastructure-as-code. Deploy and manage cloud infrastructure on AWS, Azure, or GCP.\n\nWho This Course Is For\nDevelopers transitioning to DevOps, system administrators, and cloud engineers.\n\nWhat You\'ll Learn\n✅Build and automate CI/CD pipelines.\n✅Containerize applications with Docker.\n✅Orchestrate containers at scale with Kubernetes.\n✅Deploy infrastructure using Terraform and cloud platforms.\n\nCourse Outline\nModule 1: CI/CD Pipelines & Automation\nModule 2: Containerization with Docker\nModule 3: Container Orchestration & Kubernetes\nModule 4: Infrastructure as Code & Cloud Deployment',

  'DevSecOps Engineering: Automating Security':
    'Integrate security into DevOps pipelines. Learn to automate security scanning, vulnerability detection, compliance checking, and implement zero-trust principles.\n\nWho This Course Is For\nDevOps engineers, security engineers, and development teams building secure CI/CD pipelines.\n\nWhat You\'ll Learn\n✅Implement security scanning in CI/CD pipelines.\n✅Integrate SAST, DAST, and container scanning tools.\n✅Automate compliance and policy enforcement.\n✅Monitor and respond to security events in real-time.\n\nCourse Outline\nModule 1: Security in CI/CD Architecture\nModule 2: Automated Security Testing (SAST/DAST)\nModule 3: Container & Infrastructure Security\nModule 4: Compliance Automation & Monitoring',

  'Enterprise Cloud Solutions Architect':
    'Design scalable, secure, and cost-effective enterprise cloud solutions. Master multi-cloud strategy, hybrid architecture, disaster recovery, and governance.\n\nWho This Course Is For\nCloud architects, infrastructure leads, and enterprise technical decision-makers.\n\nWhat You\'ll Learn\n✅Design enterprise-scale cloud architectures.\n✅Implement multi-cloud and hybrid strategies.\n✅Plan high availability, disaster recovery, and business continuity.\n✅Optimize costs and ensure compliance at scale.\n\nCourse Outline\nModule 1: Enterprise Cloud Architecture Patterns\nModule 2: Multi-Cloud & Hybrid Cloud Strategy\nModule 3: High Availability & Disaster Recovery\nModule 4: Cloud Governance & Cost Optimization',

  'Frontend Engineering: React & Next.js Mastery':
    'Build production-grade frontends with React and Next.js. Master component architecture, state management, performance optimization, and full-stack capabilities.\n\nWho This Course Is For\nJavaScript developers, career switchers, and frontend engineers seeking to master modern React and Next.js.\n\nWhat You\'ll Learn\n✅Master React fundamentals, hooks, and advanced patterns.\n✅Build scalable component architectures.\n✅Manage complex state with Redux or Zustand.\n✅Deploy server-rendered apps with Next.js.\n\nCourse Outline\nModule 1: React Fundamentals & JSX\nModule 2: Hooks & State Management\nModule 3: Component Patterns & Performance\nModule 4: Next.js & Full-Stack Development',

  'Backend Engineering: Scalable Architectures':
    'Design and build backend systems serving millions of requests. Master databases, APIs, caching strategies, and microservices architecture patterns.\n\nWho This Course Is For\nBackend developers, system architects, and engineers building scalable server-side systems.\n\nWhat You\'ll Learn\n✅Design RESTful and GraphQL APIs.\n✅Master database optimization and query performance.\n✅Implement caching and asynchronous processing.\n✅Build microservices and distributed systems.\n\nCourse Outline\nModule 1: API Design & Development\nModule 2: Database Architecture & Optimization\nModule 3: Caching, Queues & Async Processing\nModule 4: Microservices & Distributed Systems',

  'Mobile Engineering: Cross-Platform Development':
    'Build iOS and Android apps from a single codebase. Master React Native or Flutter, native modules, and app store deployment.\n\nWho This Course Is For\nMobile developers, full-stack engineers, and developers seeking cross-platform mobile skills.\n\nWhat You\'ll Learn\n✅Build cross-platform apps with React Native or Flutter.\n✅Integrate native modules and device APIs.\n✅Optimize performance and memory usage.\n✅Deploy to iOS and Android app stores.\n\nCourse Outline\nModule 1: Cross-Platform Framework Fundamentals\nModule 2: Native Modules & Device Integration\nModule 3: Performance Optimization & Testing\nModule 4: App Store Deployment & Distribution',

  'Professional Data Engineering':
    'Build data pipelines that power analytics and AI. Master ETL/ELT, data lakes, warehouses, streaming architectures, and tools like Spark and Airflow.\n\nWho This Course Is For\nData engineers, data scientists, and backend developers building data infrastructure.\n\nWhat You\'ll Learn\n✅Design and implement ETL/ELT pipelines.\n✅Build scalable data lakes and warehouses.\n✅Master batch and streaming data processing.\n✅Orchestrate workflows with Airflow and similar tools.\n\nCourse Outline\nModule 1: Data Architecture & Fundamentals\nModule 2: ETL/ELT Pipeline Design\nModule 3: Batch & Streaming Processing (Spark)\nModule 4: Data Warehousing & Orchestration',

  'AI Engineering & MLOps':
    'Deploy machine learning models to production at scale. Master model training, evaluation, deployment, monitoring, and operational best practices for ML systems.\n\nWho This Course Is For\nAI engineers, data scientists, and ML operations professionals.\n\nWhat You\'ll Learn\n✅Develop end-to-end machine learning pipelines.\n✅Build and deploy models at scale with MLflow.\n✅Implement monitoring and retraining strategies.\n✅Manage model lifecycle and drift detection.\n\nCourse Outline\nModule 1: Machine Learning Development Lifecycle\nModule 2: Model Training, Evaluation & Optimization\nModule 3: Model Deployment & Serving\nModule 4: Monitoring, Drift Detection & Retraining',
}

async function reformatBodies() {
  console.log('\n╔════════════════════════════════════════════════════════╗')
  console.log('║      REFORMAT COURSE BODY DESCRIPTIONS                ║')
  console.log('╚════════════════════════════════════════════════════════╝\n')

  for (const [title, newBody] of Object.entries(bodyFormatMap)) {
    console.log(`→ ${title}`)

    if (!APPLY) {
      console.log('   dry-run: would reformat body\n')
      continue
    }

    const courses = await client.fetch(
      `*[_type == "course" && title == $title]{_id}`,
      { title }
    )

    if (courses.length === 0) {
      console.log('   ❌ Course not found\n')
      continue
    }

    // Convert text to portable text blocks
    const blocks = newBody.split('\n\n').map((paragraph) => ({
      _type: 'block',
      style: paragraph.startsWith('✅') ? 'normal' : 'normal',
      markDefs: [],
      children: [{ _type: 'span', marks: [], text: paragraph }],
    }))

    for (const course of courses) {
      await client.patch(course._id).set({ body: blocks }).commit()
      console.log('   ✅ Updated\n')
    }
  }

  console.log(
    APPLY
      ? 'Done. All bodies reformatted.\n'
      : 'Dry-run complete. Set APPLY=1 to write changes.\n'
  )
}

reformatBodies().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
