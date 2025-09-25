// sanity/schemas/course.ts
import {defineField, defineType} from 'sanity'

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
      title: 'Course Type',
      type: 'string',
      options: {
        list: [
          { title: 'Self-Paced (One-time fee)', value: 'self-paced' },
          { title: 'Live Mentoring (Hourly/Weekly pricing)', value: 'live' },
        ],
        layout: 'radio',
      },
      initialValue: 'live',
      description: 'Live mentoring supports flexible hourly/weekly scheduling with monthly billing'
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

    // Live mentoring hourly rates
    defineField({
      name: 'hourlyRateNGN',
      title: 'Hourly Rate (₦) - for Live Mentoring',
      type: 'number',
      description: 'The price per hour in Nigerian Naira for one-on-one or group classes',
      hidden: ({ parent }) => parent?.courseType !== 'live',
      validation: (Rule) => Rule.positive().integer().min(1000).max(50000)
    }),
    defineField({
      name: 'hourlyRateUSD',
      title: 'Hourly Rate ($) - for Live Mentoring',
      type: 'number',
      description: 'The price per hour in USD for international clients',
      hidden: ({ parent }) => parent?.courseType !== 'live',
      validation: (Rule) => Rule.positive().min(5).max(200)
    }),

    // Flexible scheduling options for live courses
    defineField({
      name: 'schedulingOptions',
      title: 'Scheduling Options',
      type: 'object',
      hidden: ({ parent }) => parent?.courseType !== 'live',
      fields: [
        defineField({
          name: 'minHoursPerSession',
          title: 'Minimum Hours per Session',
          type: 'number',
          initialValue: 1,
          validation: (Rule) => Rule.min(1).max(3)
        }),
        defineField({
          name: 'maxHoursPerSession',
          title: 'Maximum Hours per Session',
          type: 'number',
          initialValue: 3,
          validation: (Rule) => Rule.min(1).max(5)
        }),
        defineField({
          name: 'minSessionsPerWeek',
          title: 'Minimum Sessions per Week',
          type: 'number',
          initialValue: 1,
          validation: (Rule) => Rule.min(1).max(7)
        }),
        defineField({
          name: 'maxSessionsPerWeek',
          title: 'Maximum Sessions per Week',
          type: 'number',
          initialValue: 3,
          validation: (Rule) => Rule.min(1).max(7)
        }),
        defineField({
          name: 'defaultHours',
          title: 'Default Hours per Week',
          type: 'number',
          description: 'Default selection for pricing display (1 hour per week for 1 month)',
          initialValue: 1,
          validation: (Rule) => Rule.min(1).max(21)
        }),
        defineField({
          name: 'availableDays',
          title: 'Available Days of the Week',
          type: 'array',
          of: [{
            type: 'string',
            options: {
              list: [
                { title: 'Monday', value: 'monday' },
                { title: 'Tuesday', value: 'tuesday' },
                { title: 'Wednesday', value: 'wednesday' },
                { title: 'Thursday', value: 'thursday' },
                { title: 'Friday', value: 'friday' },
                { title: 'Saturday', value: 'saturday' },
                { title: 'Sunday', value: 'sunday' }
              ]
            }
          }],
          initialValue: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        })
      ]
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
    
    // Additional fields for professional enrollment system
    defineField({
      name: 'duration',
      title: 'Course Duration',
      type: 'string',
      description: 'e.g., "8 weeks", "3 months", "Flexible scheduling"',
      initialValue: 'Flexible scheduling',
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
    defineField({
      name: 'curriculum',
      title: 'Curriculum Overview',
      type: 'object',
      fields: [
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
          name: 'duration',
          title: 'Total Duration',
          type: 'string',
          initialValue: 'Flexible based on schedule',
        }),
      ],
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
  ],
})
