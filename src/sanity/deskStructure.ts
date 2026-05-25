import type { StructureResolver } from 'sanity/structure'

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Textbooks')
        .child(
          S.list()
            .title('Textbooks')
            .items([
              S.listItem()
                .title('All Textbooks')
                .child(S.documentTypeList('book').title('All Textbooks')),
              S.listItem()
                .title('Coming Soon')
                .child(
                  S.documentList()
                    .title('Coming Soon Textbooks')
                    .filter('_type == "book" && status == "coming_soon"')
                ),
              S.listItem()
                .title('Available')
                .child(
                  S.documentList()
                    .title('Available Textbooks')
                    .filter('_type == "book" && status == "available"')
                ),
              S.listItem()
                .title('Launch Checklist: Missing Sales Links')
                .child(
                  S.documentList()
                    .title('Available Books Missing Sales Links')
                    .filter('_type == "book" && status == "available" && (!defined(salesLinks) || count(salesLinks) == 0)')
                ),
            ])
        ),
      S.listItem()
        .title('Release Notification Subscribers')
        .child(
          S.list()
            .title('Release Notification Subscribers')
            .items([
              S.listItem()
                .title('All Subscribers')
                .child(S.documentTypeList('bookReleaseSubscriber').title('All Subscribers')),
              S.listItem()
                .title('Pending Notification')
                .child(
                  S.documentList()
                    .title('Pending Notification')
                    .filter('_type == "bookReleaseSubscriber" && status == "pending"')
                ),
              S.listItem()
                .title('Already Notified')
                .child(
                  S.documentList()
                    .title('Already Notified')
                    .filter('_type == "bookReleaseSubscriber" && status == "notified"')
                ),
            ])
        ),
      S.listItem()
        .title('Digital Publishing (FVMMD)')
        .child(
          S.list()
            .title('Digital Publishing')
            .items([
              S.listItem()
                .title('Publications')
                .child(S.documentTypeList('publication').title('Publications')),
              S.listItem()
                .title('Resource Matrices')
                .child(S.documentTypeList('resourceMatrix').title('Resource Matrices')),
              S.listItem()
                .title('Authors')
                .child(S.documentTypeList('author').title('Authors')),
              S.listItem()
                .title('Access Ledgers')
                .child(S.documentTypeList('publicationAccessLedger').title('Access Ledgers')),
            ])
        ),
      ...S.documentTypeListItems().filter(
        (listItem) => !['book', 'bookReleaseSubscriber', 'publication', 'resourceMatrix', 'author', 'publicationAccessLedger'].includes(listItem.getId() ?? '')
      ),
    ])
