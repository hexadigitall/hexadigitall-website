import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'curriculum',
  title: 'Curriculum',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'course',
      title: 'Linked Course',
      type: 'reference',
      to: [{ type: 'course' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'heroSummary',
      title: 'Hero Summary',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'heroTags',
      title: 'Hero Tags',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
    }),
    defineField({
      name: 'level',
      title: 'Level',
      type: 'string',
    }),
    defineField({
      name: 'studyTime',
      title: 'Study Time',
      type: 'string',
    }),
    defineField({
      name: 'schoolName',
      title: 'School Name',
      type: 'string',
    }),
    defineField({
      name: 'welcomeTitle',
      title: 'Welcome Heading',
      type: 'string',
    }),
    defineField({
      name: 'welcomeMessages',
      title: 'Welcome Paragraphs',
      type: 'array',
      of: [defineArrayMember({ type: 'text' })],
    }),
    defineField({
      name: 'prerequisites',
      title: 'Prerequisites',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'complementaryCourses',
      title: 'Complementary Courses',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', type: 'text', rows: 2 }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
          },
        }),
      ],
    }),
    defineField({
      name: 'essentialResources',
      title: 'Essential Resources',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'learningRoadmap',
      title: 'Learning Roadmap',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'weeks',
      title: 'Weekly Curriculum',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'weekNumber', title: 'Week Number', type: 'number', validation: (Rule) => Rule.required().min(1) }),
            defineField({ name: 'duration', title: 'Duration', type: 'string' }),
            defineField({ name: 'topic', title: 'Topic', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'outcomes',
              title: 'Learning Outcomes',
              type: 'array',
              of: [defineArrayMember({ type: 'string' })],
            }),
            defineField({ name: 'labTitle', title: 'Lab Title', type: 'string' }),
            defineField({
              name: 'labItems',
              title: 'Lab Items',
              type: 'array',
              of: [defineArrayMember({ type: 'string' })],
            }),
          ],
          preview: {
            select: { title: 'topic', subtitle: 'weekNumber' },
            prepare(selection) {
              return {
                title: selection.title,
                subtitle: `Week ${selection.subtitle || ''}`,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'capstoneProjects',
      title: 'Capstone Projects',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', type: 'text', rows: 2 }),
            defineField({
              name: 'deliverables',
              title: 'Deliverables',
              type: 'array',
              of: [defineArrayMember({ type: 'string' })],
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
          },
        }),
      ],
    }),
    defineField({
      name: 'sourceHtmlFile',
      title: 'Source HTML File',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'importedAt',
      title: 'Imported At',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      courseTitle: 'course.title',
      subtitle: 'duration',
    },
    prepare(selection) {
      return {
        title: selection.title,
        subtitle: [selection.courseTitle, selection.subtitle].filter(Boolean).join(' • '),
      }
    },
  },
})
