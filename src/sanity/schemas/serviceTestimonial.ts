import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'serviceTestimonial',
  title: 'Service Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'client',
      title: 'Client Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'role',
      title: 'Client Role',
      type: 'string',
      description: 'e.g., CEO, Project Manager, Director'
    }),
    defineField({
      name: 'company',
      title: 'Company Name',
      type: 'string'
    }),
    defineField({
      name: 'image',
      title: 'Client Image',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'testimonial',
      title: 'Testimonial Text',
      type: 'text',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'serviceCategory',
      title: 'Service Category',
      type: 'reference',
      to: [{ type: 'serviceCategory' }],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: Rule => Rule.required().min(1).max(5)
    }),
    defineField({
      name: 'projectHighlights',
      title: 'Project Highlights',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'featured',
      title: 'Featured Testimonial',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'date',
      title: 'Testimonial Date',
      type: 'date'
    })
  ],
  preview: {
    select: {
      title: 'client',
      subtitle: 'company',
      media: 'image'
    }
  }
})