// sanity/schemas/testimonial.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorCompany',
      title: 'Author Company / Title',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'quote',
      subtitle: 'authorName',
    },
  },
})