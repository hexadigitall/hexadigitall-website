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
        focus: '2D Drafting, 3D Modeling, Industry Standards',
        pricePerMonthNGN: 32000,
        pricePerHourNGN: 8000,
        pricePerMonth: 60,
        pricePerHour: 15,
        duration: '12 Weeks',
        difficulty: 'Intermediate',
        description: 'Master AutoCAD from fundamentals to advanced techniques. Learn precision 2D drafting, create detailed 3D models, and understand industry-standard workflows used by professional architects and engineers. This comprehensive course covers drawing tools, layers, annotations, and rendering to prepare you for real-world CAD projects.',
        keyTopics: [
          '2D drafting tools and precision drawing',
          '3D modeling and visualization',
          'Layer management and organization',
          'Annotations, dimensions, and layouts',
          'Industry standards and best practices',
          'Rendering and presentation techniques'
        ]
      },
      {
        title: 'ArchiCAD Professional',
        slug: 'archicad-professional',
        focus: 'BIM Fundamentals, Floor Plans, CineRender Visualization',
        pricePerMonthNGN: 40000,
        pricePerHourNGN: 10000,
        pricePerMonth: 80,
        pricePerHour: 20,
        duration: '16 Weeks',
        difficulty: 'Intermediate',
        description: 'Become proficient in Building Information Modeling (BIM) with ArchiCAD. Master the creation of detailed floor plans, sections, and elevations. Learn to produce photorealistic visualizations with CineRender and manage complex architectural projects from concept to documentation.',
        keyTopics: [
          'BIM fundamentals and workflow',
          'Architectural floor plans and sections',
          'Building elements and structures',
          'CineRender visualization and lighting',
          'Construction documentation',
          'Collaboration and project coordination'
        ]
      },
      {
        title: 'Adobe Creative Cloud Suite',
        slug: 'adobe-creative-cloud-suite',
        focus: 'Illustrator (Vector/Logo), Photoshop (Compositing), Integration',
        pricePerMonthNGN: 36000,
        pricePerHourNGN: 9000,
        pricePerMonth: 60,
        pricePerHour: 15,
        duration: '12 Weeks',
        difficulty: 'Beginner to Intermediate',
        description: 'Master the essential Adobe Creative Cloud applications. Create professional vector graphics and logos in Illustrator, perform advanced photo compositing in Photoshop, and learn seamless workflow integration between applications. Perfect for aspiring graphic designers and digital artists.',
        keyTopics: [
          'Adobe Illustrator: Vector graphics and logo design',
          'Adobe Photoshop: Photo editing and compositing',
          'Layer management and masking techniques',
          'Typography and text effects',
          'Color theory and application',
          'Cross-application workflow integration'
        ]
      },
      {
        title: 'Vector Graphics Mastery (CorelDRAW)',
        slug: 'vector-graphics-mastery-coreldraw',
        focus: 'Print Design, Illustration, Pre-press',
        pricePerMonthNGN: 24000,
        pricePerHourNGN: 6000,
        pricePerMonth: 40,
        pricePerHour: 10,
        duration: '10 Weeks',
        difficulty: 'Beginner to Intermediate',
        description: 'Master CorelDRAW for professional print design and illustration. Learn vector drawing techniques, layout design for print media, and pre-press preparation. Perfect for creating brochures, flyers, logos, and professional illustrations ready for commercial printing.',
        keyTopics: [
          'Vector drawing and illustration techniques',
          'Print layout and design principles',
          'Typography for print media',
          'Color management and separation',
          'Pre-press preparation and specifications',
          'Production-ready file preparation'
        ]
      },
      {
        title: 'Visual Communication & Infographics',
        slug: 'visual-communication-infographics',
        focus: 'Design Principles, Typography, Data Visualization',
        pricePerMonthNGN: 20000,
        pricePerHourNGN: 5000,
        pricePerMonth: 32,
        pricePerHour: 8,
        duration: '8 Weeks',
        difficulty: 'Beginner',
        description: 'Learn to communicate complex information visually. Master fundamental design principles, effective typography, and data visualization techniques. Create engaging infographics and visual content that tells compelling stories and makes data accessible to any audience.',
        keyTopics: [
          'Fundamental design principles and theory',
          'Typography and typographic hierarchy',
          'Color psychology and application',
          'Data visualization best practices',
          'Infographic design and storytelling',
          'Tools and templates for visual communication'
        ]
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
        focus: 'Data Cleaning, Power BI/Tableau, Executive Dashboards',
        pricePerMonthNGN: 48000,
        pricePerHourNGN: 12000,
        pricePerMonth: 100,
        pricePerHour: 25,
        duration: '16 Weeks',
        difficulty: 'Intermediate',
        description: 'Transform raw data into actionable business insights. Master data cleaning, preparation, and analysis using industry-leading tools like Power BI and Tableau. Learn to create executive dashboards that drive decision-making and communicate complex data stories effectively to stakeholders.',
        keyTopics: [
          'Data cleaning and preparation techniques',
          'Power BI and Tableau mastery',
          'Executive dashboard design',
          'KPI identification and tracking',
          'Data storytelling and visualization',
          'Business metrics and analytics strategy'
        ]
      },
      {
        title: 'Advanced Excel for Business',
        slug: 'advanced-excel-business',
        focus: 'VLOOKUP/XLOOKUP, Pivot Tables, Power Query, Macros',
        pricePerMonthNGN: 24000,
        pricePerHourNGN: 6000,
        pricePerMonth: 40,
        pricePerHour: 10,
        duration: '10 Weeks',
        difficulty: 'Beginner to Intermediate',
        description: 'Unlock Excel\'s full potential for business analysis. Master advanced formulas including VLOOKUP and XLOOKUP, create dynamic pivot tables, automate workflows with Power Query, and build custom solutions with macros. Essential skills for data analysts and business professionals.',
        keyTopics: [
          'Advanced formulas: VLOOKUP, XLOOKUP, INDEX-MATCH',
          'Pivot tables and pivot charts',
          'Power Query for data transformation',
          'Excel macros and VBA basics',
          'Conditional formatting and data validation',
          'Business modeling and financial analysis'
        ]
      },
      {
        title: 'Programming for Data Management',
        slug: 'programming-data-management',
        focus: 'Python/R Basics, Pandas/NumPy, Automation',
        pricePerMonthNGN: 44000,
        pricePerHourNGN: 11000,
        pricePerMonth: 88,
        pricePerHour: 22,
        duration: '14 Weeks',
        difficulty: 'Intermediate',
        description: 'Learn programming specifically for data management and analysis. Master Python or R for data manipulation using Pandas and NumPy. Automate repetitive data tasks, clean large datasets efficiently, and build scalable data pipelines that save hours of manual work.',
        keyTopics: [
          'Python/R fundamentals for data',
          'Pandas for data manipulation',
          'NumPy for numerical computing',
          'Data cleaning and preprocessing',
          'Automation scripts and workflows',
          'File I/O and data format handling'
        ]
      },
      {
        title: 'SQL & Relational Database Design',
        slug: 'sql-relational-database-design',
        focus: 'Complex Queries, Joins, Normalization, PostgreSQL',
        pricePerMonthNGN: 36000,
        pricePerHourNGN: 9000,
        pricePerMonth: 72,
        pricePerHour: 18,
        duration: '12 Weeks',
        difficulty: 'Intermediate',
        description: 'Master SQL and relational database design from the ground up. Write complex queries, understand joins and subqueries, design normalized database schemas, and work with PostgreSQL in production environments. Essential for data analysts, backend developers, and database administrators.',
        keyTopics: [
          'SQL fundamentals and advanced queries',
          'Joins, unions, and subqueries',
          'Database normalization and design',
          'PostgreSQL administration',
          'Indexing and query optimization',
          'Transactions and data integrity'
        ]
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
        focus: 'MongoDB, AWS/Azure DB Management, Scalability',
        pricePerMonthNGN: 48000,
        pricePerHourNGN: 12000,
        pricePerMonth: 96,
        pricePerHour: 24,
        duration: '16 Weeks',
        difficulty: 'Intermediate to Advanced',
        description: 'Master modern NoSQL databases and cloud-based data architectures. Learn MongoDB document modeling, manage databases on AWS and Azure, and design scalable database solutions for modern applications. Essential for cloud architects and backend engineers building distributed systems.',
        keyTopics: [
          'MongoDB fundamentals and document modeling',
          'AWS RDS and DynamoDB management',
          'Azure Cosmos DB and SQL Database',
          'Database scalability and sharding',
          'Replication and high availability',
          'Cloud database security and optimization'
        ]
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
        focus: 'Bubble/PowerApps, Workflow Automation (Zapier), Prototyping',
        pricePerMonthNGN: 40000,
        pricePerHourNGN: 10000,
        pricePerMonth: 80,
        pricePerHour: 20,
        duration: '12 Weeks',
        difficulty: 'Beginner to Intermediate',
        description: 'Build functional applications without extensive coding. Master low-code/no-code platforms like Bubble and PowerApps, automate workflows with Zapier, and rapidly prototype ideas. Perfect for entrepreneurs, product managers, and citizen developers who want to build apps quickly.',
        keyTopics: [
          'Bubble.io application development',
          'Microsoft PowerApps for business solutions',
          'Workflow automation with Zapier',
          'Rapid prototyping techniques',
          'Database integration and API connections',
          'Deployment and user testing'
        ]
      },
      {
        title: 'Microsoft Access for Business Apps',
        slug: 'microsoft-access-business-apps',
        focus: 'Desktop DB Apps, Forms, Reporting',
        pricePerMonthNGN: 20000,
        pricePerHourNGN: 5000,
        pricePerMonth: 32,
        pricePerHour: 8,
        duration: '8 Weeks',
        difficulty: 'Beginner',
        description: 'Create powerful desktop database applications with Microsoft Access. Learn to design relational databases, build user-friendly forms, generate professional reports, and develop business solutions without programming. Ideal for small businesses and departmental applications.',
        keyTopics: [
          'Access database design and tables',
          'Query design and SQL basics',
          'Forms development for data entry',
          'Report generation and formatting',
          'Macros and basic automation',
          'Business application deployment'
        ]
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
        focus: 'Visual Slide Design, Interactive Elements, Audience Strategy, Confident Delivery',
        pricePerMonthNGN: 32000,
        pricePerHourNGN: 8000,
        pricePerMonth: 64,
        pricePerHour: 16,
        duration: '10 Weeks',
        difficulty: 'Intermediate',
        description: 'Master the art of executive presentations and public speaking. Learn to design compelling visual slides, engage audiences with interactive elements, develop audience-specific strategies, and deliver with confidence. Transform your presentation skills to influence, persuade, and inspire at the executive level.',
        keyTopics: [
          'Visual slide design principles',
          'Storytelling and narrative structure',
          'Interactive presentation techniques',
          'Audience analysis and strategy',
          'Confident delivery and body language',
          'Q&A management and handling objections'
        ]
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
        focus: 'Copilot in Office, Teams Collaboration, SharePoint/OneDrive',
        pricePerMonthNGN: 28000,
        pricePerHourNGN: 7000,
        pricePerMonth: 48,
        pricePerHour: 12,
        duration: '10 Weeks',
        difficulty: 'Beginner to Intermediate',
        description: 'Maximize productivity with Microsoft 365 and AI-powered tools. Master Copilot integration across Office applications, optimize Teams collaboration, and manage content with SharePoint and OneDrive. Learn to leverage AI to work smarter and boost team efficiency in modern hybrid work environments.',
        keyTopics: [
          'Microsoft Copilot for productivity',
          'AI-powered document creation and editing',
          'Microsoft Teams collaboration best practices',
          'SharePoint document management',
          'OneDrive file sync and sharing',
          'Workflow automation with Power Automate'
        ]
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

// Helper function to create slug from title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function importCourses() {
  console.log('🚀 Starting course import process...\n');
  
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

        // Create course document
        const course = {
          _type: 'course',
          _id: courseData.slug,
          title: courseData.title,
          slug: {
            _type: 'slug',
            current: courseData.slug
          },
          description: courseData.description,
          school: {
            _type: 'reference',
            _ref: school._id
          },
          price: totalUSD,
          priceNGN: totalNGN,
          pricePerMonth: courseData.pricePerMonth,
          pricePerMonthNGN: courseData.pricePerMonthNGN,
          pricePerHour: courseData.pricePerHour,
          pricePerHourNGN: courseData.pricePerHourNGN,
          duration: courseData.duration,
          difficulty: courseData.difficulty,
          featured: false,
          popular: false,
        };

        // Create the course
        const result = await client.create(course);
        
        console.log(`   ✅ Created successfully!`);
        console.log(`   - Duration: ${courseData.duration} (~${months} months)`);
        console.log(`   - Price: $${totalUSD} (₦${totalNGN.toLocaleString()})`);
        console.log(`   - Monthly: $${courseData.pricePerMonth}/mo (₦${courseData.pricePerMonthNGN.toLocaleString()}/mo)`);
        console.log(`   - Hourly: $${courseData.pricePerHour}/hr (₦${courseData.pricePerHourNGN.toLocaleString()}/hr)`);
        console.log(`   - Difficulty: ${courseData.difficulty}\n`);

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

  // Detailed results by school
  console.log('📋 Results by School:\n');
  const resultsBySchool = results.reduce((acc, result) => {
    if (!acc[result.school]) {
      acc[result.school] = [];
    }
    acc[result.school].push(result);
    return acc;
  }, {});

  for (const [school, courses] of Object.entries(resultsBySchool)) {
    console.log(`\n${school}:`);
    courses.forEach(course => {
      const status = course.status === 'created' ? '✅' : '❌';
      console.log(`  ${status} ${course.title} (${course.slug})`);
      if (course.error) {
        console.log(`     Error: ${course.error}`);
      }
    });
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log('✨ Import process completed!');
  console.log(`${'='.repeat(80)}\n`);
}

importCourses().catch(console.error);
