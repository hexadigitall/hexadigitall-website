import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'simScenario',
  title: 'Simulation Scenario',
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
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'yamlContent',
      title: 'YAML Scenario Definition',
      type: 'text',
      description: 'Full scenario YAML. See docs/SCENARIO_FORMAT.md for structure.',
      rows: 30,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
})
