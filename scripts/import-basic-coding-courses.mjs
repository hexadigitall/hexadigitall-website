// scripts/import-basic-coding-courses.mjs
// Adds foundational vanilla coding courses to the "School of Coding and Development"
// Courses: HTML, CSS, JavaScript, CSS Only, Advanced CSS, JS Only, Advanced JS

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

const SCHOOL_TITLE = 'School of Coding & Development'

async function getSchoolIdByTitle(title) {
  const school = await client.fetch(`*[_type == "school" && title == $title][0]{ _id, title }`, { title })
  if (!school?._id) {
    // List available schools
    const schools = await client.fetch(`*[_type == "school"]{ _id, title } | order(title asc)`)
    const schoolList = schools.map(s => `  - ${s.title}`).join('\n')
    throw new Error(`School not found: "${title}"\n\nAvailable schools:\n${schoolList}\n\nUpdate SCHOOL_TITLE in the script to match an existing school.`)
  }
  return school._id
}

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

function buildBody(course) {
  const courseName = course.title
  
  // Who This Course Is For
  let audience = 'Beginners'
  if (courseName.includes('HTML')) audience = 'Beginners starting their web development journey'
  if (courseName.includes('CSS')) audience = courseName.includes('Only') 
    ? 'Frontend developers and designers wanting to master CSS'
    : 'Beginners and developers wanting to master modern CSS'
  if (courseName.includes('JavaScript') && !courseName.includes('Advanced')) 
    audience = 'Beginners wanting to learn core JavaScript concepts'
  if (courseName.includes('Advanced')) audience = 'Developers with intermediate experience wanting advanced techniques'
  
  // What You'll Learn bullets
  let learnItems = []
  if (courseName.includes('HTML')) {
    learnItems = [
      '✅ Semantic HTML markup for accessibility and SEO',
      '✅ Forms, media elements, and tables',
      '✅ HTML5 best practices and standards',
      '✅ Meta tags and document structure',
      '✅ Build accessible, well-structured web pages',
    ]
  } else if (courseName.includes('CSS')) {
    if (courseName.includes('Advanced')) {
      learnItems = [
        '✅ Advanced Grid and Flexbox patterns',
        '✅ CSS architecture (BEM, CSS Modules)',
        '✅ Fluid typography and responsive units',
        '✅ Theming and design systems',
        '✅ Performance optimization techniques',
        '✅ Accessibility in CSS and animations',
      ]
    } else if (courseName.includes('Only')) {
      learnItems = [
        '✅ Build responsive layouts from scratch',
        '✅ Create UI components without JavaScript',
        '✅ CSS Flexbox and Grid mastery',
        '✅ Animations, transitions, and transforms',
        '✅ Mobile-first responsive design',
      ]
    } else {
      learnItems = [
        '✅ CSS selectors and the box model',
        '✅ Flexbox and Grid layouts',
        '✅ Positioning and responsive design',
        '✅ Transitions and keyframe animations',
        '✅ Typography and color theory',
      ]
    }
  } else if (courseName.includes('JavaScript')) {
    if (courseName.includes('Advanced')) {
      learnItems = [
        '✅ Closures, prototypes, and prototype chain',
        '✅ Async/await, Promises, and callbacks',
        '✅ Modules and ES6+ features',
        '✅ Design patterns and best practices',
        '✅ Performance profiling and optimization',
        '✅ Testing and debugging techniques',
      ]
    } else if (courseName.includes('Only')) {
      learnItems = [
        '✅ Build interactive DOM applications',
        '✅ State management without frameworks',
        '✅ Event handling and API integration',
        '✅ Module patterns and code organization',
        '✅ Build games, utilities, and mini-apps',
      ]
    } else {
      learnItems = [
        '✅ Variables, data types, and operators',
        '✅ Functions, arrays, and objects',
        '✅ DOM manipulation and events',
        '✅ ES6+ features and async operations',
        '✅ Debugging and common pitfalls',
      ]
    }
  }
  
  // Course outline
  let outlineModules = []
  if (courseName.includes('HTML')) {
    outlineModules = [
      'Module 1: HTML Foundations & Semantics',
      'Module 2: Forms & Media Elements',
      'Module 3: Accessibility & Best Practices',
      'Module 4: SEO & Meta Tags',
    ]
  } else if (courseName.includes('CSS')) {
    if (courseName.includes('Advanced')) {
      outlineModules = [
        'Module 1: Advanced Selectors & Layout Patterns',
        'Module 2: CSS Architecture & Scalability',
        'Module 3: Performance & Optimization',
        'Module 4: Design Systems & Theming',
      ]
    } else if (courseName.includes('Only')) {
      outlineModules = [
        'Module 1: Flexbox Layout Mastery',
        'Module 2: CSS Grid & Responsive Design',
        'Module 3: Animations & Transitions',
        'Module 4: Building Real-World Components',
      ]
    } else {
      outlineModules = [
        'Module 1: Selectors, Box Model, Positioning',
        'Module 2: Flexbox & Responsive Design',
        'Module 3: Grid & Layouts',
        'Module 4: Animations & Best Practices',
      ]
    }
  } else if (courseName.includes('JavaScript')) {
    if (courseName.includes('Advanced')) {
      outlineModules = [
        'Module 1: Closures & Prototypes',
        'Module 2: Async Patterns & Promises',
        'Module 3: Modules & Design Patterns',
        'Module 4: Performance & Testing',
      ]
    } else if (courseName.includes('Only')) {
      outlineModules = [
        'Module 1: DOM & Event Handling',
        'Module 2: Interactive Applications',
        'Module 3: State Management',
        'Module 4: Building Your First Projects',
      ]
    } else {
      outlineModules = [
        'Module 1: Fundamentals & Data Types',
        'Module 2: Functions & Objects',
        'Module 3: DOM & Events',
        'Module 4: Projects & Best Practices',
      ]
    }
  }
  
  const body = [
    createBlock(course.description, 'blockquote'),
    createBlock('Who This Course Is For', 'h3'),
    createBlock(audience),
    createBlock("What You'll Learn", 'h3'),
    ...learnItems.map(item => createBlock(item)),
    createBlock('Course Outline', 'h3'),
    ...outlineModules.map(mod => createBlock(mod)),
  ]
  
  return body
}

// Pricing: NGN hourly 6,250–8,750; USD hourly set proportionally (≈ $5–$7)
const COURSES = [
  {
    title: 'HTML Fundamentals',
    summary: 'Learn the building blocks of the web: tags, structure, semantics, accessibility, and best practices.',
    description: 'Master HTML essentials including semantic markup, forms, media, tables, accessibility, and SEO-friendly content structure. Perfect for beginners starting their web journey.',
    level: 'Beginner',
    hourlyRateNGN: 6250,
    hourlyRateUSD: 5,
    order: 10,
  },
  {
    title: 'CSS Fundamentals',
    summary: 'Style websites with layouts, colors, typography, and responsive design using modern CSS.',
    description: 'Cover selectors, box model, flexbox, grid, positioning, responsive units, transitions, and modern best practices to build beautiful, responsive interfaces.',
    level: 'Beginner',
    hourlyRateNGN: 6250,
    hourlyRateUSD: 5,
    order: 20,
  },
  {
    title: 'JavaScript Fundamentals',
    summary: 'Core JS concepts: variables, functions, DOM, events, ES6+, and practical problem solving.',
    description: 'Hands-on JavaScript for beginners: data types, control flow, arrays/objects, functions, ES modules, DOM manipulation, events, and debugging techniques.',
    level: 'Beginner',
    hourlyRateNGN: 8750,
    hourlyRateUSD: 7,
    order: 30,
  },
  {
    title: 'CSS Only Projects',
    summary: 'Practice CSS skills by building layouts, components, and animations without JavaScript.',
    description: 'Project-based learning: build responsive layouts, UI components, and micro-interactions using pure CSS (Flexbox, Grid, transitions, keyframe animations).',
    level: 'Beginner',
    hourlyRateNGN: 6250,
    hourlyRateUSD: 5,
    order: 40,
  },
  {
    title: 'Advanced CSS Mastery',
    summary: 'Advanced layouts, performance, architecture (BEM/CSS Modules), animations, and design systems.',
    description: 'Deep dive into Grid patterns, fluid typography, responsive strategies, theming, CSS architecture, accessibility, and performance optimization for production-ready UI.',
    level: 'Advanced',
    hourlyRateNGN: 8750,
    hourlyRateUSD: 7,
    order: 50,
  },
  {
    title: 'JavaScript Only Projects',
    summary: 'Strengthen JS by building interactive projects (games, utilities, mini-apps) without frameworks.',
    description: 'Project-focused course: DOM apps, state management patterns, modules, async APIs, and performance—no frameworks, just raw JavaScript.',
    level: 'Intermediate',
    hourlyRateNGN: 8750,
    hourlyRateUSD: 7,
    order: 60,
  },
  {
    title: 'Advanced JavaScript Mastery',
    summary: 'Advanced JS: async/await, modules, patterns, performance, tooling, and clean code.',
    description: 'Master closures, prototypes, async patterns, modules, testing, performance profiling, and modern tooling to write robust, maintainable JavaScript.',
    level: 'Advanced',
    hourlyRateNGN: 8750,
    hourlyRateUSD: 7,
    order: 70,
  },
]

async function upsertCourse(schoolId, course) {
  const slug = slugify(course.title)
  const existing = await client.fetch(`*[_type == "course" && slug.current == $slug][0]{ _id }`, { slug })

  const body = buildBody(course)
  const ogTitle = course.title
  const ogDescription = course.summary

  const doc = {
    _type: 'course',
    title: course.title,
    slug: { current: slug },
    order: course.order,
    school: { _type: 'reference', _ref: schoolId },
    summary: course.summary,
    description: course.description,
    body: body,
    courseType: 'live',
    billingType: 'monthly',
    hourlyRateNGN: course.hourlyRateNGN,
    hourlyRateUSD: course.hourlyRateUSD,
    level: course.level,
    durationWeeks: course.level === 'Beginner' ? 8 : 12,
    hoursPerWeek: 2,
    duration: course.level === 'Beginner' ? '8 weeks • 2 hrs/week' : '12 weeks • 2 hrs/week',
    modules: course.level === 'Beginner' ? 4 : 5,
    lessons: course.level === 'Beginner' ? 12 : 16,
    instructor: 'Hexadigitall Mentor',
    featured: false,
    ogTitle: ogTitle,
    ogDescription: ogDescription,
  }

  if (existing?._id) {
    await client.patch(existing._id).set(doc).commit()
    console.log(`🔁 Updated course: ${course.title}`)
    return existing._id
  } else {
    const created = await client.create(doc)
    console.log(`✅ Created course: ${course.title}`)
    return created._id
  }
}

async function run() {
  try {
    console.log('📚 Importing vanilla coding courses...')
    const schoolId = await getSchoolIdByTitle(SCHOOL_TITLE)
    console.log(`🏫 Target school: ${SCHOOL_TITLE} (${schoolId})`)

    const results = []
    for (const course of COURSES) {
      const id = await upsertCourse(schoolId, course)
      results.push({ title: course.title, id })
    }

    console.log('\n🎉 Import complete. Summary:')
    results.forEach((r, i) => console.log(` ${i + 1}. ${r.title} → ${r.id}`))
  } catch (err) {
    console.error('❌ Import failed:', err)
    process.exit(1)
  }
}

await run()
