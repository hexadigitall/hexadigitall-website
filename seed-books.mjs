#!/usr/bin/env node
/**
 * seed-books.mjs
 *
 * Creates Sanity book documents for:
 *   1. DevOps Engineering & Cloud Infrastructure (Core) — coming_soon, full ToC
 *   2. All other curriculum-based textbooks — coming_soon, title only
 *
 * Run:  node seed-books.mjs
 */

import { createClient } from '@sanity/client';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-08-30',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// ── Slug → clean title ────────────────────────────────────────────────────────

const TOKEN_MAP = {
  'nodejs': 'Node.js', 'nextjs': 'Next.js', 'react-next-js': 'React & Next.js',
  'css': 'CSS', 'html': 'HTML', 'ui-ux': 'UI/UX', 'uiux': 'UI/UX',
  'aws': 'AWS', 'azure': 'Azure', 'ci-cd': 'CI/CD', 'mern': 'MERN',
  'seo': 'SEO', 'vfx': 'VFX', 'sql': 'SQL', 'nosql': 'NoSQL',
  'llms': 'LLMs', 'mlops': 'MLOps', 'sre': 'SRE', 'rtb': 'RTB',
  'dsa': 'DSA', 'devsecops': 'DevSecOps', 'devops': 'DevOps',
  'ccna': 'CCNA', 'cissp': 'CISSP', 'pmp': 'PMP', 'csm': 'CSM',
  'sc-100': 'SC-100', 'sc-200': 'SC-200', 'az500': 'AZ-500',
  'az-500': 'AZ-500', 'capi': 'CAPI', 'net-core': '.NET Core',
  'c-sharp': 'C#', 'api': 'API', 'apis': 'APIs',
  'java': 'Java', 'python': 'Python', 'git': 'Git', 'github': 'GitHub',
  'javascript': 'JavaScript', 'typescript': 'TypeScript', 'linux': 'Linux',
  'leetcode': 'LeetCode', 'appsec': 'AppSec', 'coreldraw': 'CorelDRAW',
  'archicad': 'ArchiCAD', 'autocad': 'AutoCAD', 'ai': 'AI',
  'adsense': 'AdSense', 'microsoft-365': 'Microsoft 365',
  'microsoft-access': 'Microsoft Access', 'google-analytics-4': 'Google Analytics 4',
  'tiktok': 'TikTok', 'youtube': 'YouTube', 'meta': 'Meta',
};

function slugToTitle(slug) {
  const parts = slug.split('-');
  const result = [];
  let i = 0;
  while (i < parts.length) {
    let found = false;
    for (let len = 4; len >= 1; len--) {
      const combo = parts.slice(i, i + len).join('-');
      if (TOKEN_MAP[combo]) {
        result.push(TOKEN_MAP[combo]);
        i += len;
        found = true;
        break;
      }
    }
    if (!found) {
      const p = parts[i];
      result.push(p.charAt(0).toUpperCase() + p.slice(1));
      i++;
    }
  }
  return result.join(' ');
}

// ── Detect level from slug ────────────────────────────────────────────────────

function detectLevel(slug) {
  if (slug.startsWith('advanced-') || slug.includes('mastery') || slug.includes('enterprise') || slug.includes('professional')) return 'advanced';
  if (slug.includes('intermediate') || slug.includes('engineering') || slug.includes('architect')) return 'intermediate';
  if (slug.includes('intro') || slug.includes('beginners') || slug.includes('fundamentals') || slug.includes('crash-course') || slug.includes('quick-start') || slug.includes('fast-track') || slug.includes('essentials') || slug.includes('101')) return 'beginner';
  return 'intermediate';
}

// ── Curriculum directory ──────────────────────────────────────────────────────

const CURRICULUM_DIR = path.join(__dirname, 'public/curriculums');

function getUniqueCurriculumSlugs() {
  const files = fs.readdirSync(CURRICULUM_DIR)
    .filter(f => f.startsWith('curriculum-') && f.endsWith('.html') && !f.includes('('));
  const slugs = files.map(f => f.replace('curriculum-', '').replace('.html', '').trim());
  // Deduplicate (some have slight name variants)
  return [...new Set(slugs)];
}

// ── Full DevOps book data ─────────────────────────────────────────────────────

const DEVOPS_BOOK = {
  _type: 'book',
  title: 'DevOps Engineering & Cloud Infrastructure',
  subtitle: 'Core Track — A 20-Week Project-Driven Curriculum with Labs, Assessments & Capstone',
  slug: { _type: 'slug', current: 'devops-engineering-cloud-infrastructure-core' },
  edition: '1st Edition',
  authors: ['Hexadigitall Technologies'],
  description:
    'A comprehensive 20-week guide to DevOps engineering and cloud infrastructure — covering CI/CD pipelines, Docker, Kubernetes, Terraform, GitOps, observability, DevSecOps, and full production deployment. Built for learners who want real-world, deployable skills from day one.',
  longDescription: [
    {
      _type: 'block',
      _key: 'intro',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'intro-span',
          text: 'This textbook is the official companion to the Hexadigitall DevOps Engineering & Cloud Infrastructure course. Each of the 20 weeks introduces new concepts through structured reading, hands-on labs, quizzes, and a guided assessment — culminating in a complete capstone deployment project.',
        },
      ],
    },
  ],
  pageCount: 680,
  level: 'intermediate',
  status: 'coming_soon',
  publishedAt: '2026-06-01',
  tableOfContents: [
    { _type: 'object', _key: 'w1', chapter: 1, title: 'DevOps Foundations & CI/CD Overview', pages: '1–34' },
    { _type: 'object', _key: 'w2', chapter: 2, title: 'Advanced Docker & Multi-Container Applications', pages: '35–78' },
    { _type: 'object', _key: 'w3', chapter: 3, title: 'Container CI/CD & Automation', pages: '79–118' },
    { _type: 'object', _key: 'w4', chapter: 4, title: 'Kubernetes Workloads & Configuration', pages: '119–162' },
    { _type: 'object', _key: 'w5', chapter: 5, title: 'Kubernetes Networking & Storage', pages: '163–206' },
    { _type: 'object', _key: 'w6', chapter: 6, title: 'Advanced Kubernetes Patterns', pages: '207–248' },
    { _type: 'object', _key: 'w7', chapter: 7, title: 'Helm & Kubernetes Package Management', pages: '249–286' },
    { _type: 'object', _key: 'w8', chapter: 8, title: 'Infrastructure as Code with Terraform', pages: '287–330' },
    { _type: 'object', _key: 'w9', chapter: 9, title: 'Advanced Terraform & Cloud Provisioning', pages: '331–370' },
    { _type: 'object', _key: 'w10', chapter: 10, title: 'GitOps & Advanced CI/CD', pages: '371–410' },
    { _type: 'object', _key: 'w11', chapter: 11, title: 'Monitoring, Logging & Observability', pages: '411–450' },
    { _type: 'object', _key: 'w12', chapter: 12, title: 'Advanced CI/CD Pipeline Engineering', pages: '451–488' },
    { _type: 'object', _key: 'w13', chapter: 13, title: 'Advanced Deployment Strategies', pages: '489–526' },
    { _type: 'object', _key: 'w14', chapter: 14, title: 'Service Mesh & Advanced Networking', pages: '527–562' },
    { _type: 'object', _key: 'w15', chapter: 15, title: 'Advanced Observability & SRE Practices', pages: '563–596' },
    { _type: 'object', _key: 'w16', chapter: 16, title: 'DevSecOps & Security Automation', pages: '597–630' },
    { _type: 'object', _key: 'w17', chapter: 17, title: 'Multi-Cloud & Hybrid Infrastructure', pages: '631–654' },
    { _type: 'object', _key: 'w18', chapter: 18, title: 'Platform Engineering & Developer Experience', pages: '655–668' },
    { _type: 'object', _key: 'w19', chapter: 19, title: 'Production Optimization & Cost Management', pages: '669–680' },
    { _type: 'object', _key: 'w20', chapter: 20, title: 'Capstone Project & Production Deployment', pages: '681–690' },
  ],
  ogTitle: 'DevOps Engineering & Cloud Infrastructure Textbook | Hexadigitall',
  ogDescription:
    'The official 20-week DevOps textbook from Hexadigitall — covering CI/CD, Docker, Kubernetes, Terraform, GitOps, and full production deployment. Available on Amazon.',
};

// ── Main script ───────────────────────────────────────────────────────────────

async function main() {
  console.log('📚 Hexadigitall Book Seeder\n');

  // 1. Check existing books to avoid duplicates
  const existing = await client.fetch(
    `*[_type == "book"]{ "slug": slug.current }`
  );
  const existingSlugs = new Set(existing.map(b => b.slug));
  console.log(`Found ${existingSlugs.size} existing book(s) in Sanity.\n`);

  let created = 0;
  let skipped = 0;

  // 2. Create DevOps book (full data)
  const devopsSlug = DEVOPS_BOOK.slug.current;
  if (existingSlugs.has(devopsSlug)) {
    console.log(`⏭  Skipping DevOps book (already exists)`);
    skipped++;
  } else {
    try {
      await client.create(DEVOPS_BOOK);
      console.log(`✅ Created: ${DEVOPS_BOOK.title}`);
      created++;
    } catch (err) {
      console.error(`❌ Failed DevOps book:`, err.message);
    }
  }

  // 3. Create coming-soon books from curriculum files
  const curriculumSlugs = getUniqueCurriculumSlugs();
  console.log(`\nProcessing ${curriculumSlugs.length} curriculum files...\n`);

  for (const slug of curriculumSlugs) {
    // Skip the DevOps core one (already created above)
    if (slug === 'devops-engineering-cloud-infrastructure-core' || slug === 'devops-engineering-cloud-infrastructure') {
      continue;
    }

    if (existingSlugs.has(slug)) {
      console.log(`⏭  Skip (exists): ${slug}`);
      skipped++;
      continue;
    }

    const title = slugToTitle(slug);
    const level = detectLevel(slug);

    const doc = {
      _type: 'book',
      title,
      slug: { _type: 'slug', current: slug },
      edition: '1st Edition',
      authors: ['Hexadigitall Technologies'],
      description: `The official Hexadigitall textbook for ${title}. Coming soon — enroll in the companion course to be notified on release.`,
      level,
      status: 'coming_soon',
      ogTitle: `${title} Textbook | Hexadigitall`,
      ogDescription: `Official Hexadigitall textbook for ${title}. Available soon on Amazon and other platforms.`,
    };

    try {
      await client.create(doc);
      console.log(`✅ ${title}`);
      created++;
    } catch (err) {
      console.error(`❌ ${title}: ${err.message}`);
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 120));
  }

  console.log(`\n─────────────────────────────────`);
  console.log(`✅ Created: ${created}`);
  console.log(`⏭  Skipped: ${skipped}`);
  console.log(`📚 Total books in store: ${created + existingSlugs.size}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
