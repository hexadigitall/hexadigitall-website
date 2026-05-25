# Hexadigitall Streamlined Architecture Hierarchy

```text
.
├── .build-scripts
│   └── ... (collapsed)
├── .gemini
│   └── ... (collapsed)
├── .github
│   └── ... (collapsed)
├── .qa-venv
│   └── ... (collapsed)
├── .sanity
│   └── ... (collapsed)
├── .venv
│   └── ... (collapsed)
├── .venv-imgcover
│   └── ... (collapsed)
├── .venv-kdp
│   └── ... (collapsed)
├── .vercel
│   └── ... (collapsed)
├── backups
│   └── architecting-landing-zones-textbook.html.bak
├── clients
│   └── olu-thompson
│       ├── assets
│       │   ├── profile-photo.jpg
│       │   └── security-article.png
│       ├── resume
│       │   ├── assets
│       │   │   └── profile-photo.jpg
│       │   ├── Olu-Thompson-Current-Resume.docx
│       │   ├── RESUME-PROJECT-SUMMARY.md
│       │   └── olu-thompson-resume.html
│       ├── CLIENT-EMAIL-TEMPLATE.md
│       ├── PROJECT-SUMMARY.md
│       ├── README.md
│       ├── linkedin-field-guide.html
│       └── linkedin-profile-mockup.html
├── components
│   └── publications
│       └── SearchInterface.tsx
├── content
│   └── draft-messages.md
├── data
│   ├── dsa-writing-design-courses.json
│   └── new-dsa-writing-design-courses.json
├── dist
│   ├── assets
│   │   └── images
│   │       ├── heroes
│   │       │   ├── hero-students-learning.jpg
│   │       │   ├── hero-success-celebration.jpg
│   │       │   └── hero-tech-team.jpg
│   │       ├── people
│   │       │   ├── african-american-man-wearing-red-sweater-excited-chip.webp
│   │       │   ├── front-view-happy-woman-calling-out-chip.webp
│   │       │   ├── front-view-happy-woman-calling-out-hero.webp
│   │       │   ├── portrait-cool-man-with-sunglasses-dancing-smiling-alt-chip.webp
│   │       │   ├── portrait-cool-man-with-sunglasses-dancing-smiling-chip.webp
│   │       │   └── surprised-playful-touched-good-looking-african-american-woman-glasses-chip.webp
│   │       ├── team
│   │       │   ├── diverse-team.jpg
│   │       │   ├── happy-businessman.jpg
│   │       │   └── smiling-developer.jpg
│   │       └── testimonials
│   │           ├── testimonial-person-1.jpg
│   │           ├── testimonial-person-2.jpg
│   │           └── testimonial-person-3.jpg
│   ├── curriculums
│   │   ├── pdfs
│   │   │   ├── advanced-ansible-automation-curriculum.pdf
│   │   │   ├── azure-security-technologies-az-500.pdf
│   │   │   ├── curriculum-azure-security-az500.pdf
│   │   │   ├── curriculum-javascript-fundamentals.pdf
│   │   │   ├── curriculum-linux-shell-scripting.pdf
│   │   │   ├── devops-engineering-cloud-infrastructure-core.pdf
│   │   │   ├── executive-agile-leadership-curriculum.pdf
│   │   │   └── linux-administration-shell-scripting.pdf
│   │   ├── curriculum-adobe-creative-cloud-suite.html
│   │   ├── curriculum-adsense-101-approval-blueprint.html
│   │   ├── curriculum-adsense-arbitrage-pro.html
│   │   ├── curriculum-adsense-traffic-revenue.html
│   │   ├── curriculum-advanced-ansible-automation.html
│   │   ├── curriculum-advanced-backend-nodejs.html
│   │   ├── curriculum-advanced-css-mastery.html
│   │   ├── curriculum-advanced-excel-business.html
│   │   ├── curriculum-advanced-javascript-mastery.html
│   │   ├── curriculum-advanced-seo-mastery.html
│   │   ├── curriculum-advanced-ui-ux.html
│   │   ├── curriculum-agile-project-management-essentials.html
│   │   ├── curriculum-ai-engineering-llms.html
│   │   ├── curriculum-ai-engineering-mlops.html
│   │   ├── curriculum-amazon-retail-media-networks.html
│   │   ├── curriculum-application-security-appsec-specialist.html
│   │   ├── curriculum-applied-machine-learning.html
│   │   ├── curriculum-archicad-professional.html
│   │   ├── curriculum-architecting-landing-zones.html
│   │   ├── curriculum-autocad-masterclass.html
│   │   ├── curriculum-aws-certified-solutions-architect.html
│   │   ├── curriculum-aws-crash-course-for-beginners.html
│   │   ├── curriculum-azure-security-technologies-az-500.html
│   │   ├── curriculum-backend-development-crash-course.html
│   │   └── ... and 102 more files/folders
│   ├── fonts
│   │   ├── lato-bold.woff2
│   │   ├── lato-regular.woff2
│   │   ├── lato.zip
│   │   ├── montserrat-bold.woff2
│   │   └── montserrat.zip
│   ├── forms
│   │   ├── assets
│   │   │   ├── forms.css
│   │   │   └── forms.js
│   │   ├── branding
│   │   │   └── logo-design
│   │   │       ├── logo-basic
│   │   │       │   └── index.html
│   │   │       ├── logo-premium
│   │   │       │   └── index.html
│   │   │       └── logo-standard
│   │   │           └── index.html
│   │   ├── branding-design
│   │   │   └── professional-branding
│   │   │       └── index.html
│   │   ├── business-and-strategy
│   │   │   └── business-plan-package
│   │   │       └── index.html
│   │   ├── business-strategy
│   │   │   ├── business-plan
│   │   │   │   ├── bp-basic
│   │   │   │   │   └── index.html
│   │   │   │   ├── bp-premium
│   │   │   │   │   └── index.html
│   │   │   │   └── bp-standard
│   │   │   │       └── index.html
│   │   │   └── growth-plan
│   │   │       ├── growth-basic
│   │   │       │   └── index.html
│   │   │       ├── growth-premium
│   │   │       │   └── index.html
│   │   │       └── growth-standard
│   │   │           └── index.html
│   │   ├── consulting-advisory
│   │   │   └── business-consulting
│   │   │       └── index.html
│   │   ├── creative-services
│   │   │   └── portfolio-website
│   │   │       └── index.html
│   │   ├── digital-marketing
│   │   │   └── marketing-strategy
│   │   │       └── index.html
│   │   ├── general-inquiry
│   │   │   └── index.html
│   │   ├── individual-services
│   │   │   ├── ad-campaign
│   │   │   │   └── index.html
│   │   │   ├── bug-fix-monthly
│   │   │   │   └── index.html
│   │   │   ├── business-cards
│   │   │   │   └── index.html
│   │   │   ├── business-plan-review
│   │   │   │   └── index.html
│   │   │   ├── content-package
│   │   │   │   └── index.html
│   │   │   ├── cv-resume
│   │   │   │   └── index.html
│   │   │   ├── executive-summary
│   │   │   │   └── index.html
│   │   │   ├── linkedin-optimization
│   │   │   │   └── index.html
│   │   │   ├── logo-design
│   │   │   │   └── index.html
│   │   │   ├── market-research
│   │   │   │   └── index.html
│   │   │   ├── payment-gateway
│   │   │   │   └── index.html
│   │   │   ├── pitch-deck
│   │   │   │   └── index.html
│   │   │   ├── pitch-practice
│   │   │   │   └── index.html
│   │   │   ├── portfolio-website
│   │   │   │   └── index.html
│   │   │   ├── seo-audit
│   │   │   │   └── index.html
│   │   │   ├── social-audit
│   │   │   │   └── index.html
│   │   │   ├── social-media-kit
│   │   │   │   └── index.html
│   │   │   ├── speed-optimization
│   │   │   │   └── index.html
│   │   │   ├── strategy-call
│   │   │   │   └── index.html
│   │   │   ├── website-redesign
│   │   │   │   └── index.html
│   │   │   └── index.html
│   │   ├── marketing
│   │   │   ├── marketing-strategy
│   │   │   │   ├── market-basic
│   │   │   │   │   └── index.html
│   │   │   │   ├── market-premium
│   │   │   │   │   └── index.html
│   │   │   │   └── market-standard
│   │   │   │       └── index.html
│   │   │   └── social-media
│   │   │       ├── socmed-basic
│   │   │       │   └── index.html
│   │   │       ├── socmed-premium
│   │   │       │   └── index.html
│   │   │       └── socmed-standard
│   │   │           └── index.html
│   │   ├── portfolio
│   │   │   ├── cv-resume
│   │   │   │   ├── cv-essential
│   │   │   │   │   └── index.html
│   │   │   │   ├── cv-executive
│   │   │   │   │   └── index.html
│   │   │   │   └── cv-professional
│   │   │   │       └── index.html
│   │   │   ├── linkedin-optimization
│   │   │   │   ├── linkedin-complete
│   │   │   │   │   └── index.html
│   │   │   │   ├── linkedin-executive
│   │   │   │   │   └── index.html
│   │   │   │   └── linkedin-quick
│   │   │   │       └── index.html
│   │   │   └── portfolio-website
│   │   │       ├── portfolio-premium
│   │   │       │   └── index.html
│   │   │       ├── portfolio-professional
│   │   │       │   └── index.html
│   │   │       └── portfolio-starter
│   │   │           └── index.html
│   │   ├── profile-and-portfolio
│   │   │   ├── cv-resume-professional
│   │   │   │   └── index.html
│   │   │   ├── linkedin-complete-makeover
│   │   │   │   └── index.html
│   │   │   ├── cv-resume-professional.html
│   │   │   └── linkedin-complete-makeover.html
│   │   ├── social-media
│   │   │   ├── hexadigitall-logo.png
│   │   │   ├── index-original-backup.html
│   │   │   └── index.html
│   │   ├── web-and-mobile
│   │   │   ├── business-website
│   │   │   │   └── index.html
│   │   │   ├── ecommerce-store
│   │   │   │   └── index.html
│   │   │   ├── landing-page
│   │   │   │   └── index.html
│   │   │   └── web-app-development
│   │   │       └── index.html
│   │   ├── web-development
│   │   │   ├── business-website
│   │   │   │   ├── business-website-basic
│   │   │   │   │   └── index.html
│   │   │   │   ├── business-website-premium
│   │   │   │   │   └── index.html
│   │   │   │   └── business-website-standard
│   │   │   │       └── index.html
│   │   │   ├── ecommerce-store
│   │   │   │   ├── ecommerce-basic
│   │   │   │   │   └── index.html
│   │   │   │   ├── ecommerce-premium
│   │   │   │   │   └── index.html
│   │   │   │   └── ecommerce-standard
│   │   │   │       └── index.html
│   │   │   ├── landing-page
│   │   │   │   ├── landing-page-basic
│   │   │   │   │   └── index.html
│   │   │   │   ├── landing-page-premium
│   │   │   │   │   └── index.html
│   │   │   │   └── landing-page-standard
│   │   │   │       └── index.html
│   │   │   └── web-app
│   │   │       ├── webapp-business
│   │   │       │   └── index.html
│   │   │       ├── webapp-enterprise
│   │   │       │   └── index.html
│   │   │       └── webapp-startup
│   │   │           └── index.html
│   │   └── index.html
│   ├── og-images
│   │   ├── advanced-ansible-automation-iac.jpg
│   │   ├── advanced-backend-engineering-node-js-microservices-.jpg
│   │   ├── advanced-seo-rank-1-on-google.jpg
│   │   ├── advanced-seo-serp-ranking-mastery.jpg
│   │   ├── ai-engineering-building-llms-neural-networks.jpg
│   │   ├── applied-machine-learning-data-science.jpg
│   │   ├── architecting-landing-zones.jpg
│   │   ├── aws-certified-solutions-architect-associate-professional-.jpg
│   │   ├── aws-certified-solutions-architect-associate-professional-2.jpg
│   │   ├── aws-certified-solutions-architect-associate-professional-3.jpg
│   │   ├── bp-growth-basic.jpg
│   │   ├── bp-growth-premium.jpg
│   │   ├── bp-growth-standard.jpg
│   │   ├── bp-starter-basic.jpg
│   │   ├── bp-starter-premium.jpg
│   │   ├── bp-starter-standard.jpg
│   │   ├── bug-fix-support.jpg
│   │   ├── business-coaching-basic.jpg
│   │   ├── business-coaching-premium.jpg
│   │   ├── business-coaching-standard.jpg
│   │   ├── business-coaching.jpg
│   │   ├── business-plan-and-logo-design.jpg
│   │   ├── business-plan-growth.jpg
│   │   ├── business-plan-premium.jpg
│   │   ├── business-plan-standard.jpg
│   │   └── ... and 375 more files/folders
│   ├── roadmaps
│   │   └── roadmap-cloud-security-engineer.html
│   ├── social-preview
│   │   └── README.md
│   ├── static
│   │   ├── SanityVision-9uo3KlLC.js
│   │   ├── VideoPlayer-aDL46I3D.js
│   │   ├── ViteDevServerStopped-xo1pwa8h.js
│   │   ├── a50194d2.create-schema.json
│   │   ├── apple-touch-icon.png
│   │   ├── bash-CG6S6Dwl.js
│   │   ├── browser-Dn51dcC7.js
│   │   ├── create-manifest.json
│   │   ├── ef87c8fe.create-tools.json
│   │   ├── favicon-192.png
│   │   ├── favicon-512.png
│   │   ├── favicon-96.png
│   │   ├── favicon.ico
│   │   ├── favicon.svg
│   │   ├── groq-BSgH9Pcp.js
│   │   ├── index-BjuBiSjk.js
│   │   ├── index2-CRNX8Sjz.js
│   │   ├── index3-zeQuyGW7.js
│   │   ├── index4-DXG4lNR1.js
│   │   ├── javascript-BJ-GTedN.js
│   │   ├── json-unC8z3UW.js
│   │   ├── jsx-BQ6XNmEo.js
│   │   ├── manifest.webmanifest
│   │   ├── refractor-CfhyEo1P.js
│   │   ├── resources-Belq_sQk.js
│   │   └── ... and 11 more files/folders
│   ├── textbooks
│   │   ├── kdp
│   │   │   ├── architecting-landing-zones
│   │   │   │   ├── covers
│   │   │   │   │   ├── architecting-landing-zones-hardcover-fullwrap.pdf
│   │   │   │   │   ├── architecting-landing-zones-kindle-cover.jpg
│   │   │   │   │   ├── architecting-landing-zones-kindle-cover.tiff
│   │   │   │   │   └── architecting-landing-zones-paperback-fullwrap.pdf
│   │   │   │   ├── imgs
│   │   │   │   ├── pdfs
│   │   │   │   │   ├── architecting-landing-zones-kdp-6x9-hardcover-teacher.pdf
│   │   │   │   │   ├── architecting-landing-zones-kdp-6x9-hardcover.pdf
│   │   │   │   │   ├── architecting-landing-zones-kdp-6x9-teacher.pdf
│   │   │   │   │   └── architecting-landing-zones-kdp-6x9.pdf
│   │   │   │   ├── architecting-landing-zones-kdp-6x9-hardcover-teacher.html
│   │   │   │   ├── architecting-landing-zones-kdp-6x9-hardcover.html
│   │   │   │   ├── architecting-landing-zones-kdp-6x9-teacher.html
│   │   │   │   ├── architecting-landing-zones-kdp-6x9.html
│   │   │   │   ├── architecting-landing-zones-kdp-cover-fullwrap.html
│   │   │   │   ├── architecting-landing-zones-kdp-cover-hardcover-fullwrap.html
│   │   │   │   ├── architecting-landing-zones-kdp-cover.html
│   │   │   │   ├── architecting-landing-zones-kdp-preliminary-pages.html
│   │   │   │   ├── architecting-landing-zones-kindle-cover.html
│   │   │   │   ├── architecting-landing-zones-student-textbook.html
│   │   │   │   └── architecting-landing-zones-textbook.html
│   │   │   ├── devops-engineering-cloud-infrastructure-core
│   │   │   │   ├── covers
│   │   │   │   │   ├── devops-kdp-cover-fullwrap.pdf
│   │   │   │   │   ├── devops-kdp-cover-hardcover-fullwrap.pdf
│   │   │   │   │   ├── devops-kindle-cover.jpg
│   │   │   │   │   └── devops-kindle-cover.tiff
│   │   │   │   ├── imgs
│   │   │   │   ├── pdfs
│   │   │   │   │   ├── exports
│   │   │   │   │   ├── devops-kdp-6x9-hardcover-teacher.pdf
│   │   │   │   │   ├── devops-kdp-6x9-hardcover.pdf
│   │   │   │   │   ├── devops-kdp-6x9-teacher.pdf
│   │   │   │   │   └── devops-kdp-6x9.pdf
│   │   │   │   ├── devops-engineering-cloud-infrastructure-core-student-textbook.html
│   │   │   │   ├── devops-engineering-cloud-infrastructure-core-textbook.html
│   │   │   │   ├── devops-kdp-6x9-hardcover-teacher.html
│   │   │   │   ├── devops-kdp-6x9-hardcover.html
│   │   │   │   ├── devops-kdp-6x9-teacher.html
│   │   │   │   ├── devops-kdp-6x9.html
│   │   │   │   ├── devops-kdp-cover-fullwrap.html
│   │   │   │   ├── devops-kdp-cover-hardcover-fullwrap.html
│   │   │   │   ├── devops-kdp-cover.html
│   │   │   │   ├── devops-kdp-preliminary-pages.html
│   │   │   │   └── devops-kindle-cover.html
│   │   │   ├── dunce-to-midjourney-pro
│   │   │   │   ├── covers
│   │   │   │   │   ├── .gitkeep
│   │   │   │   │   ├── dunce-to-midjourney-pro-kdp-cover-fullwrap.pdf
│   │   │   │   │   ├── dunce-to-midjourney-pro-kdp-cover-hardcover-fullwrap.pdf
│   │   │   │   │   ├── dunce-to-midjourney-pro-kdp-cover.jpg
│   │   │   │   │   ├── dunce-to-midjourney-pro-kdp-cover.tiff
│   │   │   │   │   ├── dunce-to-midjourney-pro-kindle-cover.jpg
│   │   │   │   │   └── dunce-to-midjourney-pro-kindle-cover.tiff
│   │   │   │   ├── imgs
│   │   │   │   │   └── .gitkeep
│   │   │   │   ├── pdfs
│   │   │   │   │   ├── .gitkeep
│   │   │   │   │   ├── dunce-to-midjourney-pro-kdp-6x9-hardcover.pdf
│   │   │   │   │   └── dunce-to-midjourney-pro-kdp-6x9.pdf
│   │   │   │   ├── cover-img-dunce-to-midjourney-pro-square.png
│   │   │   │   ├── cover-img-dunce-to-midjourney-pro-wtext.png
│   │   │   │   ├── cover-img-dunce-to-midjourney-pro.png
│   │   │   │   ├── dunce-to-midjourney-pro-kdp-6x9-hardcover.html
│   │   │   │   ├── dunce-to-midjourney-pro-kdp-6x9.html
│   │   │   │   ├── dunce-to-midjourney-pro-kdp-cover-fullwrap.html
│   │   │   │   ├── dunce-to-midjourney-pro-kdp-cover-hardcover-fullwrap.html
│   │   │   │   ├── dunce-to-midjourney-pro-kdp-cover.html
│   │   │   │   ├── dunce-to-midjourney-pro-kdp-preliminary-pages.html
│   │   │   │   ├── dunce-to-midjourney-pro-kindle-cover.html
│   │   │   │   └── dunce-to-midjourney-pro.html
│   │   │   ├── exports
│   │   │   │   └── pdf
│   │   │   └── KDP_PUBLISHING_GUIDE.md
│   │   ├── devops-engineering-cloud-infrastructure-core-student-textbook.html
│   │   ├── devops-engineering-cloud-infrastructure-core-textbook.html
│   │   ├── dunce-to-midjourney-pro-textbook.html
│   │   └── textbook-assessment-renderer.js
│   ├── PUBLIC_FOLDER_WIREFRAME.md
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── apple-touch-icon.png
│   ├── browserconfig.xml
│   ├── digital_marketing2.jpg
│   ├── digital_partner_.png
│   ├── digitall_partner.png
│   ├── favicon-16.ico
│   ├── favicon-16x16.png
│   ├── favicon-32.ico
│   ├── favicon-32x32.png
│   ├── favicon.ico
│   ├── hexadigitall-logo-transparent.png
│   ├── hexadigitall-logo-transparent.svg
│   ├── hexadigitall-logo.svg
│   └── ... and 5 more files/folders
├── docs
│   ├── COURSE_MIGRATION_GUIDE.md
│   ├── EMAIL_SETUP.md
│   ├── FAVICON_SETUP.md
│   ├── Fully_Updated_Course_List_Plus_Data_for_Sanity_Studio.md
│   ├── MIGRATION_QUICKSTART.md
│   ├── SANITY_STUDIO_FIX_GUIDE.md
│   ├── SOCIAL_SHARE_GUIDE.md
│   └── og-share-investigation.md
├── promotional-campaign
│   ├── content
│   │   ├── SALES_STRATEGY.md
│   │   ├── SEO_CONTENT_STRATEGY.md
│   │   └── SOCIAL_MEDIA_CONTENT.md
│   ├── pdfs
│   │   ├── CAMPAIGN_STRATEGY.html
│   │   ├── CAMPAIGN_TRACKING_GUIDE.html
│   │   ├── CONTENT_CALENDAR_30DAYS.html
│   │   ├── EMAIL_NURTURE_SEQUENCES.html
│   │   ├── INDEX.html
│   │   ├── LAUNCH_DAY_CHECKLIST.html
│   │   ├── MASTER_PLAYBOOK.html
│   │   ├── QUICK_REFERENCE.html
│   │   ├── README.html
│   │   ├── SALES_STRATEGY.html
│   │   ├── SEO_CONTENT_STRATEGY.html
│   │   ├── SOCIAL_MEDIA_CONTENT.html
│   │   ├── SOCIAL_SHARE_GUIDE.html
│   │   └── SWIPE_FILE.html
│   ├── tracking
│   │   └── sample_campaign_data.csv
│   ├── CAMPAIGN_LAUNCH_PAD_DEC27.md
│   ├── CAMPAIGN_STRATEGY.md
│   ├── CAMPAIGN_TRACKING_GUIDE.md
│   ├── CONTENT_CALENDAR_30DAYS.md
│   ├── EMAIL_NURTURE_SEQUENCES.md
│   ├── FOLDER_WIREFRAME.md
│   ├── FOLDER_WIREFRAME_FULL.md
│   ├── LAUNCH_DAY_CHECKLIST.md
│   ├── MASTER_PLAYBOOK.md
│   ├── README.md
│   ├── SWIPE_FILE.md
│   ├── download-images.cjs
│   ├── download-people-images.cjs
│   ├── generate-course-og-images.cjs
│   ├── generate-images-v2.cjs
│   ├── generate-images-v3.cjs
│   ├── generate-images-v4.cjs
│   ├── generate-images-v5.cjs
│   └── generate-images.cjs
├── proposals
│   ├── divas-kloset-outreach.md
│   ├── jhema-wears-outreach.md
│   └── jhema-wears-proposal.md
├── public
│   ├── assets
│   │   └── images
│   │       ├── heroes
│   │       │   ├── hero-students-learning.jpg
│   │       │   ├── hero-success-celebration.jpg
│   │       │   └── hero-tech-team.jpg
│   │       ├── people
│   │       │   ├── african-american-man-wearing-red-sweater-excited-chip.webp
│   │       │   ├── front-view-happy-woman-calling-out-chip.webp
│   │       │   ├── front-view-happy-woman-calling-out-hero.webp
│   │       │   ├── portrait-cool-man-with-sunglasses-dancing-smiling-alt-chip.webp
│   │       │   ├── portrait-cool-man-with-sunglasses-dancing-smiling-chip.webp
│   │       │   └── surprised-playful-touched-good-looking-african-american-woman-glasses-chip.webp
│   │       ├── team
│   │       │   ├── diverse-team.jpg
│   │       │   ├── happy-businessman.jpg
│   │       │   └── smiling-developer.jpg
│   │       └── testimonials
│   │           ├── testimonial-person-1.jpg
│   │           ├── testimonial-person-2.jpg
│   │           └── testimonial-person-3.jpg
│   ├── curriculums
│   │   ├── pdfs
│   │   │   ├── advanced-ansible-automation-curriculum.pdf
│   │   │   ├── azure-security-technologies-az-500.pdf
│   │   │   ├── curriculum-azure-security-az500.pdf
│   │   │   ├── curriculum-javascript-fundamentals.pdf
│   │   │   ├── curriculum-linux-shell-scripting.pdf
│   │   │   ├── devops-engineering-cloud-infrastructure-core.pdf
│   │   │   ├── executive-agile-leadership-curriculum.pdf
│   │   │   └── linux-administration-shell-scripting.pdf
│   │   ├── curriculum-adobe-creative-cloud-suite.html
│   │   ├── curriculum-adsense-101-approval-blueprint.html
│   │   ├── curriculum-adsense-arbitrage-pro.html
│   │   ├── curriculum-adsense-traffic-revenue.html
│   │   ├── curriculum-advanced-ansible-automation.html
│   │   ├── curriculum-advanced-backend-nodejs.html
│   │   ├── curriculum-advanced-css-mastery.html
│   │   ├── curriculum-advanced-excel-business.html
│   │   ├── curriculum-advanced-javascript-mastery.html
│   │   ├── curriculum-advanced-seo-mastery.html
│   │   ├── curriculum-advanced-ui-ux.html
│   │   ├── curriculum-agile-project-management-essentials.html
│   │   ├── curriculum-ai-engineering-llms.html
│   │   ├── curriculum-ai-engineering-mlops.html
│   │   ├── curriculum-amazon-retail-media-networks.html
│   │   ├── curriculum-application-security-appsec-specialist.html
│   │   ├── curriculum-applied-machine-learning.html
│   │   ├── curriculum-archicad-professional.html
│   │   ├── curriculum-architecting-landing-zones.html
│   │   ├── curriculum-autocad-masterclass.html
│   │   ├── curriculum-aws-certified-solutions-architect.html
│   │   ├── curriculum-aws-crash-course-for-beginners.html
│   │   ├── curriculum-azure-security-technologies-az-500.html
│   │   ├── curriculum-backend-development-crash-course.html
│   │   └── ... and 102 more files/folders
│   ├── fonts
│   │   ├── lato-bold.woff2
│   │   ├── lato-regular.woff2
│   │   ├── lato.zip
│   │   ├── montserrat-bold.woff2
│   │   └── montserrat.zip
│   ├── forms
│   │   ├── assets
│   │   │   ├── forms.css
│   │   │   └── forms.js
│   │   ├── branding
│   │   │   └── logo-design
│   │   │       ├── logo-basic
│   │   │       │   └── index.html
│   │   │       ├── logo-premium
│   │   │       │   └── index.html
│   │   │       └── logo-standard
│   │   │           └── index.html
│   │   ├── branding-design
│   │   │   └── professional-branding
│   │   │       └── index.html
│   │   ├── business-and-strategy
│   │   │   └── business-plan-package
│   │   │       └── index.html
│   │   ├── business-strategy
│   │   │   ├── business-plan
│   │   │   │   ├── bp-basic
│   │   │   │   │   └── index.html
│   │   │   │   ├── bp-premium
│   │   │   │   │   └── index.html
│   │   │   │   └── bp-standard
│   │   │   │       └── index.html
│   │   │   └── growth-plan
│   │   │       ├── growth-basic
│   │   │       │   └── index.html
│   │   │       ├── growth-premium
│   │   │       │   └── index.html
│   │   │       └── growth-standard
│   │   │           └── index.html
│   │   ├── consulting-advisory
│   │   │   └── business-consulting
│   │   │       └── index.html
│   │   ├── creative-services
│   │   │   └── portfolio-website
│   │   │       └── index.html
│   │   ├── digital-marketing
│   │   │   └── marketing-strategy
│   │   │       └── index.html
│   │   ├── general-inquiry
│   │   │   └── index.html
│   │   ├── individual-services
│   │   │   ├── ad-campaign
│   │   │   │   └── index.html
│   │   │   ├── bug-fix-monthly
│   │   │   │   └── index.html
│   │   │   ├── business-cards
│   │   │   │   └── index.html
│   │   │   ├── business-plan-review
│   │   │   │   └── index.html
│   │   │   ├── content-package
│   │   │   │   └── index.html
│   │   │   ├── cv-resume
│   │   │   │   └── index.html
│   │   │   ├── executive-summary
│   │   │   │   └── index.html
│   │   │   ├── linkedin-optimization
│   │   │   │   └── index.html
│   │   │   ├── logo-design
│   │   │   │   └── index.html
│   │   │   ├── market-research
│   │   │   │   └── index.html
│   │   │   ├── payment-gateway
│   │   │   │   └── index.html
│   │   │   ├── pitch-deck
│   │   │   │   └── index.html
│   │   │   ├── pitch-practice
│   │   │   │   └── index.html
│   │   │   ├── portfolio-website
│   │   │   │   └── index.html
│   │   │   ├── seo-audit
│   │   │   │   └── index.html
│   │   │   ├── social-audit
│   │   │   │   └── index.html
│   │   │   ├── social-media-kit
│   │   │   │   └── index.html
│   │   │   ├── speed-optimization
│   │   │   │   └── index.html
│   │   │   ├── strategy-call
│   │   │   │   └── index.html
│   │   │   ├── website-redesign
│   │   │   │   └── index.html
│   │   │   └── index.html
│   │   ├── marketing
│   │   │   ├── marketing-strategy
│   │   │   │   ├── market-basic
│   │   │   │   │   └── index.html
│   │   │   │   ├── market-premium
│   │   │   │   │   └── index.html
│   │   │   │   └── market-standard
│   │   │   │       └── index.html
│   │   │   └── social-media
│   │   │       ├── socmed-basic
│   │   │       │   └── index.html
│   │   │       ├── socmed-premium
│   │   │       │   └── index.html
│   │   │       └── socmed-standard
│   │   │           └── index.html
│   │   ├── portfolio
│   │   │   ├── cv-resume
│   │   │   │   ├── cv-essential
│   │   │   │   │   └── index.html
│   │   │   │   ├── cv-executive
│   │   │   │   │   └── index.html
│   │   │   │   └── cv-professional
│   │   │   │       └── index.html
│   │   │   ├── linkedin-optimization
│   │   │   │   ├── linkedin-complete
│   │   │   │   │   └── index.html
│   │   │   │   ├── linkedin-executive
│   │   │   │   │   └── index.html
│   │   │   │   └── linkedin-quick
│   │   │   │       └── index.html
│   │   │   └── portfolio-website
│   │   │       ├── portfolio-premium
│   │   │       │   └── index.html
│   │   │       ├── portfolio-professional
│   │   │       │   └── index.html
│   │   │       └── portfolio-starter
│   │   │           └── index.html
│   │   ├── profile-and-portfolio
│   │   │   ├── cv-resume-professional
│   │   │   │   └── index.html
│   │   │   ├── linkedin-complete-makeover
│   │   │   │   └── index.html
│   │   │   ├── cv-resume-professional.html
│   │   │   └── linkedin-complete-makeover.html
│   │   ├── social-media
│   │   │   ├── hexadigitall-logo.png
│   │   │   ├── index-original-backup.html
│   │   │   └── index.html
│   │   ├── web-and-mobile
│   │   │   ├── business-website
│   │   │   │   └── index.html
│   │   │   ├── ecommerce-store
│   │   │   │   └── index.html
│   │   │   ├── landing-page
│   │   │   │   └── index.html
│   │   │   └── web-app-development
│   │   │       └── index.html
│   │   ├── web-development
│   │   │   ├── business-website
│   │   │   │   ├── business-website-basic
│   │   │   │   │   └── index.html
│   │   │   │   ├── business-website-premium
│   │   │   │   │   └── index.html
│   │   │   │   └── business-website-standard
│   │   │   │       └── index.html
│   │   │   ├── ecommerce-store
│   │   │   │   ├── ecommerce-basic
│   │   │   │   │   └── index.html
│   │   │   │   ├── ecommerce-premium
│   │   │   │   │   └── index.html
│   │   │   │   └── ecommerce-standard
│   │   │   │       └── index.html
│   │   │   ├── landing-page
│   │   │   │   ├── landing-page-basic
│   │   │   │   │   └── index.html
│   │   │   │   ├── landing-page-premium
│   │   │   │   │   └── index.html
│   │   │   │   └── landing-page-standard
│   │   │   │       └── index.html
│   │   │   └── web-app
│   │   │       ├── webapp-business
│   │   │       │   └── index.html
│   │   │       ├── webapp-enterprise
│   │   │       │   └── index.html
│   │   │       └── webapp-startup
│   │   │           └── index.html
│   │   └── index.html
│   ├── og-images
│   │   ├── advanced-ansible-automation-iac.jpg
│   │   ├── advanced-backend-engineering-node-js-microservices-.jpg
│   │   ├── advanced-seo-rank-1-on-google.jpg
│   │   ├── advanced-seo-serp-ranking-mastery.jpg
│   │   ├── ai-engineering-building-llms-neural-networks.jpg
│   │   ├── applied-machine-learning-data-science.jpg
│   │   ├── architecting-landing-zones.jpg
│   │   ├── aws-certified-solutions-architect-associate-professional-.jpg
│   │   ├── aws-certified-solutions-architect-associate-professional-2.jpg
│   │   ├── aws-certified-solutions-architect-associate-professional-3.jpg
│   │   ├── bp-growth-basic.jpg
│   │   ├── bp-growth-premium.jpg
│   │   ├── bp-growth-standard.jpg
│   │   ├── bp-starter-basic.jpg
│   │   ├── bp-starter-premium.jpg
│   │   ├── bp-starter-standard.jpg
│   │   ├── bug-fix-support.jpg
│   │   ├── business-coaching-basic.jpg
│   │   ├── business-coaching-premium.jpg
│   │   ├── business-coaching-standard.jpg
│   │   ├── business-coaching.jpg
│   │   ├── business-plan-and-logo-design.jpg
│   │   ├── business-plan-growth.jpg
│   │   ├── business-plan-premium.jpg
│   │   ├── business-plan-standard.jpg
│   │   └── ... and 375 more files/folders
│   ├── roadmaps
│   │   └── roadmap-cloud-security-engineer.html
│   ├── social-preview
│   │   └── README.md
│   ├── textbooks
│   │   ├── kdp
│   │   │   ├── architecting-landing-zones
│   │   │   │   ├── covers
│   │   │   │   │   ├── architecting-landing-zones-hardcover-fullwrap.pdf
│   │   │   │   │   ├── architecting-landing-zones-kindle-cover.jpg
│   │   │   │   │   ├── architecting-landing-zones-kindle-cover.tiff
│   │   │   │   │   └── architecting-landing-zones-paperback-fullwrap.pdf
│   │   │   │   ├── imgs
│   │   │   │   ├── pdfs
│   │   │   │   │   ├── architecting-landing-zones-kdp-6x9-hardcover-teacher.pdf
│   │   │   │   │   ├── architecting-landing-zones-kdp-6x9-hardcover.pdf
│   │   │   │   │   ├── architecting-landing-zones-kdp-6x9-teacher.pdf
│   │   │   │   │   └── architecting-landing-zones-kdp-6x9.pdf
│   │   │   │   ├── architecting-landing-zones-kdp-6x9-hardcover-teacher.html
│   │   │   │   ├── architecting-landing-zones-kdp-6x9-hardcover.html
│   │   │   │   ├── architecting-landing-zones-kdp-6x9-teacher.html
│   │   │   │   ├── architecting-landing-zones-kdp-6x9.html
│   │   │   │   ├── architecting-landing-zones-kdp-cover-fullwrap.html
│   │   │   │   ├── architecting-landing-zones-kdp-cover-hardcover-fullwrap.html
│   │   │   │   ├── architecting-landing-zones-kdp-cover.html
│   │   │   │   ├── architecting-landing-zones-kdp-preliminary-pages.html
│   │   │   │   ├── architecting-landing-zones-kindle-cover.html
│   │   │   │   ├── architecting-landing-zones-student-textbook.html
│   │   │   │   └── architecting-landing-zones-textbook.html
│   │   │   ├── devops-engineering-cloud-infrastructure-core
│   │   │   │   ├── covers
│   │   │   │   │   ├── devops-kdp-cover-fullwrap.pdf
│   │   │   │   │   ├── devops-kdp-cover-hardcover-fullwrap.pdf
│   │   │   │   │   ├── devops-kindle-cover.jpg
│   │   │   │   │   └── devops-kindle-cover.tiff
│   │   │   │   ├── imgs
│   │   │   │   ├── pdfs
│   │   │   │   │   ├── exports
│   │   │   │   │   ├── devops-kdp-6x9-hardcover-teacher.pdf
│   │   │   │   │   ├── devops-kdp-6x9-hardcover.pdf
│   │   │   │   │   ├── devops-kdp-6x9-teacher.pdf
│   │   │   │   │   └── devops-kdp-6x9.pdf
│   │   │   │   ├── devops-engineering-cloud-infrastructure-core-student-textbook.html
│   │   │   │   ├── devops-engineering-cloud-infrastructure-core-textbook.html
│   │   │   │   ├── devops-kdp-6x9-hardcover-teacher.html
│   │   │   │   ├── devops-kdp-6x9-hardcover.html
│   │   │   │   ├── devops-kdp-6x9-teacher.html
│   │   │   │   ├── devops-kdp-6x9.html
│   │   │   │   ├── devops-kdp-cover-fullwrap.html
│   │   │   │   ├── devops-kdp-cover-hardcover-fullwrap.html
│   │   │   │   ├── devops-kdp-cover.html
│   │   │   │   ├── devops-kdp-preliminary-pages.html
│   │   │   │   └── devops-kindle-cover.html
│   │   │   ├── dunce-to-midjourney-pro
│   │   │   │   ├── covers
│   │   │   │   │   ├── .gitkeep
│   │   │   │   │   ├── dunce-to-midjourney-pro-kdp-cover-fullwrap.pdf
│   │   │   │   │   ├── dunce-to-midjourney-pro-kdp-cover-hardcover-fullwrap.pdf
│   │   │   │   │   ├── dunce-to-midjourney-pro-kdp-cover.jpg
│   │   │   │   │   ├── dunce-to-midjourney-pro-kdp-cover.tiff
│   │   │   │   │   ├── dunce-to-midjourney-pro-kindle-cover.jpg
│   │   │   │   │   └── dunce-to-midjourney-pro-kindle-cover.tiff
│   │   │   │   ├── imgs
│   │   │   │   │   └── .gitkeep
│   │   │   │   ├── pdfs
│   │   │   │   │   ├── .gitkeep
│   │   │   │   │   ├── dunce-to-midjourney-pro-kdp-6x9-hardcover.pdf
│   │   │   │   │   └── dunce-to-midjourney-pro-kdp-6x9.pdf
│   │   │   │   ├── cover-img-dunce-to-midjourney-pro-square.png
│   │   │   │   ├── cover-img-dunce-to-midjourney-pro-wtext.png
│   │   │   │   ├── cover-img-dunce-to-midjourney-pro.png
│   │   │   │   ├── dunce-to-midjourney-pro-kdp-6x9-hardcover.html
│   │   │   │   ├── dunce-to-midjourney-pro-kdp-6x9.html
│   │   │   │   ├── dunce-to-midjourney-pro-kdp-cover-fullwrap.html
│   │   │   │   ├── dunce-to-midjourney-pro-kdp-cover-hardcover-fullwrap.html
│   │   │   │   ├── dunce-to-midjourney-pro-kdp-cover.html
│   │   │   │   ├── dunce-to-midjourney-pro-kdp-preliminary-pages.html
│   │   │   │   ├── dunce-to-midjourney-pro-kindle-cover.html
│   │   │   │   └── dunce-to-midjourney-pro.html
│   │   │   ├── exports
│   │   │   │   └── pdf
│   │   │   └── KDP_PUBLISHING_GUIDE.md
│   │   ├── devops-engineering-cloud-infrastructure-core-student-textbook.html
│   │   ├── devops-engineering-cloud-infrastructure-core-textbook.html
│   │   ├── dunce-to-midjourney-pro-textbook.html
│   │   └── textbook-assessment-renderer.js
│   ├── PUBLIC_FOLDER_WIREFRAME.md
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── apple-touch-icon.png
│   ├── browserconfig.xml
│   ├── digital_marketing2.jpg
│   ├── digital_partner_.png
│   ├── digitall_partner.png
│   ├── favicon-16.ico
│   ├── favicon-16x16.png
│   ├── favicon-32.ico
│   ├── favicon-32x32.png
│   ├── favicon.ico
│   ├── hexadigitall-logo-transparent.png
│   ├── hexadigitall-logo-transparent.svg
│   ├── hexadigitall-logo.svg
│   ├── manifest.json
│   └── ... and 3 more files/folders
├── sample-data
│   ├── README.md
│   ├── service-categories-ngn.json
│   └── service-categories.json
├── sanity
│   ├── schemas
│   │   ├── author.ts
│   │   ├── publication.ts
│   │   └── resourceMatrix.ts
│   └── schema.ts
├── scripts
│   └── ... (collapsed)
├── src
│   ├── __tests__
│   │   ├── accessibilityFlow.test.tsx
│   │   └── discountLogic.test.tsx
│   ├── app
│   │   ├── about
│   │   │   └── page.tsx
│   │   ├── admin
│   │   │   ├── analytics
│   │   │   │   └── page.tsx
│   │   │   ├── dashboard
│   │   │   │   └── page.tsx
│   │   │   ├── enrollments
│   │   │   │   ├── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── login
│   │   │   │   └── page.tsx
│   │   │   ├── operations
│   │   │   │   └── page.tsx
│   │   │   ├── settings
│   │   │   │   └── page.tsx
│   │   │   ├── submissions
│   │   │   │   ├── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   └── users
│   │   │       └── page.tsx
│   │   ├── api
│   │   │   ├── admin
│   │   │   │   ├── analytics
│   │   │   │   │   └── route.ts
│   │   │   │   ├── auth
│   │   │   │   │   └── route.ts
│   │   │   │   ├── courses
│   │   │   │   │   └── route.ts
│   │   │   │   ├── dashboard
│   │   │   │   │   └── route.ts
│   │   │   │   ├── enrollments
│   │   │   │   │   └── route.ts
│   │   │   │   ├── operations
│   │   │   │   │   └── route.ts
│   │   │   │   ├── settings
│   │   │   │   │   └── password
│   │   │   │   │       └── route.ts
│   │   │   │   ├── submissions
│   │   │   │   │   └── route.ts
│   │   │   │   └── users
│   │   │   │       ├── [id]
│   │   │   │       │   ├── courses
│   │   │   │       │   │   └── route.ts
│   │   │   │       │   ├── enrollments
│   │   │   │       │   │   └── route.ts
│   │   │   │       │   └── route.ts
│   │   │   │       └── route.ts
│   │   │   ├── analytics
│   │   │   │   └── route.ts
│   │   │   ├── assessments
│   │   │   │   └── [courseSlug]
│   │   │   │       └── [assessmentSlug]
│   │   │   │           ├── save
│   │   │   │           │   └── route.ts
│   │   │   │           ├── start
│   │   │   │           │   └── route.ts
│   │   │   │           └── submit
│   │   │   │               └── route.ts
│   │   │   ├── auth
│   │   │   │   ├── [...nextauth]
│   │   │   │   │   └── route.ts
│   │   │   │   ├── login
│   │   │   │   │   └── route.ts
│   │   │   │   ├── oauth
│   │   │   │   │   └── session-login
│   │   │   │   │       └── route.ts
│   │   │   │   ├── register
│   │   │   │   │   └── route.ts
│   │   │   │   ├── teacher-oauth-claim
│   │   │   │   │   └── route.ts
│   │   │   │   ├── teacher-oauth-session-login
│   │   │   │   │   └── route.ts
│   │   │   │   └── verify-email
│   │   │   │       └── route.ts
│   │   │   ├── campaign
│   │   │   │   └── leads
│   │   │   │       └── route.ts
│   │   │   ├── contact
│   │   │   │   └── route.ts
│   │   │   ├── course-enrollment
│   │   │   │   └── route.ts
│   │   │   ├── create-checkout-session
│   │   │   │   └── route.ts
│   │   │   ├── curriculum
│   │   │   │   └── [slug]
│   │   │   │       └── pdf
│   │   │   │           └── route.ts
│   │   │   ├── custom-build
│   │   │   │   └── route.ts
│   │   │   ├── debug
│   │   │   │   └── env
│   │   │   │       └── route.ts
│   │   │   ├── exchange-rates
│   │   │   │   └── route.ts
│   │   │   ├── featured-courses
│   │   │   │   └── route.ts
│   │   │   ├── files
│   │   │   │   └── [id]
│   │   │   │       └── route.ts
│   │   │   ├── forms
│   │   │   │   └── intake
│   │   │   │       └── route.ts
│   │   │   ├── health
│   │   │   │   └── route.ts
│   │   │   ├── newsletter
│   │   │   │   └── route.ts
│   │   │   ├── publications
│   │   │   │   └── search
│   │   │   │       └── route.ts
│   │   │   ├── release-notifications
│   │   │   │   ├── dispatch
│   │   │   │   │   └── route.ts
│   │   │   │   └── subscribe
│   │   │   │       └── route.ts
│   │   │   ├── revalidate
│   │   │   │   └── route.ts
│   │   │   ├── service-categories
│   │   │   │   └── route.ts
│   │   │   ├── service-checkout
│   │   │   │   └── route.ts
│   │   │   ├── service-request
│   │   │   │   └── route.ts
│   │   │   ├── student
│   │   │   │   ├── curriculum-pdf
│   │   │   │   │   └── route.ts
│   │   │   │   ├── enrollments
│   │   │   │   │   └── route.ts
│   │   │   │   └── renew
│   │   │   │       └── route.ts
│   │   │   ├── teacher
│   │   │   │   ├── assessments
│   │   │   │   │   └── route.ts
│   │   │   │   ├── courses
│   │   │   │   │   └── route.ts
│   │   │   │   └── students
│   │   │   │       └── route.ts
│   │   │   └── ... and 5 more files/folders
│   │   ├── blog
│   │   │   ├── [slug]
│   │   │   │   └── page.tsx
│   │   │   ├── BlogPageContent.tsx
│   │   │   └── page.tsx
│   │   ├── campaign
│   │   │   └── [slug]
│   │   │       └── page.tsx
│   │   ├── cancel
│   │   │   └── page.tsx
│   │   ├── contact
│   │   │   └── page.tsx
│   │   ├── courses
│   │   │   ├── [slug]
│   │   │   │   ├── assessments
│   │   │   │   │   ├── [assessmentSlug]
│   │   │   │   │   │   ├── AssessmentExamClient.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── curriculum
│   │   │   │   │   ├── CurriculumEmbed.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── category
│   │   │   │   └── [slug]
│   │   │   │       └── page.tsx
│   │   │   ├── CoursesPageContent.tsx
│   │   │   ├── CoursesPageContent.tsx.old
│   │   │   ├── ServerCoursesPage.tsx
│   │   │   └── page.tsx
│   │   ├── curriculums
│   │   │   ├── [slug]
│   │   │   └── page.tsx
│   │   ├── divas-kloset
│   │   │   └── [slug]
│   │   │       └── page.tsx
│   │   ├── enrollment-success
│   │   │   └── page.tsx
│   │   ├── errata
│   │   │   ├── [slug]
│   │   │   │   ├── ErrataDetailClient.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── ErrataCatalog.tsx
│   │   │   └── page.tsx
│   │   ├── faq
│   │   │   ├── FaqPageContent.tsx
│   │   │   └── page.tsx
│   │   ├── mentorships
│   │   │   ├── courses
│   │   │   │   ├── [slug]
│   │   │   │   │   ├── MentorshipCoursePageClient.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── MentorshipCoursesPageClient.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── enrollment-success
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── portfolio
│   │   │   ├── [slug]
│   │   │   │   └── page.tsx
│   │   │   ├── PortfolioPageContent.tsx
│   │   │   └── page.tsx
│   │   ├── privacy-policy
│   │   │   └── page.tsx
│   │   ├── proposals
│   │   │   ├── [client]
│   │   │   │   └── page.tsx
│   │   │   ├── divas-kloset
│   │   │   │   ├── page.tsx
│   │   │   │   └── proposal-client.tsx
│   │   │   ├── jhema-wears
│   │   │   │   ├── page.tsx
│   │   │   │   └── proposal-client.tsx
│   │   │   └── social-media-marketing
│   │   │       └── [client]
│   │   │           └── page.tsx
│   │   ├── publications
│   │   │   └── [slug]
│   │   │       └── resource-vault
│   │   │           └── page.tsx
│   │   ├── resources
│   │   │   ├── [slug]
│   │   │   │   ├── ResourcesDetailClient.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── ResourcesCatalog.tsx
│   │   │   └── page.tsx
│   │   ├── school
│   │   │   └── [slug]
│   │   │       ├── SchoolPageContent.tsx
│   │   │       └── page.tsx
│   │   ├── services
│   │   │   ├── [slug]
│   │   │   │   └── page.tsx
│   │   │   ├── build-bundle
│   │   │   │   └── page.tsx
│   │   │   ├── checkout-cancel
│   │   │   │   └── page.tsx
│   │   │   ├── checkout-success
│   │   │   │   ├── CheckoutSuccessClient.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── custom-build
│   │   │   │   ├── steps
│   │   │   │   │   ├── Step1Core.tsx
│   │   │   │   │   ├── Step2AddOns.tsx
│   │   │   │   │   ├── Step3Summary.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── page.tsx
│   │   │   │   └── types.ts
│   │   │   ├── request
│   │   │   │   └── success
│   │   │   │       └── page.tsx
│   │   │   ├── ServicesPageClient.tsx
│   │   │   ├── error.tsx
│   │   │   └── page.tsx
│   │   ├── store
│   │   │   ├── [slug]
│   │   │   │   ├── ReleaseNotifyForm.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── BookCard.tsx
│   │   │   ├── StoreCatalog.tsx
│   │   │   └── page.tsx
│   │   ├── student
│   │   │   ├── dashboard
│   │   │   │   └── page.tsx
│   │   │   ├── login
│   │   │   │   └── page.tsx
│   │   │   ├── oauth-success
│   │   │   │   └── page.tsx
│   │   │   └── signup
│   │   │       └── page.tsx
│   │   ├── studio
│   │   │   └── [[...index]]
│   │   │       └── page.tsx
│   │   ├── success
│   │   │   └── page.tsx
│   │   └── ... and 13 more files/folders
│   ├── components
│   │   ├── admin
│   │   │   ├── AdminNavbar.tsx
│   │   │   ├── AssignCoursesModal.tsx
│   │   │   ├── Breadcrumbs.tsx
│   │   │   └── GrantCourseAccessModal.tsx
│   │   ├── animations
│   │   │   ├── AnimatedBackground.tsx
│   │   │   └── AnimatedCard.tsx
│   │   ├── campaign
│   │   │   └── CampaignLeadForm.tsx
│   │   ├── common
│   │   │   └── Banner.tsx
│   │   ├── courses
│   │   │   ├── CourseCard.tsx
│   │   │   ├── CoursePaymentModal.tsx
│   │   │   └── CoursePricingCalculator.tsx
│   │   ├── curriculum
│   │   │   └── CurriculumDocumentView.tsx
│   │   ├── home
│   │   │   └── JourneySection.tsx
│   │   ├── layout
│   │   │   ├── Footer.tsx
│   │   │   └── Header.tsx
│   │   ├── marketing
│   │   │   ├── FunnelOnboarding.tsx
│   │   │   ├── StartupFunnel.tsx
│   │   │   └── StartupFunnelClient.tsx
│   │   ├── mentorships
│   │   │   ├── MentorshipCourseCard.tsx
│   │   │   └── MentorshipEnrollmentModal.tsx
│   │   ├── modals
│   │   │   └── EnrollmentModal.tsx
│   │   ├── sections
│   │   │   ├── ComingSoon.tsx
│   │   │   ├── FeaturedCourses.tsx
│   │   │   ├── FinalCTA.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── RecentTextbooks.tsx
│   │   │   ├── ServiceCard.tsx
│   │   │   ├── ServicesOverview.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── WhyChooseUs.tsx
│   │   ├── service
│   │   │   └── DynamicServicePage.tsx
│   │   ├── services
│   │   │   ├── BusinessServicePage.tsx
│   │   │   ├── CompleteServicePage.tsx
│   │   │   ├── ConditionalContactForm.tsx
│   │   │   ├── ConditionalSections.tsx
│   │   │   ├── CustomBuildResumeBar.tsx
│   │   │   ├── CustomBuildWizard.tsx
│   │   │   ├── CustomizationWizard.tsx
│   │   │   ├── CustomizeHandler.tsx
│   │   │   ├── DynamicServicePage.tsx
│   │   │   ├── EnhancedServiceWizard.tsx
│   │   │   ├── FocusHandler.tsx
│   │   │   ├── InteractiveServicePage.tsx
│   │   │   ├── JourneyHeader.tsx
│   │   │   ├── NigerianBanner.tsx
│   │   │   ├── PackageComparison.tsx
│   │   │   ├── PaymentSummary.tsx
│   │   │   ├── PredefinedPackageButton.tsx
│   │   │   ├── QuickQuoteCalculator.tsx
│   │   │   ├── QuickStartChecklist.tsx
│   │   │   ├── QuoteButtonWrapper.tsx
│   │   │   ├── SearchParamsHandler.tsx
│   │   │   ├── ServiceCaseStudies.tsx
│   │   │   ├── ServiceGroupCard.tsx
│   │   │   ├── ServiceGroupModal.tsx
│   │   │   ├── ServiceGroupSelector.tsx
│   │   │   └── ... and 17 more files/folders
│   │   ├── student
│   │   │   └── SubscriptionCard.tsx
│   │   ├── ui
│   │   │   ├── Breadcrumb.tsx
│   │   │   ├── CTAButton.tsx
│   │   │   ├── CountdownTimer.tsx
│   │   │   ├── CurrencySwitcher.tsx
│   │   │   ├── DiscountBanner.tsx
│   │   │   ├── FloatingCTA.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── OptimizedImage.tsx
│   │   │   ├── PerformanceMonitor.tsx
│   │   │   ├── PriceDisplay.tsx
│   │   │   ├── PricingTiers.tsx
│   │   │   ├── WhatsAppWidget.tsx
│   │   │   └── button.tsx
│   │   ├── AnalyticsTracker.tsx
│   │   ├── ContactForm.tsx
│   │   ├── CourseEnrollment.tsx
│   │   ├── CourseEnrollment.tsx.old
│   │   ├── CourseEnrollmentEnhanced.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── GoogleAnalytics.tsx
│   │   ├── NewsletterSubscription.tsx
│   │   ├── SEOStructuredData.tsx
│   │   └── ... and 1 more files/folders
│   ├── config
│   │   ├── serviceCustomFields.ts
│   │   └── servicePackages.ts
│   ├── contexts
│   │   ├── CurrencyContext.tsx
│   │   ├── CustomBuildContext.tsx
│   │   └── ThemeContext.tsx
│   ├── data
│   │   ├── divasKlosetTiers.ts
│   │   ├── individualServices.ts
│   │   ├── serviceGroups.ts
│   │   └── servicePackages.ts
│   ├── hooks
│   │   ├── useAnalytics.ts
│   │   └── useServices.ts
│   ├── lib
│   │   ├── __tests__
│   │   │   └── normalizeStatistics.test.ts
│   │   ├── course-assessments
│   │   │   ├── architecting-landing-zones.ts
│   │   │   └── devops-engineering-cloud-infrastructure-core.ts
│   │   ├── adminAuth.ts
│   │   ├── analytics.ts
│   │   ├── assessment-access.ts
│   │   ├── assessment-registry.ts
│   │   ├── assessment-types.ts
│   │   ├── auth.ts
│   │   ├── book-queries.ts
│   │   ├── cached-api.ts
│   │   ├── currency.ts
│   │   ├── curriculum-pdf.ts
│   │   ├── curriculum-types.ts
│   │   ├── curriculum-utils.ts
│   │   ├── customBuildPricing.ts
│   │   ├── email-templates.ts
│   │   ├── email-types.ts
│   │   ├── email.ts
│   │   ├── fallback-data.ts
│   │   ├── mentorship-pricing.ts
│   │   ├── normalizeStatistics.ts
│   │   ├── pdf-generator.ts
│   │   ├── sanity-queries.ts
│   │   ├── sanity-server.ts
│   │   ├── seo.ts
│   │   └── ... and 6 more files/folders
│   ├── sanity
│   │   ├── schemas
│   │   │   ├── __tests__
│   │   │   │   └── schemaValidation.test.ts
│   │   │   ├── analyticsEvent.ts
│   │   │   ├── assessmentAttempt.ts
│   │   │   ├── author.hexadigitall.ts
│   │   │   ├── book.ts
│   │   │   ├── bookReleaseSubscriber.ts
│   │   │   ├── course-fixed.ts
│   │   │   ├── course-original-backup.ts
│   │   │   ├── course.ts
│   │   │   ├── courseCategory.ts
│   │   │   ├── curriculum.ts
│   │   │   ├── enrollment.ts
│   │   │   ├── faq.ts
│   │   │   ├── formSubmission.ts
│   │   │   ├── index.ts
│   │   │   ├── pageOgAssets.ts
│   │   │   ├── pendingEnrollment.ts
│   │   │   ├── post.ts
│   │   │   ├── project.ts
│   │   │   ├── publication.hexadigitall.ts
│   │   │   ├── resourceMatrix.hexadigitall.ts
│   │   │   ├── school.ts
│   │   │   ├── service.ts
│   │   │   ├── serviceCaseStudy.ts
│   │   │   ├── serviceCategory.ts
│   │   │   └── ... and 6 more files/folders
│   │   ├── client.ts
│   │   ├── deskStructure.ts
│   │   └── imageUrlBuilder.ts
│   ├── types
│   │   ├── course.ts
│   │   ├── jest.d.ts
│   │   ├── modules.d.ts
│   │   ├── school.ts
│   │   ├── service.ts
│   │   └── subscription.ts
│   ├── auth.ts
│   └── proxy.ts
├── tmp
│   └── pdf-qa
│       ├── after
│       │   ├── p125.png
│       │   ├── p235.png
│       │   ├── p249.png
│       │   ├── p253.png
│       │   ├── p297.png
│       │   ├── p313.png
│       │   ├── p467.png
│       │   ├── p475.png
│       │   ├── p499.png
│       │   └── p60.png
│       ├── focus
│       │   ├── p10.png
│       │   ├── p104.png
│       │   ├── p105.png
│       │   ├── p11.png
│       │   ├── p12.png
│       │   ├── p125.png
│       │   ├── p13.png
│       │   ├── p174.png
│       │   ├── p175.png
│       │   ├── p19.png
│       │   ├── p192.png
│       │   ├── p193.png
│       │   ├── p20.png
│       │   ├── p201.png
│       │   ├── p202.png
│       │   ├── p21.png
│       │   ├── p235.png
│       │   ├── p249.png
│       │   ├── p253.png
│       │   ├── p297.png
│       │   ├── p313.png
│       │   ├── p44.png
│       │   ├── p45.png
│       │   ├── p467.png
│       │   ├── p475.png
│       │   └── ... and 9 more files/folders
│       ├── neighbors
│       │   ├── p124.png
│       │   ├── p125.png
│       │   ├── p126.png
│       │   ├── p234.png
│       │   ├── p235.png
│       │   ├── p236.png
│       │   ├── p248.png
│       │   ├── p249.png
│       │   ├── p250.png
│       │   ├── p252.png
│       │   ├── p253.png
│       │   ├── p254.png
│       │   ├── p466.png
│       │   ├── p467.png
│       │   ├── p468.png
│       │   ├── p474.png
│       │   ├── p475.png
│       │   ├── p476.png
│       │   ├── p498.png
│       │   ├── p499.png
│       │   ├── p500.png
│       │   ├── p59.png
│       │   ├── p60.png
│       │   ├── p61.png
│       │   ├── p651.png
│       │   └── ... and 2 more files/folders
│       ├── wk1-p7.png
│       ├── wk1-p8.png
│       ├── wk10-p7.png
│       ├── wk10-p8.png
│       ├── wk15-p7.png
│       ├── wk15-p8.png
│       ├── wk20-p8.png
│       ├── wk20-p9.png
│       ├── wk5-p7.png
│       └── wk5-p8.png
├── .env.example
├── .env.local
├── README.md
├── eslint.config.js
├── jest.config.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── sanity.cli.js
├── sanity.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── ... and 239 more root files (e.g. *.md, *.py, *.html)
```
