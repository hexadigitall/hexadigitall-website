# Course Curriculum System

This system generates professional, detailed course curricula for students, covering the entire course duration with weekly breakdowns, learning resources, project requirements, and study guidance.

## 📁 Files Created

### Scripts
- **`scripts/fetch-course-curriculum-data.mjs`** - Fetches course data from Sanity CMS
- **`scripts/generate-curriculum-pdfs.mjs`** - Converts HTML curricula to PDF format

### Curricula Documents
- **`curriculum-azure-security-az500.html`** - Azure Security Technologies (AZ-500) Curriculum
- **`curriculum-linux-shell-scripting.html`** - Linux Administration & Shell Scripting Pro Curriculum

## 🎯 Features

Each curriculum includes:

### ✅ Welcome & Introduction
- Warm welcome message
- Course overview and importance
- What students will achieve

### ✅ Prerequisites
- Required knowledge before starting
- Recommended foundational courses
- Setup requirements

### ✅ Learning Resources
- **Free Resources**: Documentation, tutorials, official guides
- **Paid Resources**: Books, premium courses, practice exams
- **Tools**: Required software and applications

### ✅ Complementary Courses
- Suggested courses to take alongside
- Related courses for skill expansion
- Career path recommendations

### ✅ Learning Roadmap
- Phased approach to the course
- Clear milestones and objectives
- Progress tracking guidance

### ✅ Weekly Curriculum
- **Detailed weekly breakdown** covering the entire course duration
- Learning objectives for each week
- Topics and subtopics
- **Hands-on lab exercises** with practical tasks
- Code examples and command references
- Time allocation (study hours per week)

### ✅ Capstone Projects
- Major projects covering real-world scenarios
- Clear objectives and requirements
- Skill demonstration opportunities
- Portfolio-worthy deliverables

### ✅ Study Tips
- Best practices for success
- Time management guidance
- Learning strategies
- Community resources

### ✅ Professional Design
- Clean, modern UI/UX
- Course-specific color schemes:
  - **Azure Security**: Microsoft Azure blue theme (#0078D4)
  - **Linux**: Ubuntu orange/terminal theme (#E95420)
- Print-optimized layouts
- Professional typography (Inter, Space Grotesk, JetBrains Mono)
- Responsive design
- PDF-ready formatting

## 🚀 Usage

### Viewing the Curricula

Simply open the HTML files in any modern web browser:

```bash
# Open Azure Security curriculum
open curriculum-azure-security-az500.html

# Open Linux curriculum  
open curriculum-linux-shell-scripting.html
```

### Generating PDF Versions

1. **Install dependencies** (first time only):
```bash
npm install puppeteer
```

2. **Generate PDFs**:
```bash
node scripts/generate-curriculum-pdfs.mjs
```

This will create:
- `curriculum-azure-security-az500.pdf`
- `curriculum-linux-shell-scripting.pdf`

### Fetching Course Data from Sanity

To check course information before creating curricula:

```bash
node scripts/fetch-course-curriculum-data.mjs
```

## 📊 Course Details

### Azure Security Technologies (AZ-500)
- **Duration**: 16 weeks
- **Level**: Advanced
- **Time Commitment**: 2 hours/week + lab practice
- **School**: Cybersecurity
- **Focus**: Microsoft Azure security, identity management, platform protection, security operations

### Linux Administration & Shell Scripting Pro
- **Duration**: 10 weeks
- **Level**: Intermediate  
- **Time Commitment**: 5 hours/week
- **School**: Cloud & DevOps
- **Modules**: 5
- **Lessons**: 25
- **Focus**: Linux system administration, command line mastery, bash scripting, automation

## 🎨 Design Philosophy

### Visual Design
- **Professional**: Enterprise-grade design suitable for corporate training
- **Branded**: Reflects HexaDigitall's identity
- **Accessible**: High contrast, readable fonts, clear hierarchy
- **Printable**: Optimized for both screen and print

### Content Structure
- **Comprehensive**: Covers entire course scope in detail
- **Actionable**: Clear tasks, labs, and projects
- **International Standard**: Industry-aligned curriculum content
- **Student-Focused**: Designed with learner success in mind

### Technical Implementation
- **Semantic HTML5**: Proper document structure
- **Modern CSS**: Flexbox, Grid, custom properties
- **Google Fonts**: Professional typography
- **Print Stylesheets**: Optimized for PDF generation

## 📝 Creating New Curricula

To create a curriculum for a new course:

1. **Fetch course data**:
```javascript
const courseData = await fetchCourseData('Course Title Here');
```

2. **Create HTML file** following the template structure:
   - Header with course metadata
   - Welcome section
   - Prerequisites
   - Resources and roadmap
   - Weekly breakdown (match course duration)
   - Projects
   - Footer

3. **Customize design**:
   - Choose appropriate color scheme
   - Add course-specific imagery
   - Adjust content sections as needed

4. **Add to PDF generator**:
```javascript
const CURRICULA = [
  // ... existing curricula
  {
    name: 'New Course Name',
    htmlFile: 'curriculum-new-course.html',
    pdfFile: 'curriculum-new-course.pdf'
  }
];
```

## 🔧 Customization

### Colors
Each curriculum uses CSS custom properties for easy theming:

```css
:root {
  --primary-color: #0078D4;    /* Main brand color */
  --secondary-color: #50E6FF;  /* Accent color */
  --dark-bg: #002050;          /* Dark backgrounds */
  /* ... other colors */
}
```

### Content Sections
Add or remove sections by editing the HTML structure:
- All sections use the `.section` class
- Cards use the `.card` class
- Week blocks use `.week-block` class

### PDF Settings
Modify PDF generation options in `generate-curriculum-pdfs.mjs`:
```javascript
await page.pdf({
  format: 'A4',
  printBackground: true,
  margin: { /* adjust margins */ }
});
```

## 📤 Distribution

### Email to Students
1. Generate PDF version
2. Attach to welcome email
3. Include HTML version link if hosting online

### Online Hosting
- Upload HTML files to website
- Students can view in browser
- Print or save as PDF from browser

### Learning Management System
- Import HTML as content
- Link to PDF downloads
- Embed in course dashboard

## 🎓 Educational Impact

These curricula provide:
- **Clarity**: Students know exactly what to expect
- **Structure**: Clear path from start to finish
- **Resources**: Everything needed for success
- **Professionalism**: Reflects serious, quality education
- **Motivation**: Comprehensive roadmap inspires confidence

## 🔄 Maintenance

### Updating Curricula
1. Edit HTML file with new content
2. Regenerate PDF
3. Update version date in footer
4. Redistribute to affected students

### Syncing with Sanity
- Course data changes in Sanity should be reflected in curricula
- Run fetch script to verify current data
- Update HTML manually (currently no auto-sync)

## 📖 Best Practices

1. **Keep content current**: Update resources, tools, and industry practices
2. **Student feedback**: Incorporate learner suggestions
3. **Industry alignment**: Ensure content matches current job requirements
4. **Clear objectives**: Each week should have measurable outcomes
5. **Realistic timeframes**: Labs and projects should fit within study hours

## 🤝 Support

For questions about:
- **Content**: Contact curriculum development team
- **Technical issues**: File GitHub issue
- **Course data**: Check Sanity CMS

## 📜 License

© 2026 HexaDigitall - All rights reserved

---

**Created**: January 2026  
**Last Updated**: January 12, 2026  
**Maintained By**: HexaDigitall Curriculum Team
