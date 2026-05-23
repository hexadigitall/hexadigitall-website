import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'author',
  title: 'Author Identity Registry',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Penname Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Identifier Key',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'biography',
      title: 'Biographical Matrix',
      type: 'text',
    }),
  ],
});
