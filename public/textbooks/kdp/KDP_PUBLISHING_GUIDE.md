# KDP Publishing Guide — DevOps Engineering & Cloud Infrastructure

**Textbook:** DevOps Engineering & Cloud Infrastructure — Core Track  
**Publisher:** Hexadigitall Technologies  
**Draft ISBN:** 978-0-000000-00-0 ← replace before submission  

---

## Deliverables

| File | Purpose | Status |
|------|---------|--------|
| `devops-kdp-preliminary-pages.html` | Standalone prelim pages (title, copyright, dedication, TOC) | ✅ Ready |
| `devops-kdp-6x9.html` | Full 6×9 KDP paperback manuscript (content + prelim pages) | ✅ Ready |
| `devops-kdp-6x9-hardcover.html` | Full 6×9 KDP hardcover manuscript (larger gutter margins) | ✅ Ready |
| `devops-kdp-cover.html` | Front cover only, 6×9 in (for KDP upload) | ✅ Ready |
| `devops-kdp-cover-fullwrap.html` | Paperback full wrap cover | ✅ Ready |
| `devops-kdp-cover-hardcover-fullwrap.html` | Hardcover full wrap cover | ✅ Ready |
| `devops-kindle-cover.html` | Kindle ebook cover (5.333×8.533 in → 1600×2560 px) | ✅ Ready |

---

## Before You Submit

### 1. Obtain an ISBN

- **Free from KDP**: KDP assigns a free ISBN — listed publisher is "Independently published"
- **Self-purchased ISBN (recommended)**: Get from Bowker (US) or Nielsen (UK/NG)
  - Allows "Hexadigitall Technologies" as publisher name in metadata
  - One ISBN per format (paperback, hardcover, Kindle each need separate ISBN)
- Replace all `978-0-000000-00-0` placeholders in:
  - All cover HTML files (`<meta name="book:isbn">`)
  - `devops-kdp-6x9.html` and `devops-kdp-6x9-hardcover.html`
  - The barcode zone on both full-wrap covers

### 2. Final Page Count

KDP needs the real page count to calculate spine width accurately.

**How to get it:**
1. Open `devops-kdp-6x9.html` in Chrome
2. Print → Save as PDF (or use Puppeteer/WeasyPrint)
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

Review and confirm in `devops-kdp-6x9.html` (copyright section):
- Publication date
- Phone number, address
- Any legal entity name changes

---

## Generating PDFs

### Option A — Chrome (Paged.js, recommended for the manuscript)

```bash
# Open in Chrome, then: Print → Destination: Save as PDF
# Settings: Paper size = Custom (6in × 9in manually if needed), Margins = None
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

### Cover PDFs (all covers)

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
| `build-kdp-6x9.py` | Transforms teacher textbook → paperback manuscript |
| `build-kdp-6x9-hardcover.py` | Derives hardcover from paperback manuscript |

Re-run these scripts whenever the main textbook file is updated:
```bash
python3 build-kdp-6x9.py && python3 build-kdp-6x9-hardcover.py
```
