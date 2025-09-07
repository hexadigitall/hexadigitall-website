// sanity/schemas/service.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'overview',
      title: 'Service Overview',
      type: 'text',
      description: 'A short description for the main services page.',
    }),
    defineField({
      name: 'mainContent',
      title: 'Main Content',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Detailed description for the individual service page.'
    }),
  ],
})