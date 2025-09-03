// sanity/schemas/project.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project / Case Study',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Project Title / Client Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'industry',
      title: 'Client Industry',
      type: 'string',
    }),
    defineField({
      name: 'projectGoal',
      title: 'Project Goal / The Challenge',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'solution',
      title: 'Our Solution',
      description: 'The services provided by Hexadigitall.',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'results',
      title: 'Results & Impact',
      description: 'Quantifiable metrics and outcomes.',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'testimonial',
      title: 'Client Testimonial',
      type: 'text',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Project Image',
      type: 'image',
      options: {
        hotspot: true, // Enables better image cropping
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'industry',
      media: 'mainImage',
    },
  },
})