import path from 'path';
import { fileURLToPath } from 'url';
import { client, guessLocalImagePathFor, guessOgPostImagePathFor, findOrUpload } from './lib/sanity-helpers.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// 14 new courses with pricing and metadata (aligned with import-courses-full.mjs)
const coursesBySchool = [
  {
    schoolSlug: 'school-of-design',
    courses: [
      { title: 'AutoCAD Masterclass', slug: 'autocad-masterclass', duration: '12 Weeks', difficulty: 'Intermediate', imageSlug: 'autocad-masterclass', description: 'Master AutoCAD from fundamentals to advanced techniques. Learn precision 2D drafting, create detailed 3D models, and understand industry-standard workflows used by professional architects and engineers.', pricePerMonthNGN: 32000, pricePerHourNGN: 8000, pricePerMonth: 60, pricePerHour: 15 },
      { title: 'ArchiCAD Professional', slug: 'archicad-professional', duration: '16 Weeks', difficulty: 'Intermediate', imageSlug: 'archicad-professional', description: 'Become proficient in Building Information Modeling (BIM) with ArchiCAD. Master the creation of detailed floor plans, sections, and elevations with photorealistic visualizations.', pricePerMonthNGN: 40000, pricePerHourNGN: 10000, pricePerMonth: 80, pricePerHour: 20 },
      { title: 'Adobe Creative Cloud Suite', slug: 'adobe-creative-cloud-suite', duration: '12 Weeks', difficulty: 'Beginner to Intermediate', imageSlug: 'adobe-creative-cloud-suite', description: 'Master the essential Adobe Creative Cloud applications. Create professional vector graphics and logos in Illustrator, perform advanced photo compositing in Photoshop.', pricePerMonthNGN: 36000, pricePerHourNGN: 9000, pricePerMonth: 60, pricePerHour: 15 },
      { title: 'Vector Graphics Mastery (CorelDRAW)', slug: 'vector-graphics-mastery-coreldraw', duration: '10 Weeks', difficulty: 'Beginner to Intermediate', imageSlug: 'vector-graphics-mastery-coreldraw', description: 'Master CorelDRAW for professional print design and illustration. Learn vector drawing techniques, layout design for print media, and pre-press preparation.', pricePerMonthNGN: 24000, pricePerHourNGN: 6000, pricePerMonth: 40, pricePerHour: 10 },
      { title: 'Visual Communication & Infographics', slug: 'visual-communication-infographics', duration: '8 Weeks', difficulty: 'Beginner', imageSlug: 'visual-communication-infographics', description: 'Learn to communicate complex information visually. Master fundamental design principles, effective typography, and data visualization techniques.', pricePerMonthNGN: 20000, pricePerHourNGN: 5000, pricePerMonth: 32, pricePerHour: 8 },
    ]
  },
  {
    schoolSlug: 'school-of-data-and-ai',
    courses: [
      { title: 'Business Intelligence (BI) & Analytics', slug: 'business-intelligence-analytics', duration: '16 Weeks', difficulty: 'Intermediate', imageSlug: 'business-intelligence-bi-and-analytics', description: 'Transform raw data into actionable business insights. Master data cleaning, preparation, and analysis using industry-leading tools like Power BI and Tableau.', pricePerMonthNGN: 48000, pricePerHourNGN: 12000, pricePerMonth: 100, pricePerHour: 25 },
      { title: 'Advanced Excel for Business', slug: 'advanced-excel-business', duration: '10 Weeks', difficulty: 'Beginner to Intermediate', imageSlug: 'advanced-excel-for-business', description: "Unlock Excel's full potential for business analysis. Master advanced formulas, create dynamic pivot tables, automate workflows with Power Query.", pricePerMonthNGN: 24000, pricePerHourNGN: 6000, pricePerMonth: 40, pricePerHour: 10 },
      { title: 'Programming for Data Management', slug: 'programming-data-management', duration: '14 Weeks', difficulty: 'Intermediate', imageSlug: 'programming-for-data-management', description: 'Learn programming specifically for data management and analysis. Master Python or R for data manipulation using Pandas and NumPy.', pricePerMonthNGN: 44000, pricePerHourNGN: 11000, pricePerMonth: 88, pricePerHour: 22 },
      { title: 'SQL & Relational Database Design', slug: 'sql-relational-database-design', duration: '12 Weeks', difficulty: 'Intermediate', imageSlug: 'sql-and-relational-database-design', description: 'Master SQL and relational database design from the ground up. Write complex queries, understand joins and subqueries, design normalized database schemas.', pricePerMonthNGN: 36000, pricePerHourNGN: 9000, pricePerMonth: 72, pricePerHour: 18 },
    ]
  },
  { schoolSlug: 'school-of-cloud-and-devops', courses: [
      { title: 'NoSQL & Cloud Database Architecture', slug: 'nosql-cloud-database-architecture', duration: '16 Weeks', difficulty: 'Intermediate to Advanced', imageSlug: 'nosql-and-cloud-database-architecture', description: 'Master modern NoSQL databases and cloud-based data architectures. Learn MongoDB document modeling, manage databases on AWS and Azure.', pricePerMonthNGN: 48000, pricePerHourNGN: 12000, pricePerMonth: 96, pricePerHour: 24 }
  ]},
  { schoolSlug: 'school-of-coding-and-development', courses: [
      { title: 'Rapid App Development (Low-Code/No-Code)', slug: 'rapid-app-development-low-code', duration: '12 Weeks', difficulty: 'Beginner to Intermediate', imageSlug: 'rapid-app-development-low-code', description: 'Build functional applications without extensive coding. Master low-code/no-code platforms like Bubble and PowerApps, automate workflows with Zapier.', pricePerMonthNGN: 40000, pricePerHourNGN: 10000, pricePerMonth: 80, pricePerHour: 20 },
      { title: 'Microsoft Access for Business Apps', slug: 'microsoft-access-business-apps', duration: '8 Weeks', difficulty: 'Beginner', imageSlug: 'microsoft-access-for-business-apps', description: 'Create powerful desktop database applications with Microsoft Access. Learn to design relational databases, build user-friendly forms, generate professional reports.', pricePerMonthNGN: 20000, pricePerHourNGN: 5000, pricePerMonth: 32, pricePerHour: 8 }
  ]},
  { schoolSlug: 'school-of-writing', courses: [
      { title: 'Executive Presentation & Public Speaking', slug: 'executive-presentation-public-speaking', duration: '10 Weeks', difficulty: 'Intermediate', imageSlug: 'executive-presentation-and-public-speaking', description: 'Master the art of executive presentations and public speaking. Learn to design compelling visual slides, engage audiences with interactive elements.', pricePerMonthNGN: 32000, pricePerHourNGN: 8000, pricePerMonth: 64, pricePerHour: 16 }
  ]},
  { schoolSlug: 'school-of-software-mastery', courses: [
      { title: 'Microsoft 365 & AI Integration', slug: 'microsoft-365-ai-integration', duration: '10 Weeks', difficulty: 'Beginner to Intermediate', imageSlug: 'microsoft-365-and-ai-integration', description: 'Maximize productivity with Microsoft 365 and AI-powered tools. Master Copilot integration across Office applications, optimize Teams collaboration.', pricePerMonthNGN: 28000, pricePerHourNGN: 7000, pricePerMonth: 48, pricePerHour: 12 }
  ]}
];

function monthsFromDuration(duration) {
  const weeks = parseInt(duration.split(' ')[0]);
  return Math.ceil(weeks / 4);
}

async function addNewCourses() {
  console.log('🚀 Creating 14 new courses with images...');
  let created = 0; let skipped = 0; let errors = 0;

  for (const block of coursesBySchool) {
    const school = await client.fetch(`*[_type == "school" && slug.current == $s][0]{_id,name}`, { s: block.schoolSlug });
    if (!school) { console.error(`❌ School not found: ${block.schoolSlug}`); continue; }

    for (const c of block.courses) {
      const exists = await client.fetch(`*[_type == "course" && slug.current == $slug][0]{_id}`, { slug: c.slug });
      if (exists) { console.log(`↪️  Skip (exists): ${c.slug}`); skipped++; continue; }

      // Resolve image paths
      const coverPath = guessLocalImagePathFor('course', c.imageSlug || c.slug, PROJECT_ROOT);
      const bannerPath = coverPath; // same asset for banner background by default
      const ogPath = guessOgPostImagePathFor(c.imageSlug || c.slug, PROJECT_ROOT);

      // Upload/reuse assets
      const mainImage = coverPath ? await findOrUpload(coverPath) : undefined;
      const bannerBackgroundImage = bannerPath ? await findOrUpload(bannerPath) : undefined;
      const ogImage = ogPath ? await findOrUpload(ogPath) : undefined;

      const months = monthsFromDuration(c.duration);
      const priceTotalUSD = c.pricePerMonth * months;
      const priceTotalNGN = c.pricePerMonthNGN * months;

      const doc = {
        _type: 'course',
        _id: c.slug,
        title: c.title,
        slug: { _type: 'slug', current: c.slug },
        school: { _type: 'reference', _ref: school._id },
        description: c.description,
        summary: c.description.substring(0, 140),
        level: c.difficulty,
        duration: c.duration,
        durationWeeks: parseInt(c.duration),
        hoursPerWeek: 2,
        courseType: 'live',
        hourlyRateUSD: c.pricePerHour,
        hourlyRateNGN: c.pricePerHourNGN,
        pricePerMonth: c.pricePerMonth,
        pricePerMonthNGN: c.pricePerMonthNGN,
        price: priceTotalUSD,
        priceNGN: priceTotalNGN,
        mainImage,
        bannerBackgroundImage,
        ogImage,
        ogTitle: c.title,
        ogDescription: c.description.substring(0, 160),
        seo: {
          title: c.title,
          description: c.description.substring(0, 160),
          url: `https://www.hexadigitall.com/courses/${c.slug}`,
          image: ogImage
        },
        modules: 8,
      };

      try {
        await client.create(doc);
        console.log(`✅ Created: ${c.title}`);
        created++;
      } catch (e) {
        console.error(`❌ Failed: ${c.title} — ${e.message}`);
        errors++;
      }
    }
  }

  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}, Errors: ${errors}`);
}

addNewCourses().catch(console.error);
