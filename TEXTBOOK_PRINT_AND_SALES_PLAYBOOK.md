# Hexadigitall Textbook Print And Sales Playbook

This document is the singular operational source of truth for preparing any Hexadigitall textbook for printing, PDF export, marketplace upload, and commercial sale.

It defines:

1. the canonical set of textbook files
2. the rules for interiors, covers, and preliminary pages
3. the build and regeneration flow for different editions and formats
4. the PDF generation and proofing workflow
5. the sales-readiness checklist for KDP and other marketplaces

This document is not a title-specific publishing brief. It is the line-wide operational playbook.

## End-To-End Lifecycle

This is the canonical chain for every sellable Hexadigitall textbook:

1. define and build the textbook product using the advanced textbook standard
2. create and refine the teacher and student source textbooks as the authoritative content and layout files
3. derive marketplace-ready manuscript interiors from those source textbooks
4. design and finalize the front cover, paperback full wrap, and hardcover full wrap as separate assets
5. generate proof PDFs from the frozen interior and cover files
6. validate page count, spine width, bleed, safe zones, and metadata
7. upload the correct interior PDF and the correct cover PDF to the target marketplace
8. treat the frozen interior and cover set as the commercial release package for that format

In other words:

1. the textbook standard governs what the book must be
2. the source textbook files govern what the book says and how it lays out
3. the build scripts govern how print-ready derivatives are produced
4. the cover files govern exterior packaging
5. the PDF export workflow governs what is actually uploaded and sold

## Operational Handoff

Use the documents in this order:

1. start in [TEXTBOOK_STANDARD_IMPLEMENTATION_PLAN.md](/mnt/d/projects/mine/hexadigitall/hexadigitall/TEXTBOOK_STANDARD_IMPLEMENTATION_PLAN.md) when creating or upgrading the textbook product itself
2. move into this playbook when the title is ready to become a print and sales asset family
3. use title-specific publishing guides only for title-specific notes, file names, and marketplace details

## Scope

This playbook applies to all Hexadigitall textbooks, including:

1. student editions
2. teacher editions
3. paperback interiors
4. hardcover interiors
5. front-cover-only files
6. paperback full-wrap cover files
7. hardcover full-wrap cover files
8. title-specific preliminary pages where used
9. generated PDF exports and proof copies

## Source Of Truth Hierarchy

When there is a conflict, use this order:

1. this playbook for publishing, export, and sales operations
2. the advanced textbook standard for product and structural requirements
3. the source textbook HTML files for actual content and live layout behavior
4. title-specific build scripts for derived manuscript variants
5. title-specific publishing notes only if they do not conflict with this playbook

Current related documents:

1. [TEXTBOOK_STANDARD_IMPLEMENTATION_PLAN.md](/mnt/d/projects/mine/hexadigitall/hexadigitall/TEXTBOOK_STANDARD_IMPLEMENTATION_PLAN.md)
2. [public/textbooks/kdp/KDP_PUBLISHING_GUIDE.md](/mnt/d/projects/mine/hexadigitall/hexadigitall/public/textbooks/kdp/KDP_PUBLISHING_GUIDE.md)

## Canonical File Model

Every sellable textbook title should be managed as a product family.

### 1. Source Textbooks

These are the authoritative source files for content and layout.

Required variants where applicable:

1. teacher source textbook
2. student source textbook

Rules:

1. source textbooks may include the front cover and back cover for design and browser review
2. source textbooks are the only place where content, pedagogy, and layout should be edited directly
3. derived manuscript files must be generated from source textbooks, not hand-maintained independently

### 2. Manuscript Interiors

These are upload-ready interior files for print platforms.

Required variants where applicable:

1. paperback student manuscript
2. paperback teacher manuscript
3. hardcover student manuscript
4. hardcover teacher manuscript

Rules:

1. manuscript interiors must not include the front cover
2. manuscript interiors must not include the back cover
3. manuscript interiors must preserve the real instructional content, front matter, and page system
4. manuscript interiors must inherit from the current source textbooks
5. hardcover manuscripts may adjust only the binding-sensitive margin system unless a title explicitly requires more

### 3. Cover Assets

Each title should support separate cover deliverables.

Required cover types:

1. front cover only
2. paperback full wrap cover
3. hardcover full wrap cover

Rules:

1. cover files are separate from the manuscript interior
2. marketplace uploads should use separate interior and cover deliverables unless the platform explicitly requires a combined file
3. spine width must be based on final page count after the interior PDF is frozen
4. front cover only is used where the channel does not require a full wrap PDF

### 4. Preliminary Pages

Preliminary pages may live in one of two ways:

1. integrated inside the source textbook front matter
2. isolated in a separate preliminary-pages file if a title needs a special publishing workflow

Required preliminary content, unless a title has a justified exception:

1. copyright and access page
2. license and usage language
3. support, updates, resources, or errata path
4. table of contents
5. how-to-use guidance
6. methodology or learning framework page
7. student guidance page
8. instructor guidance page in teacher editions

Optional preliminary content where the title needs it:

1. half-title page
2. dedication page
3. preface or positioning statement
4. mentorship pathways page
5. repository rules page

## Product Family Chain

Every title should be understandable as one connected asset chain, not as disconnected files.

### 1. Editorial Source Layer

This is where the book is created.

1. teacher source textbook
2. student source textbook

These files define:

1. the real instructional content
2. the front matter structure
3. the trim-aware layout system
4. the cover and back-cover design review state where included

### 2. Derived Interior Layer

This is where platform-ready interiors are generated.

1. paperback student manuscript
2. paperback teacher manuscript
3. hardcover student manuscript
4. hardcover teacher manuscript

These files exist so that:

1. the interior upload is separated from the cover upload
2. binding-sensitive differences are handled without forking the source textbook unnecessarily
3. the sales upload uses clean, cover-free manuscript files

### 3. Exterior Packaging Layer

This is where the commercial shell of the book is finalized.

1. front-cover-only file
2. paperback full-wrap file
3. hardcover full-wrap file

These files depend on the frozen interior because:

1. full-wrap spine width must use the final page count
2. barcode placement and marketplace-safe zones live in the cover workflow
3. the same title may need different exterior packaging per channel or format

### 4. Export Layer

This is where deliverable PDFs are produced.

1. interior PDFs exported from manuscript HTML files
2. cover PDFs exported from cover HTML files
3. proof copies reviewed before upload

### 5. Commercial Release Layer

This is the marketplace package.

For each sellable format, freeze:

1. one interior PDF
2. one corresponding cover PDF
3. one metadata set
4. one identifier assignment policy for that format

## Canonical Directory And Naming Pattern

The default pattern for a textbook title should be:

1. source textbooks in `public/textbooks/`
2. derived print and marketplace files in `public/textbooks/kdp/`
3. generated PDFs in `public/textbooks/kdp/exports/pdf/`

Recommended naming pattern for a title slug `<title-slug>`:

1. `public/textbooks/<title-slug>-textbook.html`
2. `public/textbooks/<title-slug>-student-textbook.html`
3. `public/textbooks/kdp/<title-slug>/<title-slug>-kdp-6x9.html`
4. `public/textbooks/kdp/<title-slug>/<title-slug>-kdp-6x9-teacher.html`
5. `public/textbooks/kdp/<title-slug>/<title-slug>-kdp-6x9-hardcover.html`
6. `public/textbooks/kdp/<title-slug>/<title-slug>-kdp-6x9-hardcover-teacher.html`
7. `public/textbooks/kdp/<title-slug>/<title-slug>-kdp-cover.html`
8. `public/textbooks/kdp/<title-slug>/<title-slug>-kdp-cover-fullwrap.html`
9. `public/textbooks/kdp/<title-slug>/<title-slug>-kdp-cover-hardcover-fullwrap.html`
10. `public/textbooks/kdp/<title-slug>/<title-slug>-kindle-cover.html`
11. `public/textbooks/kdp/<title-slug>/<title-slug>-kdp-preliminary-pages.html` if needed

Cover exports are generated into:

1. `public/textbooks/kdp/<title-slug>/covers/` — all exported cover files for that title

Cover export scripts live at the project root:

1. `generate-<title-slug>-cover-exports.mjs` — per-title export script

## Non-Negotiable Publishing Rules

### 1. No Cover Pages Inside Print Manuscripts

This is mandatory.

1. front cover belongs to a cover asset, not the manuscript interior upload
2. back cover belongs to a cover asset, not the manuscript interior upload
3. if a source textbook includes them for design review, build scripts must remove them for manuscript output

### 2. No Placeholder Book Identifiers Inside Interiors

This is mandatory.

1. do not place placeholder ISBN text inside the manuscript interior
2. do not place placeholder DOI text inside the manuscript interior
3. do not assume one ISBN across formats
4. each sellable format may require its own ISBN
5. ISBN handling should live in marketplace metadata and cover/barcode workflows, not as placeholder prose inside the interior

### 3. Teacher And Student Editions Must Stay Structurally Aligned

Required:

1. same core front matter sequence
2. same course structure
3. same print system
4. same commercial and brand quality

Teacher-only material may include:

1. answers
2. rubrics
3. facilitation notes
4. instructor guidance

### 4. Derived Files Must Be Regenerated, Not Hand-Diverged

Rules:

1. edit the source textbook, not the generated KDP manuscript, unless fixing an emergency stale artifact before immediate export
2. if a source textbook changes, regenerate all dependent manuscript variants
3. if paperback manuscript changes, regenerate hardcover derivatives after it

### 5. Print Geometry Must Match Claimed Trim

Default standard:

1. 6in x 9in trim for advanced textbooks unless a title has an explicit exception
2. mirrored gutter margins for duplex print
3. tighter outside margins than legacy A4-derived layouts
4. content padding tuned to the trim size, not reused from browser-first desktop layout

## Canonical Production Workflow

### Phase 1. Prepare The Source Textbook

Start here.

1. finalize content in the teacher and student source textbooks
2. finalize print-friendly CSS in the source textbooks
3. validate the front matter sequence
4. validate that no placeholder ISBN or DOI text exists in the interior
5. validate that cover layouts render correctly in the source versions used for design review

### Phase 2. Prepare The Derived Manuscripts

Build the platform-ready interiors.

1. generate paperback student manuscript from student source textbook
2. generate paperback teacher manuscript from teacher source textbook
3. generate hardcover student manuscript from paperback student manuscript
4. generate hardcover teacher manuscript from paperback teacher manuscript

Rules:

1. covers must be stripped from the interior outputs
2. first-page margin rules must be appropriate for manuscript mode, not for full-bleed cover mode
3. hardcover builds should only change what binding requires unless explicitly necessary

### Phase 3. Prepare Cover Assets

Do this after the title interior is stable.

1. finalize front cover design
2. finalize paperback full wrap design
3. finalize hardcover full wrap design
4. update spine width only after final interior page count is known

Rules:

1. use the final PDF page count, not estimates, for spine calculations
2. leave barcode placement in the cover workflow, not in the interior workflow
3. keep safe zones clear of critical text and logos
4. treat full-wrap files as downstream of the frozen interior, not as parallel guesses

### Hardcover Full-Wrap Geometry

Use these values for KDP case laminate hardcover full-wrap layouts.

| Variable | Value | Notes |
|---|---|---|
| Left bleed | 0.125in | |
| Back panel | 6in | |
| Left hinge | 0.0625in | KDP case laminate spec |
| Spine | calculated | based on final page count |
| Right hinge | 0.0625in | KDP case laminate spec |
| Front panel | 6in | |
| Right bleed | 0.125in | |
| **Total width** | **0.125 + 6 + 0.0625 + spine + 0.0625 + 6 + 0.125** | |
| Height | 9.25in | includes top and bottom bleed |

CSS grid column pattern:

```
grid-template-columns: 6in 0.0625in var(--spine) 0.0625in 6in;
```

Critical: Do not use `0.375in` for hinges. That value is far too large, causes front panel overflow, and compresses the spine visually. The correct KDP hinge is `0.0625in`.

Paperback full-wrap geometry follows a different pattern (no hinges). Use the paperback full-wrap template as the reference for that format.

### Phase 4. Generate PDFs

Generate proof-ready and upload-ready files.

For manuscript interiors:

1. open the manuscript through a local server or supported browser context
2. allow the table of contents and paged rendering to finish before export
3. export with backgrounds enabled
4. inspect page count, page order, page breaks, and margin behavior

For covers:

1. export front cover only when required by the channel
2. export paperback full wrap as a separate print-ready file
3. export hardcover full wrap as a separate print-ready file

### Phase 4A. Match Files Before Upload

Before a marketplace upload begins, verify the pairings.

1. paperback interior PDF must match the paperback full-wrap cover PDF
2. hardcover interior PDF must match the hardcover full-wrap cover PDF
3. front-cover-only exports must be used only for channels that request a front cover rather than a full wrap
4. metadata, identifiers, and page count assumptions must belong to the same frozen release set

### Phase 5. Proof And Freeze

Before sales upload, perform a freeze review.

1. confirm the manuscript has no front or back cover embedded
2. confirm the title page and TOC are complete
3. confirm the final page count
4. confirm spine width values in cover files
5. confirm no placeholder IDs remain in the interior
6. confirm URLs, QR codes, and support paths work

### Phase 6. Marketplace Packaging And Sales Release

This is the final operational step.

1. assign the correct interior PDF to the correct product format
2. assign the correct cover PDF to the correct product format
3. enter marketplace metadata for that exact format
4. confirm identifiers, imprint, and pricing match the selected format
5. upload only frozen files that have already passed proof review

## PDF Generation Standard

### Interior PDF Rules

Required:

1. wait for TOC population before export
2. export with print backgrounds enabled
3. use the actual trim size defined by CSS
4. do not let browser auto-fit a different paper size silently
5. inspect first pages and chapter starts after export

Proof checklist:

1. title page renders correctly
2. TOC is populated and page numbers match
3. headers, callouts, code blocks, and tables do not break badly
4. line length feels appropriate for the trim
5. no cut-off cover artifacts appear inside the manuscript

### Cover PDF Rules

Required:

1. verify the canvas size matches the platform specification
2. verify bleed and safe zones
3. verify spine width matches final page count
4. verify barcode zone remains clear where required
5. verify export has no browser margins or scaling artifacts

### Cover Export Format Policy

This is mandatory. Each cover file type has a fixed output format. Do not deviate.

| Cover file type | PDF | JPG | TIFF |
|---|---|---|---|
| Paperback full-wrap | ✓ | — | — |
| Hardcover full-wrap | ✓ | — | — |
| Front cover only | optional | ✓ | ✓ |
| Kindle cover page | — | ✓ | ✓ |

Rules:

1. full-wrap files must produce PDF only — they are print-press files, not image assets
2. Kindle cover and front-cover-only files must produce JPG and TIFF for marketplace upload
3. do not generate JPG or TIFF from full-wrap files
4. do not generate a full-wrap PDF from a Kindle or front-cover file

### Kindle Cover Export Specification

Canonical Kindle cover dimensions:

1. 1600 × 2560 pixels
2. 300 DPI
3. ratio 1.6 : 1 (portrait)

Export method:

1. render the Kindle cover HTML to a temporary PDF via headless browser (respects CSS `@page` inch-based sizing)
2. convert the temporary PDF to JPG and TIFF using ImageMagick `convert` with `-density 300 -resize 1600x2560!`
3. delete the temporary PDF after conversion
4. do not use headless browser screenshot for Kindle JPG or TIFF — screenshot rendering conflicts with inch-based CSS and produces incorrect dimensions

### Pagination Standard

This is mandatory for all advanced textbooks.

Required:

1. all page numbering must be CSS-generated using `@page` rules and `counter(page)` mechanisms
2. do not hardcode manual page number footers or spans in the source HTML
3. pagination must be delegated entirely to the print engine, not mixed with manual elements
4. if a textbook includes page numbers in the footer area, they must be generated via CSS, not embedded as literal span elements

Anti-patterns to eliminate:

1. hardcoded `<span>` elements containing numeric page values scattered through the content
2. manual footer styling mixed with numeric content in ways that create pagination conflicts
3. assumption that visible page counts in browser view will match print output

Verification approach:

1. after removing any hardcoded pagination elements, search all source files for numeric-only footer patterns
2. verify that the same search pattern returns zero results in generated manuscripts
3. confirm final PDFs display correct page numbering from the print engine, not from embedded text

Lesson: Hardcoded pagination elements create duplicate or incorrect page numbering in final output and conflict with the actual page-break behavior of the print engine. Always rely on CSS-based counter systems.

## Metadata And Identifier Policy

### ISBN Policy

Use this rule set:

1. never rely on one ISBN for all formats
2. paperback, hardcover, and ebook may each need different identifiers
3. do not hard-code placeholder ISBN prose in the interior
4. use marketplace metadata and cover/barcode workflows for identifier handling

### DOI Policy

Default rule:

1. do not place placeholder DOI text in the interior
2. only use a DOI if Hexadigitall has a deliberate DOI policy for that title and format
3. if no DOI program exists for the line, omit it completely

## Sales Readiness Checklist

The textbook is ready for print and sale only when all of the following are true.

### Product Readiness

1. teacher and student editions are structurally aligned where both exist
2. front matter is complete
3. resources, support, and errata paths are valid
4. no placeholder identifiers remain in the interior

### Interior Readiness

1. manuscript file has no front cover embedded
2. manuscript file has no back cover embedded
3. trim size is correct
4. margins and gutters are correct for the format
5. TOC and page numbering are correct

### Cover Readiness

1. front cover is finalized
2. paperback full wrap is finalized
3. hardcover full wrap is finalized where needed
4. spine width uses final page count
5. safe zones and bleed are respected

### Marketplace Readiness

1. title metadata is complete
2. description and keywords are complete
3. correct file is matched to the correct upload slot
4. interior and cover PDFs correspond to the same frozen edition and page count

## Required Build Discipline

When a textbook changes, use this order.

1. edit source textbook files
2. regenerate paperback manuscripts
3. regenerate hardcover manuscripts from the refreshed paperbacks
4. re-export interior PDFs
5. confirm final page count
6. update spine widths in cover files
7. export final cover PDFs

Do not update cover spine widths before the interior page count is frozen.

## Multi-Tier Verification For Pagination And Content Changes

When removing pagination elements, fixing layout issues, or making significant content changes, verify the changes propagate correctly through all tiers.

**Verification sequence:**

1. **Source tier**: Confirm the change is present in the source textbook file (teacher and/or student edition as applicable)
2. **Manuscript tier**: Regenerate all derived manuscripts and confirm the change is present in each variant
3. **PDF tier**: Re-export all PDFs and confirm the change is reflected in the final output

**Example verification pattern:**

If removing hardcoded page number footers from a source textbook:
1. Search the source file for the numeric pattern and confirm all instances are removed
2. Regenerate all four manuscript variants (paperback/hardcover × teacher/student)
3. Search all generated manuscripts for the same pattern and confirm zero results
4. Export final PDFs and confirm pagination is correct in the rendered output

**Lesson:** Changes made to source files must flow through the entire build pipeline. The verification approach ensures no stale data propagates through manuscript generation or PDF export.

## Current Reference Implementation

The DevOps title family is the current reference implementation for this playbook.

Current build scripts:

1. [build-kdp-6x9.py](/mnt/d/projects/mine/hexadigitall/hexadigitall/build-kdp-6x9.py)
2. [build-kdp-6x9-teacher.py](/mnt/d/projects/mine/hexadigitall/hexadigitall/build-kdp-6x9-teacher.py)
3. [build-kdp-6x9-hardcover.py](/mnt/d/projects/mine/hexadigitall/hexadigitall/build-kdp-6x9-hardcover.py)
4. [build-kdp-6x9-hardcover-teacher.py](/mnt/d/projects/mine/hexadigitall/hexadigitall/build-kdp-6x9-hardcover-teacher.py)

Current cover export scripts:

1. [generate-devops-cover-exports.mjs](/mnt/d/projects/mine/hexadigitall/hexadigitall/generate-devops-cover-exports.mjs) — DevOps title cover exports (PDF, JPG, TIFF)
2. [generate-landing-zones-cover-exports.mjs](/mnt/d/projects/mine/hexadigitall/hexadigitall/generate-landing-zones-cover-exports.mjs) — Landing Zones title cover exports (PDF, JPG, TIFF)

Each cover export script:

1. renders full-wrap HTML files to PDF via headless browser
2. renders Kindle cover HTML to a temporary PDF then converts via ImageMagick to JPG and TIFF at the correct dimensions
3. outputs all files to the `covers/` subfolder within the title's KDP directory
4. enforces the format policy: full-wrap = PDF only; Kindle = JPG + TIFF only

Current cover references:

1. [public/textbooks/kdp/devops-engineering-cloud-infrastructure-core/devops-kdp-cover.html](/mnt/d/projects/mine/hexadigitall/hexadigitall/public/textbooks/kdp/devops-engineering-cloud-infrastructure-core/devops-kdp-cover.html)
2. [public/textbooks/kdp/devops-engineering-cloud-infrastructure-core/devops-kdp-cover-fullwrap.html](/mnt/d/projects/mine/hexadigitall/hexadigitall/public/textbooks/kdp/devops-engineering-cloud-infrastructure-core/devops-kdp-cover-fullwrap.html)
3. [public/textbooks/kdp/devops-engineering-cloud-infrastructure-core/devops-kdp-cover-hardcover-fullwrap.html](/mnt/d/projects/mine/hexadigitall/hexadigitall/public/textbooks/kdp/devops-engineering-cloud-infrastructure-core/devops-kdp-cover-hardcover-fullwrap.html)
4. [public/textbooks/kdp/devops-engineering-cloud-infrastructure-core/devops-kindle-cover.html](/mnt/d/projects/mine/hexadigitall/hexadigitall/public/textbooks/kdp/devops-engineering-cloud-infrastructure-core/devops-kindle-cover.html)

Landing Zones cover references:

1. [public/textbooks/kdp/architecting-landing-zones/architecting-landing-zones-kdp-cover-fullwrap.html](/mnt/d/projects/mine/hexadigitall/hexadigitall/public/textbooks/kdp/architecting-landing-zones/architecting-landing-zones-kdp-cover-fullwrap.html)
2. [public/textbooks/kdp/architecting-landing-zones/architecting-landing-zones-kdp-cover-hardcover-fullwrap.html](/mnt/d/projects/mine/hexadigitall/hexadigitall/public/textbooks/kdp/architecting-landing-zones/architecting-landing-zones-kdp-cover-hardcover-fullwrap.html)
3. [public/textbooks/kdp/architecting-landing-zones/architecting-landing-zones-kindle-cover.html](/mnt/d/projects/mine/hexadigitall/hexadigitall/public/textbooks/kdp/architecting-landing-zones/architecting-landing-zones-kindle-cover.html)

## What This Playbook Replaces

This playbook should be treated as the canonical operational guide instead of relying on fragmented title-specific notes.

Title-specific publishing guides may still exist, but only as implementation notes for a specific textbook. They must not override this document.