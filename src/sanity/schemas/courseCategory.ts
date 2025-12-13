// sanity/schemas/courseCategory.ts
import {defineField, defineType} from 'sanity'
export default defineType({
  name: 'courseCategory',
  title: 'Course Category',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this category appears (lower numbers first)',
    }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
  ],
})