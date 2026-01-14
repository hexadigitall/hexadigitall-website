import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import QRCode from 'qrcode';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// --- 1. CONFIGURATION ---

const BASE_SITE_URL = 'https://www.hexadigitall.com';
const TEMP_BACKUP_DIR = `/mnt/d/projects/temp`;
const BATCH_SIZE = 20;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const LOGO_PATH = path.join(PROJECT_ROOT, 'public/hexadigitall-logo-transparent.png');
const OUTPUT_ROOT = path.join(PROJECT_ROOT, 'public/og-images');

const SOURCES = [
  { id: 'courses', dir: path.join(PROJECT_ROOT, 'public/assets/images/courses'), badgeText: 'Professional Certification' },
  { id: 'services', dir: path.join(PROJECT_ROOT, 'public/assets/images/services'), badgeText: 'Professional Service' },
  { id: 'schools', dir: path.join(PROJECT_ROOT, 'public/assets/images/schools'), badgeText: 'School of Excellence' }
];

// --- 2. THE MASTER "ONE-TO-ONE" URL MAP ---
// Key = Clean Filename (no extension, no 'course-'/'service-' prefix, no digits)
// Value = The EXACT URL to generate the QR code for

const EXACT_URL_MAP = {
  // === SCHOOLS ===
  'school-of-algorithms': 'https://www.hexadigitall.com/school/school-of-algorithms',
  'school-of-writing': 'https://www.hexadigitall.com/school/school-of-writing',
  'school-of-cloud-and-devops': 'https://www.hexadigitall.com/school/school-of-cloud-and-devops',
  'school-of-coding-and-development': 'https://www.hexadigitall.com/school/school-of-coding-and-development',
  'school-of-cybersecurity': 'https://www.hexadigitall.com/school/school-of-cybersecurity',
  'school-of-data-and-ai': 'https://www.hexadigitall.com/school/school-of-data-and-ai',
  'school-of-design': 'https://www.hexadigitall.com/school/school-of-design',
  'school-of-executive-management': 'https://www.hexadigitall.com/school/school-of-executive-management',
  'school-of-fundamentals': 'https://www.hexadigitall.com/school/school-of-fundamentals',
  'school-of-growth-and-marketing': 'https://www.hexadigitall.com/school/school-of-growth-and-marketing',
  'school-of-infrastructure': 'https://www.hexadigitall.com/school/school-of-infrastructure',
  'school-of-software-mastery': 'https://www.hexadigitall.com/school/school-of-software-mastery',

  // === SERVICES (Mapping Packages to their Parent Category) ===
  
  // 1. Business Planning & Branding
  'business-plan-and-logo-design': 'https://www.hexadigitall.com/services/business-plan-and-logo-design',
  'business-plan-and-logo': 'https://www.hexadigitall.com/services/business-plan-and-logo-design',
  'business-plan-growth': 'https://www.hexadigitall.com/services/business-plan-and-logo-design',
  'business-plan-investor': 'https://www.hexadigitall.com/services/business-plan-and-logo-design',
  'business-plan-starter': 'https://www.hexadigitall.com/services/business-plan-and-logo-design',
  'logo-design': 'https://www.hexadigitall.com/services/business-plan-and-logo-design',
  'financial-projections': 'https://www.hexadigitall.com/services/business-plan-and-logo-design',

  // 2. Mentoring & Consulting
  'mentoring-and-consulting': 'https://www.hexadigitall.com/services/mentoring-and-consulting',
  'mentoring-program': 'https://www.hexadigitall.com/services/mentoring-and-consulting',
  'strategy-session': 'https://www.hexadigitall.com/services/mentoring-and-consulting',
  'consulting': 'https://www.hexadigitall.com/services/mentoring-and-consulting',
  'growth-accelerator': 'https://www.hexadigitall.com/services/mentoring-and-consulting',
  'pitch-practice': 'https://www.hexadigitall.com/services/mentoring-and-consulting',

  // 3. Profile & Portfolio
  'profile-and-portfolio-building': 'https://www.hexadigitall.com/services/profile-and-portfolio-building',
  'profile-and-portfolio': 'https://www.hexadigitall.com/services/profile-and-portfolio-building',
  'professional-woman': 'https://www.hexadigitall.com/services/profile-and-portfolio-building',
  'professional-cv-resume': 'https://www.hexadigitall.com/services/profile-and-portfolio-building',
  'linkedin-optimization': 'https://www.hexadigitall.com/services/profile-and-portfolio-building',
  'portfolio-website': 'https://www.hexadigitall.com/services/profile-and-portfolio-building',

  // 4. Social Media & Marketing
  'social-media-advertising-and-marketing': 'https://www.hexadigitall.com/services/social-media-advertising-and-marketing',
  'social-media-marketing': 'https://www.hexadigitall.com/services/social-media-advertising-and-marketing',
  'social-media-audit': 'https://www.hexadigitall.com/services/social-media-advertising-and-marketing',
  'social-starter': 'https://www.hexadigitall.com/services/social-media-advertising-and-marketing',
  'ad-campaign-setup': 'https://www.hexadigitall.com/services/social-media-advertising-and-marketing',
  'marketing-pro': 'https://www.hexadigitall.com/services/social-media-advertising-and-marketing',

  // 5. Web & Mobile Development
  'web-and-mobile-software-development': 'https://www.hexadigitall.com/services/web-and-mobile-software-development',
  'web-and-mobile-development': 'https://www.hexadigitall.com/services/web-and-mobile-software-development',
  'business-website': 'https://www.hexadigitall.com/services/web-and-mobile-software-development',
  'ecommerce-store': 'https://www.hexadigitall.com/services/web-and-mobile-software-development',
  'mobile-app-development': 'https://www.hexadigitall.com/services/web-and-mobile-software-development',
  'landing-page-design': 'https://www.hexadigitall.com/services/web-and-mobile-software-development',
  'cms-integration': 'https://www.hexadigitall.com/services/web-and-mobile-software-development',
  'web-development': 'https://www.hexadigitall.com/services/web-and-mobile-software-development',
  'cloud-infrastructure-devops': 'https://www.hexadigitall.com/services/web-and-mobile-software-development',
  'it-support': 'https://www.hexadigitall.com/services/web-and-mobile-software-development',
  'cybersecurity': 'https://www.hexadigitall.com/services/web-and-mobile-software-development',
  'data-analytics-bi': 'https://www.hexadigitall.com/services/web-and-mobile-software-development',

  // === COURSES (Explicit Mapping) ===
  'meta-ads-for-local-business': 'https://www.hexadigitall.com/courses/meta-ads-for-local-business',
  'adsense-traffic-revenue': 'https://www.hexadigitall.com/courses/adsense-traffic-revenue',
  'copywriting-for-direct-response': 'https://www.hexadigitall.com/courses/copywriting-for-direct-response',
  'youtube-ads-manager': 'https://www.hexadigitall.com/courses/youtube-ads-manager',
  'server-side-tracking-capi': 'https://www.hexadigitall.com/courses/server-side-tracking-capi',
  'amazon-retail-media-networks': 'https://www.hexadigitall.com/courses/amazon-retail-media-networks',
  'devops-engineering-cloud-infrastructure': 'https://www.hexadigitall.com/courses/devops-engineering-cloud-infrastructure',
  'frontend-engineering-react-next-js-mastery': 'https://www.hexadigitall.com/courses/frontend-engineering-react-next-js-mastery',
  'frontend-mastery-with-react-next-js': 'https://www.hexadigitall.com/courses/frontend-engineering-react-next-js-mastery',
  'system-design-interviews': 'https://www.hexadigitall.com/courses/system-design-interviews',
  'technical-writing': 'https://www.hexadigitall.com/courses/technical-writing',
  'personal-branding': 'https://www.hexadigitall.com/courses/personal-branding',
  'html-fundamentals': 'https://www.hexadigitall.com/courses/html-fundamentals',
  'advanced-javascript-mastery': 'https://www.hexadigitall.com/courses/advanced-javascript-mastery',
  'intro-to-algorithms-problem-solving': 'https://www.hexadigitall.com/courses/intro-to-algorithms-problem-solving',
  'intro-to-cloud-computing': 'https://www.hexadigitall.com/courses/intro-to-cloud-computing',
  'intro-to-coding': 'https://www.hexadigitall.com/courses/intro-to-coding',
  'intro-to-digital-literacy': 'https://www.hexadigitall.com/courses/intro-to-digital-literacy',
  'intro-to-professional-writing': 'https://www.hexadigitall.com/courses/intro-to-professional-writing',
  'aws-crash-course-for-beginners': 'https://www.hexadigitall.com/courses/aws-crash-course-for-beginners',
  'uiux-quick-start-for-developers': 'https://www.hexadigitall.com/courses/uiux-quick-start-for-developers',
  'mobile-app-development-quick-start': 'https://www.hexadigitall.com/courses/mobile-app-development-quick-start',
  'adsense-101-approval-blueprint': 'https://www.hexadigitall.com/courses/adsense-101-approval-blueprint',
  'google-search-ads-boot-camp': 'https://www.hexadigitall.com/courses/google-search-ads-boot-camp',
  'canva-for-ad-creatives': 'https://www.hexadigitall.com/courses/canva-for-ad-creatives',
  'intro-to-digital-media-buying': 'https://www.hexadigitall.com/courses/intro-to-digital-media-buying',
  'adsense-arbitrage-pro': 'https://www.hexadigitall.com/courses/adsense-arbitrage-pro',
  'advanced-ansible-automation-iac': 'https://www.hexadigitall.com/courses/advanced-ansible-automation',
  'advanced-backend-engineering-node-js-microservices': 'https://www.hexadigitall.com/courses/advanced-backend-nodejs',
  'backend-engineering': 'https://www.hexadigitall.com/courses/backend-engineering-scalable-architectures',
  'advanced-seo-rank-1-on-google': 'https://www.hexadigitall.com/courses/advanced-seo-mastery',
  'advanced-seo-serp-ranking-mastery': 'https://www.hexadigitall.com/courses/advanced-seo-mastery',
  'ai-engineering-building-llms-neural-networks': 'https://www.hexadigitall.com/courses/ai-engineering-llms',
  'applied-machine-learning-data-science': 'https://www.hexadigitall.com/courses/applied-machine-learning',
  'aws-certified-solutions-architect-associate-professional': 'https://www.hexadigitall.com/courses/aws-certified-solutions-architect',
  'c-net-core-architecture': 'https://www.hexadigitall.com/courses/c-sharp-net-core',
  'cisco-certified-network-associate-ccna-200-301': 'https://www.hexadigitall.com/courses/ccna-networking',
  'certified-scrum-master-csm-bootcamp': 'https://www.hexadigitall.com/courses/certified-scrum-master-csm',
  'cissp-senior-security-professional-prep': 'https://www.hexadigitall.com/courses/cissp-certification-prep',
  'cissp-certification-prep-course': 'https://www.hexadigitall.com/courses/cissp-certification-prep',
  'cloud-infrastructure-deployment-strategy': 'https://www.hexadigitall.com/courses/cloud-infrastructure-strategy',
  'computer-hardware-engineering-system-maintenance': 'https://www.hexadigitall.com/courses/computer-hardware-engineering',
  'devops-engineering-kubernetes-mastery': 'https://www.hexadigitall.com/courses/devops-kubernetes-mastery',
  'digital-literacy-computer-operations': 'https://www.hexadigitall.com/courses/digital-literacy-computer-operations',
  'digital-marketing-for-small-businesses': 'https://www.hexadigitall.com/courses/digital-marketing-small-business',
  'enterprise-security-risk-management': 'https://www.hexadigitall.com/courses/enterprise-security-risk',
  'ethical-hacking-for-beginners': 'https://www.hexadigitall.com/courses/ethical-hacking-beginners',
  'ethical-hacking-penetration-testing-masterclass': 'https://www.hexadigitall.com/courses/ethical-hacking-penetration-testing',
  'executive-agile-leadership-transformation': 'https://www.hexadigitall.com/courses/executive-agile-leadership',
  'full-stack-web-development-bootcamp-zero-to-hero': 'https://www.hexadigitall.com/courses/full-stack-web-development',
  'web-development-bootcamp-from-zero-to-hero': 'https://www.hexadigitall.com/courses/full-stack-web-development',
  'git-github-for-beginners': 'https://www.hexadigitall.com/courses/git-github-beginners',
  'devops-fundamentals-git-github-mastery': 'https://www.hexadigitall.com/courses/git-github-beginners',
  'google-analytics-4-ga4-data-mastery': 'https://www.hexadigitall.com/courses/google-analytics-4-mastery',
  'google-analytics-4-from-beginner-to-expert': 'https://www.hexadigitall.com/courses/google-analytics-4-mastery',
  'integrated-digital-marketing-growth-strategy': 'https://www.hexadigitall.com/courses/integrated-digital-marketing',
  'java-enterprise-development': 'https://www.hexadigitall.com/courses/java-enterprise-development',
  'linux-administration-shell-scripting-pro': 'https://www.hexadigitall.com/courses/linux-administration-shell-scripting',
  'motion-graphics-visual-effects': 'https://www.hexadigitall.com/courses/motion-graphics-vfx',
  'enterprise-cloud-solutions-architect': 'https://www.hexadigitall.com/courses/enterprise-cloud-solutions-architect',
  'security-operations-analyst-sc-200': 'https://www.hexadigitall.com/courses/security-operations-analyst-sc-200',
  'leetcode-problem-solving-interview-prep': 'https://www.hexadigitall.com/courses/leetcode-interview-prep',
  'competitive-programming-mastery': 'https://www.hexadigitall.com/courses/competitive-programming',
  'business-writing-professional-communication': 'https://www.hexadigitall.com/courses/business-writing',
  'ui-ux-design-fundamentals': 'https://www.hexadigitall.com/courses/ui-ux-fundamentals',
  'advanced-ui-ux-design-design-systems': 'https://www.hexadigitall.com/courses/advanced-ui-ux',
  'css-fundamentals': 'https://www.hexadigitall.com/courses/css-fundamentals',
  'javascript-fundamentals': 'https://www.hexadigitall.com/courses/javascript-fundamentals',
  'css-only-projects': 'https://www.hexadigitall.com/courses/css-only-projects',
  'advanced-css-mastery': 'https://www.hexadigitall.com/courses/advanced-css-mastery',
  'javascript-only-projects': 'https://www.hexadigitall.com/courses/javascript-only-projects',
  'modern-javascript-algorithms-data-structures': 'https://www.hexadigitall.com/courses/advanced-javascript-mastery',
  'intro-to-data-ai': 'https://www.hexadigitall.com/courses/intro-to-data-ai',
  'intro-to-leadership-management': 'https://www.hexadigitall.com/courses/intro-to-leadership-management',
  'intro-to-digital-marketing': 'https://www.hexadigitall.com/courses/intro-to-digital-marketing',
  'intro-to-networking-infrastructure': 'https://www.hexadigitall.com/courses/intro-to-networking-infrastructure',
  'network-security-administration': 'https://www.hexadigitall.com/courses/network-security-admin',
  'intro-to-software-development': 'https://www.hexadigitall.com/courses/intro-to-software-development',
  'kubernetes-quick-start': 'https://www.hexadigitall.com/courses/kubernetes-quick-start',
  'react-essentials-bootcamp': 'https://www.hexadigitall.com/courses/react-essentials-bootcamp',
  'full-stack-jumpstart-mern': 'https://www.hexadigitall.com/courses/full-stack-jumpstart-mern',
  'ethical-hacking-fast-track': 'https://www.hexadigitall.com/courses/ethical-hacking-fast-track',
  'seo-fast-track-rank-on-google': 'https://www.hexadigitall.com/courses/seo-fast-track-rank-on-google',
  'social-media-marketing-accelerator': 'https://www.hexadigitall.com/courses/social-media-marketing-accelerator',
  'technical-writing-essentials': 'https://www.hexadigitall.com/courses/technical-writing-essentials',
  'project-management-fundamentals': 'https://www.hexadigitall.com/courses/agile-project-management-essentials',
  'project-management-professional-pmp-accelerator': 'https://www.hexadigitall.com/courses/pmp-certification-prep',
  'product-strategy-the-lean-startup-building-mvps': 'https://www.hexadigitall.com/courses/product-strategy-lean-startup',
  'the-lean-startup-build-your-mvp': 'https://www.hexadigitall.com/courses/product-strategy-lean-startup',
  'professional-office-365-suite-mastery': 'https://www.hexadigitall.com/courses/professional-office-365',
  'python-for-data-science-analytics': 'https://www.hexadigitall.com/courses/python-data-science-analytics',
  'react-native-cross-platform-mobile-apps': 'https://www.hexadigitall.com/courses/react-native-mobile-dev',
  'react-native-build-mobile-apps-for-ios-android': 'https://www.hexadigitall.com/courses/react-native-mobile-dev',
  'cross-platform-mobile-app-development-react-native': 'https://www.hexadigitall.com/courses/react-native-mobile-dev',
  'tiktok-reels-ad-strategy': 'https://www.hexadigitall.com/courses/tiktok-reels-ad-strategy',
  'programmatic-advertising-rtb': 'https://www.hexadigitall.com/courses/programmatic-advertising-rtb',
  'social-media-marketing-community-growth': 'https://www.hexadigitall.com/courses/social-media-community-growth',
  'technical-writing-api-documentation': 'https://www.hexadigitall.com/courses/technical-writing-api-docs',
  'azure-security-technologies-az-500': 'https://www.hexadigitall.com/courses/azure-security-technologies-az-500',
  'microsoft-cybersecurity-architect-sc-100': 'https://www.hexadigitall.com/courses/microsoft-cybersecurity-architect-sc-100',
  'application-security-appsec-specialist': 'https://www.hexadigitall.com/courses/application-security-appsec-specialist',
  'devsecops-engineering-automating-security': 'https://www.hexadigitall.com/courses/devsecops-engineering-automating-security',
  'professional-data-engineering': 'https://www.hexadigitall.com/courses/professional-data-engineering',
  'product-design-ui-ux-professional-bootcamp': 'https://www.hexadigitall.com/courses/ui-ux-product-design',
  'visual-brand-design-graphic-artistry': 'https://www.hexadigitall.com/courses/visual-brand-design',
  'cybersecurity-fundamentals-network-systems-defense': 'https://www.hexadigitall.com/courses/cybersecurity-fundamentals-network-systems-defense',
  'mobile-engineering': 'https://www.hexadigitall.com/courses/mobile-engineering-cross-platform-development',
  'mobile-engineering-cross-platform-development': 'https://www.hexadigitall.com/courses/mobile-engineering-cross-platform-development',
  'content-writing-copywriting-for-web': 'https://www.hexadigitall.com/courses/content-writing-copywriting',
  'graphic-design-essentials': 'https://www.hexadigitall.com/courses/graphic-design-essentials',
  'graphic-design': 'https://www.hexadigitall.com/courses/graphic-design-essentials',
  'intro-to-cybersecurity': 'https://www.hexadigitall.com/courses/intro-to-cybersecurity',
  'intro-to-design': 'https://www.hexadigitall.com/courses/intro-to-design',
  'network-security-essentials': 'https://www.hexadigitall.com/courses/network-security-essentials',
  'machine-learning-crash-course': 'https://www.hexadigitall.com/courses/machine-learning-crash-course',
  'data-analysis-with-python': 'https://www.hexadigitall.com/courses/data-analysis-fast-track',
  'graphic-design-crash-course': 'https://www.hexadigitall.com/courses/graphic-design-crash-course',
  'backend-development-crash-course': 'https://www.hexadigitall.com/courses/backend-development-crash-course',
  'copywriting-crash-course': 'https://www.hexadigitall.com/courses/copywriting-crash-course',
  'course-coding': 'https://www.hexadigitall.com/courses/intro-to-coding',
  'course-data-analysis': 'https://www.hexadigitall.com/courses/data-analysis-fast-track',
  'mobile-office-business-productivity-from-your-phone': 'https://www.hexadigitall.com/courses/digital-literacy-computer-operations',

  // === NEW COURSES ===
  'autocad-masterclass': 'https://www.hexadigitall.com/courses/autocad-masterclass',
  'archicad-professional': 'https://www.hexadigitall.com/courses/archicad-professional',
  'adobe-creative-cloud-suite': 'https://www.hexadigitall.com/courses/adobe-creative-cloud-suite',
  'vector-graphics-mastery-coreldraw': 'https://www.hexadigitall.com/courses/vector-graphics-mastery-coreldraw',
  'visual-communication-infographics': 'https://www.hexadigitall.com/courses/visual-communication-infographics',
  'business-intelligence-bi-and-analytics': 'https://www.hexadigitall.com/courses/business-intelligence-analytics',
  'advanced-excel-for-business': 'https://www.hexadigitall.com/courses/advanced-excel-business',
  'programming-for-data-management': 'https://www.hexadigitall.com/courses/programming-data-management',
  'sql-and-relational-database-design': 'https://www.hexadigitall.com/courses/sql-relational-database-design',
  'nosql-and-cloud-database-architecture': 'https://www.hexadigitall.com/courses/nosql-cloud-database-architecture',
  'rapid-app-development-low-code-no-code': 'https://www.hexadigitall.com/courses/rapid-app-development-low-code',
  'microsoft-access-for-business-apps': 'https://www.hexadigitall.com/courses/microsoft-access-business-apps',
  'executive-presentation-and-public-speaking': 'https://www.hexadigitall.com/courses/executive-presentation-public-speaking',
  'microsoft-365-and-ai-integration': 'https://www.hexadigitall.com/courses/microsoft-365-ai-integration',
  
  // INDEX PAGES
  'courses': 'https://www.hexadigitall.com/courses',
  'services': 'https://www.hexadigitall.com/services'
};

const TITLE_TEXT_OVERRIDES = {
  // Service Packages Titles
  'service-business-website': 'Business Website — Basic',
  'service-business-website2': 'Business Website — Standard',
  'service-business-website3': 'Business Website — Premium',
  'service-ecommerce-store': 'E-commerce Store — Basic',
  'service-ecommerce-store2': 'E-commerce Store — Standard',
  'service-ecommerce-store3': 'E-commerce Store — Premium',
  'service-social-media-marketing': 'Social Media — Basic',
  'service-social-media-marketing2': 'Social Media — Standard',
  'service-social-media-marketing3': 'Social Media — Premium',
  'service-mobile-app-development': 'Web App — Startup Edition',
  'service-mobile-app-development2': 'Web App — Business Edition',
  'service-mobile-app-development3': 'Web App — Enterprise Edition',
  'service-business-plan-and-logo': 'Business Plan — Basic',
  'service-business-plan-and-logo2': 'Business Plan — Standard',
  'service-business-plan-and-logo3': 'Business Plan — Premium',
  // Schools
  'school-of-algorithms': 'School of Algorithms & Problem Solving',
  'school-of-writing': 'School of Writing & Communication',
  'school-of-cloud-and-devops': 'School of Cloud & DevOps',
  'school-of-coding-and-development': 'School of Coding & Development',
  'school-of-cybersecurity': 'School of Cybersecurity',
  'school-of-data-and-ai': 'School of Data & AI',
  'school-of-design': 'School of Design',
  'school-of-executive-management': 'School of Executive Management',
  'school-of-fundamentals': 'School of Fundamentals',
  'school-of-growth-and-marketing': 'School of Growth & Marketing',
  'school-of-infrastructure': 'School of Infrastructure',
  'school-of-software-mastery': 'School of Software Mastery',
  // Courses
  'courses': 'Master In-Demand Tech Skills & Certifications',
  'c-net-core-architecture': 'C#, .NET Core Architecture & Development',
  'advanced-backend-engineering-node-js-microservices': 'Advanced Backend: Node.js & Microservices',
  'aws-certified-solutions-architect-associate-professional': 'AWS Certified Solutions Architect (Associate)',
  'frontend-mastery-with-react-next-js': 'Frontend Engineering: React & Next.js',
  'react-native-build-mobile-apps-for-ios-android': 'React Native Mobile Development',
  'microsoft-365-and-ai-integration': 'Microsoft 365 & AI Integration',
  'nosql-and-cloud-database-architecture': 'NoSQL & Cloud Database Architecture',

  //Services
  'services': 'Professional Tech Services & Solutions'
};

const UPPERCASE_WORDS = ['aws', 'sql', 'nosql', 'api', 'ai', 'bi', 'css', 'html', 'php', 'js', 'cad', 'bim', 'iot', 'devops', 'ui', 'ux', 'seo', 'serp', 'sem', 'crm', 'erp', 'llm', 'llms', 'ga4', 'mvp', 'mvps', 'ios', 'cv', 'ccna', 'cissp', 'csm', 'az', 'pmp', 'sc', 'az-500'];

// --- 3. HELPER FUNCTIONS ---

function getTargetUrl(filename) {
  // Clean filename to match the Keys in EXACT_URL_MAP
  const cleanName = path.parse(filename).name
    .replace(/^course-/, '')  // Remove course prefix if any
    .replace(/^service-/, '') // Remove service prefix if any
    .replace(/[-_]?\d+$/, '') // Remove numbers (1, 2, 3)
    .replace(/[-_]+$/, '');   // Remove trailing dashes

  // 1. Direct Lookup
  if (EXACT_URL_MAP[cleanName]) return EXACT_URL_MAP[cleanName];

  // 2. Lookup with Original Filename (for cases like "courses.jpg" or "services.jpg")
  const rawName = path.parse(filename).name;
  if (EXACT_URL_MAP[rawName]) return EXACT_URL_MAP[rawName];

  // 3. Fallback for Index
  if (cleanName === 'courses') return `${BASE_SITE_URL}/courses`;
  if (cleanName === 'services') return `${BASE_SITE_URL}/services`;

  console.warn(`⚠️  WARNING: No URL map found for file: ${filename} (Key: ${cleanName})`);
  return BASE_SITE_URL; // Default safe fallback
}

function formatTitle(filename, sourceId) {
  let rawName = path.parse(filename).name;
  let cleanKey = rawName.replace(/^course-/, '').replace(/^service-/, '');
  
  if (TITLE_TEXT_OVERRIDES[cleanKey]) return TITLE_TEXT_OVERRIDES[cleanKey];

  let baseKey = cleanKey.replace(/[-_]?\d+$/, '');
  let suffix = '';
  if (sourceId === 'services') {
     if (cleanKey.match(/3$/)) suffix = ' — Premium';
     else if (cleanKey.match(/2$/)) suffix = ' — Standard';
     else if (cleanKey.match(/1$/)) suffix = ' — Basic';
     
     if (TITLE_TEXT_OVERRIDES[baseKey]) return TITLE_TEXT_OVERRIDES[baseKey] + suffix;
  }

  const words = baseKey.split(/[-_]/);
  const formatted = words.map((word, index) => {
    const lowerWord = word.toLowerCase();
    if (['and', 'or', 'for', 'to', 'in', 'with', 'on', 'at', 'of', 'by'].includes(lowerWord) && index !== 0) return lowerWord;
    if (UPPERCASE_WORDS.includes(lowerWord)) return lowerWord.toUpperCase();
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');

  return formatted + suffix;
}

function backupAndClearDirectory(sourceDir, backupDir) {
  if (!fs.existsSync(sourceDir)) return;
  const timestamp = Date.now();
  const uniqueBackupDir = path.join(backupDir, `backup_og_${timestamp}`);
  if (!fs.existsSync(uniqueBackupDir)) fs.mkdirSync(uniqueBackupDir, { recursive: true });
  console.log(`🧹 Cleaning ${sourceDir} and backing up to ${uniqueBackupDir}...`);
  
  const moveFiles = (currentPath, relativePath = '') => {
    if (!fs.existsSync(currentPath)) return;
    const items = fs.readdirSync(currentPath);
    items.forEach(item => {
      const srcPath = path.join(currentPath, item);
      const destPath = path.join(uniqueBackupDir, relativePath, item);
      const stat = fs.statSync(srcPath);
      if (stat.isDirectory()) {
        if (!fs.existsSync(destPath)) fs.mkdirSync(destPath, { recursive: true });
        moveFiles(srcPath, path.join(relativePath, item));
      } else {
        const destFolder = path.dirname(destPath);
        if (!fs.existsSync(destFolder)) fs.mkdirSync(destFolder, { recursive: true });
        fs.copyFileSync(srcPath, destPath);
        fs.unlinkSync(srcPath);
      }
    });
  };
  moveFiles(sourceDir);
}

function getDesignHTML(type, title, category, imgBase64, logoBase64, qrCodeBase64) {
  let width = 1200, height = 630;
  if (type === 'post') { width = 1080; height = 1080; }
  if (type === 'story') { width = 1080; height = 1920; }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        body { margin: 0; padding: 0; width: ${width}px; height: ${height}px; font-family: 'Inter', sans-serif; background-color: #0f172a; position: relative; overflow: hidden; }
        
        .bg-image { position: absolute; inset: 0; background-image: url('${imgBase64}'); background-size: cover; background-position: center; opacity: 0.35; z-index: 1; }
        
        .brand-badge { position: absolute; top: 40px; right: 50px; background: linear-gradient(90deg, #0f172a 0%, #1e293b 100%); border: 1px solid rgba(255,255,255,0.1); color: #06b6d4; padding: 10px 25px; border-radius: 50px; font-weight: 800; font-size: 16px; letter-spacing: 1px; z-index: 20; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
        
        .logo-container { position: absolute; top: 40px; left: 50px; z-index: 20; background: rgba(15, 23, 42, 0.6); padding: 10px 20px; border-radius: 12px; backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.05); }
        .logo { width: 160px; display: block; }
        
        .qr-container { position: absolute; bottom: 40px; right: 50px; background: white; padding: 10px; border-radius: 12px; z-index: 20; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
        .qr-code { width: 100px; height: 100px; display: block; }
        
        .content-card {
          position: absolute; left: 50px; z-index: 10;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.85) 100%);
          backdrop-filter: blur(10px); padding: 40px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.6);
          ${type === 'story' ? 
            'bottom: 250px; left: 50%; transform: translateX(-50%); width: 80%; text-align: center; border-bottom: 8px solid #06b6d4;' : 
            'bottom: 50px; width: 65%; border-left: 8px solid #06b6d4;'}
        }

        .category { color: #06b6d4; font-size: 14px; text-transform: uppercase; font-weight: 700; letter-spacing: 2px; margin-bottom: 12px; }
        h1 { color: white; margin: 0; font-weight: 800; line-height: 1.1; font-size: ${type === 'story' ? '48px' : '42px'}; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
        .cta-btn { display: inline-block; margin-top: 20px; background: linear-gradient(90deg, #06b6d4 0%, #22d3ee 100%); color: #0f172a; padding: 12px 30px; border-radius: 50px; font-weight: 800; font-size: 14px; text-transform: uppercase; box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3); }
      </style>
    </head>
    <body>
      <div class="bg-image"></div>
      <div class="logo-container"><img src="${logoBase64}" class="logo" /></div>
      <div class="brand-badge">HEXADIGITALL.COM</div>
      <div class="content-card">
        <div class="category">${category}</div>
        <h1>${title}</h1>
        <div class="cta-btn">Enroll Now</div>
      </div>
      <div class="qr-container"><img src="${qrCodeBase64}" class="qr-code" /></div>
    </body>
    </html>
  `;
}

// --- 3. MAIN EXECUTION ---
(async () => {
  console.log('🚀 Starting Exact-Map Marketing Image Generation...');
  backupAndClearDirectory(OUTPUT_ROOT, TEMP_BACKUP_DIR);

  const browser = await puppeteer.launch();
  let page = await browser.newPage();

  if (!fs.existsSync(LOGO_PATH)) { console.error(`❌ Logo missing: ${LOGO_PATH}`); process.exit(1); }
  const logoBuffer = fs.readFileSync(LOGO_PATH);
  const logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;

  let globalCounter = 0;

  for (const source of SOURCES) {
    if (!fs.existsSync(source.dir)) continue;
    const files = fs.readdirSync(source.dir).filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
    console.log(`\n📂 ${source.id.toUpperCase()}: Processing ${files.length} images...`);

    for (const file of files) {
      globalCounter++;
      // Restart browser every batch to free memory
      if (globalCounter % BATCH_SIZE === 0) {
        await page.close();
        page = await browser.newPage();
      }

      const sourcePath = path.join(source.dir, file);
      const title = formatTitle(file, source.id);
      
      // Get the correct validated URL from the EXACT Map
      const targetUrl = getTargetUrl(file);

      const qrCodeDataUrl = await QRCode.toDataURL(targetUrl, { width: 300, margin: 0 });
      const imgBuffer = fs.readFileSync(sourcePath);
      const imgBase64 = `data:image/jpeg;base64,${imgBuffer.toString('base64')}`;

      const formats = [
        { type: 'main', dir: OUTPUT_ROOT },
        { type: 'post', dir: path.join(OUTPUT_ROOT, 'posts') },
        { type: 'story', dir: path.join(OUTPUT_ROOT, 'stories') }
      ];

      for (const fmt of formats) {
        if (!fs.existsSync(fmt.dir)) fs.mkdirSync(fmt.dir, { recursive: true });
        const html = getDesignHTML(fmt.type, title, source.badgeText, imgBase64, logoBase64, qrCodeDataUrl);
        await page.setContent(html);
        
        if (fmt.type === 'main') await page.setViewport({ width: 1200, height: 630 });
        if (fmt.type === 'post') await page.setViewport({ width: 1080, height: 1080 });
        if (fmt.type === 'story') await page.setViewport({ width: 1080, height: 1920 });

        await page.screenshot({ path: path.join(fmt.dir, file), type: 'jpeg', quality: 90 });
      }
      process.stdout.write('.');
    }
  }
  await browser.close();
  console.log('\n✅ Generation Complete.');
})();