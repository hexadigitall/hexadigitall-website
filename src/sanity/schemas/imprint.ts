import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'imprint',
  title: 'Digital Imprint',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Book Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'isbn',
      title: 'ISBN',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Synopsis',
      type: 'text',
    }),
    defineField({
      name: 'price',
      title: 'Price (NGN)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'allowCopyRegistration',
      title: 'Allow Readers to Register Physical Copies',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'assets',
      title: 'Companion Digital Assets',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'resourceMatrix' }] }],
    }),
  ],
});
