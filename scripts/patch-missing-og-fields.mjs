import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_UPDATE_TOKEN,
  useCdn: false,
  apiVersion: '2023-12-30',
});

function defaultOgTitle(cat, pkg) {
  return pkg ? `${pkg.name} | ${cat.title} | Hexadigitall` : `${cat.title} | Hexadigitall`;
}
function defaultOgDescription(cat, pkg) {
  return pkg
    ? `Explore the ${pkg.name} package in ${cat.title} from Hexadigitall. Professional, fast, and tailored for your needs.`
    : `Explore ${cat.title} services from Hexadigitall. Professional, fast, and tailored for your needs.`;
}

async function patchMissingOgFields() {
  const categories = await client.fetch(`*[_type == "serviceCategory"]{
    _id,
    title,
    ogImage { asset->{url} },
    packages[]{
      _key,
      name,
      ogImage { asset->{url} },
      ogTitle,
      ogDescription
    }
  }`);

  let totalPatched = 0;

  for (const cat of categories) {
    if (Array.isArray(cat.packages)) {
      for (const pkg of cat.packages) {
        if (!pkg.ogTitle || !pkg.ogDescription) {
          const ogTitle = pkg.ogTitle || defaultOgTitle(cat, pkg);
          const ogDescription = pkg.ogDescription || defaultOgDescription(cat, pkg);
          try {
            await client.patch(cat._id)
              .set({
                [`packages[_key==\"${pkg._key}\"].ogTitle`]: ogTitle,
                [`packages[_key==\"${pkg._key}\"].ogDescription`]: ogDescription
              })
              .commit();
            console.log(`Patched [${cat.title}] > [${pkg.name}] with ogTitle/ogDescription.`);
            totalPatched++;
          } catch (err) {
            console.error(`Failed to patch [${cat.title}] > [${pkg.name}]:`, err.message);
          }
        }
      }
    }
  }
  if (totalPatched === 0) {
    console.log('No missing ogTitle/ogDescription fields needed patching.');
  } else {
    console.log(`Patched ${totalPatched} package(s) with missing ogTitle/ogDescription.`);
  }
}

patchMissingOgFields().catch(console.error);
