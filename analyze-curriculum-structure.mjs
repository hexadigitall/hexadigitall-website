import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const curriculumDir = path.join(__dirname, 'public', 'curriculums');

const REQUIRED_SECTIONS = [
  { name: 'Brand Bar', patterns: ['class="brand-bar"'] },
  { name: 'Course Snapshot', patterns: ['class="course-hero"'] },
  { name: 'Header & Meta', patterns: ['class="header".*class="course-meta"|class="course-meta".*class="header"', 'School'] },
  { name: 'Welcome Section', patterns: ['class="welcome-section"', 'Welcome to'] },
  { name: 'Prerequisites', patterns: ['Prerequisites', 'What You Should Know'] },
  { name: 'Recommended Complementary Courses', patterns: ['Recommended Complementary Courses'] },
  { name: 'Essential Learning Resources', patterns: ['Essential Learning Resources'] },
  { name: 'Your Learning Roadmap', patterns: ['Your Learning Roadmap'] },
  { name: 'Detailed Weekly Curriculum', patterns: ['Detailed Weekly Curriculum', 'Weekly'] },
  { name: 'Capstone Projects', patterns: ['Capstone Projects', 'Major Projects'] },
  { name: 'Study Tips for Success', patterns: ['Study Tips for Success'] },
  { name: 'About Section', patterns: ['About the', 'About This Course', 'class="about"'] },
  { name: 'Footer', patterns: ['class="footer"'] }
];

function checkSection(content, section) {
  return section.patterns.some(pattern => {
    const regex = new RegExp(pattern, 'i');
    return regex.test(content);
  });
}

function analyzeFile(filePath, fileName) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const missing = [];
    const present = [];

    REQUIRED_SECTIONS.forEach(section => {
      if (checkSection(content, section)) {
        present.push(section.name);
      } else {
        missing.push(section.name);
      }
    });

    return {
      fileName,
      present,
      missing,
      missingCount: missing.length,
      totalPresent: present.length
    };
  } catch (error) {
    return {
      fileName,
      error: error.message,
      present: [],
      missing: [],
      missingCount: -1,
      totalPresent: 0
    };
  }
}

function main() {
  try {
    const files = fs.readdirSync(curriculumDir).filter(f => f.endsWith('.html'));
    console.log(`Found ${files.length} HTML curriculum files\n`);

    const results = files.map(f => analyzeFile(path.join(curriculumDir, f), f));
    
    // Group by missing count
    const grouped = {};
    results.forEach(result => {
      const key = `${result.missingCount}_sections`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(result);
    });

    // Generate report
    console.log('='.repeat(100));
    console.log('CURRICULUM STRUCTURE ANALYSIS REPORT');
    console.log('='.repeat(100));
    console.log(`\nTotal Curriculum Files: ${files.length}`);
    console.log(`Complete Files (0 missing): ${(results.filter(r => r.missingCount === 0).length)}`);
    console.log(`Incomplete Files: ${(results.filter(r => r.missingCount > 0).length)}\n`);

    // Sort by missing count
    const sortedKeys = Object.keys(grouped).sort((a, b) => {
      const numA = parseInt(a);
      const numB = parseInt(b);
      return numA - numB;
    });

    sortedKeys.forEach(key => {
      const num = parseInt(key);
      const fileList = grouped[key];
      
      if (num === 0) {
        console.log(`\n${'='.repeat(100)}`);
        console.log(`✓ COMPLETE FILES (All 13 sections present): ${fileList.length} files`);
        console.log(`${'='.repeat(100)}`);
        fileList.forEach(f => {
          console.log(`  ✓ ${f.fileName}`);
        });
      } else {
        console.log(`\n${'='.repeat(100)}`);
        console.log(`✗ MISSING ${num} SECTION${num === 1 ? '' : 'S'}: ${fileList.length} files`);
        console.log(`${'='.repeat(100)}`);
        fileList.forEach(f => {
          console.log(`\n  File: ${f.fileName}`);
          console.log(`  Missing (${f.missing.length}):`);
          f.missing.forEach(m => console.log(`    - ${m}`));
        });
      }
    });

    // Summary table
    console.log(`\n${'='.repeat(100)}`);
    console.log('SUMMARY BY MISSING SECTIONS');
    console.log(`${'='.repeat(100)}`);
    console.log('Missing Sections | File Count');
    console.log('-'.repeat(30));
    sortedKeys.forEach(key => {
      const num = parseInt(key);
      const count = grouped[key].length;
      console.log(`${num === 0 ? 'Complete' : num} ${' '.repeat(15 - (num.toString().length + (num === 0 ? 8 : 0)))} | ${count}`);
    });

    // Detailed CSV export
    console.log(`\n${'='.repeat(100)}`);
    console.log('DETAILED CSV EXPORT');
    console.log(`${'='.repeat(100)}`);
    console.log('File Name,Missing Sections Count,Missing Sections');
    results.forEach(r => {
      const missing = r.missing.length > 0 ? `"${r.missing.join('; ')}"` : 'None';
      console.log(`"${r.fileName}",${r.missingCount},${missing}`);
    });

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
