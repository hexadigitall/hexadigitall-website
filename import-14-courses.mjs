#!/usr/bin/env node
/**
 * Bulk Import Script - Add 14 new courses (improved v2)
 * Uses placeholder images and ensures all courses are created
 */

import { createClient } from '@sanity/client';
import https from 'https';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-08-30',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// Generate color-coded placeholder image URL
function getPlaceholderImage(courseTitle) {
  const colors = ['3498db', 'e74c3c', '2ecc71', 'f39c12', '9b59b6', '1abc9c', 'e67e22', 'c0392b'];
  const hash = courseTitle.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const color = colors[hash % colors.length];
  
  // Using dummyimage for reliable placeholder with text
  return `https://dummyimage.com/800x400/${color}/ffffff&text=${encodeURIComponent(courseTitle.substring(0, 20))}`;
}

// Helper to download and upload image
async function uploadImageToSanity(imageUrl) {
  try {
    const buffer = await new Promise((resolve, reject) => {
      https.get(imageUrl, (response) => {
        const chunks = [];
        response.on('data', chunk => chunks.push(chunk));
        response.on('end', () => resolve(Buffer.concat(chunks)));
        response.on('error', reject);
      }).on('error', reject);
    });

    const asset = await client.assets.upload('image', buffer, {
      filename: `course-${Date.now()}.jpg`
    });

    return {
      _type: 'image',
      asset: {
        _ref: asset._id,
        _type: 'reference'
      }
    };
  } catch (error) {
    console.error(`      ⚠️  Image upload failed, continuing without image...`);
    return null;
  }
}

// Course data with professional details
const coursesData = [
  {
    title: 'Azure Security Technologies (AZ-500)',
    school: 'School of Cybersecurity',
    summary: 'Master Microsoft Azure security technologies with hands-on labs. Cover identity & access, platform protection, data & applications security, and security operations. Prepare for AZ-500 certification with real-world scenarios.',
    description: 'Azure Security Technologies (AZ-500) is the premier Microsoft certification for cloud security professionals. This intensive course covers Azure identity management, infrastructure protection, data security, and advanced threat protection. You\'ll gain expertise in implementing security controls, managing encryption, and responding to security incidents in Azure environments. Ideal for security architects and cloud engineers transitioning to Azure.',
    courseType: 'live',
    hourlyRateUSD: 50,
    hourlyRateNGN: 42000,
    level: 'advanced'
  },
  {
    title: 'Microsoft Cybersecurity Architect (SC-100)',
    school: 'School of Cybersecurity',
    summary: 'Design enterprise security solutions with Microsoft technologies. Master zero-trust architecture, identity governance, threat protection, and compliance frameworks at architectural level.',
    description: 'The Cybersecurity Architect Expert (SC-100) certification represents the pinnacle of Microsoft security expertise. This advanced course teaches you to design comprehensive security solutions across hybrid and cloud environments. You\'ll architect zero-trust implementations, design identity and access strategies, and develop incident response frameworks. Perfect for senior security professionals and architects.',
    courseType: 'live',
    hourlyRateUSD: 56.25,
    hourlyRateNGN: 47000,
    level: 'expert'
  },
  {
    title: 'Security Operations Analyst (SC-200)',
    school: 'School of Cybersecurity',
    summary: 'Become a SOC analyst with Microsoft Sentinel expertise. Monitor threats, investigate incidents, respond to security events, and manage security information & event management (SIEM) systems.',
    description: 'As a Security Operations Analyst (SC-200), you\'ll manage Microsoft Sentinel and other security tools to detect and respond to threats. This course covers threat detection, investigation methodologies, incident response automation, and hunting techniques. You\'ll learn to configure monitoring, create detection rules, and respond to security incidents in enterprise environments.',
    courseType: 'live',
    hourlyRateUSD: 43.75,
    hourlyRateNGN: 37000,
    level: 'intermediate'
  },
  {
    title: 'Cybersecurity Fundamentals: Network & Systems Defense',
    school: 'School of Cybersecurity',
    summary: 'Start your security career with foundational knowledge of networks, systems, and defense principles. Cover firewalls, intrusion detection, vulnerability management, and security best practices.',
    description: 'This foundational course introduces cybersecurity concepts essential for any IT professional. You\'ll learn network security fundamentals, system hardening, firewall configuration, IDS/IPS concepts, and vulnerability assessment basics. Perfect for newcomers to cybersecurity or IT professionals looking to pivot into security roles.',
    courseType: 'live',
    hourlyRateUSD: 25,
    hourlyRateNGN: 20000,
    level: 'beginner'
  },
  {
    title: 'Application Security (AppSec) Specialist',
    school: 'School of Cybersecurity',
    summary: 'Secure applications from development through deployment. Master OWASP, code review, secure coding practices, API security, and application scanning tools.',
    description: 'Application Security specialists ensure software is built and deployed securely. This course covers OWASP Top 10, secure coding practices, threat modeling, code review techniques, and automated scanning. You\'ll learn to identify vulnerabilities in different application types and implement security controls at every development stage.',
    courseType: 'live',
    hourlyRateUSD: 37.5,
    hourlyRateNGN: 31250,
    level: 'advanced'
  },
  {
    title: 'Ethical Hacking & Penetration Testing',
    school: 'School of Cybersecurity',
    summary: 'Learn to think like attackers and break systems ethically. Master reconnaissance, scanning, exploitation, post-exploitation, and reporting for real-world penetration testing engagements.',
    description: 'Ethical hackers and penetration testers identify vulnerabilities before attackers do. This hands-on course covers the complete penetration testing methodology: planning, reconnaissance, vulnerability scanning, exploitation, and reporting. You\'ll use industry-standard tools and learn practical techniques used by security professionals worldwide.',
    courseType: 'live',
    hourlyRateUSD: 43.75,
    hourlyRateNGN: 35000,
    level: 'advanced'
  },
  {
    title: 'DevOps Engineering & Cloud Infrastructure',
    school: 'School of Cloud & DevOps',
    summary: 'Master DevOps practices with containerization, orchestration, and infrastructure-as-code. Deploy and manage cloud infrastructure on AWS, Azure, or GCP with automation and best practices.',
    description: 'DevOps engineers bridge development and operations to deliver software faster and more reliably. This course covers CI/CD pipelines, containerization with Docker, orchestration with Kubernetes, infrastructure-as-code (Terraform), and cloud deployment strategies. You\'ll build production-ready pipelines and manage infrastructure at scale.',
    courseType: 'live',
    hourlyRateUSD: 45,
    hourlyRateNGN: 37500,
    level: 'advanced'
  },
  {
    title: 'DevSecOps Engineering: Automating Security',
    school: 'School of Cloud & DevOps',
    summary: 'Integrate security into DevOps pipelines. Learn to automate security scanning, vulnerability detection, compliance checking, and implement zero-trust principles in CI/CD.',
    description: 'DevSecOps engineers shift left on security by integrating it into development pipelines. This course teaches automated security testing, SAST/DAST tools, container scanning, policy enforcement, and compliance automation. You\'ll create secure pipelines that catch vulnerabilities early without slowing development.',
    courseType: 'live',
    hourlyRateUSD: 43.75,
    hourlyRateNGN: 36500,
    level: 'advanced'
  },
  {
    title: 'Enterprise Cloud Solutions Architect',
    school: 'School of Cloud & DevOps',
    summary: 'Design scalable, secure, and cost-effective cloud solutions for enterprises. Master multi-cloud strategy, hybrid architecture, disaster recovery, and enterprise governance.',
    description: 'Enterprise Cloud Architects design solutions serving thousands of users across global infrastructures. This advanced course covers solution design patterns, multi-cloud strategies, high availability architectures, disaster recovery, cost optimization, and enterprise governance. You\'ll learn to balance security, performance, cost, and compliance.',
    courseType: 'live',
    hourlyRateUSD: 50,
    hourlyRateNGN: 42000,
    level: 'expert'
  },
  {
    title: 'Frontend Engineering: React & Next.js Mastery',
    school: 'School of Software Mastery',
    summary: 'Build production-grade frontends with React and Next.js. Master component architecture, state management, performance optimization, and full-stack capabilities with Next.js.',
    description: 'Frontend engineers craft user experiences with modern frameworks. This comprehensive course covers React fundamentals, advanced patterns, hooks, state management (Redux, Zustand), testing, and Next.js for server-side rendering and static generation. You\'ll build scalable, performant applications used by millions of users.',
    courseType: 'live',
    hourlyRateUSD: 40,
    hourlyRateNGN: 33500,
    level: 'intermediate'
  },
  {
    title: 'Backend Engineering: Scalable Architectures',
    school: 'School of Software Mastery',
    summary: 'Design and build backend systems serving millions of requests. Master databases, APIs, caching, message queues, and microservices architecture patterns.',
    description: 'Backend engineers build the infrastructure powering modern applications. This course covers API design (REST, GraphQL), database optimization, caching strategies, asynchronous processing, microservices, and scaling techniques. You\'ll learn to handle millions of concurrent users and petabytes of data.',
    courseType: 'live',
    hourlyRateUSD: 43.75,
    hourlyRateNGN: 36500,
    level: 'advanced'
  },
  {
    title: 'Mobile Engineering: Cross-Platform Development',
    school: 'School of Software Mastery',
    summary: 'Build iOS and Android apps from a single codebase. Master React Native or Flutter, native modules, performance optimization, and app store deployment.',
    description: 'Mobile engineers reach billions of users on smartphones worldwide. This course covers cross-platform development (React Native/Flutter), native module integration, device APIs, performance optimization, and best practices for iOS and Android. You\'ll deploy apps to millions of users.',
    courseType: 'live',
    hourlyRateUSD: 40,
    hourlyRateNGN: 33500,
    level: 'intermediate'
  },
  {
    title: 'Professional Data Engineering',
    school: 'School of Data & AI',
    summary: 'Build data pipelines that power analytics and AI. Master ETL/ELT, data lakes, warehouses, streaming, and tools like Spark, Airflow, and Snowflake.',
    description: 'Data engineers build the infrastructure for data-driven decisions. This course covers data architecture, ETL/ELT pipelines, data lakes and warehouses, distributed processing (Apache Spark), workflow orchestration (Airflow), and cloud data platforms (Snowflake, BigQuery). You\'ll handle terabytes of data efficiently.',
    courseType: 'live',
    hourlyRateUSD: 45,
    hourlyRateNGN: 37500,
    level: 'advanced'
  },
  {
    title: 'AI Engineering & MLOps',
    school: 'School of Data & AI',
    summary: 'Deploy machine learning models to production at scale. Master model training, evaluation, deployment, monitoring, and operational best practices for ML systems.',
    description: 'AI engineers deploy ML models that make real-world decisions at scale. This advanced course covers model development lifecycle, MLOps practices, containerization for models, deployment frameworks (TensorFlow Serving, MLflow), monitoring and retraining strategies. You\'ll learn to build reliable, scalable AI systems.',
    courseType: 'live',
    hourlyRateUSD: 50,
    hourlyRateNGN: 42000,
    level: 'expert'
  }
];

async function importCourses() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║      BULK IMPORT - 14 NEW COURSES (V2)                ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  // Fetch school references
  console.log('📚 Fetching school references...\n');
  const schools = await client.fetch(`*[_type == "school"] { _id, title }`);
  const schoolMap = {};
  schools.forEach(school => {
    schoolMap[school.title] = school._id;
  });

  console.log(`✅ Found ${Object.keys(schoolMap).length} schools\n`);

  let successCount = 0;
  let failureCount = 0;
  const createdCourses = [];

  for (let i = 0; i < coursesData.length; i++) {
    const courseData = coursesData[i];
    console.log(`[${i + 1}/${coursesData.length}] Importing: ${courseData.title}`);

    try {
      // Generate or upload image
      console.log(`   📸 Preparing image...`);
      let mainImage = null;
      
      try {
        const placeholderUrl = getPlaceholderImage(courseData.title);
        mainImage = await uploadImageToSanity(placeholderUrl);
      } catch (err) {
        console.log(`      ⚠️  Using no image`);
      }

      // Create course document
      const schoolId = schoolMap[courseData.school];
      if (!schoolId) {
        throw new Error(`School not found: ${courseData.school}`);
      }

      const courseDoc = {
        _type: 'course',
        title: courseData.title,
        slug: {
          _type: 'slug',
          current: courseData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        },
        school: {
          _type: 'reference',
          _ref: schoolId
        },
        summary: courseData.summary,
        description: courseData.description,
        courseType: courseData.courseType,
        hourlyRateUSD: courseData.hourlyRateUSD,
        hourlyRateNGN: courseData.hourlyRateNGN,
        level: courseData.level,
        order: 1000 + i
      };

      // Add image if available
      if (mainImage) {
        courseDoc.mainImage = mainImage;
      }

      const result = await client.create(courseDoc);
      console.log(`   ✅ Created with ID: ${result._id}`);
      console.log(`   💰 Pricing: $${courseData.hourlyRateUSD}/hr (USD) / ₦${courseData.hourlyRateNGN}/hr (NGN)\n`);
      successCount++;
      createdCourses.push({
        title: courseData.title,
        id: result._id,
        school: courseData.school
      });
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}\n`);
      failureCount++;
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('\n📊 IMPORT SUMMARY:\n');
  console.log(`   ✅ Successfully imported: ${successCount} courses`);
  console.log(`   ❌ Failed: ${failureCount} courses`);
  console.log(`   📝 Total processed: ${coursesData.length} courses\n`);

  if (successCount > 0) {
    console.log('📚 CREATED COURSES:\n');
    const coursesBySchool = {};
    createdCourses.forEach(course => {
      if (!coursesBySchool[course.school]) {
        coursesBySchool[course.school] = [];
      }
      coursesBySchool[course.school].push(course.title);
    });

    Object.entries(coursesBySchool).forEach(([school, titles]) => {
      console.log(`   🏫 ${school}`);
      titles.forEach(title => {
        console.log(`      • ${title}`);
      });
      console.log();
    });
  }

  if (successCount === coursesData.length) {
    console.log('🎉 All courses imported successfully!\n');
  } else if (successCount > 0) {
    console.log(`⚠️  ${successCount}/${coursesData.length} courses imported. Please retry failures.\n`);
  } else {
    console.log('❌ No courses imported. Please check the errors above.\n');
  }
}

await importCourses();
