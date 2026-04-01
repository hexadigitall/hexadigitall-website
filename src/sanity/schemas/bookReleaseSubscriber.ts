import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'bookReleaseSubscriber',
  title: 'Book Release Subscriber',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'bookSlug',
      title: 'Book Slug',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bookTitle',
      title: 'Book Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Subscriber Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Notified', value: 'notified' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'createdAt',
      title: 'Subscribed At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'notifiedAt',
      title: 'Notified At',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'email',
      subtitle: 'bookTitle',
      status: 'status',
    },
    prepare(selection) {
      const { title, subtitle, status } = selection
      return {
        title,
        subtitle: `${subtitle} · ${status ?? 'pending'}`,
      }
    },
  },
})
