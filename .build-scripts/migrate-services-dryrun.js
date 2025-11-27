// Import the compiled JS file name so Node ESM resolves correctly after tsc emits to .build-scripts
import { migrateServices, serviceCategories } from './migrate-services.js';
// Non-destructive mock client for dry-run: logs operations instead of performing network calls
const dryRunClient = {
    create: async (doc) => {
        const id = `dryrun-${(doc.slug && doc.slug.current) || doc.title.replace(/\s+/g, '-').toLowerCase()}`;
        console.log('DRYRUN create:', doc.title, '->', id);
        return { _id: id };
    },
    patch: () => ({ set: () => ({ commit: async () => ({ _id: 'dryrun-patch' }) }) }),
    transaction: () => ({ create: () => ({ commit: async () => ({}) }) }),
    set: () => ({ commit: async () => ({}) }),
    commit: async () => ({}),
    fetch: async () => serviceCategories,
    // other no-op methods
    createIfNotExists: async (d) => ({ _id: `dryrun-${d._id || 'x'}` }),
    createOrReplace: async (d) => ({ _id: `dryrun-${d._id || 'x'}` }),
    delete: async () => ({}),
    mutate: async () => ({}),
};
async function run() {
    console.log('Starting dry-run migration of', serviceCategories.length, 'services...');
    try {
        await migrateServices(dryRunClient);
        console.log('Dry-run completed successfully. No changes were made.');
    }
    catch (err) {
        console.error('Dry-run failed:', err);
        process.exitCode = 1;
    }
}
// If executed directly from Node CLI, run the dry-run.
if (process.argv && process.argv[1] && process.argv[1].endsWith('migrate-services-dryrun.js')) {
    run();
}
