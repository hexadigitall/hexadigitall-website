# Content Verification Script

This script compares content between your local development server and the live deployed site to ensure they match.

## Purpose

After deploying to Vercel, use this script to verify that:
- Static pages render correctly
- Dynamic routes work properly
- Content from Sanity CMS is displayed consistently
- No unexpected differences exist between environments

## Prerequisites

1. **Local server must be running:**
   ```bash
   npm run build
   npm start
   ```

2. **Required dependencies installed:**
   ```bash
   npm install
   ```

## Usage

### Basic Usage

Compare local (http://localhost:3000) with live (https://hexadigitall.com):

```bash
npm run verify-content
```

### Custom URLs

Compare different environments:

```bash
# Compare staging with production
LOCAL_URL=https://staging.hexadigitall.com LIVE_URL=https://hexadigitall.com npm run verify-content

# Compare local dev on different port
LOCAL_URL=http://localhost:3001 npm run verify-content
```

## What It Checks

### Static Pages
- Home page (/)
- About (/about)
- Services (/services)
- Courses (/courses)
- Blog (/blog)
- Portfolio (/portfolio)
- Contact (/contact)
- FAQ (/faq)

### Dynamic Routes
- Sample course pages (/courses/[slug])
- Sample blog posts (/blog/[slug])
- Sample portfolio projects (/portfolio/[slug])

### Content Elements
- Page titles
- H1 and H2 headings
- Main content area
- Header/footer presence
- Overall content length

### Sanity CMS Data
- Count of courses
- Count of blog posts
- Count of portfolio projects

## Output

The script provides:
- ✅ Green checkmarks for matching content
- ⚠️  Yellow warnings for minor differences
- ❌ Red errors for major issues
- Detailed summary at the end

### Example Output

```
============================================================
Content Verification: Local vs Live Deployment
============================================================

Local:  http://localhost:3000
Live:   https://hexadigitall.com

🔍 Checking if local server is running...
  ✅ Local server is accessible

🗄️  Checking Sanity CMS Data...
  Courses: 12
  Blog Posts: 24
  Portfolio Projects: 18

📋 Verifying Static Pages...

📄 Checking: /
  ✅ Content matches!
     Title: Hexadigitall | Business Planning, Web Dev & Digital Marketing
     H1s: 1, H2s: 5
     Size: 45.2KB

📄 Checking: /about
  ✅ Content matches!
     Title: About Us | Hexadigitall
     H1s: 1, H2s: 3
     Size: 32.1KB

...

============================================================
Summary
============================================================

✓ Pages checked: 8
✓ Matches: 8
✗ Differences: 0

📊 Sanity CMS:
  - 12 courses
  - 24 blog posts
  - 18 portfolio projects

✅ All pages match! Local and live content is consistent.
```

## Common Differences

Some differences are expected and acceptable:

### 1. CDN Caching
The live site may show slightly older content if using CDN caching. This is normal and will update within the cache TTL (typically 1-60 minutes).

### 2. Build Timestamps
Content generated at build time (like timestamps or version numbers) may differ.

### 3. Environment-Specific Content
Content that changes based on environment variables may legitimately differ.

### 4. Dynamic Features
Real-time features (like user counts, "online now" indicators) will naturally differ.

## Troubleshooting

### "Local server is not running"

Start your local server:
```bash
npm run build
npm start
```

Wait a few seconds for the server to start, then run the verification again.

### "Live page error: HTTP 404"

The page doesn't exist on the live site. This could mean:
- The page hasn't been deployed yet
- The route is different than expected
- The page requires authentication

### "Content length differs significantly"

This could indicate:
- Missing content on one environment
- Additional content on one environment
- Layout/styling differences that affect HTML size
- Different Sanity CMS data between environments

Check the specific page manually to verify the difference is acceptable.

### Timeout Errors

If requests timeout:
- Check your internet connection
- Verify the URLs are correct
- The server might be slow to respond (increase timeout if needed)

## Integration with CI/CD

You can add this verification to your deployment workflow:

```yaml
# .github/workflows/verify-deployment.yml
name: Verify Deployment

on:
  deployment_status:

jobs:
  verify:
    if: github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - name: Wait for deployment to be ready
        run: sleep 30
      - name: Verify content
        run: |
          LIVE_URL=${{ github.event.deployment_status.target_url }} \
          LOCAL_URL=${{ github.event.deployment_status.target_url }} \
          npm run verify-content
```

## Exit Codes

- `0`: Success - all checks passed or only minor differences
- `1`: Error - critical failure (local server not running, etc.)

Note: The script exits with 0 even if minor differences are found, as long as both sites are accessible. This is because some differences (like caching) are expected and acceptable.
