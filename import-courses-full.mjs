import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2024-01-11',
  token: process.env.SANITY_API_TOKEN,
});

// Course data organized by school
const coursesData = [
  // School of Design - 5 courses
  {
    schoolSlug: 'school-of-design',
    courses: [
      {
        title: 'AutoCAD Masterclass',
        slug: 'autocad-masterclass',
        imageSlug: 'autocad-masterclass',
        focus: '2D Drafting, 3D Modeling, Industry Standards',
        pricePerMonthNGN: 32000,
        pricePerHourNGN: 8000,
        pricePerMonth: 60,
        pricePerHour: 15,
        duration: '12 Weeks',
        difficulty: 'Intermediate',
        description: 'Master AutoCAD from fundamentals to advanced techniques. Learn precision 2D drafting, create detailed 3D models, and understand industry-standard workflows used by professional architects and engineers.',
      },
      {
        title: 'ArchiCAD Professional',
        slug: 'archicad-professional',
        imageSlug: 'archicad-professional',
        focus: 'BIM Fundamentals, Floor Plans, CineRender Visualization',
        pricePerMonthNGN: 40000,
        pricePerHourNGN: 10000,
        pricePerMonth: 80,
        pricePerHour: 20,
        duration: '16 Weeks',
        difficulty: 'Intermediate',
        description: 'Become proficient in Building Information Modeling (BIM) with ArchiCAD. Master the creation of detailed floor plans, sections, and elevations with photorealistic visualizations.',
      },
      {
        title: 'Adobe Creative Cloud Suite',
        slug: 'adobe-creative-cloud-suite',
        imageSlug: 'adobe-creative-cloud-suite',
        focus: 'Illustrator (Vector/Logo), Photoshop (Compositing), Integration',
        pricePerMonthNGN: 36000,
        pricePerHourNGN: 9000,
        pricePerMonth: 60,
        pricePerHour: 15,
        duration: '12 Weeks',
        difficulty: 'Beginner to Intermediate',
        description: 'Master the essential Adobe Creative Cloud applications. Create professional vector graphics and logos in Illustrator, perform advanced photo compositing in Photoshop.',
      },
      {
        title: 'Vector Graphics Mastery (CorelDRAW)',
        slug: 'vector-graphics-mastery-coreldraw',
        imageSlug: 'vector-graphics-mastery-coreldraw',
        focus: 'Print Design, Illustration, Pre-press',
        pricePerMonthNGN: 24000,
        pricePerHourNGN: 6000,
        pricePerMonth: 40,
        pricePerHour: 10,
        duration: '10 Weeks',
        difficulty: 'Beginner to Intermediate',
        description: 'Master CorelDRAW for professional print design and illustration. Learn vector drawing techniques, layout design for print media, and pre-press preparation.',
      },
      {
        title: 'Visual Communication & Infographics',
        slug: 'visual-communication-infographics',
        imageSlug: 'visual-communication-infographics',
        focus: 'Design Principles, Typography, Data Visualization',
        pricePerMonthNGN: 20000,
        pricePerHourNGN: 5000,
        pricePerMonth: 32,
        pricePerHour: 8,
        duration: '8 Weeks',
        difficulty: 'Beginner',
        description: 'Learn to communicate complex information visually. Master fundamental design principles, effective typography, and data visualization techniques.',
      }
    ]
  },
  // School of Data & AI - 4 courses
  {
    schoolSlug: 'school-of-data-and-ai',
    courses: [
      {
        title: 'Business Intelligence (BI) & Analytics',
        slug: 'business-intelligence-analytics',
        imageSlug: 'business-intelligence-analytics',
        focus: 'Data Cleaning, Power BI/Tableau, Executive Dashboards',
        pricePerMonthNGN: 48000,
        pricePerHourNGN: 12000,
        pricePerMonth: 100,
        pricePerHour: 25,
        duration: '16 Weeks',
        difficulty: 'Intermediate',
        description: 'Transform raw data into actionable business insights. Master data cleaning, preparation, and analysis using industry-leading tools like Power BI and Tableau.',
      },
      {
        title: 'Advanced Excel for Business',
        slug: 'advanced-excel-business',
        imageSlug: 'advanced-excel-business',
        focus: 'VLOOKUP/XLOOKUP, Pivot Tables, Power Query, Macros',
        pricePerMonthNGN: 24000,
        pricePerHourNGN: 6000,
        pricePerMonth: 40,
        pricePerHour: 10,
        duration: '10 Weeks',
        difficulty: 'Beginner to Intermediate',
        description: 'Unlock Excel\'s full potential for business analysis. Master advanced formulas, create dynamic pivot tables, automate workflows with Power Query.',
      },
      {
        title: 'Programming for Data Management',
        slug: 'programming-data-management',
        imageSlug: 'programming-data-management',
        focus: 'Python/R Basics, Pandas/NumPy, Automation',
        pricePerMonthNGN: 44000,
        pricePerHourNGN: 11000,
        pricePerMonth: 88,
        pricePerHour: 22,
        duration: '14 Weeks',
        difficulty: 'Intermediate',
        description: 'Learn programming specifically for data management and analysis. Master Python or R for data manipulation using Pandas and NumPy.',
      },
      {
        title: 'SQL & Relational Database Design',
        slug: 'sql-relational-database-design',
        imageSlug: 'sql-relational-database-design',
        focus: 'Complex Queries, Joins, Normalization, PostgreSQL',
        pricePerMonthNGN: 36000,
        pricePerHourNGN: 9000,
        pricePerMonth: 72,
        pricePerHour: 18,
        duration: '12 Weeks',
        difficulty: 'Intermediate',
        description: 'Master SQL and relational database design from the ground up. Write complex queries, understand joins and subqueries, design normalized database schemas.',
      }
    ]
  },
  // School of Cloud & DevOps - 1 course
  {
    schoolSlug: 'school-of-cloud-and-devops',
    courses: [
      {
        title: 'NoSQL & Cloud Database Architecture',
        slug: 'nosql-cloud-database-architecture',
        imageSlug: 'nosql-cloud-database-architecture',
        focus: 'MongoDB, AWS/Azure DB Management, Scalability',
        pricePerMonthNGN: 48000,
        pricePerHourNGN: 12000,
        pricePerMonth: 96,
        pricePerHour: 24,
        duration: '16 Weeks',
        difficulty: 'Intermediate to Advanced',
        description: 'Master modern NoSQL databases and cloud-based data architectures. Learn MongoDB document modeling, manage databases on AWS and Azure.',
      }
    ]
  },
  // School of Coding & Development - 2 courses
  {
    schoolSlug: 'school-of-coding-and-development',
    courses: [
      {
        title: 'Rapid App Development (Low-Code/No-Code)',
        slug: 'rapid-app-development-low-code',
        imageSlug: 'rapid-app-development-low-code',
        focus: 'Bubble/PowerApps, Workflow Automation (Zapier), Prototyping',
        pricePerMonthNGN: 40000,
        pricePerHourNGN: 10000,
        pricePerMonth: 80,
        pricePerHour: 20,
        duration: '12 Weeks',
        difficulty: 'Beginner to Intermediate',
        description: 'Build functional applications without extensive coding. Master low-code/no-code platforms like Bubble and PowerApps, automate workflows with Zapier.',
      },
      {
        title: 'Microsoft Access for Business Apps',
        slug: 'microsoft-access-business-apps',
        imageSlug: 'microsoft-access-business-apps',
        focus: 'Desktop DB Apps, Forms, Reporting',
        pricePerMonthNGN: 20000,
        pricePerHourNGN: 5000,
        pricePerMonth: 32,
        pricePerHour: 8,
        duration: '8 Weeks',
        difficulty: 'Beginner',
        description: 'Create powerful desktop database applications with Microsoft Access. Learn to design relational databases, build user-friendly forms, generate professional reports.',
      }
    ]
  },
  // School of Writing & Communication - 1 course
  {
    schoolSlug: 'school-of-writing',
    courses: [
      {
        title: 'Executive Presentation & Public Speaking',
        slug: 'executive-presentation-public-speaking',
        imageSlug: 'executive-presentation-public-speaking',
        focus: 'Visual Slide Design, Interactive Elements, Audience Strategy, Confident Delivery',
        pricePerMonthNGN: 32000,
        pricePerHourNGN: 8000,
        pricePerMonth: 64,
        pricePerHour: 16,
        duration: '10 Weeks',
        difficulty: 'Intermediate',
        description: 'Master the art of executive presentations and public speaking. Learn to design compelling visual slides, engage audiences with interactive elements.',
      }
    ]
  },
  // School of Software Mastery - 1 course
  {
    schoolSlug: 'school-of-software-mastery',
    courses: [
      {
        title: 'Microsoft 365 & AI Integration',
        slug: 'microsoft-365-ai-integration',
        imageSlug: 'microsoft-365-ai-integration',
        focus: 'Copilot in Office, Teams Collaboration, SharePoint/OneDrive',
        pricePerMonthNGN: 28000,
        pricePerHourNGN: 7000,
        pricePerMonth: 48,
        pricePerHour: 12,
        duration: '10 Weeks',
        difficulty: 'Beginner to Intermediate',
        description: 'Maximize productivity with Microsoft 365 and AI-powered tools. Master Copilot integration across Office applications, optimize Teams collaboration.',
      }
    ]
  }
];

// Helper function to calculate total price based on duration and monthly price
function calculateTotalPrice(duration, pricePerMonth, pricePerMonthNGN) {
  const weeks = parseInt(duration.split(' ')[0]);
  const months = Math.ceil(weeks / 4);
  return {
    totalUSD: pricePerMonth * months,
    totalNGN: pricePerMonthNGN * months,
    months
  };
}

async function importCoursesWithAllFields() {
  console.log('🚀 Importing courses with all required fields...\n');
  
  let totalCreated = 0;
  let totalErrors = 0;
  const results = [];

  for (const schoolData of coursesData) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📚 Processing ${schoolData.schoolSlug}`);
    console.log(`${'='.repeat(80)}\n`);

    // Fetch school reference
    const school = await client.fetch(
      `*[_type == "school" && slug.current == $slug][0]`,
      { slug: schoolData.schoolSlug }
    );

    if (!school) {
      console.error(`❌ School not found: ${schoolData.schoolSlug}`);
      totalErrors += schoolData.courses.length;
      continue;
    }

    console.log(`✅ Found school: ${school.name}\n`);

    for (const courseData of schoolData.courses) {
      try {
        console.log(`📝 Creating: ${courseData.title}`);

        // Calculate pricing
        const { totalUSD, totalNGN, months } = calculateTotalPrice(
          courseData.duration,
          courseData.pricePerMonth,
          courseData.pricePerMonthNGN
        );

        // Check if course already exists
        const existingCourse = await client.fetch(
          `*[_type == "course" && slug.current == $slug][0]`,
          { slug: courseData.slug }
        );

        if (existingCourse) {
          console.log(`   ⚠️  Course already exists, skipping: ${courseData.slug}`);
          continue;
        }

        // Find course image in Sanity (uploaded earlier)
        const courseImage = await client.fetch(
          `*[_type == "sanity.imageAsset" && originalFilename match $filename][0] {
            _id
          }`,
          { filename: `*${courseData.imageSlug}*` }
        );

        // Create course document with all required fields
        const courseDoc = {
          _type: 'course',
          _id: courseData.slug,
          title: courseData.title,
          slug: {
            _type: 'slug',
            current: courseData.slug
          },
          school: {
            _type: 'reference',
            _ref: school._id
          },
          summary: courseData.description.substring(0, 120),
          description: courseData.description,
          level: courseData.difficulty,
          duration: courseData.duration,
          durationWeeks: parseInt(courseData.duration.split(' ')[0]),
          hoursPerWeek: 2,
          
          // PRICING FIELDS - Monthly subscription model
          courseType: 'live',
          hourlyRateUSD: courseData.pricePerHour,
          hourlyRateNGN: courseData.pricePerHourNGN,
          pricePerMonth: courseData.pricePerMonth,
          pricePerMonthNGN: courseData.pricePerMonthNGN,
          price: totalUSD,
          priceNGN: totalNGN,
          
          // IMAGES
          ...(courseImage && {
            mainImage: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: courseImage._id
              }
            }
          }),
          
          // SEO FIELDS
          ogTitle: courseData.title,
          ogDescription: courseData.description.substring(0, 160),
          seo: {
            title: courseData.title,
            description: courseData.description.substring(0, 160),
            url: `https://www.hexadigitall.com/courses/${courseData.slug}`
          },
          
          // COURSE DETAILS
          modules: 8,
          lessons: 24,
          featured: false,
          popular: false,
          billingType: 'monthly',
          includes: [
            'Live mentorship sessions',
            'Recorded lectures',
            'Access to course materials',
            'Community support',
            'Certificate of completion'
          ]
        };

        // Create the course
        const result = await client.create(courseDoc);
        
        console.log(`   ✅ Created successfully!`);
        console.log(`   - Duration: ${courseData.duration} (~${months} months)`);
        console.log(`   - Hourly Rate: $${courseData.pricePerHour}/hr (₦${courseData.pricePerHourNGN.toLocaleString()}/hr)`);
        console.log(`   - Monthly: $${courseData.pricePerMonth}/mo (₦${courseData.pricePerMonthNGN.toLocaleString()}/mo)`);
        console.log(`   - Total: $${totalUSD} (₦${totalNGN.toLocaleString()})\n`);

        totalCreated++;
        results.push({
          title: courseData.title,
          slug: courseData.slug,
          school: school.name,
          status: 'created'
        });

      } catch (error) {
        console.error(`   ❌ Error creating ${courseData.title}:`, error.message);
        totalErrors++;
        results.push({
          title: courseData.title,
          slug: courseData.slug,
          school: school.name,
          status: 'error',
          error: error.message
        });
      }
    }
  }

  // Summary
  console.log(`\n${'='.repeat(80)}`);
  console.log('📊 IMPORT SUMMARY');
  console.log(`${'='.repeat(80)}\n`);
  console.log(`✅ Successfully created: ${totalCreated} courses`);
  console.log(`❌ Errors: ${totalErrors}`);
  console.log(`📝 Total attempted: ${totalCreated + totalErrors}\n`);

  // Detailed results
  console.log('📋 Summary:');
  const grouped = results.reduce((acc, r) => {
    if (!acc[r.school]) acc[r.school] = { created: 0, errors: 0 };
    if (r.status === 'created') acc[r.school].created++;
    else acc[r.school].errors++;
    return acc;
  }, {});

  Object.entries(grouped).forEach(([school, stats]) => {
    console.log(`\n${school}:`);
    console.log(`  ✅ Created: ${stats.created}`);
    if (stats.errors) console.log(`  ❌ Errors: ${stats.errors}`);
  });

  console.log(`\n${'='.repeat(80)}`);
  console.log('✨ Import process completed!');
  console.log(`${'='.repeat(80)}\n`);
}

importCoursesWithAllFields().catch(console.error);
