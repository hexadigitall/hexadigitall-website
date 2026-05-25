import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'publicationAccessLedger',
  title: 'Publication Access Ledger',
  type: 'document',
  fields: [
    defineField({
      name: 'customerIdentityHash',
      title: 'Customer Email / Identity',
      type: 'string',
    }),
    defineField({
      name: 'purchasedPublicationReference',
      title: 'Purchased Publication',
      type: 'reference',
      to: [{ type: 'publication' }, { type: 'book' }],
    }),
    defineField({
      name: 'grantedSystemTimestamp',
      title: 'Granted Timestamp',
      type: 'datetime',
    }),
    defineField({
      name: 'operationalLedgerState',
      title: 'Ledger State',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Revoked', value: 'revoked' },
          { title: 'Refunded', value: 'refunded' },
        ],
      },
      initialValue: 'active',
    }),
  ],
});
