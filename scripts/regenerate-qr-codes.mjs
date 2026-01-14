import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';

// Correct slug mapping from Sanity (verified)
const CORRECT_URLS = {
  schools: [
    'https://www.hexadigitall.com/schools/school-of-algorithms',
    'https://www.hexadigitall.com/schools/school-of-writing',
    'https://www.hexadigitall.com/schools/school-of-cloud-and-devops',
    'https://www.hexadigitall.com/schools/school-of-coding-and-development',
    'https://www.hexadigitall.com/schools/school-of-cybersecurity',
    'https://www.hexadigitall.com/schools/school-of-data-and-ai',
    'https://www.hexadigitall.com/schools/school-of-design',
    'https://www.hexadigitall.com/schools/school-of-executive-management',
    'https://www.hexadigitall.com/schools/school-of-fundamentals',
    'https://www.hexadigitall.com/schools/school-of-growth-and-marketing',
    'https://www.hexadigitall.com/schools/school-of-infrastructure',
    'https://www.hexadigitall.com/schools/school-of-software-mastery'
  ],
  courses: [
    'https://www.hexadigitall.com/courses/meta-ads-for-local-business',
    'https://www.hexadigitall.com/courses/adsense-traffic-revenue',
    'https://www.hexadigitall.com/courses/copywriting-for-direct-response',
    'https://www.hexadigitall.com/courses/youtube-ads-manager',
    'https://www.hexadigitall.com/courses/server-side-tracking-capi',
    'https://www.hexadigitall.com/courses/amazon-retail-media-networks',
    'https://www.hexadigitall.com/courses/devops-engineering-cloud-infrastructure',
    'https://www.hexadigitall.com/courses/frontend-engineering-react-next-js-mastery',
    'https://www.hexadigitall.com/courses/system-design-interviews',
    'https://www.hexadigitall.com/courses/technical-writing',
    'https://www.hexadigitall.com/courses/personal-branding',
    'https://www.hexadigitall.com/courses/html-fundamentals',
    'https://www.hexadigitall.com/courses/advanced-javascript-mastery',
    'https://www.hexadigitall.com/courses/intro-to-algorithms-problem-solving',
    'https://www.hexadigitall.com/courses/intro-to-cloud-computing',
    'https://www.hexadigitall.com/courses/intro-to-coding',
    'https://www.hexadigitall.com/courses/intro-to-digital-literacy',
    'https://www.hexadigitall.com/courses/intro-to-professional-writing',
    'https://www.hexadigitall.com/courses/aws-crash-course-for-beginners',
    'https://www.hexadigitall.com/courses/uiux-quick-start-for-developers',
    'https://www.hexadigitall.com/courses/mobile-app-development-quick-start',
    'https://www.hexadigitall.com/courses/adsense-101-approval-blueprint',
    'https://www.hexadigitall.com/courses/google-search-ads-boot-camp',
    'https://www.hexadigitall.com/courses/canva-for-ad-creatives',
    'https://www.hexadigitall.com/courses/intro-to-digital-media-buying',
    'https://www.hexadigitall.com/courses/adsense-arbitrage-pro',
    'https://www.hexadigitall.com/courses/advanced-ansible-automation',
    'https://www.hexadigitall.com/courses/advanced-backend-nodejs',
    'https://www.hexadigitall.com/courses/advanced-seo-mastery',
    'https://www.hexadigitall.com/courses/ai-engineering-llms',
    'https://www.hexadigitall.com/courses/applied-machine-learning',
    'https://www.hexadigitall.com/courses/aws-certified-solutions-architect',
    'https://www.hexadigitall.com/courses/c-sharp-net-core',
    'https://www.hexadigitall.com/courses/ccna-networking',
    'https://www.hexadigitall.com/courses/certified-scrum-master-csm',
    'https://www.hexadigitall.com/courses/cissp-certification-prep',
    'https://www.hexadigitall.com/courses/cloud-infrastructure-strategy',
    'https://www.hexadigitall.com/courses/computer-hardware-engineering',
    'https://www.hexadigitall.com/courses/devops-kubernetes-mastery',
    'https://www.hexadigitall.com/courses/digital-literacy-computer-operations',
    'https://www.hexadigitall.com/courses/digital-marketing-small-business',
    'https://www.hexadigitall.com/courses/enterprise-security-risk',
    'https://www.hexadigitall.com/courses/ethical-hacking-beginners',
    'https://www.hexadigitall.com/courses/ethical-hacking-penetration-testing',
    'https://www.hexadigitall.com/courses/executive-agile-leadership',
    'https://www.hexadigitall.com/courses/full-stack-web-development',
    'https://www.hexadigitall.com/courses/git-github-beginners',
    'https://www.hexadigitall.com/courses/google-analytics-4-mastery',
    'https://www.hexadigitall.com/courses/integrated-digital-marketing',
    'https://www.hexadigitall.com/courses/java-enterprise-development',
    'https://www.hexadigitall.com/courses/linux-administration-shell-scripting',
    'https://www.hexadigitall.com/courses/motion-graphics-vfx',
    'https://www.hexadigitall.com/courses/enterprise-cloud-solutions-architect',
    'https://www.hexadigitall.com/courses/security-operations-analyst-sc-200',
    'https://www.hexadigitall.com/courses/ai-engineering-mlops',
    'https://www.hexadigitall.com/courses/leetcode-interview-prep',
    'https://www.hexadigitall.com/courses/competitive-programming',
    'https://www.hexadigitall.com/courses/business-writing',
    'https://www.hexadigitall.com/courses/ui-ux-fundamentals',
    'https://www.hexadigitall.com/courses/advanced-ui-ux',
    'https://www.hexadigitall.com/courses/css-fundamentals',
    'https://www.hexadigitall.com/courses/javascript-fundamentals',
    'https://www.hexadigitall.com/courses/css-only-projects',
    'https://www.hexadigitall.com/courses/advanced-css-mastery',
    'https://www.hexadigitall.com/courses/javascript-only-projects',
    'https://www.hexadigitall.com/courses/intro-to-data-ai',
    'https://www.hexadigitall.com/courses/intro-to-leadership-management',
    'https://www.hexadigitall.com/courses/intro-to-digital-marketing',
    'https://www.hexadigitall.com/courses/intro-to-networking-infrastructure',
    'https://www.hexadigitall.com/courses/intro-to-software-development',
    'https://www.hexadigitall.com/courses/kubernetes-quick-start',
    'https://www.hexadigitall.com/courses/react-essentials-bootcamp',
    'https://www.hexadigitall.com/courses/full-stack-jumpstart-mern',
    'https://www.hexadigitall.com/courses/ethical-hacking-fast-track',
    'https://www.hexadigitall.com/courses/seo-fast-track-rank-on-google',
    'https://www.hexadigitall.com/courses/social-media-marketing-accelerator',
    'https://www.hexadigitall.com/courses/technical-writing-essentials',
    'https://www.hexadigitall.com/courses/network-security-admin',
    'https://www.hexadigitall.com/courses/pmp-certification-prep',
    'https://www.hexadigitall.com/courses/product-strategy-lean-startup',
    'https://www.hexadigitall.com/courses/professional-office-365',
    'https://www.hexadigitall.com/courses/python-data-science-analytics',
    'https://www.hexadigitall.com/courses/react-native-mobile-dev',
    'https://www.hexadigitall.com/courses/tiktok-reels-ad-strategy',
    'https://www.hexadigitall.com/courses/programmatic-advertising-rtb',
    'https://www.hexadigitall.com/courses/social-media-community-growth',
    'https://www.hexadigitall.com/courses/technical-writing-api-docs',
    'https://www.hexadigitall.com/courses/azure-security-technologies-az-500',
    'https://www.hexadigitall.com/courses/microsoft-cybersecurity-architect-sc-100',
    'https://www.hexadigitall.com/courses/application-security-appsec-specialist',
    'https://www.hexadigitall.com/courses/devsecops-engineering-automating-security',
    'https://www.hexadigitall.com/courses/professional-data-engineering',
    'https://www.hexadigitall.com/courses/ui-ux-product-design',
    'https://www.hexadigitall.com/courses/visual-brand-design',
    'https://www.hexadigitall.com/courses/cybersecurity-fundamentals-network-systems-defense',
    'https://www.hexadigitall.com/courses/backend-engineering-scalable-architectures',
    'https://www.hexadigitall.com/courses/mobile-engineering-cross-platform-development',
    'https://www.hexadigitall.com/courses/dsa-fundamentals',
    'https://www.hexadigitall.com/courses/content-writing-copywriting',
    'https://www.hexadigitall.com/courses/graphic-design-essentials',
    'https://www.hexadigitall.com/courses/intro-to-cybersecurity',
    'https://www.hexadigitall.com/courses/intro-to-design',
    'https://www.hexadigitall.com/courses/network-security-essentials',
    'https://www.hexadigitall.com/courses/machine-learning-crash-course',
    'https://www.hexadigitall.com/courses/data-analysis-fast-track',
    'https://www.hexadigitall.com/courses/graphic-design-crash-course',
    'https://www.hexadigitall.com/courses/agile-project-management-essentials',
    'https://www.hexadigitall.com/courses/product-management-quick-start',
    'https://www.hexadigitall.com/courses/backend-development-crash-course',
    'https://www.hexadigitall.com/courses/copywriting-crash-course'
  ],
  newCourses: [
    'https://www.hexadigitall.com/courses/autocad-masterclass',
    'https://www.hexadigitall.com/courses/archicad-professional',
    'https://www.hexadigitall.com/courses/adobe-creative-cloud-suite',
    'https://www.hexadigitall.com/courses/vector-graphics-mastery-coreldraw',
    'https://www.hexadigitall.com/courses/visual-communication-infographics',
    'https://www.hexadigitall.com/courses/business-intelligence-analytics',
    'https://www.hexadigitall.com/courses/advanced-excel-business',
    'https://www.hexadigitall.com/courses/programming-data-management',
    'https://www.hexadigitall.com/courses/sql-relational-database-design',
    'https://www.hexadigitall.com/courses/nosql-cloud-database-architecture',
    'https://www.hexadigitall.com/courses/rapid-app-development-low-code',
    'https://www.hexadigitall.com/courses/microsoft-access-business-apps',
    'https://www.hexadigitall.com/courses/executive-presentation-public-speaking',
    'https://www.hexadigitall.com/courses/microsoft-365-ai-integration'
  ],
  services: [
    'https://www.hexadigitall.com/services/business-plan-and-logo-design',
    'https://www.hexadigitall.com/services/mentoring-and-consulting',
    'https://www.hexadigitall.com/services/profile-and-portfolio-building',
    'https://www.hexadigitall.com/services/social-media-advertising-and-marketing',
    'https://www.hexadigitall.com/services/web-and-mobile-software-development'
  ]
};

const ogImagesDir = 'public/og-images';

// Map course slugs from generate-marketing-images.mjs master map
async function regenerateQRCodes() {
  console.log('🔄 Regenerating QR codes with correct URLs...\n');

  let total = 0;
  let updated = 0;

  // Process schools
  for (const schoolUrl of CORRECT_URLS.schools) {
    const schoolSlug = schoolUrl.split('/').pop();
    const schoolQrPath = path.join(ogImagesDir, 'schools', `${schoolSlug}-qr.png`);
    if (fs.existsSync(schoolQrPath)) {
      await QRCode.toFile(schoolQrPath, schoolUrl, { width: 300 });
      updated++;
    }
    total++;
  }

  // Process courses
  for (const courseUrl of CORRECT_URLS.courses) {
    const courseSlug = courseUrl.split('/').pop();
    const courseQrPath = path.join(ogImagesDir, 'courses', `${courseSlug}-qr.png`);
    if (fs.existsSync(courseQrPath)) {
      await QRCode.toFile(courseQrPath, courseUrl, { width: 300 });
      updated++;
    }
    total++;
  }

  // Process new courses
  for (const courseUrl of CORRECT_URLS.newCourses) {
    const courseSlug = courseUrl.split('/').pop();
    const courseQrPath = path.join(ogImagesDir, 'courses', `${courseSlug}-qr.png`);
    if (fs.existsSync(courseQrPath)) {
      await QRCode.toFile(courseQrPath, courseUrl, { width: 300 });
      updated++;
    }
    total++;
  }

  // Process services
  for (const serviceUrl of CORRECT_URLS.services) {
    const serviceSlug = serviceUrl.split('/').pop();
    const serviceQrPath = path.join(ogImagesDir, 'services', `${serviceSlug}-qr.png`);
    if (fs.existsSync(serviceQrPath)) {
      await QRCode.toFile(serviceQrPath, serviceUrl, { width: 300 });
      updated++;
    }
    total++;
  }

  console.log(`✅ QR Code regeneration complete!`);
  console.log(`   Total URLs to update: ${total}`);
  console.log(`   QR codes updated: ${updated}`);
}

regenerateQRCodes().catch(console.error);
