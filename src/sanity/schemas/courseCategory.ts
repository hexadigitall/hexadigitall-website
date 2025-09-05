// sanity/schemas/courseCategory.ts
import {defineField, defineType} from 'sanity'
export default defineType({
  name: 'courseCategory',
  title: 'Course Category',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
  ],
})