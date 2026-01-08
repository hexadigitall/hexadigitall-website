// scripts/import-intro-courses.mjs
// Adds introductory courses to all 12 schools to drive campaign: "Intro courses from NGN 25k/month!"
// Pricing: NGN 6,250-10,000/hr (NGN 25k-40k/month); USD $5-8/hr

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || 'puzezel0'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!token) {
  console.error('❌ SANITY_API_TOKEN is required to run this import script.')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion: '2024-08-30', token, useCdn: false })

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function createBlock(text, style = 'normal') {
  return {
    _type: 'block',
    style,
    markDefs: [],
    children: [{ _type: 'span', marks: [], text }],
  }
}

function buildBody(course, schoolName) {
  const intro = course.description
  
  // Determine audience based on school
  let audience = 'Absolute beginners with no prior experience'
  if (schoolName.includes('Algorithms')) audience = 'Beginners wanting to understand problem-solving fundamentals'
  if (schoolName.includes('Cloud')) audience = 'Beginners curious about cloud computing and modern infrastructure'
  if (schoolName.includes('Coding')) audience = 'Complete beginners starting their coding journey'
  if (schoolName.includes('Cybersecurity')) audience = 'Anyone curious about digital security and protecting systems'
  if (schoolName.includes('Data')) audience = 'Beginners interested in data analysis and AI concepts'
  if (schoolName.includes('Design')) audience = 'Aspiring designers and creatives with no prior design experience'
  if (schoolName.includes('Executive')) audience = 'Managers and professionals exploring leadership fundamentals'
  if (schoolName.includes('Fundamentals')) audience = 'Complete beginners seeking digital literacy'
  if (schoolName.includes('Growth') || schoolName.includes('Marketing')) audience = 'Entrepreneurs and marketers exploring growth strategies'
  if (schoolName.includes('Infrastructure')) audience = 'Beginners interested in networking and IT infrastructure'
  if (schoolName.includes('Software')) audience = 'Developers exploring advanced development concepts'
  if (schoolName.includes('Writing')) audience = 'Anyone wanting to improve their written communication'
  
  const learnItems = course.learnItems || [
    '✅ Core concepts and fundamentals',
    '✅ Practical hands-on exercises',
    '✅ Industry-standard terminology',
    '✅ Real-world applications',
    '✅ Foundation for advanced learning',
  ]
  
  const modules = course.modules || [
    'Module 1: Introduction & Core Concepts',
    'Module 2: Fundamentals & Key Principles',
    'Module 3: Practical Applications',
    'Module 4: Building Your First Project',
  ]
  
  const body = [
    createBlock(intro, 'blockquote'),
    createBlock('Who This Course Is For', 'h3'),
    createBlock(audience),
    createBlock("What You'll Learn", 'h3'),
    ...learnItems.map(item => createBlock(item)),
    createBlock('Course Outline', 'h3'),
    ...modules.map(mod => createBlock(mod)),
  ]
  
  return body
}

// Intro courses for all 12 schools
const INTRO_COURSES = [
  {
    schoolTitle: 'School of Algorithms & Problem Solving',
    title: 'Intro to Algorithms & Problem Solving',
    summary: 'Learn the basics of computational thinking, logic, and problem-solving strategies.',
    description: 'Start your journey into algorithms with fundamental problem-solving techniques, basic data structures, and computational thinking. Perfect for absolute beginners.',
    hourlyRateNGN: 6250,
    hourlyRateUSD: 5,
    learnItems: [
      '✅ Computational thinking fundamentals',
      '✅ Basic algorithmic patterns',
      '✅ Problem decomposition strategies',
      '✅ Simple data structures (arrays, lists)',
      '✅ Introduction to Big O notation',
    ],
    modules: [
      'Module 1: What Are Algorithms?',
      'Module 2: Problem-Solving Fundamentals',
      'Module 3: Basic Data Structures',
      'Module 4: Your First Algorithms',
    ],
  },
  {
    schoolTitle: 'School of Cloud & DevOps',
    title: 'Intro to Cloud Computing',
    summary: 'Understand cloud fundamentals, services, and how businesses use cloud infrastructure.',
    description: 'Explore cloud computing basics: what it is, how it works, major providers (AWS, Azure, Google Cloud), and why businesses are moving to the cloud.',
    hourlyRateNGN: 7500,
    hourlyRateUSD: 6,
    learnItems: [
      '✅ Cloud computing concepts and benefits',
      '✅ Overview of AWS, Azure, and Google Cloud',
      '✅ Cloud service models (IaaS, PaaS, SaaS)',
      '✅ Cloud storage and networking basics',
      '✅ Security and compliance fundamentals',
    ],
    modules: [
      'Module 1: What Is Cloud Computing?',
      'Module 2: Major Cloud Providers',
      'Module 3: Cloud Service Models',
      'Module 4: Getting Started with Cloud',
    ],
  },
  {
    schoolTitle: 'School of Coding & Development',
    title: 'Intro to Coding',
    summary: 'Your first steps into programming: variables, logic, and writing your first code.',
    description: 'Start coding with no prior experience. Learn programming fundamentals, write your first lines of code, and understand how software works.',
    hourlyRateNGN: 6250,
    hourlyRateUSD: 5,
    learnItems: [
      '✅ What is programming and how it works',
      '✅ Variables, data types, and operators',
      '✅ Control flow: conditions and loops',
      '✅ Functions and code organization',
      '✅ Write your first working program',
    ],
    modules: [
      'Module 1: Introduction to Programming',
      'Module 2: Your First Code',
      'Module 3: Control Flow & Logic',
      'Module 4: Building Your First App',
    ],
  },
  {
    schoolTitle: 'School of Cybersecurity',
    title: 'Intro to Cybersecurity',
    summary: 'Learn the basics of digital security, threats, and how to protect systems and data.',
    description: 'Understand cybersecurity fundamentals: types of threats, basic defense mechanisms, and how security professionals protect digital assets.',
    hourlyRateNGN: 8750,
    hourlyRateUSD: 7,
    learnItems: [
      '✅ Cybersecurity landscape and threats',
      '✅ Basic security principles (CIA triad)',
      '✅ Common attacks and defenses',
      '✅ Password security and authentication',
      '✅ Introduction to network security',
    ],
    modules: [
      'Module 1: What Is Cybersecurity?',
      'Module 2: Common Threats & Attacks',
      'Module 3: Defense Fundamentals',
      'Module 4: Securing Your Digital Life',
    ],
  },
  {
    schoolTitle: 'School of Data & AI',
    title: 'Intro to Data & AI',
    summary: 'Discover the world of data analysis, machine learning, and artificial intelligence basics.',
    description: 'Explore data concepts, basic statistics, and an introduction to AI and machine learning. Learn how data drives decisions and powers AI.',
    hourlyRateNGN: 8750,
    hourlyRateUSD: 7,
    learnItems: [
      '✅ What is data and why it matters',
      '✅ Basic statistics and data analysis',
      '✅ Introduction to machine learning',
      '✅ AI concepts and real-world applications',
      '✅ Data visualization basics',
    ],
    modules: [
      'Module 1: Understanding Data',
      'Module 2: Basic Statistics & Analysis',
      'Module 3: Introduction to AI & ML',
      'Module 4: Data in Action',
    ],
  },
  {
    schoolTitle: 'School of Design',
    title: 'Intro to Design',
    summary: 'Learn design fundamentals: color, typography, layout, and visual communication.',
    description: 'Start your design journey with core principles: color theory, typography, composition, and how to create visually appealing designs.',
    hourlyRateNGN: 6250,
    hourlyRateUSD: 5,
    learnItems: [
      '✅ Design principles and fundamentals',
      '✅ Color theory and palette selection',
      '✅ Typography basics',
      '✅ Layout and composition',
      '✅ Introduction to design tools',
    ],
    modules: [
      'Module 1: What Is Design?',
      'Module 2: Color & Typography',
      'Module 3: Layout & Composition',
      'Module 4: Your First Design Project',
    ],
  },
  {
    schoolTitle: 'School of Executive Management',
    title: 'Intro to Leadership & Management',
    summary: 'Foundational leadership skills: communication, decision-making, and team management.',
    description: 'Learn essential management skills: leading teams, making decisions, effective communication, and driving results.',
    hourlyRateNGN: 10000,
    hourlyRateUSD: 8,
    learnItems: [
      '✅ Leadership vs. management',
      '✅ Effective communication strategies',
      '✅ Decision-making frameworks',
      '✅ Team motivation and delegation',
      '✅ Goal setting and execution',
    ],
    modules: [
      'Module 1: Leadership Fundamentals',
      'Module 2: Communication & Influence',
      'Module 3: Decision Making',
      'Module 4: Leading Your Team',
    ],
  },
  {
    schoolTitle: 'School of Fundamentals',
    title: 'Intro to Digital Literacy',
    summary: 'Master basic computer skills, internet navigation, and digital productivity tools.',
    description: 'Build essential digital skills: using computers, internet basics, email, productivity software, and online safety.',
    hourlyRateNGN: 6250,
    hourlyRateUSD: 5,
    learnItems: [
      '✅ Computer basics and operating systems',
      '✅ Internet and browser fundamentals',
      '✅ Email and communication tools',
      '✅ Productivity software (docs, sheets)',
      '✅ Online safety and privacy',
    ],
    modules: [
      'Module 1: Computer Fundamentals',
      'Module 2: Internet & Email Basics',
      'Module 3: Productivity Tools',
      'Module 4: Digital Safety',
    ],
  },
  {
    schoolTitle: 'School of Growth & Marketing',
    title: 'Intro to Digital Marketing',
    summary: 'Learn marketing fundamentals: social media, content, SEO, and growth strategies.',
    description: 'Understand digital marketing basics: how to reach audiences online, create content, and grow a brand or business.',
    hourlyRateNGN: 7500,
    hourlyRateUSD: 6,
    learnItems: [
      '✅ Digital marketing landscape',
      '✅ Social media marketing basics',
      '✅ Content marketing fundamentals',
      '✅ Introduction to SEO',
      '✅ Email marketing basics',
    ],
    modules: [
      'Module 1: What Is Digital Marketing?',
      'Module 2: Social Media Foundations',
      'Module 3: Content & SEO Basics',
      'Module 4: Your Marketing Strategy',
    ],
  },
  {
    schoolTitle: 'School of Infrastructure',
    title: 'Intro to Networking & Infrastructure',
    summary: 'Understand networking basics: how devices connect, protocols, and IT infrastructure.',
    description: 'Learn networking fundamentals: IP addresses, protocols, routers, switches, and how the internet works.',
    hourlyRateNGN: 7500,
    hourlyRateUSD: 6,
    learnItems: [
      '✅ Networking concepts and terminology',
      '✅ How the internet works',
      '✅ IP addresses and protocols',
      '✅ Routers, switches, and devices',
      '✅ Introduction to network security',
    ],
    modules: [
      'Module 1: Networking Fundamentals',
      'Module 2: How the Internet Works',
      'Module 3: Devices & Protocols',
      'Module 4: Basic Network Setup',
    ],
  },
  {
    schoolTitle: 'School of Software Mastery',
    title: 'Intro to Software Development',
    summary: 'Explore the software development lifecycle, tools, and best practices.',
    description: 'Learn what software development entails: from planning to deployment, version control, and modern development practices.',
    hourlyRateNGN: 8750,
    hourlyRateUSD: 7,
    learnItems: [
      '✅ Software development lifecycle',
      '✅ Version control with Git',
      '✅ Development environments and tools',
      '✅ Collaboration and code review',
      '✅ Introduction to software testing',
    ],
    modules: [
      'Module 1: The Software Development Process',
      'Module 2: Tools & Environments',
      'Module 3: Version Control Basics',
      'Module 4: Your First Development Project',
    ],
  },
  {
    schoolTitle: 'School of Writing & Communication',
    title: 'Intro to Professional Writing',
    summary: 'Master clear, effective writing for business, technical docs, and professional communication.',
    description: 'Learn to write clearly and effectively: business emails, reports, documentation, and persuasive content.',
    hourlyRateNGN: 6250,
    hourlyRateUSD: 5,
    learnItems: [
      '✅ Writing fundamentals and clarity',
      '✅ Business writing essentials',
      '✅ Email and professional communication',
      '✅ Report and documentation writing',
      '✅ Editing and proofreading',
    ],
    modules: [
      'Module 1: Writing Foundations',
      'Module 2: Business Communication',
      'Module 3: Professional Documents',
      'Module 4: Polishing Your Writing',
    ],
  },
]

async function getSchoolIdByTitle(title) {
  const school = await client.fetch(`*[_type == "school" && title == $title][0]{ _id, title }`, { title })
  if (!school?._id) {
    const schools = await client.fetch(`*[_type == "school"]{ _id, title } | order(title asc)`)
    const schoolList = schools.map(s => `  - ${s.title}`).join('\n')
    throw new Error(`School not found: "${title}"\n\nAvailable schools:\n${schoolList}`)
  }
  return school._id
}

async function upsertCourse(schoolId, course, schoolName) {
  const slug = slugify(course.title)
  const existing = await client.fetch(`*[_type == "course" && slug.current == $slug][0]{ _id }`, { slug })

  const body = buildBody(course, schoolName)
  const ogTitle = course.title
  const ogDescription = course.summary

  const doc = {
    _type: 'course',
    title: course.title,
    slug: { current: slug },
    order: 5, // Intro courses have low order to appear first
    school: { _type: 'reference', _ref: schoolId },
    summary: course.summary,
    description: course.description,
    body: body,
    courseType: 'live',
    billingType: 'monthly',
    hourlyRateNGN: course.hourlyRateNGN,
    hourlyRateUSD: course.hourlyRateUSD,
    level: 'Beginner',
    durationWeeks: 8,
    hoursPerWeek: 2,
    duration: '8 weeks • 2 hrs/week',
    modules: 4,
    lessons: 12,
    instructor: 'Hexadigitall Mentor',
    featured: true, // Feature intro courses to drive campaign
    ogTitle: ogTitle,
    ogDescription: ogDescription,
  }

  if (existing?._id) {
    await client.patch(existing._id).set(doc).commit()
    console.log(`🔁 Updated: ${course.title}`)
    return existing._id
  } else {
    const created = await client.create(doc)
    console.log(`✅ Created: ${course.title}`)
    return created._id
  }
}

async function run() {
  try {
    console.log('📚 Importing intro courses for all 12 schools...\n')

    const results = []
    for (const course of INTRO_COURSES) {
      console.log(`\n→ ${course.schoolTitle}`)
      const schoolId = await getSchoolIdByTitle(course.schoolTitle)
      const id = await upsertCourse(schoolId, course, course.schoolTitle)
      results.push({ title: course.title, id })
    }

    console.log('\n\n🎉 Import complete! Summary:')
    results.forEach((r, i) => console.log(` ${i + 1}. ${r.title} → ${r.id}`))
    console.log('\n💡 Campaign message: "Start learning from NGN 25,000/month with our Intro courses!"')
  } catch (err) {
    console.error('❌ Import failed:', err)
    process.exit(1)
  }
}

run()
