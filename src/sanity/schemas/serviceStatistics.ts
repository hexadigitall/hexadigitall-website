import { defineField, defineType } from 'sanity'

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
      name: 'metrics',
      title: 'Key Metrics',
      type: 'object',
      fields: [
        { 
          name: 'projectsCompleted',
          title: 'Projects Completed',
          type: 'number'
        },
        {
          name: 'clientSatisfaction',
          title: 'Client Satisfaction Rate',
          type: 'number',
          validation: Rule => Rule.min(0).max(100)
        },
        {
          name: 'averageDeliveryTime',
          title: 'Average Delivery Time',
          type: 'string'
        },
        {
          name: 'teamSize',
          title: 'Team Size',
          type: 'number'
        }
      ]
    }),
    defineField({
      name: 'performance',
      title: 'Performance Metrics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'metric', title: 'Metric Name', type: 'string' },
            { name: 'value', title: 'Value', type: 'string' },
            { name: 'change', title: 'Change (%)', type: 'number' },
            { name: 'period', title: 'Time Period', type: 'string' }
          ]
        }
      ]
    }),
    defineField({
      name: 'clientMetrics',
      title: 'Client Success Metrics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'metric', title: 'Metric', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
            { name: 'value', title: 'Average Value', type: 'string' },
            { name: 'benchmark', title: 'Industry Benchmark', type: 'string' }
          ]
        }
      ]
    }),
    defineField({
      name: 'techStack',
      title: 'Technology Stack',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Technology Name', type: 'string' },
            { name: 'category', title: 'Category', type: 'string' },
            { name: 'expertise', title: 'Expertise Level', type: 'number' },
            { name: 'projectCount', title: 'Projects Using This', type: 'number' }
          ]
        }
      ]
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