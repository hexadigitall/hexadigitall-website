// sanity/schemas/course.ts
import {defineField, defineType} from 'sanity'

// Type for course parent context in validation
interface CourseParent {
  courseType?: 'live' | 'self-paced';
  [key: string]: unknown;
}

export default defineType({
  name: 'course',
  title: 'Course',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this course appears in listings (lower numbers appear first)',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'courseCategory'}],
    }),
    defineField({ name: 'summary', title: 'Summary', type: 'text' }),
    defineField({
      name: 'courseType',
      title: 'Course Pricing Model',
      type: 'string',
      options: {
        list: [
          { title: 'Mentorship Subscription (Monthly)', value: 'live' },
          { title: 'Self-Paced (One-time)', value: 'self-paced' }
        ],
        layout: 'radio',
      },
      initialValue: 'live',
      description: 'Monthly subscription with flexible scheduling using Regional Pricing (PPP)'
    }),

    // Self-paced pricing (legacy support)
    defineField({
      name: 'nairaPrice',
      title: 'Price in Nigerian Naira (₦)',
      type: 'number',
      description: 'Course price in Nigerian Naira for local customers',
      hidden: ({ parent }) => parent?.courseType !== 'self-paced',
    }),
    defineField({
      name: 'dollarPrice',
      title: 'Price in US Dollars ($)',
      type: 'number',
      description: 'Course price in USD for international customers (used for currency conversion)',
      hidden: ({ parent }) => parent?.courseType !== 'self-paced',
    }),

    // REGIONAL PRICING FIELDS (PPP Model)
    defineField({
      name: 'hourlyRateUSD',
      title: 'Hidden Global Rate (USD)',
      type: 'number',
      description: 'The standard international hourly rate. Range: $15/hr (₦60/mo floor) to $87.5/hr ($350/mo ceiling). This is the global market rate.',
      hidden: ({ parent }) => parent?.courseType !== 'live',
      validation: (Rule) => Rule.custom((value, context) => {
        const parent = context?.parent as CourseParent;
        if (parent?.courseType !== 'live') return true;
        if (!value) return 'Hourly rate is required for live mentoring courses';
        if (value < 15) return 'Minimum rate is $15/hr';
        if (value > 87.5) return 'Maximum rate is $87.5/hr';
        return true;
      })
    }),
    defineField({
      name: 'hourlyRateNGN',
      title: 'Hidden Regional Rate (NGN)',
      type: 'number',
      description: 'The adjusted PPP rate for Nigeria. Range: ₦12,500/hr (₦50k/mo floor) to ₦70,000/hr (₦280k/mo ceiling). NOT a direct conversion.',
      hidden: ({ parent }) => parent?.courseType !== 'live',
      validation: (Rule) => Rule.custom((value, context) => {
        const parent = context?.parent as CourseParent;
        if (parent?.courseType !== 'live') return true;
        if (!value) return 'Hourly rate is required for live mentoring courses';
        if (value < 12500) return 'Minimum rate is ₦12,500/hr';
        if (value > 70000) return 'Maximum rate is ₦70,000/hr';
        if (!Number.isInteger(value)) return 'NGN rate must be a whole number';
        return true;
      })
    }),

    // Simplified scheduling constraints
    defineField({
      name: 'billingType',
      title: 'Billing Type',
      type: 'string',
      options: {
        list: [
          { title: 'Monthly Recurring (Recommended)', value: 'monthly' },
          { title: 'Pay-per-Session', value: 'per-session' },
          { title: 'Package Deal (Multiple months)', value: 'package' }
        ]
      },
      initialValue: 'monthly',
      description: 'How students will be billed for this course'
    }),

    // Legacy price field (hidden)
    defineField({
      name: 'price',
      title: 'Legacy Price (NGN) - Deprecated',
      type: 'number',
      description: 'Legacy field - use nairaPrice and dollarPrice instead',
      hidden: true,
    }),

    defineField({ name: 'description', title: 'Short Description', type: 'text', description: 'Brief description of what students will learn (shown on course cards)' }),
    defineField({ name: 'body', title: 'Full Description', type: 'array', of: [{type: 'block'}] }),
    defineField({ name: 'mainImage', title: 'Course Image', type: 'image', options: { hotspot: true } }),
    
    defineField({
      name: 'durationWeeks',
      title: 'Duration in Weeks',
      type: 'number',
      description: 'Professional recommendation: Beginner (4-8 weeks), Intermediate (8-12 weeks), Advanced (12-16 weeks), Certification (16-24 weeks)',
      validation: (Rule) => Rule.min(4).max(24),
      initialValue: 8
    }),
    defineField({
      name: 'hoursPerWeek',
      title: 'Recommended Hours per Week',
      type: 'number',
      description: 'Default recommendation for course completion',
      validation: (Rule) => Rule.min(1).max(10),
      initialValue: 2
    }),
    defineField({
      name: 'duration',
      title: 'Duration Display Text',
      type: 'string',
      description: 'Display text for course duration',
    }),
    defineField({
      name: 'level',
      title: 'Course Level',
      type: 'string',
      options: {
        list: [
          { title: 'Beginner', value: 'Beginner' },
          { title: 'Intermediate', value: 'Intermediate' },
          { title: 'Advanced', value: 'Advanced' },
          { title: 'All Levels', value: 'All Levels' },
        ],
      },
      initialValue: 'Intermediate',
    }),
    defineField({
      name: 'instructor',
      title: 'Instructor Name',
      type: 'string',
      description: 'The main instructor for this course',
    }),
    
    defineField({
      name: 'prerequisites',
      title: 'Prerequisites',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of prerequisites for this course',
    }),
    defineField({
      name: 'maxStudents',
      title: 'Maximum Students per Session',
      type: 'number',
      description: 'Maximum number of students per live session (leave empty for unlimited)',
    }),
    defineField({
      name: 'modules',
      title: 'Number of Modules',
      type: 'number',
      initialValue: 8,
    }),
    defineField({
      name: 'lessons',
      title: 'Total Lessons',
      type: 'number',
      initialValue: 24,
    }),
    defineField({
      name: 'includes',
      title: 'What\'s Included',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of what students get with this course',
      initialValue: [
        'Live one-on-one or small group sessions',
        'Personalized learning path',
        'Direct access to instructor',
        'Flexible scheduling',
        'Certificate of completion',
        'Downloadable resources',
      ],
    }),
    defineField({
      name: 'certificate',
      title: 'Certificate Available',
      type: 'boolean',
      description: 'Whether students receive a certificate upon completion',
      initialValue: true,
    }),
    defineField({
      name: 'featured',
      title: 'Featured Course',
      type: 'boolean',
      description: 'Whether this course should be featured on the homepage',
      initialValue: false,
    }),

    // Course Materials
    defineField({
      name: 'contentPdf',
      title: 'Course Content PDF',
      type: 'file',
      description: 'Downloadable course content/curriculum PDF for enrolled students and assigned teachers',
      options: {
        accept: '.pdf',
      },
    }),
    defineField({
      name: 'roadmapPdf',
      title: 'Course Roadmap PDF',
      type: 'file',
      description: 'Downloadable learning roadmap PDF for enrolled students and assigned teachers',
      options: {
        accept: '.pdf',
      },
    }),
    defineField({
      name: 'assignedTeachers',
      title: 'Assigned Teachers',
      type: 'array',
      of: [{
        type: 'reference',
        to: [{ type: 'user' }],
      }],
      description: 'Teachers assigned to teach this course',
      validation: (Rule) => Rule.custom((teachers, context) => {
        if (!teachers || teachers.length === 0) return true
        // Could add validation here to ensure referenced users have role='teacher'
        return true
      }),
    }),

    // New fields for live course management
    defineField({
      name: 'timeZones',
      title: 'Available Time Zones',
      type: 'array',
      of: [{
        type: 'string',
        options: {
          list: [
            { title: 'West Africa Time (WAT)', value: 'WAT' },
            { title: 'Eastern Time (ET)', value: 'ET' },
            { title: 'Central Time (CT)', value: 'CT' },
            { title: 'Pacific Time (PT)', value: 'PT' },
            { title: 'Greenwich Mean Time (GMT)', value: 'GMT' },
            { title: 'Central European Time (CET)', value: 'CET' }
          ]
        }
      }],
      initialValue: ['WAT', 'ET'],
      description: 'Time zones instructor is available for live sessions'
    }),

    defineField({
      name: 'sessionFormats',
      title: 'Available Session Formats',
      type: 'array',
      of: [{
        type: 'string',
        options: {
          list: [
            { title: 'One-on-One', value: 'one-on-one' },
            { title: 'Small Group (2-4 students)', value: 'small-group' },
            { title: 'Group Session (5-8 students)', value: 'group' }
          ]
        }
      }],
      initialValue: ['one-on-one', 'small-group'],
      description: 'Available formats for live sessions'
    }),

    // Legacy fields - kept for backward compatibility with existing documents
    defineField({
      name: 'curriculum',
      title: 'Curriculum (Legacy)',
      type: 'object',
      description: 'Legacy field - data migrating to modules/lessons/duration fields',
      fields: [
        { name: 'duration', type: 'string', title: 'Duration' },
        { name: 'lessons', type: 'number', title: 'Lessons' },
        { name: 'modules', type: 'number', title: 'Modules' },
      ],
      hidden: true,
    }),

    defineField({
      name: 'monthlyScheduling',
      title: 'Monthly Scheduling (Legacy)',
      type: 'object',
      description: 'Legacy scheduling constraints - superseded by flexible hourly model',
      fields: [
        {
          name: 'sessionsPerWeek',
          type: 'object',
          title: 'Sessions Per Week',
          fields: [
            { name: 'min', type: 'number', title: 'Min' },
            { name: 'max', type: 'number', title: 'Max' },
            { name: 'default', type: 'number', title: 'Default' },
          ],
        },
        {
          name: 'hoursPerSession',
          type: 'object',
          title: 'Hours Per Session',
          fields: [
            { name: 'min', type: 'number', title: 'Min' },
            { name: 'max', type: 'number', title: 'Max' },
            { name: 'default', type: 'number', title: 'Default' },
          ],
        },
        { name: 'totalHoursLimit', type: 'number', title: 'Total Hours Limit' },
      ],
      hidden: true,
    }),
  ],
})