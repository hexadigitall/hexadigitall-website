# KDP Publishing Guide — DevOps Engineering & Cloud Infrastructure

Operational note:

The canonical line-wide publishing process now lives in [TEXTBOOK_PRINT_AND_SALES_PLAYBOOK.md](/mnt/d/projects/mine/hexadigitall/hexadigitall/TEXTBOOK_PRINT_AND_SALES_PLAYBOOK.md).

Use this file only as a DevOps title-specific reference. If it conflicts with the central playbook, the central playbook wins.

**Textbook:** DevOps Engineering & Cloud Infrastructure — Core Track  
**Publisher:** Hexadigitall Technologies  
**Role of this file:** DevOps-specific implementation note for the current title family  

---

## Deliverables

| File | Purpose | Status |
|------|---------|--------|
| `devops-kdp-6x9.html` | Student paperback manuscript interior | ✅ Ready |
| `devops-kdp-6x9-teacher.html` | Teacher paperback manuscript interior | ✅ Ready |
| `devops-kdp-6x9-hardcover.html` | Student hardcover manuscript interior | ✅ Ready |
| `devops-kdp-6x9-hardcover-teacher.html` | Teacher hardcover manuscript interior | ✅ Ready |
| `devops-kdp-cover.html` | Front cover only, used only where a channel requests a front cover instead of a full wrap | ✅ Ready |
| `devops-kdp-cover-fullwrap.html` | Paperback full-wrap cover | ✅ Ready |
| `devops-kdp-cover-hardcover-fullwrap.html` | Hardcover full-wrap cover | ✅ Ready |
| `devops-kindle-cover.html` | Kindle ebook cover (5.333×8.533 in → 1600×2560 px) | ✅ Ready |
| `devops-kdp-preliminary-pages.html` | Optional title-specific prelim artifact, not the default manuscript submission asset | Optional |

Use the current asset chain in this order:

1. source textbook HTML files in `public/textbooks/`
2. build scripts that derive manuscript interiors in `public/textbooks/kdp/`
3. separate front-cover and full-wrap cover HTML files in `public/textbooks/kdp/`
4. exported interior and cover PDFs in `public/textbooks/kdp/exports/pdf/`

---

## Before You Submit

### 1. Obtain an ISBN

- **Free from KDP**: KDP assigns a free ISBN — listed publisher is "Independently published"
- **Self-purchased ISBN (recommended)**: Get from Bowker (US) or Nielsen (UK/NG)
  - Allows "Hexadigitall Technologies" as publisher name in metadata
  - One ISBN per format (paperback, hardcover, Kindle each need separate ISBN)

Current rule:

1. manuscript interiors should not contain placeholder ISBN prose
2. identifiers should be assigned per format
3. identifier handling belongs in marketplace metadata and the cover/barcode workflow
4. if cover files carry ISBN or barcode metadata, update those after the format is frozen

### 2. Final Page Count

KDP needs the real page count to calculate spine width accurately.

**How to get it:**
1. Serve the textbook locally and open the manuscript file in a browser context that fully renders paged content
2. Wait for the table of contents to populate and pagination to finish
3. Print → Save as PDF (or use Puppeteer/WeasyPrint)
3. Check PDF page count in Acrobat or `pdfinfo`

**Update spine widths in cover files:**

```
Cream paper (standard): spine = pages × 0.002252 in
White paper:             spine = pages × 0.002347 in
```

Files to update with actual spine width:
- `devops-kdp-cover-fullwrap.html` → CSS variables `--spine-w` and `--total-w` and `@page size`
- `devops-kdp-cover-hardcover-fullwrap.html` → same variables and `@page size`

### 3. Author & Copyright Details

Review and confirm in the current manuscript file being exported:
- Publication date
- Phone number, address
- Any legal entity name changes

### 4. Match The Correct Interior To The Correct Cover

Before upload:

1. `devops-kdp-6x9.html` must pair with `devops-kdp-cover-fullwrap.html`
2. `devops-kdp-6x9-hardcover.html` must pair with `devops-kdp-cover-hardcover-fullwrap.html`
3. `devops-kdp-cover.html` is not the default KDP print-cover upload when a full-wrap cover is required
4. teacher manuscript variants are internal or alternate-channel assets unless the target marketplace explicitly needs them

---

## Generating PDFs

### Preferred Export Workflow

1. run the relevant build scripts first so the derived manuscript files are current
2. open the manuscript via localhost or another supported local server context
3. wait for TOC population and final pagination before exporting
4. export with print backgrounds enabled
5. inspect first pages, chapter starts, page count, and page breaks before freezing the PDF

### Option A — Chrome (recommended for the manuscript)

```bash
# Open via a local server, then: Print → Destination: Save as PDF
# Wait for TOC population before exporting
# Settings: use the CSS-defined trim, keep browser scaling neutral, Margins = None
google-chrome --headless --print-to-pdf=devops-manuscript.pdf \
  --print-to-pdf-no-header \
  public/textbooks/kdp/devops-kdp-6x9.html
```

### Option B — Puppeteer

```js
const puppeteer = require('puppeteer');
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto('file:///path/to/devops-kdp-6x9.html', { waitUntil: 'networkidle0' });
await page.pdf({
  path: 'devops-manuscript.pdf',
  width: '6in',
  height: '9in',
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 }
});
await browser.close();
```

### Option C — WeasyPrint (CLI)

```bash
weasyprint public/textbooks/kdp/devops-kdp-6x9.html devops-manuscript.pdf
```

### Cover PDFs

```bash
for f in devops-kdp-cover devops-kdp-cover-fullwrap devops-kdp-cover-hardcover-fullwrap devops-kindle-cover; do
  google-chrome --headless --print-to-pdf=${f}.pdf \
    --print-to-pdf-no-header \
    public/textbooks/kdp/\${f}.html
done
```

### Kindle Cover Image

Export `devops-kindle-cover.html` as a PNG at **1600 × 2560 px** (300 DPI):

```bash
# Puppeteer:
await page.setViewport({ width: 1600, height: 2560, deviceScaleFactor: 1 });
await page.goto('file:///path/to/devops-kindle-cover.html');
await page.screenshot({ path: 'devops-kindle-cover.png', fullPage: true });
```

---

## KDP Submission Steps

### Paperback

1. Log in at **kdp.amazon.com** → Create → Paperback
2. **Book details**: Fill title, subtitle, author, description, keywords, categories
3. **Content**:
   - Trim size: **6 × 9 in** (15.24 × 22.86 cm)
   - Bleed: **No Bleed** (our content respects safe zones)
   - Paper color: **White** or **Cream** — adjust spine formula accordingly
   - Upload `devops-manuscript.pdf`
4. **Cover**:
   - Choose "Upload a cover you already have (print-ready PDF)"
   - Upload `devops-kdp-cover-fullwrap.pdf`
   - KDP Cover Calculator URL: https://kdp.amazon.com/en_US/cover-calculators → for verified spine
5. **Pricing**: Set list price, KDP royalty 60% on Expanded Distribution channels

### Hardcover

Same as paperback but:
- Select **Hardcover** product type
- Use `devops-kdp-6x9-hardcover.pdf` for interior
- Use `devops-kdp-cover-hardcover-fullwrap.pdf` for cover
- Hardcover spine = pages × 0.002347 in

### Kindle (eBook)

1. Create → Kindle eBook
2. **Content**: Upload `devops-kdp-6x9.html` directly, or convert to EPUB first
   - Recommended conversion: use **Calibre** or **Pandoc** for clean EPUB
   - Or use KDP's auto-conversion from Word/HTML
3. **Cover**: Upload `devops-kindle-cover.png` (1600 × 2560 px)
4. **Pricing**: Enable **KDP Select** for Kindle Unlimited enrollment (optional)

---

## Metadata to Prepare

```
Title:        DevOps Engineering & Cloud Infrastructure
Subtitle:     Core Track — Comprehensive 20-Week Programme
Author:       Hexadigitall Technologies
Publisher:    Hexadigitall Technologies
Language:     English
Edition:      First
Pub Date:     January 2026
ISBN (PB):    978-x-xxxxx-xxx-x
ISBN (HC):    978-x-xxxxx-xxx-x
ISBN (Kindle):978-x-xxxxx-xxx-x
BISAC:        COM051010 (Computers / Programming / Open Source)
              COM060160 (Computers / Internet / Cloud Computing)
              COM014000 (Computers / Networking / General)
Page count:   TBD (fill after PDF export)
```

**Back-cover description** (200-300 words for KDP listing):

> The definitive hands-on textbook for the Hexadigitall DevOps Engineering Core Track.
> Twenty intensive weeks of theory, lab work, and capstone projects that build
> production-grade DevOps skills from day one. Covering CI/CD pipelines, Docker,
> Kubernetes, Terraform, AWS/GCP/Azure, Prometheus, Grafana, DevSecOps, SRE principles,
> FinOps, and a full capstone sprint — this textbook prepares engineers for senior
> platform and DevOps roles.

---

## Spine Width Reference

| Pages | Spine (cream paper) | Spine (white paper) |
|-------|--------------------|--------------------|
| 400   | 0.901 in           | 0.939 in           |
| 500   | 1.126 in           | 1.174 in           |
| 600   | 1.351 in           | 1.408 in           |
| 700   | 1.576 in           | 1.643 in           |
| 800   | 1.802 in           | 1.878 in           |

---

## Files to Keep Out of Git

Add to `.gitignore` if desired:
```
public/textbooks/kdp/*.pdf
public/textbooks/kdp/*.png
public/textbooks/kdp/*.tif
```

HTML source files should remain in version control.

---

## Build Scripts

| Script | Purpose |
|--------|---------|
| `build-kdp-6x9.py` | Builds student paperback manuscript from the student source textbook |
| `build-kdp-6x9-teacher.py` | Builds teacher paperback manuscript from the teacher source textbook |
| `build-kdp-6x9-hardcover.py` | Builds student hardcover manuscript from the student paperback manuscript |
| `build-kdp-6x9-hardcover-teacher.py` | Builds teacher hardcover manuscript from the teacher paperback manuscript |

Re-run these scripts whenever the source textbooks change:
```bash
python3 build-kdp-6x9.py && python3 build-kdp-6x9-teacher.py && python3 build-kdp-6x9-hardcover.py && python3 build-kdp-6x9-hardcover-teacher.py
```

Recommended release order:

1. update source textbooks
2. rebuild paperback manuscripts
3. rebuild hardcover manuscripts
4. export interior PDFs
5. confirm final page counts
6. update full-wrap spine widths
7. export cover PDFs
