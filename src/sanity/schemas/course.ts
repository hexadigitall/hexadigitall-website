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

    // Enhanced Monthly Billing Scheduling Options
    defineField({
      name: 'monthlyScheduling',
      title: 'Monthly Billing & Scheduling Options',
      type: 'object',
      hidden: ({ parent }) => parent?.courseType !== 'live',
      description: 'Configure flexible monthly billing with session customization',
      fields: [
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
        
        // Session Matrix Configuration
        defineField({
          name: 'sessionMatrix',
          title: 'Session Customization Matrix',
          type: 'object',
          description: 'Allow students to customize sessions per week and hours per session',
          fields: [
            defineField({
              name: 'sessionsPerWeek',
              title: 'Sessions per Week Options',
              type: 'object',
              fields: [
                defineField({
                  name: 'min',
                  title: 'Minimum Sessions per Week',
                  type: 'number',
                  initialValue: 1,
                  validation: (Rule) => Rule.required().min(1).max(7)
                }),
                defineField({
                  name: 'max',
                  title: 'Maximum Sessions per Week', 
                  type: 'number',
                  initialValue: 4,
                  validation: (Rule) => Rule.required().min(1).max(7)
                }),
                defineField({
                  name: 'default',
                  title: 'Default Sessions per Week',
                  type: 'number',
                  initialValue: 1,
                  validation: (Rule) => Rule.required().min(1).max(7)
                })
              ]
            }),
            defineField({
              name: 'hoursPerSession',
              title: 'Hours per Session Options',
              type: 'object',
              fields: [
                defineField({
                  name: 'min',
                  title: 'Minimum Hours per Session',
                  type: 'number',
                  initialValue: 1,
                  validation: (Rule) => Rule.required().min(1).max(4)
                }),
                defineField({
                  name: 'max',
                  title: 'Maximum Hours per Session',
                  type: 'number',
                  initialValue: 3,
                  validation: (Rule) => Rule.required().min(1).max(4)
                }),
                defineField({
                  name: 'default',
                  title: 'Default Hours per Session',
                  type: 'number',
                  initialValue: 1,
                  validation: (Rule) => Rule.required().min(1).max(4)
                })
              ]
            }),
            defineField({
              name: 'totalHoursLimit',
              title: 'Maximum Total Hours per Week',
              type: 'number',
              description: 'Prevent students from selecting unrealistic schedules',
              initialValue: 12,
              validation: (Rule) => Rule.required().min(4).max(20)
            })
          ]
        }),
        
        // Professional scheduling constraints
        defineField({
          name: 'availabilityWindow',
          title: 'Instructor Availability',
          type: 'object',
          fields: [
            defineField({
              name: 'daysOfWeek',
              title: 'Available Days',
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
              initialValue: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
              description: 'Days when instructor is available for sessions'
            }),
            defineField({
              name: 'timeSlots',
              title: 'Available Time Slots',
              type: 'array',
              of: [{
                type: 'string',
                options: {
                  list: [
                    { title: 'Morning (9AM - 12PM)', value: 'morning' },
                    { title: 'Afternoon (1PM - 5PM)', value: 'afternoon' },
                    { title: 'Evening (6PM - 9PM)', value: 'evening' },
                    { title: 'Weekend (10AM - 4PM)', value: 'weekend' }
                  ]
                }
              }],
              initialValue: ['morning', 'afternoon', 'evening'],
              description: 'Time slots when sessions can be scheduled'
            })
          ]
        }),
        
        // Pricing structure for different session formats
        defineField({
          name: 'sessionPricing',
          title: 'Session Format Pricing',
          type: 'object',
          description: 'Different rates for different session formats',
          fields: [
            defineField({
              name: 'oneOnOneMultiplier',
              title: 'One-on-One Rate Multiplier',
              type: 'number',
              initialValue: 1.0,
              validation: (Rule) => Rule.required().min(0.5).max(3.0),
              description: 'Multiply base rate by this for 1-on-1 sessions (1.0 = no change)'
            }),
            defineField({
              name: 'smallGroupMultiplier',
              title: 'Small Group Rate Multiplier (2-4 students)',
              type: 'number',
              initialValue: 0.7,
              validation: (Rule) => Rule.required().min(0.3).max(1.0),
              description: 'Multiply base rate by this for small groups (0.7 = 30% discount)'
            }),
            defineField({
              name: 'largeGroupMultiplier',
              title: 'Large Group Rate Multiplier (5-8 students)',
              type: 'number',
              initialValue: 0.5,
              validation: (Rule) => Rule.required().min(0.2).max(1.0),
              description: 'Multiply base rate by this for large groups (0.5 = 50% discount)'
            })
          ]
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
    
    // Professional Duration Guidelines
    defineField({
      name: 'recommendedDuration',
      title: 'Recommended Course Duration',
      type: 'object',
      description: 'Professional duration recommendations based on course complexity',
      fields: [
        defineField({
          name: 'weeks',
          title: 'Duration in Weeks',
          type: 'number',
          description: 'Professional recommendation: Beginner (4-8 weeks), Intermediate (8-12 weeks), Advanced (12-16 weeks), Certification (16-24 weeks)',
          validation: (Rule) => Rule.required().min(4).max(24),
          initialValue: 8
        }),
        defineField({
          name: 'hoursPerWeek',
          title: 'Recommended Hours per Week',
          type: 'number',
          description: 'Default recommendation for course completion',
          validation: (Rule) => Rule.required().min(1).max(10),
          initialValue: 2
        }),
        defineField({
          name: 'totalHours',
          title: 'Total Course Hours',
          type: 'number',
          description: 'Automatically calculated: weeks × hours per week',
          readOnly: true,
          validation: (Rule) => Rule.custom((totalHours, context) => {
            const parent = context.parent as Record<string, unknown>;
            const weeks = (parent?.weeks as number) || 0;
            const hoursPerWeek = (parent?.hoursPerWeek as number) || 0;
            const calculated = weeks * hoursPerWeek;
            return calculated > 0 ? true : 'Total hours must be greater than 0';
          })
        }),
        defineField({
          name: 'flexibility',
          title: 'Schedule Flexibility',
          type: 'string',
          options: {
            list: [
              { title: 'Fixed Schedule (instructor-led cohorts)', value: 'fixed' },
              { title: 'Flexible Schedule (student choice)', value: 'flexible' },
              { title: 'Semi-Flexible (some fixed milestones)', value: 'semi-flexible' }
            ]
          },
          initialValue: 'flexible'
        })
      ]
    }),
    
    // Legacy duration field (for display compatibility)
    defineField({
      name: 'duration',
      title: 'Duration Display Text',
      type: 'string',
      description: 'Display text for course duration (auto-generated from recommendedDuration)',
      readOnly: true,
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
