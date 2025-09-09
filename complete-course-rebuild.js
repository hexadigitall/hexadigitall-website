import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Create clients
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-08-30',
  useCdn: false,
})

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-08-30',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// Helper function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Generate unique key
function generateKey() {
  return Math.random().toString(36).substring(2, 15)
}

// Define the clean structure with all necessary data
const cleanCourseStructure = {
  'Web & Mobile Development': {
    description: 'Build modern web applications and mobile apps that users love',
    icon: 'code',
    courses: [
      {
        title: 'Web Development Bootcamp: From Zero to Hero',
        description: 'Master full-stack web development from HTML/CSS basics to advanced frameworks',
        price: 89000,
        duration: '12 weeks',
        level: 'Beginner to Intermediate',
        instructor: 'Hexadigitall Team',
        summary: 'Transform from complete beginner to job-ready web developer with our comprehensive bootcamp covering HTML, CSS, JavaScript, React, Node.js, and database integration.',
        body: [
          {
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'Launch your web development career with our comprehensive bootcamp that takes you from complete beginner to job-ready developer in just 12 weeks.'
              }
            ]
          },
          {
            _type: 'block',
            _key: generateKey(),
            style: 'h3',
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'What You\'ll Learn'
              }
            ]
          },
          {
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'Master the fundamentals of HTML5, CSS3, and responsive design. Build dynamic websites with JavaScript and modern ES6+ features. Learn React.js for building interactive user interfaces and Node.js for server-side development.'
              }
            ]
          }
        ],
        curriculum: {
          modules: 8,
          lessons: 48,
          duration: '12 weeks'
        },
        includes: [
          'Live coding sessions',
          'Real-world projects',
          'Career guidance',
          'Certificate of completion',
          'Lifetime access to materials'
        ]
      },
      {
        title: 'React Native: Build Mobile Apps for iOS & Android',
        description: 'Create cross-platform mobile applications using React Native',
        price: 75000,
        duration: '10 weeks',
        level: 'Intermediate',
        instructor: 'Hexadigitall Team',
        summary: 'Build professional mobile apps for both iOS and Android using React Native. Learn navigation, state management, API integration, and deployment to app stores.',
        body: [
          {
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'Create native mobile applications for both iOS and Android platforms using React Native, the popular cross-platform framework used by companies like Facebook, Instagram, and Uber.'
              }
            ]
          },
          {
            _type: 'block',
            _key: generateKey(),
            style: 'h3',
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'Course Highlights'
              }
            ]
          },
          {
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'Learn to build performant mobile apps with native look and feel. Master navigation, state management with Redux, API integration, push notifications, and app store deployment processes.'
              }
            ]
          }
        ],
        curriculum: {
          modules: 6,
          lessons: 36,
          duration: '10 weeks'
        },
        includes: [
          'Mobile app development projects',
          'App store deployment guide',
          'Performance optimization techniques',
          'Certificate of completion',
          'Source code access'
        ]
      }
    ]
  },
  'Business & Entrepreneurship': {
    description: 'Launch and grow successful businesses with proven strategies',
    icon: 'chart',
    courses: [
      {
        title: 'Project Management Fundamentals',
        description: 'Learn essential project management skills and methodologies',
        price: 45000,
        duration: '6 weeks',
        level: 'Beginner',
        instructor: 'Hexadigitall Team',
        summary: 'Master the fundamentals of project management including planning, execution, monitoring, and delivery. Learn Agile, Scrum, and traditional methodologies.',
        body: [
          {
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'Develop essential project management skills that are crucial for success in any industry. Learn to plan, execute, and deliver projects on time and within budget.'
              }
            ]
          }
        ],
        curriculum: {
          modules: 4,
          lessons: 24,
          duration: '6 weeks'
        },
        includes: [
          'Project management templates',
          'Real-world case studies',
          'Certification prep materials',
          'Certificate of completion'
        ]
      },
      {
        title: 'The Lean Startup: Build Your MVP',
        description: 'Launch your startup efficiently using lean methodology',
        price: 55000,
        duration: '8 weeks',
        level: 'Intermediate',
        instructor: 'Hexadigitall Team',
        summary: 'Learn to build and launch minimum viable products, validate business ideas, and scale your startup using lean principles and data-driven decisions.',
        body: [
          {
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'Turn your business idea into reality using the lean startup methodology. Learn to build MVPs, validate assumptions, and iterate based on customer feedback.'
              }
            ]
          }
        ],
        curriculum: {
          modules: 5,
          lessons: 30,
          duration: '8 weeks'
        },
        includes: [
          'MVP development framework',
          'Customer validation techniques',
          'Growth hacking strategies',
          'Certificate of completion'
        ]
      },
      {
        title: 'Digital Marketing for Small Businesses',
        description: 'Grow your business with effective digital marketing strategies',
        price: 40000,
        duration: '6 weeks',
        level: 'Beginner',
        instructor: 'Hexadigitall Team',
        summary: 'Master digital marketing essentials including social media, email marketing, content marketing, and paid advertising to grow your small business.',
        body: [
          {
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'Grow your small business with practical digital marketing strategies that deliver real results. Learn to reach your target audience and convert leads into customers.'
              }
            ]
          }
        ],
        curriculum: {
          modules: 4,
          lessons: 20,
          duration: '6 weeks'
        },
        includes: [
          'Marketing templates and tools',
          'Campaign examples',
          'ROI tracking methods',
          'Certificate of completion'
        ]
      }
    ]
  },
  'Digital Marketing & SEO': {
    description: 'Master search engine optimization and digital marketing',
    icon: 'settings',
    courses: [
      {
        title: 'Advanced SEO: Rank #1 on Google',
        description: 'Master advanced SEO techniques to dominate search rankings',
        price: 60000,
        duration: '8 weeks',
        level: 'Intermediate to Advanced',
        instructor: 'Hexadigitall Team',
        summary: 'Learn advanced SEO strategies, technical optimization, content marketing, and link building to achieve top Google rankings and drive organic traffic.',
        body: [
          {
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'Master advanced SEO techniques used by top digital marketing agencies to achieve and maintain #1 Google rankings for competitive keywords.'
              }
            ]
          }
        ],
        curriculum: {
          modules: 5,
          lessons: 25,
          duration: '8 weeks'
        },
        includes: [
          'SEO audit tools and templates',
          'Keyword research strategies',
          'Link building techniques',
          'Certificate of completion'
        ]
      }
    ]
  },
  'Data & Analytics': {
    description: 'Analyze data and gain insights to drive business decisions',
    icon: 'chart',
    courses: [
      {
        title: 'Data Analysis with Python',
        description: 'Learn data analysis and visualization using Python',
        price: 70000,
        duration: '10 weeks',
        level: 'Intermediate',
        instructor: 'Hexadigitall Team',
        summary: 'Master data analysis with Python using pandas, numpy, matplotlib, and seaborn. Learn to clean, analyze, and visualize data for business insights.',
        body: [
          {
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'Transform raw data into actionable insights using Python. Learn the complete data analysis workflow from collection to visualization and reporting.'
              }
            ]
          }
        ],
        curriculum: {
          modules: 6,
          lessons: 35,
          duration: '10 weeks'
        },
        includes: [
          'Python code examples',
          'Real datasets for practice',
          'Data visualization projects',
          'Certificate of completion'
        ]
      },
      {
        title: 'Google Analytics 4: From Beginner to Expert',
        description: 'Master Google Analytics 4 for website and app tracking',
        price: 35000,
        duration: '5 weeks',
        level: 'Beginner to Intermediate',
        instructor: 'Hexadigitall Team',
        summary: 'Learn Google Analytics 4 setup, configuration, reporting, and advanced analysis to measure and optimize your website and app performance.',
        body: [
          {
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'Master Google Analytics 4, the latest version of the world\'s most popular web analytics platform. Learn to track, measure, and optimize your digital marketing efforts.'
              }
            ]
          }
        ],
        curriculum: {
          modules: 3,
          lessons: 18,
          duration: '5 weeks'
        },
        includes: [
          'GA4 setup templates',
          'Custom reporting dashboards',
          'Conversion tracking guide',
          'Certificate of completion'
        ]
      }
    ]
  },
  'Cybersecurity & Certification': {
    description: 'Protect systems and earn industry certifications',
    icon: 'network',
    courses: [
      {
        title: 'CISSP Certification Prep Course',
        description: 'Prepare for the CISSP cybersecurity certification exam',
        price: 95000,
        duration: '14 weeks',
        level: 'Advanced',
        instructor: 'Hexadigitall Team',
        summary: 'Comprehensive preparation for the CISSP certification covering all 8 domains of cybersecurity with practice exams and real-world scenarios.',
        body: [
          {
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'Prepare for one of the most respected cybersecurity certifications in the industry. Master all 8 domains of the CISSP Common Body of Knowledge.'
              }
            ]
          }
        ],
        curriculum: {
          modules: 8,
          lessons: 56,
          duration: '14 weeks'
        },
        includes: [
          'Practice exams',
          'Study guides',
          'Exam strategies',
          'Certificate of completion'
        ]
      },
      {
        title: 'Ethical Hacking for Beginners',
        description: 'Learn ethical hacking and penetration testing fundamentals',
        price: 65000,
        duration: '8 weeks',
        level: 'Beginner to Intermediate',
        instructor: 'Hexadigitall Team',
        summary: 'Learn ethical hacking techniques, penetration testing methodologies, and security assessment tools to identify and fix security vulnerabilities.',
        body: [
          {
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'Learn ethical hacking techniques used by cybersecurity professionals to identify and fix security vulnerabilities before malicious actors can exploit them.'
              }
            ]
          }
        ],
        curriculum: {
          modules: 5,
          lessons: 28,
          duration: '8 weeks'
        },
        includes: [
          'Penetration testing tools',
          'Lab environment access',
          'Security assessment templates',
          'Certificate of completion'
        ]
      }
    ]
  },
  'Foundational Tech Skills': {
    description: 'Build essential technical skills for any tech career',
    icon: 'default',
    courses: [
      {
        title: 'Mastering the Command Line',
        description: 'Learn command line essentials for developers and sys admins',
        price: 25000,
        duration: '4 weeks',
        level: 'Beginner',
        instructor: 'Hexadigitall Team',
        summary: 'Master the command line interface used by developers and system administrators. Learn file management, process control, and automation basics.',
        body: [
          {
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'Master the command line interface that powers modern development and system administration. Essential skills for any technical career.'
              }
            ]
          }
        ],
        curriculum: {
          modules: 3,
          lessons: 15,
          duration: '4 weeks'
        },
        includes: [
          'Command reference guide',
          'Practice exercises',
          'Automation scripts',
          'Certificate of completion'
        ]
      },
      {
        title: 'Git & GitHub for Beginners',
        description: 'Learn version control with Git and collaboration on GitHub',
        price: 30000,
        duration: '4 weeks',
        level: 'Beginner',
        instructor: 'Hexadigitall Team',
        summary: 'Master Git version control and GitHub collaboration. Learn branching, merging, pull requests, and team workflows essential for any development project.',
        body: [
          {
            _type: 'block',
            _key: generateKey(),
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: generateKey(),
                text: 'Learn Git and GitHub, the essential tools for version control and collaboration used by millions of developers worldwide.'
              }
            ]
          }
        ],
        curriculum: {
          modules: 3,
          lessons: 18,
          duration: '4 weeks'
        },
        includes: [
          'Git workflow templates',
          'GitHub project examples',
          'Collaboration best practices',
          'Certificate of completion'
        ]
      }
    ]
  }
}

async function completeRebuild() {
  console.log('🔥 COMPLETE COURSE REBUILD STARTING...\n')
  
  try {
    // Step 1: Delete ALL existing courses and course categories
    console.log('🗑️  Step 1: Deleting all existing courses and categories...')
    
    const existingCourses = await client.fetch(`*[_type == "course"]{ _id }`)
    const existingCategories = await client.fetch(`*[_type == "courseCategory"]{ _id }`)
    
    console.log(`   Found ${existingCourses.length} courses to delete`)
    console.log(`   Found ${existingCategories.length} categories to delete`)
    
    // Delete courses first
    for (const course of existingCourses) {
      try {
        await writeClient.delete(course._id)
        console.log(`   ✅ Deleted course: ${course._id}`)
      } catch (error) {
        console.log(`   ❌ Error deleting course ${course._id}: ${error.message}`)
      }
    }
    
    // Delete categories
    for (const category of existingCategories) {
      try {
        await writeClient.delete(category._id)
        console.log(`   ✅ Deleted category: ${category._id}`)
      } catch (error) {
        console.log(`   ❌ Error deleting category ${category._id}: ${error.message}`)
      }
    }
    
    console.log('   🎉 All existing data deleted!')
    
    // Step 2: Create fresh course categories
    console.log('\n📚 Step 2: Creating fresh course categories...')
    const categoryIds = {}
    
    for (const [categoryTitle, categoryData] of Object.entries(cleanCourseStructure)) {
      const categoryDoc = {
        _type: 'courseCategory',
        title: categoryTitle,
        description: categoryData.description,
        icon: categoryData.icon,
        slug: {
          current: generateSlug(categoryTitle),
          _type: 'slug'
        }
      }
      
      try {
        const createdCategory = await writeClient.create(categoryDoc)
        categoryIds[categoryTitle] = createdCategory._id
        console.log(`   ✅ Created category: ${categoryTitle} (${createdCategory._id})`)
      } catch (error) {
        console.log(`   ❌ Error creating category ${categoryTitle}: ${error.message}`)
      }
    }
    
    // Step 3: Create courses with proper references
    console.log('\n📖 Step 3: Creating courses with proper structure...')
    
    for (const [categoryTitle, categoryData] of Object.entries(cleanCourseStructure)) {
      const categoryId = categoryIds[categoryTitle]
      
      if (!categoryId) {
        console.log(`   ❌ No category ID for ${categoryTitle}, skipping courses`)
        continue
      }
      
      for (const courseData of categoryData.courses) {
        const courseDoc = {
          _type: 'course',
          title: courseData.title,
          description: courseData.description,
          summary: courseData.summary,
          price: courseData.price,
          duration: courseData.duration,
          level: courseData.level,
          instructor: courseData.instructor,
          body: courseData.body,
          curriculum: courseData.curriculum,
          includes: courseData.includes,
          certificate: true,
          maxStudents: 50,
          mainImage: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: 'image-placeholder-400x300-jpg'
            },
            alt: `${courseData.title} course image`
          },
          slug: {
            current: generateSlug(courseData.title),
            _type: 'slug'
          },
          courseCategory: {
            _type: 'reference',
            _ref: categoryId
          }
        }
        
        try {
          const createdCourse = await writeClient.create(courseDoc)
          console.log(`   ✅ Created course: ${courseData.title} (${createdCourse._id})`)
        } catch (error) {
          console.log(`   ❌ Error creating course ${courseData.title}: ${error.message}`)
        }
      }
    }
    
    console.log('\n🎉 REBUILD COMPLETED SUCCESSFULLY!')
    
    // Step 4: Verification
    console.log('\n🔍 Verification:')
    const newCategories = await client.fetch(`*[_type == "courseCategory"] | order(title asc) { title, _id }`)
    const newCourses = await client.fetch(`*[_type == "course"] | order(title asc) { title, _id, "categoryTitle": courseCategory->title }`)
    
    console.log(`\n📚 Created ${newCategories.length} clean categories:`)
    newCategories.forEach((cat, i) => {
      console.log(`   ${i + 1}. ${cat.title}`)
    })
    
    console.log(`\n📖 Created ${newCourses.length} clean courses:`)
    newCourses.forEach((course, i) => {
      console.log(`   ${i + 1}. ${course.title} → ${course.categoryTitle}`)
    })
    
  } catch (error) {
    console.error('❌ Rebuild failed:', error)
  }
}

// Run the complete rebuild
completeRebuild()
  .then(() => {
    console.log('\n✅ Complete course rebuild finished!')
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Rebuild script failed:', error)
    process.exit(1)
  })
