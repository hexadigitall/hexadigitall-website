import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'serviceCaseStudy',
  title: 'Service Case Study',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Case Study Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 100
      },
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
      name: 'client',
      title: 'Client Details',
      type: 'object',
      fields: [
        { name: 'name', title: 'Client Name', type: 'string' },
        { name: 'industry', title: 'Industry', type: 'string' },
        { name: 'size', title: 'Company Size', type: 'string' }
      ]
    }),
    defineField({
      name: 'challenge',
      title: 'Client Challenge',
      type: 'text',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'solution',
      title: 'Our Solution',
      type: 'array',
      of: [{ type: 'block' }],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'results',
      title: 'Results & Impact',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'metric', title: 'Metric', type: 'string' },
            { name: 'value', title: 'Value', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' }
          ]
        }
      ]
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies Used',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'timeline',
      title: 'Project Timeline',
      type: 'object',
      fields: [
        { name: 'start', title: 'Start Date', type: 'date' },
        { name: 'end', title: 'End Date', type: 'date' },
        { name: 'duration', title: 'Duration', type: 'string' }
      ]
    }),
    defineField({
      name: 'images',
      title: 'Case Study Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'caption', title: 'Caption', type: 'string' },
            { name: 'alt', title: 'Alt Text', type: 'string' }
          ]
        }
      ]
    }),
    defineField({
      name: 'featured',
      title: 'Featured Case Study',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'testimonial',
      title: 'Related Testimonial',
      type: 'reference',
      to: [{ type: 'serviceTestimonial' }]
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'client.name'
    }
  }
})