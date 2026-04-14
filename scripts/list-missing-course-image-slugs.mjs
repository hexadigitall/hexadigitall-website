#!/usr/bin/env node
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@sanity/client';
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

const IMAGE_DIR = path.join(PROJECT_ROOT, 'public/assets/images/courses');

const ALIAS_TO_SLUG = {
  'advanced-backend-engineering-node-js-microservices': 'advanced-backend-nodejs',
  'advanced-seo-rank-1-on-google': 'advanced-seo-mastery',
  'advanced-seo-serp-ranking-mastery': 'advanced-seo-mastery',
  'ai-engineering-building-llms-neural-networks': 'ai-engineering-llms',
  'applied-machine-learning-data-science': 'applied-machine-learning',
  'aws-certified-solutions-architect-associate-professional': 'aws-certified-solutions-architect',
  'c-net-core-architecture': 'c-sharp-net-core',
  'certified-scrum-master-csm-bootcamp': 'certified-scrum-master-csm',
  'cisco-certified-network-associate-ccna-200-301': 'ccna-networking',
  'cissp-certification-prep-course': 'cissp-certification-prep',
  'cissp-senior-security-professional-prep': 'cissp-certification-prep',
  'cloud-infrastructure-deployment-strategy': 'cloud-infrastructure-strategy',
  'computer-hardware-engineering-system-maintenance': 'computer-hardware-engineering',
  'cross-platform-mobile-app-development-react-native': 'react-native-mobile-dev',
  'data-analysis-with-python': 'python-data-science-analytics',
  'devops-engineering-kubernetes-mastery': 'devops-kubernetes-mastery',
  'devops-fundamentals-git-github-mastery': 'git-github-beginners',
  'digital-marketing-for-small-businesses': 'digital-marketing-small-business',
  'enterprise-security-risk-management': 'enterprise-security-risk',
  'ethical-hacking-for-beginners': 'ethical-hacking-beginners',
  'ethical-hacking-penetration-testing-masterclass': 'ethical-hacking-penetration-testing',
  'executive-agile-leadership-transformation': 'executive-agile-leadership',
  'frontend-mastery-with-react-next-js': 'frontend-mastery-react',
  'full-stack-web-development-bootcamp-zero-to-hero': 'full-stack-web-development',
  'git-github-for-beginners': 'git-github-beginners',
  'google-analytics-4-from-beginner-to-expert': 'google-analytics-4-mastery',
  'google-analytics-4-ga4-data-mastery': 'google-analytics-4-mastery',
  'integrated-digital-marketing-growth-strategy': 'integrated-digital-marketing',
  'linux-administration-shell-scripting-pro': 'linux-administration-shell-scripting',
  'mobile-office-business-productivity-from-your-phone': 'professional-office-365',
  'modern-javascript-algorithms-data-structures': 'full-stack-web-development',
  'motion-graphics-visual-effects': 'motion-graphics-vfx',
  'network-security-administration': 'network-security-admin',
  'product-design-ui-ux-professional-bootcamp': 'ui-ux-product-design',
  'product-strategy-the-lean-startup-building-mvps': 'product-strategy-lean-startup',
  'professional-office-365-suite-mastery': 'professional-office-365',
  'project-management-fundamentals': 'pmp-certification-prep',
  'python-for-data-science-analytics': 'python-data-science-analytics',
  'react-native-build-mobile-apps-for-ios-android': 'react-native-mobile-dev',
  'social-media-marketing-community-growth': 'social-media-community-growth',
  'technical-writing-api-documentation': 'technical-writing-api-docs',
  'the-lean-startup-build-your-mvp': 'product-strategy-lean-startup',
  'visual-brand-design-graphic-artistry': 'visual-brand-design',
  'web-development-bootcamp-from-zero-to-hero': 'full-stack-web-development',
};

function toCanonical(value) {
  return value
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/-\d+$/, '');
}

function imageFilenameToCandidateSlugs(filename, knownSlugsSet) {
  const base = toCanonical(filename.replace(/\.[^.]+$/, ''));
  const noPrefix = base.replace(/^course-/, '');
  const candidates = new Set([noPrefix]);
  if (ALIAS_TO_SLUG[noPrefix]) candidates.add(ALIAS_TO_SLUG[noPrefix]);
  candidates.add(noPrefix.replace(/-+$/, ''));

  for (const slug of knownSlugsSet) {
    if (slug === noPrefix || slug.includes(noPrefix) || noPrefix.includes(slug)) {
      candidates.add(slug);
    }
  }

  return [...candidates].filter((slug) => knownSlugsSet.has(slug));
}

async function main() {
  const courses = await client.fetch(`*[_type == "course" && defined(slug.current)]{ "slug": slug.current, title }`);
  const slugs = courses.map((c) => c.slug).filter(Boolean);
  const knownSlugsSet = new Set(slugs);

  const imageFiles = fs
    .readdirSync(IMAGE_DIR)
    .filter((name) => /\.(jpg|jpeg|png)$/i.test(name));

  const matchedSlugs = new Set();

  for (const imageFile of imageFiles) {
    const matches = imageFilenameToCandidateSlugs(imageFile, knownSlugsSet);
    for (const slug of matches) {
      if (!matchedSlugs.has(slug)) {
        matchedSlugs.add(slug);
        break;
      }
    }
  }

  const missing = slugs.filter((slug) => !matchedSlugs.has(slug)).sort((a, b) => a.localeCompare(b));

  const outPath = path.join(PROJECT_ROOT, 'tmp-missing-course-image-slugs.txt');
  fs.writeFileSync(outPath, `${missing.join('\n')}\n`);

  console.log(`Total courses: ${slugs.length}`);
  console.log(`Matched with local course images: ${matchedSlugs.size}`);
  console.log(`Missing local course image: ${missing.length}`);
  console.log(`Saved missing slug list: ${outPath}`);
  console.log('---BEGIN MISSING SLUGS---');
  for (const slug of missing) console.log(slug);
  console.log('---END MISSING SLUGS---');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
