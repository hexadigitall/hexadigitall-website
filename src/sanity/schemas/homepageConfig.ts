import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'homepageConfig',
  title: 'Homepage Configuration',
  type: 'document',
  fields: [
    defineField({
      name: 'userId',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'template',
      title: 'Active Template',
      type: 'string',
      options: {
        list: [
          { title: 'I\'m Here to Learn', value: 'learner' },
          { title: 'I Want to Build Something', value: 'builder' },
          { title: 'Grow My Business', value: 'grow' },
          { title: 'Planning a Business', value: 'planner' },
          { title: 'I\'m Here to Read', value: 'reader' },
          { title: 'I Need Guidance', value: 'mentee' },
          { title: 'Design & Branding', value: 'designer' },
          { title: 'Shop & Download', value: 'shopper' },
          { title: 'Track My Journey', value: 'student' },
          { title: 'I\'m an Educator', value: 'educator' },
          { title: 'Just Exploring', value: 'explorer' },
          { title: 'Mix & Match', value: 'custom' },
        ],
      },
      initialValue: 'explorer',
    }),
    defineField({
      name: 'version',
      title: 'Template Version',
      type: 'number',
      initialValue: 1,
    }),
    defineField({
      name: 'widgets',
      title: 'Widgets',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'widget',
          fields: [
            defineField({
              name: 'widgetId',
              title: 'Widget ID',
              type: 'string',
            }),
            defineField({
              name: 'type',
              title: 'Widget Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Tracked Courses', value: 'tracked-courses' },
                  { title: 'Services', value: 'services' },
                  { title: 'Mentorships', value: 'mentorships' },
                  { title: 'Textbooks', value: 'textbooks' },
                  { title: 'Custom Build', value: 'custom-build' },
                  { title: 'Payments', value: 'payments' },
                  { title: 'Enrollments', value: 'enrollments' },
                  { title: 'Recent Activity', value: 'recent-activity' },
                  { title: 'Quick Actions', value: 'quick-actions' },
                  { title: 'Labs', value: 'labs' },
                  { title: 'Portfolio', value: 'portfolio' },
                  { title: 'Blog', value: 'blog' },
                  { title: 'Plans & Proposals', value: 'plans-proposals' },
                ],
              },
            }),
            defineField({
              name: 'title',
              title: 'Custom Title',
              type: 'string',
            }),
            defineField({
              name: 'config',
              title: 'Configuration',
              type: 'object',
              fields: [
                defineField({
                  name: 'items',
                  title: 'Items',
                  type: 'array',
                  of: [{ type: 'string' }],
                  description: 'User-curated references (course slugs, service IDs, etc.)',
                }),
              ],
            }),
            defineField({
              name: 'visible',
              title: 'Visible',
              type: 'boolean',
              initialValue: true,
            }),
            defineField({
              name: 'position',
              title: 'Position',
              type: 'object',
              fields: [
                defineField({ name: 'section', title: 'Section', type: 'number' }),
                defineField({ name: 'order', title: 'Order', type: 'number' }),
              ],
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'userId.name',
      subtitle: 'template',
    },
  },
})
