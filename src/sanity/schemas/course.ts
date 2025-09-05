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
    defineField({ name: 'body', title: 'Full Description', type: 'array', of: [{type: 'block'}] }),
    defineField({ name: 'price', title: 'Price (NGN)', type: 'number' }),
    defineField({ name: 'mainImage', title: 'Course Image', type: 'image', options: { hotspot: true } }),
  ],
})