// sanity/schemas/faq.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'array',
      of: [{type: 'block'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
        name: 'category',
        title: 'Category',
        type: 'string',
        options: {
            list: [
                {title: 'General', value: 'general'},
                {title: 'Services', value: 'services'},
                {title: 'Pricing', value: 'pricing'},
                {title: 'Process', value: 'process'},
            ],
            layout: 'radio'
        }
    })
  ],
  preview: {
    select: {
        title: 'question'
    }
  }
})