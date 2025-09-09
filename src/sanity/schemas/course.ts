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
          { title: 'Live Mentoring (Priced per hour)', value: 'live' },
        ],
        layout: 'radio',
      },
      initialValue: 'self-paced',
    }),
    defineField({
      name: 'price',
      title: 'Price (NGN) - for Self-Paced',
      type: 'number',
      description: "The total one-time fee for a self-paced course.",
      hidden: ({ parent }) => parent?.courseType !== 'self-paced',
    }),
    defineField({
      name: 'hourlyRate',
      title: 'Hourly Rate (NGN) - for Live Mentoring',
      type: 'number',
      description: "The price per hour for one-on-one or group classes.",
      hidden: ({ parent }) => parent?.courseType !== 'live',
    }),
    defineField({ name: 'body', title: 'Full Description', type: 'array', of: [{type: 'block'}] }),
    defineField({ name: 'mainImage', title: 'Course Image', type: 'image', options: { hotspot: true } }),
    
    // Additional fields for professional enrollment system
    defineField({
      name: 'duration',
      title: 'Course Duration',
      type: 'string',
      description: 'e.g., "8 weeks", "3 months", "Self-paced"',
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
      title: 'Maximum Students',
      type: 'number',
      description: 'Maximum number of students (leave empty for unlimited)',
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
          initialValue: '8 weeks',
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
        'Lifetime access to course materials',
        'Certificate of completion',
        'Direct access to instructor',
        'Downloadable resources',
        'Mobile and desktop access',
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
  ],
})
