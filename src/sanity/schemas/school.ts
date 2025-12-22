import {defineField, defineType} from 'sanity'
export default defineType({
  name: 'school',
  title: 'School',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this school appears (lower numbers first)',
    }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Icon name for this school (e.g. code, chart, settings, network, default)',
      initialValue: 'default',
      validation: Rule => Rule.required(),
    }),
  ],
})
