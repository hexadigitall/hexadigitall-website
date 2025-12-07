// sanity/schemas/course-fixed.ts
// SIMPLIFIED VERSION TO FIX SchemaError
// Reduces nesting depth and simplifies object structures
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
      title: 'Hourly Rate (USD)',
      type: 'number',
      description: 'The standard international hourly rate. Range: $15/hr to $87.5/hr',
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
      title: 'Hourly Rate (NGN)',
      type: 'number',
      description: 'The adjusted PPP rate for Nigeria. Range: ₦12,500/hr to ₦70,000/hr',
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

    // SIMPLIFIED SCHEDULING - Flattened structure to avoid deep nesting
    defineField({
      name: 'minSessionsPerWeek',
      title: 'Minimum Sessions per Week',
      type: 'number',
      initialValue: 1,
      hidden: ({ parent }) => parent?.courseType !== 'live',
      validation: (Rule) => Rule.min(1).max(3)
    }),
    defineField({
      name: 'maxSessionsPerWeek',
      title: 'Maximum Sessions per Week',
      type: 'number',
      initialValue: 3,
      hidden: ({ parent }) => parent?.courseType !== 'live',
      validation: (Rule) => Rule.min(1).max(3)
    }),
    defineField({
      name: 'minHoursPerSession',
      title: 'Minimum Hours per Session',
      type: 'number',
      initialValue: 1,
      hidden: ({ parent }) => parent?.courseType !== 'live',
      validation: (Rule) => Rule.min(1).max(3)
    }),
    defineField({
      name: 'maxHoursPerSession',
      title: 'Maximum Hours per Session',
      type: 'number',
      initialValue: 3,
      hidden: ({ parent }) => parent?.courseType !== 'live',
      validation: (Rule) => Rule.min(1).max(3)
    }),

    // Legacy price field (hidden)
    defineField({
      name: 'price',
      title: 'Legacy Price (NGN) - Deprecated',
      type: 'number',
      description: 'Legacy field - use nairaPrice and dollarPrice instead',
      hidden: true,
    }),

    defineField({ name: 'body', title: 'Full Description', type: 'array', of: [{type: 'block'}] }),
    defineField({ name: 'mainImage', title: 'Course Image', type: 'image', options: { hotspot: true } }),
    
    // SIMPLIFIED Duration field
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'e.g., "8 weeks", "12 weeks", "Flexible"',
      initialValue: '8 weeks',
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
      name: 'description',
      title: 'Short Description',
      type: 'text',
      description: 'Brief course description for enrollment cards',
      rows: 3,
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
    
    // SIMPLIFIED Curriculum - Simple object with basic fields
    defineField({
      name: 'curriculumModules',
      title: 'Number of Modules',
      type: 'number',
      initialValue: 8,
    }),
    defineField({
      name: 'curriculumLessons',
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

    // Simplified time zones and session formats
    defineField({
      name: 'availableTimeZones',
      title: 'Available Time Zones',
      type: 'string',
      description: 'e.g., "WAT, ET, GMT"',
      initialValue: 'WAT, ET',
    }),
    defineField({
      name: 'sessionFormats',
      title: 'Available Session Formats',
      type: 'string',
      description: 'e.g., "One-on-One, Small Group"',
      initialValue: 'One-on-One, Small Group',
    }),
  ],
})
