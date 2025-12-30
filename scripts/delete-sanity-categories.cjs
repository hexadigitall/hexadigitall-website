// Delete all courseCategory documents from Sanity (ESM)
import { writeClient } from '../src/sanity/client.ts';

async function deleteAllCategories() {
  const categories = await writeClient.fetch('*[_type == "courseCategory"]{_id, title}');
  if (!categories.length) {
    console.log('No course categories found.');
    return;
  }
  for (const cat of categories) {
    try {
      await writeClient.delete(cat._id);
      console.log(`Deleted category: ${cat.title} (${cat._id})`);
    } catch (err) {
      console.error(`Failed to delete category ${cat.title}:`, err.message);
    }
  }
  console.log('All course categories deleted.');
}

deleteAllCategories();
