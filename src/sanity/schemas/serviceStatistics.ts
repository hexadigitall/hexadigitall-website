import { defineField, defineType } from 'sanity'

/* eslint-disable @typescript-eslint/no-explicit-any */
export default defineType({
  name: 'serviceStatistics',
  title: 'Service Statistics',
  type: 'document',
  fields: [
    defineField({
      name: 'serviceCategory',
      title: 'Service Category',
      type: 'reference',
      to: [{ type: 'serviceCategory' }],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'projectsCompleted',
      title: 'Projects Completed',
      type: 'number'
    }),
    defineField({
      name: 'clientSatisfaction',
      title: 'Client Satisfaction Rate',
      type: 'number',
      validation: (Rule: any) => Rule.min(0).max(100)
    }),
    defineField({
      name: 'averageDeliveryTime',
      title: 'Average Delivery Time',
      type: 'string'
    }),
    defineField({
      name: 'teamSize',
      title: 'Team Size',
      type: 'number'
    }),
    defineField({
      name: 'performanceMetrics',
      title: 'Performance Metrics',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'successMetrics',
      title: 'Client Success Metrics',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'techStack',
      title: 'Technology Stack',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime'
    })
  ],
  preview: {
    select: {
      title: 'serviceCategory.title',
      subtitle: 'lastUpdated'
    }
  }
})