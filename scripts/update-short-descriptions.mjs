#!/usr/bin/env node
import dotenv from 'dotenv';
import { createClient } from '@sanity/client';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(PROJECT_ROOT, '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

function generateDescription(title, slug) {
  // This is a simple generator; in practice, you might use AI or more sophisticated logic
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('ui/ux') || lowerTitle.includes('design')) {
    return `Master the art of user interface and user experience design. This course covers design principles, prototyping tools like Figma, user research methodologies, and creating intuitive digital experiences that delight users and drive business results.`;
  }
  if (lowerTitle.includes('mobile') || lowerTitle.includes('app')) {
    return `Build cross-platform mobile applications with modern frameworks. Learn native development patterns, UI components, state management, and deployment strategies for iOS and Android platforms. Create apps that users love and scale globally.`;
  }
  if (lowerTitle.includes('backend') || lowerTitle.includes('server')) {
    return `Develop robust backend systems and APIs. This course covers server-side programming, database design, authentication, security best practices, and scalable architecture patterns used in production applications.`;
  }
  if (lowerTitle.includes('frontend') || lowerTitle.includes('web')) {
    return `Create stunning web interfaces with modern technologies. Learn HTML, CSS, JavaScript frameworks, responsive design, and performance optimization techniques to build websites that engage and convert users.`;
  }
  if (lowerTitle.includes('data') || lowerTitle.includes('analytics')) {
    return `Unlock insights from data with powerful tools and techniques. This course covers data collection, cleaning, analysis, visualization, and machine learning fundamentals to make data-driven decisions in any industry.`;
  }
  if (lowerTitle.includes('security') || lowerTitle.includes('cyber')) {
    return `Protect systems and data in the digital age. Learn cybersecurity fundamentals, threat detection, risk assessment, compliance frameworks, and defensive strategies to safeguard organizations from cyber threats.`;
  }
  if (lowerTitle.includes('cloud') || lowerTitle.includes('aws') || lowerTitle.includes('azure')) {
    return `Harness the power of cloud computing platforms. This course covers cloud architecture, deployment strategies, cost optimization, and best practices for building scalable, secure applications in the cloud.`;
  }
  if (lowerTitle.includes('devops') || lowerTitle.includes('automation')) {
    return `Streamline software delivery with DevOps practices. Learn continuous integration, deployment pipelines, infrastructure as code, monitoring, and automation tools to accelerate development cycles.`;
  }
  if (lowerTitle.includes('ai') || lowerTitle.includes('machine learning')) {
    return `Explore artificial intelligence and machine learning. This course covers algorithms, data preprocessing, model training, deployment, and ethical considerations for building intelligent systems.`;
  }
  if (lowerTitle.includes('marketing') || lowerTitle.includes('seo')) {
    return `Grow businesses with digital marketing strategies. Learn SEO, content marketing, social media, analytics, and conversion optimization to attract, engage, and convert target audiences.`;
  }
  if (lowerTitle.includes('project management') || lowerTitle.includes('agile')) {
    return `Lead projects to success with proven methodologies. This course covers project planning, agile frameworks, team management, risk assessment, and tools for delivering projects on time and within budget.`;
  }
  if (lowerTitle.includes('programming') || lowerTitle.includes('coding')) {
    return `Start your programming journey with foundational skills. Learn problem-solving, algorithms, data structures, and multiple programming languages to build software solutions from scratch.`;
  }
  // Default
  return `This comprehensive course provides in-depth knowledge and practical skills in ${title.toLowerCase()}. You'll learn industry best practices, tools, and techniques to excel in this field and advance your career.`;
}

async function main() {
  const courses = await client.fetch(`*[_type == "course" && defined(slug.current)]{ _id, title, "slug": slug.current, description }`);
  const shortCourses = courses.filter(c => (c.description || '').length < 100);

  console.log(`Found ${shortCourses.length} courses with short descriptions to update.`);

  for (const course of shortCourses) {
    const newDescription = generateDescription(course.title, course.slug);
    console.log(`Updating ${course.slug}: ${course.title}`);
    console.log(`New description: ${newDescription}\n`);

    await client
      .patch(course._id)
      .set({ description: newDescription })
      .commit();
  }

  console.log('All updates complete.');
}

main().catch(console.error);
