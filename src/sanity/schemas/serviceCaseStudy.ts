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
    // Client Details - Flattened
    defineField({
      name: 'clientName',
      title: 'Client Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'clientIndustry',
      title: 'Client Industry',
      type: 'string'
    }),
    defineField({
      name: 'clientSize',
      title: 'Company Size',
      type: 'string'
    }),
    defineField({
      name: 'challenge',
      title: 'Client Challenge',
      type: 'text',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'solution',
      title: 'Our Solution',
      type: 'array',
      of: [{ type: 'block' }],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'resultMetrics',
      title: 'Results & Impact',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies Used',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'startDate',
      title: 'Project Start Date',
      type: 'date'
    }),
    defineField({
      name: 'endDate',
      title: 'Project End Date',
      type: 'date'
    }),
    defineField({
      name: 'duration',
      title: 'Project Duration',
      type: 'string'
    }),
    defineField({
      name: 'images',
      title: 'Case Study Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }]
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
      subtitle: 'clientName'
    }
  }
})