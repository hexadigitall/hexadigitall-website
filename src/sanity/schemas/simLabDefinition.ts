import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'simLabDefinition',
  title: 'Simulation Lab Definition',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Lab Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'course',
      title: 'Associated Course',
      type: 'reference',
      to: [{ type: 'course' }],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulty',
      type: 'string',
      options: {
        list: [
          { title: 'Beginner', value: 'beginner' },
          { title: 'Intermediate', value: 'intermediate' },
          { title: 'Advanced', value: 'advanced' },
        ],
      },
      initialValue: 'intermediate',
    }),
    defineField({
      name: 'durationMinutes',
      title: 'Max Duration (minutes)',
      type: 'number',
      initialValue: 120,
    }),
    defineField({
      name: 'seedTopology',
      title: 'Seed Topology (YAML)',
      type: 'text',
      description: 'Device tree definition in YAML format. See schema docs for structure.',
      rows: 20,
    }),
    defineField({
      name: 'scenario',
      title: 'Scenario (optional)',
      type: 'reference',
      to: [{ type: 'simScenario' }],
      description: 'Attach a security/injection scenario that triggers at specific ticks.',
    }),
    defineField({
      name: 'instructions',
      title: 'Lab Instructions',
      type: 'markdown',
      description: 'Step-by-step instructions for the student. Supports Markdown.',
    }),
    defineField({
      name: 'gradingHints',
      title: 'Grading Hints',
      type: 'array',
      of: [{ type: 'simGradingHint' }],
      description: 'Expected state assertions used for auto-grading.',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'difficulty',
      media: 'course',
    },
  },
})
