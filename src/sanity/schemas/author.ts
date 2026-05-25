import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'author',
  title: 'Author Identity Node',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Penname Identity Name',
      type: 'string',
      validation: (Rule) => Rule.required().error('An explicit author identity is required.'),
    }),
    defineField({
      name: 'slug',
      title: 'Identity Route Key',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'biography',
      title: 'Biographical Matrix Summary',
      type: 'text',
      rows: 4,
    }),
  ],
});
