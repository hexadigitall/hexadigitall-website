import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import QRCode from 'qrcode';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// --- 1. CONFIGURATION ---

const BASE_SITE_URL = 'https://www.hexadigitall.com';
const TEMP_BACKUP_DIR = '/mnt/d/projects/temp';
const BATCH_SIZE = 20; // Restart page every 20 images to free RAM

// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const LOGO_PATH = path.join(PROJECT_ROOT, 'public/hexadigitall-logo-transparent.png');
const OUTPUT_ROOT = path.join(PROJECT_ROOT, 'public/og-images');

// --- 2. CORRECT URL MAPPING FROM SANITY ---
// This mapping ensures QR codes link to exact Sanity slugs

const URL_MAPPING = {
  // SCHOOLS
  'school-of-algorithms.jpg': 'https://www.hexadigitall.com/schools/school-of-algorithms',
  'school-of-writing.jpg': 'https://www.hexadigitall.com/schools/school-of-writing',
  'school-of-cloud-and-devops.jpg': 'https://www.hexadigitall.com/schools/school-of-cloud-and-devops',
  'school-of-coding-and-development.jpg': 'https://www.hexadigitall.com/schools/school-of-coding-and-development',
  'school-of-cybersecurity.jpg': 'https://www.hexadigitall.com/schools/school-of-cybersecurity',
  'school-of-data-and-ai.jpg': 'https://www.hexadigitall.com/schools/school-of-data-and-ai',
  'school-of-design.jpg': 'https://www.hexadigitall.com/schools/school-of-design',
  'school-of-executive-management.jpg': 'https://www.hexadigitall.com/schools/school-of-executive-management',
  'school-of-fundamentals.jpg': 'https://www.hexadigitall.com/schools/school-of-fundamentals',
  'school-of-growth-and-marketing.jpg': 'https://www.hexadigitall.com/schools/school-of-growth-and-marketing',
  'school-of-infrastructure.jpg': 'https://www.hexadigitall.com/schools/school-of-infrastructure',
  'school-of-software-mastery.jpg': 'https://www.hexadigitall.com/schools/school-of-software-mastery',

  // NEW COURSES (14)
  'autocad-masterclass.jpg': 'https://www.hexadigitall.com/courses/autocad-masterclass',
  'archicad-professional.jpg': 'https://www.hexadigitall.com/courses/archicad-professional',
  'adobe-creative-cloud-suite.jpg': 'https://www.hexadigitall.com/courses/adobe-creative-cloud-suite',
  'vector-graphics-mastery-coreldraw.jpg': 'https://www.hexadigitall.com/courses/vector-graphics-mastery-coreldraw',
  'visual-communication-infographics.jpg': 'https://www.hexadigitall.com/courses/visual-communication-infographics',
  'business-intelligence-bi-and-analytics.jpg': 'https://www.hexadigitall.com/courses/business-intelligence-analytics',
  'advanced-excel-for-business.jpg': 'https://www.hexadigitall.com/courses/advanced-excel-business',
  'programming-for-data-management.jpg': 'https://www.hexadigitall.com/courses/programming-data-management',
  'sql-and-relational-database-design.jpg': 'https://www.hexadigitall.com/courses/sql-relational-database-design',
  'nosql-and-cloud-database-architecture.jpg': 'https://www.hexadigitall.com/courses/nosql-cloud-database-architecture',
  'rapid-app-development-low-code-no-code.jpg': 'https://www.hexadigitall.com/courses/rapid-app-development-low-code',
  'microsoft-access-for-business-apps.jpg': 'https://www.hexadigitall.com/courses/microsoft-access-business-apps',
  'executive-presentation-and-public-speaking.jpg': 'https://www.hexadigitall.com/courses/executive-presentation-public-speaking',
  'microsoft-365-and-ai-integration.jpg': 'https://www.hexadigitall.com/courses/microsoft-365-ai-integration',

  // EXISTING COURSES (110) - Sample shown, expand to full list
  'meta-ads-for-local-business.jpg': 'https://www.hexadigitall.com/courses/meta-ads-for-local-business',
  'adsense-traffic-revenue.jpg': 'https://www.hexadigitall.com/courses/adsense-traffic-revenue',
  'copywriting-for-direct-response.jpg': 'https://www.hexadigitall.com/courses/copywriting-for-direct-response',
  'youtube-ads-manager.jpg': 'https://www.hexadigitall.com/courses/youtube-ads-manager',
  'server-side-tracking-capi.jpg': 'https://www.hexadigitall.com/courses/server-side-tracking-capi',
  'amazon-retail-media-networks.jpg': 'https://www.hexadigitall.com/courses/amazon-retail-media-networks',
  'devops-engineering-cloud-infrastructure.jpg': 'https://www.hexadigitall.com/courses/devops-engineering-cloud-infrastructure',
  'frontend-engineering-react-next-js-mastery.jpg': 'https://www.hexadigitall.com/courses/frontend-engineering-react-next-js-mastery',
  'system-design-interviews.jpg': 'https://www.hexadigitall.com/courses/system-design-interviews',
  'technical-writing.jpg': 'https://www.hexadigitall.com/courses/technical-writing',
  'personal-branding.jpg': 'https://www.hexadigitall.com/courses/personal-branding',
  'html-fundamentals.jpg': 'https://www.hexadigitall.com/courses/html-fundamentals',
  'advanced-javascript-mastery.jpg': 'https://www.hexadigitall.com/courses/advanced-javascript-mastery',
  'intro-to-algorithms-problem-solving.jpg': 'https://www.hexadigitall.com/courses/intro-to-algorithms-problem-solving',
  'intro-to-cloud-computing.jpg': 'https://www.hexadigitall.com/courses/intro-to-cloud-computing',
  'intro-to-coding.jpg': 'https://www.hexadigitall.com/courses/intro-to-coding',
  'intro-to-digital-literacy.jpg': 'https://www.hexadigitall.com/courses/intro-to-digital-literacy',
  'intro-to-professional-writing.jpg': 'https://www.hexadigitall.com/courses/intro-to-professional-writing',
  'aws-crash-course-for-beginners.jpg': 'https://www.hexadigitall.com/courses/aws-crash-course-for-beginners',
  'uiux-quick-start-for-developers.jpg': 'https://www.hexadigitall.com/courses/uiux-quick-start-for-developers',
  'mobile-app-development-quick-start.jpg': 'https://www.hexadigitall.com/courses/mobile-app-development-quick-start',
  'adsense-101-approval-blueprint.jpg': 'https://www.hexadigitall.com/courses/adsense-101-approval-blueprint',
  'google-search-ads-boot-camp.jpg': 'https://www.hexadigitall.com/courses/google-search-ads-boot-camp',
  'canva-for-ad-creatives.jpg': 'https://www.hexadigitall.com/courses/canva-for-ad-creatives',
  'intro-to-digital-media-buying.jpg': 'https://www.hexadigitall.com/courses/intro-to-digital-media-buying',
  'adsense-arbitrage-pro.jpg': 'https://www.hexadigitall.com/courses/adsense-arbitrage-pro',
  'advanced-ansible-automation.jpg': 'https://www.hexadigitall.com/courses/advanced-ansible-automation',
  'advanced-backend-nodejs.jpg': 'https://www.hexadigitall.com/courses/advanced-backend-nodejs',
  'advanced-seo-mastery.jpg': 'https://www.hexadigitall.com/courses/advanced-seo-mastery',
  'ai-engineering-llms.jpg': 'https://www.hexadigitall.com/courses/ai-engineering-llms',
  'applied-machine-learning.jpg': 'https://www.hexadigitall.com/courses/applied-machine-learning',
  'aws-certified-solutions-architect.jpg': 'https://www.hexadigitall.com/courses/aws-certified-solutions-architect',
  'c-sharp-net-core.jpg': 'https://www.hexadigitall.com/courses/c-sharp-net-core',
  'ccna-networking.jpg': 'https://www.hexadigitall.com/courses/ccna-networking',
  'certified-scrum-master-csm.jpg': 'https://www.hexadigitall.com/courses/certified-scrum-master-csm',
  'cissp-certification-prep.jpg': 'https://www.hexadigitall.com/courses/cissp-certification-prep',
  'cloud-infrastructure-strategy.jpg': 'https://www.hexadigitall.com/courses/cloud-infrastructure-strategy',
  'computer-hardware-engineering.jpg': 'https://www.hexadigitall.com/courses/computer-hardware-engineering',
  'devops-kubernetes-mastery.jpg': 'https://www.hexadigitall.com/courses/devops-kubernetes-mastery',
  'digital-literacy-computer-operations.jpg': 'https://www.hexadigitall.com/courses/digital-literacy-computer-operations',
  'digital-marketing-small-business.jpg': 'https://www.hexadigitall.com/courses/digital-marketing-small-business',
  'enterprise-security-risk.jpg': 'https://www.hexadigitall.com/courses/enterprise-security-risk',
  'ethical-hacking-beginners.jpg': 'https://www.hexadigitall.com/courses/ethical-hacking-beginners',
  'ethical-hacking-penetration-testing.jpg': 'https://www.hexadigitall.com/courses/ethical-hacking-penetration-testing',
  'executive-agile-leadership.jpg': 'https://www.hexadigitall.com/courses/executive-agile-leadership',
  'full-stack-web-development.jpg': 'https://www.hexadigitall.com/courses/full-stack-web-development',
  'git-github-beginners.jpg': 'https://www.hexadigitall.com/courses/git-github-beginners',
  'google-analytics-4-mastery.jpg': 'https://www.hexadigitall.com/courses/google-analytics-4-mastery',
  'integrated-digital-marketing.jpg': 'https://www.hexadigitall.com/courses/integrated-digital-marketing',
  'java-enterprise-development.jpg': 'https://www.hexadigitall.com/courses/java-enterprise-development',
  'linux-administration-shell-scripting.jpg': 'https://www.hexadigitall.com/courses/linux-administration-shell-scripting',
  'motion-graphics-vfx.jpg': 'https://www.hexadigitall.com/courses/motion-graphics-vfx',
  'enterprise-cloud-solutions-architect.jpg': 'https://www.hexadigitall.com/courses/enterprise-cloud-solutions-architect',
  'security-operations-analyst-sc-200.jpg': 'https://www.hexadigitall.com/courses/security-operations-analyst-sc-200',
  'ai-engineering-mlops.jpg': 'https://www.hexadigitall.com/courses/ai-engineering-mlops',
  'leetcode-interview-prep.jpg': 'https://www.hexadigitall.com/courses/leetcode-interview-prep',
  'competitive-programming.jpg': 'https://www.hexadigitall.com/courses/competitive-programming',
  'business-writing.jpg': 'https://www.hexadigitall.com/courses/business-writing',
  'ui-ux-fundamentals.jpg': 'https://www.hexadigitall.com/courses/ui-ux-fundamentals',
  'advanced-ui-ux.jpg': 'https://www.hexadigitall.com/courses/advanced-ui-ux',
  'css-fundamentals.jpg': 'https://www.hexadigitall.com/courses/css-fundamentals',
  'javascript-fundamentals.jpg': 'https://www.hexadigitall.com/courses/javascript-fundamentals',
  'css-only-projects.jpg': 'https://www.hexadigitall.com/courses/css-only-projects',
  'advanced-css-mastery.jpg': 'https://www.hexadigitall.com/courses/advanced-css-mastery',
  'javascript-only-projects.jpg': 'https://www.hexadigitall.com/courses/javascript-only-projects',
  'intro-to-data-ai.jpg': 'https://www.hexadigitall.com/courses/intro-to-data-ai',
  'intro-to-leadership-management.jpg': 'https://www.hexadigitall.com/courses/intro-to-leadership-management',
  'intro-to-digital-marketing.jpg': 'https://www.hexadigitall.com/courses/intro-to-digital-marketing',
  'intro-to-networking-infrastructure.jpg': 'https://www.hexadigitall.com/courses/intro-to-networking-infrastructure',
  'intro-to-software-development.jpg': 'https://www.hexadigitall.com/courses/intro-to-software-development',
  'kubernetes-quick-start.jpg': 'https://www.hexadigitall.com/courses/kubernetes-quick-start',
  'react-essentials-bootcamp.jpg': 'https://www.hexadigitall.com/courses/react-essentials-bootcamp',
  'full-stack-jumpstart-mern.jpg': 'https://www.hexadigitall.com/courses/full-stack-jumpstart-mern',
  'ethical-hacking-fast-track.jpg': 'https://www.hexadigitall.com/courses/ethical-hacking-fast-track',
  'seo-fast-track-rank-on-google.jpg': 'https://www.hexadigitall.com/courses/seo-fast-track-rank-on-google',
  'social-media-marketing-accelerator.jpg': 'https://www.hexadigitall.com/courses/social-media-marketing-accelerator',
  'technical-writing-essentials.jpg': 'https://www.hexadigitall.com/courses/technical-writing-essentials',
  'network-security-admin.jpg': 'https://www.hexadigitall.com/courses/network-security-admin',
  'pmp-certification-prep.jpg': 'https://www.hexadigitall.com/courses/pmp-certification-prep',
  'product-strategy-lean-startup.jpg': 'https://www.hexadigitall.com/courses/product-strategy-lean-startup',
  'professional-office-365.jpg': 'https://www.hexadigitall.com/courses/professional-office-365',
  'python-data-science-analytics.jpg': 'https://www.hexadigitall.com/courses/python-data-science-analytics',
  'react-native-mobile-dev.jpg': 'https://www.hexadigitall.com/courses/react-native-mobile-dev',
  'tiktok-reels-ad-strategy.jpg': 'https://www.hexadigitall.com/courses/tiktok-reels-ad-strategy',
  'programmatic-advertising-rtb.jpg': 'https://www.hexadigitall.com/courses/programmatic-advertising-rtb',
  'social-media-community-growth.jpg': 'https://www.hexadigitall.com/courses/social-media-community-growth',
  'technical-writing-api-docs.jpg': 'https://www.hexadigitall.com/courses/technical-writing-api-docs',
  'azure-security-technologies-az-500.jpg': 'https://www.hexadigitall.com/courses/azure-security-technologies-az-500',
  'microsoft-cybersecurity-architect-sc-100.jpg': 'https://www.hexadigitall.com/courses/microsoft-cybersecurity-architect-sc-100',
  'application-security-appsec-specialist.jpg': 'https://www.hexadigitall.com/courses/application-security-appsec-specialist',
  'devsecops-engineering-automating-security.jpg': 'https://www.hexadigitall.com/courses/devsecops-engineering-automating-security',
  'professional-data-engineering.jpg': 'https://www.hexadigitall.com/courses/professional-data-engineering',
  'ui-ux-product-design.jpg': 'https://www.hexadigitall.com/courses/ui-ux-product-design',
  'visual-brand-design.jpg': 'https://www.hexadigitall.com/courses/visual-brand-design',
  'cybersecurity-fundamentals-network-systems-defense.jpg': 'https://www.hexadigitall.com/courses/cybersecurity-fundamentals-network-systems-defense',
  'backend-engineering-scalable-architectures.jpg': 'https://www.hexadigitall.com/courses/backend-engineering-scalable-architectures',
  'mobile-engineering-cross-platform-development.jpg': 'https://www.hexadigitall.com/courses/mobile-engineering-cross-platform-development',
  'dsa-fundamentals.jpg': 'https://www.hexadigitall.com/courses/dsa-fundamentals',
  'content-writing-copywriting.jpg': 'https://www.hexadigitall.com/courses/content-writing-copywriting',
  'graphic-design-essentials.jpg': 'https://www.hexadigitall.com/courses/graphic-design-essentials',
  'intro-to-cybersecurity.jpg': 'https://www.hexadigitall.com/courses/intro-to-cybersecurity',
  'intro-to-design.jpg': 'https://www.hexadigitall.com/courses/intro-to-design',
  'network-security-essentials.jpg': 'https://www.hexadigitall.com/courses/network-security-essentials',
  'machine-learning-crash-course.jpg': 'https://www.hexadigitall.com/courses/machine-learning-crash-course',
  'data-analysis-fast-track.jpg': 'https://www.hexadigitall.com/courses/data-analysis-fast-track',
  'graphic-design-crash-course.jpg': 'https://www.hexadigitall.com/courses/graphic-design-crash-course',
  'agile-project-management-essentials.jpg': 'https://www.hexadigitall.com/courses/agile-project-management-essentials',
  'product-management-quick-start.jpg': 'https://www.hexadigitall.com/courses/product-management-quick-start',
  'backend-development-crash-course.jpg': 'https://www.hexadigitall.com/courses/backend-development-crash-course',
  'copywriting-crash-course.jpg': 'https://www.hexadigitall.com/courses/copywriting-crash-course',

  // SERVICES
  'business-plan-and-logo-design.jpg': 'https://www.hexadigitall.com/services/business-plan-and-logo-design',
  'mentoring-and-consulting.jpg': 'https://www.hexadigitall.com/services/mentoring-and-consulting',
  'profile-and-portfolio-building.jpg': 'https://www.hexadigitall.com/services/profile-and-portfolio-building',
  'social-media-advertising-and-marketing.jpg': 'https://www.hexadigitall.com/services/social-media-advertising-and-marketing',
  'web-and-mobile-software-development.jpg': 'https://www.hexadigitall.com/services/web-and-mobile-software-development'
};

// Helper to extract slug from filename and find URL
function getCorrectUrl(filename) {
  // First, try direct filename match
  if (URL_MAPPING[filename]) {
    return URL_MAPPING[filename];
  }

  // If not found, try building from slug
  const slug = path.parse(filename).name;
  for (const [key, url] of Object.entries(URL_MAPPING)) {
    if (key.startsWith(slug)) {
      return url;
    }
  }

  // Fallback (shouldn't happen with proper mapping)
  console.warn(`⚠️  No URL mapping found for ${filename}, using fallback slug extraction`);
  let cleanKey = slug.replace(/[-_]?\d+$/, '');
  return `${BASE_SITE_URL}${url}${cleanKey}`;
}

console.log('✅ URL mapping loaded with', Object.keys(URL_MAPPING).length, 'entries');
console.log('💡 Using exact Sanity slugs from verified list');
