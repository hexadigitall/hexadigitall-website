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
    defineField({
      name: 'courseType',
      title: 'Course Type',
      type: 'string',
      options: {
        list: [
          { title: 'Self-Paced (One-time fee)', value: 'self-paced' },
          { title: 'Live Mentoring (Priced per hour)', value: 'live' },
        ],
        layout: 'radio',
      },
      initialValue: 'self-paced',
    }),
    defineField({
      name: 'price',
      title: 'Price (NGN) - for Self-Paced',
      type: 'number',
      description: "The total one-time fee for a self-paced course.",
      hidden: ({ parent }) => parent?.courseType !== 'self-paced',
    }),
    defineField({
      name: 'hourlyRate',
      title: 'Hourly Rate (NGN) - for Live Mentoring',
      type: 'number',
      description: "The price per hour for one-on-one or group classes.",
      hidden: ({ parent }) => parent?.courseType !== 'live',
    }),
    defineField({ name: 'body', title: 'Full Description', type: 'array', of: [{type: 'block'}] }),
    defineField({ name: 'mainImage', title: 'Course Image', type: 'image', options: { hotspot: true } }),
  ],
})