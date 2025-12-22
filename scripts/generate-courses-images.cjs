// generate-courses-images.cjs
// Generate OG images for each course using downloaded images and overlaying course info
// Usage: node scripts/generate-courses-images.cjs

const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const INPUT_DIR = path.join(__dirname, '../public/course-images');
const OUTPUT_DIR = path.join(__dirname, '../public/og-images');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Define the courses (copy from schools-course-reorg.js or import if modularized)
const schoolsStructure = require('./schools-structure.cjs'); // You may need to export this structure

function getCourseList() {
  const courses = [];
  for (const [school, schoolData] of Object.entries(schoolsStructure)) {
    for (const course of schoolData.courses) {
      courses.push(course);
    }
  }
  return courses;
}

async function generateOGImage(course) {
  const filename = `${course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jpg`;
  const imagePath = path.join(INPUT_DIR, filename);
  const outputPath = path.join(OUTPUT_DIR, `course-${filename}`);
  if (!fs.existsSync(imagePath)) {
    console.log(`   ✗ Image not found for: ${course.title}`);
    return;
  }
  const width = 1200, height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const image = await loadImage(imagePath);
  ctx.drawImage(image, 0, 0, width, height);
  // Overlay course title
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, height - 120, width, 120);
  ctx.font = 'bold 48px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText(course.title, 60, height - 60);
  // Overlay price if available
  if (course.price) {
    ctx.font = 'bold 32px Arial';
    ctx.fillText(`₦${course.price.toLocaleString()}`, width - 320, height - 60);
  }
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(outputPath, buffer);
  console.log(`   ✓ OG image generated: ${outputPath}`);
}

async function generateAllOGImages() {
  const courses = getCourseList();
  for (const course of courses) {
    await generateOGImage(course);
  }
  console.log('✅ All OG images generated!');
}

generateAllOGImages().catch(console.error);
