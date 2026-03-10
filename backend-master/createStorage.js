const fs = require('fs');
const path = require('path');

/**
 * Checks if a given path exists in the root folder, and creates it if not.
 * @param {string} targetPath - Relative path to check or create.
 */
function ensurePathExists(targetPath) {
  try {
    // Resolve the path relative to the root folder
    const absolutePath = path.resolve(process.cwd(), targetPath);

    // Check if the path exists
    if (!fs.existsSync(absolutePath)) {
      // Create the path recursively if it doesn't exist
      fs.mkdirSync(absolutePath, { recursive: true });
      console.log(`Path created: ${absolutePath}`);
    } else {
      console.log(`Path already exists: ${absolutePath}`);
    }
  } catch (error) {
    console.error(`Error ensuring path exists: ${error.message}`);
  }
}


ensurePathExists('uploads');
const folders = [ 
  "uploads/banners",
  "uploads/categories",
  "uploads/default",
  "uploads/features",
  "uploads/offers",
  "uploads/productbrands",
  "uploads/products",
  "uploads/profile_imgs",
  "uploads/reviews",
  "uploads/static_files",
  "uploads/staticpage",
  "uploads/stories",
  "uploads/subcategories",
  "uploads/supersubcategories",
]
for (const folder of folders) {
  ensurePathExists(folder)
}