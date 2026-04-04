#!/usr/bin/env python3
"""
Semantic Remediation Pass 4:
- Remove mechanical "for <course>." suffixing
- Replace reused capstone cards 2&3 with domain-specific versions
- Ensure all prerequisites, resources, study tips are natively written (not suffixed)
- Reframe Technical Writing as authentic technical writing curriculum
"""

import os
import re
import json
from pathlib import Path
from bs4 import BeautifulSoup

# Domain-specific content templates
DOMAIN_CONTENT = {
    "security": {
        "prerequisites": [
            "Hands-on experience with network protocols, operating system internals, and security control implementation",
            "Practical knowledge of reading security logs, alert analysis, and threat detection workflows",
            "Comfort with risk documentation, control decisions, and evidence-based compliance mapping",
            "Familiarity with at least one SIEM platform, policy tool, or security scanner"
        ],
        "capstone_2": "Design and implement a complete security control baseline with detection engineering, demonstrating trade-offs in coverage versus operational overhead, and providing audit-ready evidence of effectiveness.",
        "capstone_3": "Validate detection accuracy, document incident response readiness, and present a threat-aware risk acceptance strategy with sign-off criteria for operational deployment.",
        "study_tips": [
            "Reserve two weekly deep-work blocks for hands-on labs, control validation, and remediation testing against real-world attacks.",
            "Maintain a control-change ledger documenting each risk decision, its measurable impact, and improvement trajectory.",
            "Conduct weekly threat model reviews, comparing assumed attack paths against current detection capability and control gaps."
        ],
        "complementary_tracks": [
            ("Incident Response", "Master triage, containment, and post-incident forensics workflows"),
            ("Cloud Security", "Extend identity, token, and workload protection into cloud environments"),
            ("Governance & Compliance", "Connect security controls to regulatory mappings and audit documentation")
        ]
    },
    "cloud": {
        "prerequisites": [
            "Experience designing system architectures with distributed components and resilience patterns",
            "Hands-on practice with Infrastructure-as-Code, cloud service models (IaaS/PaaS/SaaS), and networking basics",
            "Understanding of auto-scaling, load balancing, and cloud cost optimization tradeoffs",
            "Familiarity with at least one major cloud console (AWS, Azure, or GCP) and basic CLI usage"
        ],
        "capstone_2": "Provision a production-ready infrastructure deployment with documented architectural trade-offs, cost projections, and resilience validation against realistic failure scenarios.",
        "capstone_3": "Conduct a cloud cost optimization review, security readiness assessment, and present scaling strategy with runbook documentation for operational handoff.",
        "study_tips": [
            "Allocate two weekly blocks for architecture review, deployment testing, and cost analysis against budgets.",
            "Maintain an architecture decision record documenting service choices, redundancy approaches, and cost drivers.",
            "Run weekly cost reviews, comparing projected vs. actual spend and identifying optimization leverage points."
        ],
        "complementary_tracks": [
            ("Cloud Networking", "Master virtual networks, security groups, and multi-region routing"),
            ("DevOps & Infrastructure Automation", "Deepen CI/CD pipeline integration and infrastructure drift detection"),
            ("Cloud Cost Optimization", "Learn resource tagging, rightsizing, and multi-cloud cost analysis")
        ]
    },
    "devops": {
        "prerequisites": [
            "Version control experience with Git workflows, branching strategies, and code review practices",
            "CI/CD pipeline familiarity (GitHub Actions, GitLab CI, Jenkins, or similar platforms)",
            "Container fundamentals: Docker, image layering, networking, and registry management",
            "Understanding of deployment strategies (blue-green, canary, rolling) and rollback procedures"
        ],
        "capstone_2": "Build and validate a complete CI/CD pipeline with automated testing, security gates, and deployment orchestration, documenting reliability metrics and rollback pathways.",
        "capstone_3": "Present operational monitoring setup with alerting thresholds, incident escalation playbooks, and deployment governance policies for stakeholder approval.",
        "study_tips": [
            "Block two weekly hours for hands-on pipeline testing, failure scenario walkthroughs, and deployment automation refinement.",
            "Maintain a reliability ledger tracking deployment frequency, failure rates, and mean-time-to-recovery metrics.",
            "Conduct weekly automation reviews, identifying bottlenecks and opportunities for further pipeline optimization."
        ],
        "complementary_tracks": [
            ("Kubernetes & Container Orchestration", "Master cluster management, networking, and stateful workload deployment"),
            ("Infrastructure Automation", "Deepen Terraform, Helm, and configuration management automation"),
            ("Observability & Monitoring", "Learn structured logging, metrics collection, and alerting architecture")
        ]
    },
    "marketing": {
        "prerequisites": [
            "Audience segmentation experience and understanding of customer lifecycle models",
            "Hands-on campaign management through ad platforms (Google Ads, Meta, LinkedIn, or similar)",
            "Analytics fundamentals: conversion tracking, attribution models, and funnel analysis",
            "Practical knowledge of A/B testing, statistical significance, and experimentation governance"
        ],
        "capstone_2": "Execute a multi-channel campaign with documented audience targeting, creative variations, and real-time optimization, achieving measurable conversion lift and ROI improvements.",
        "capstone_3": "Analyze campaign performance winners and losers, justify scaling decisions with data insights, and present a quarterly growth playbook with next-quarter budget allocation recommendations.",
        "study_tips": [
            "Schedule two weekly deep-dive sessions for campaign audits, competitor analysis, and creative iteration testing.",
            "Maintain an experimentation log documenting hypothesis, test variants, winner/loser criteria, and learning transfer to next campaign.",
            "Run weekly performance reviews comparing against benchmarks, identifying underperforming segments, and adjusting targeting or messaging."
        ],
        "complementary_tracks": [
            ("Email Marketing & Automation", "Master segmentation, personalization, and lifecycle nurture workflows"),
            ("SEO & Content Strategy", "Learn keyword strategy, content optimization, and organic growth mechanics"),
            ("Analytics & Business Intelligence", "Deepen multi-touch attribution, cohort analysis, and predictive forecasting")
        ]
    },
    "design": {
        "prerequisites": [
            "Visual hierarchy fundamentals: contrast, alignment, whitespace, and intentional typography choices",
            "Color theory application: psychology, accessibility standards, and palette cohesiveness",
            "Wireframing and prototyping experience with tools like Figma, Adobe XD, or Sketch",
            "Understanding of responsive design, breakpoints, and mobile-first composition strategies"
        ],
        "capstone_2": "Design a complete user interface system with component library, interaction states, and accessibility compliance, validated through user testing and design critique.",
        "capstone_3": "Present design system governance documentation, handoff specs for engineering, and a roadmap for design debt reduction and consistency improvements.",
        "study_tips": [
            "Allocate two weekly blocks for design critique, usability testing observations, and component refinement.",
            "Maintain a component inventory tracking reuse rates, accessibility audit findings, and visual consistency improvements.",
            "Conduct weekly design reviews measuring against accessibility standards (WCAG 2.1), performance impact, and engineering feasibility."
        ],
        "complementary_tracks": [
            ("Interaction Design & Prototyping", "Master micro-interactions, animation, and prototype usability testing"),
            ("Design Systems", "Learn component architecture, design tokens, and cross-team collaboration patterns"),
            ("User Research & Testing", "Deepen qualitative methods, usability testing, and data-informed iteration")
        ]
    },
    "data": {
        "prerequisites": [
            "SQL proficiency: complex joins, window functions, query optimization, and performance analysis",
            "Hands-on experience with data visualization tools (Tableau, Looker, Power BI, or similar)",
            "Understanding of relational and dimensional modeling, fact/dimension tables, and star schema design",
            "Familiarity with data quality frameworks: validation rules, anomaly detection, and completeness checks"
        ],
        "capstone_2": "Build a multi-source data pipeline with transformation logic, quality gates, and performance optimization, delivering validated datasets ready for analytics.",
        "capstone_3": "Present data governance framework, lineage documentation, stakeholder dashboards, and a data quality roadmap with SLA expectations and monitoring strategy.",
        "study_tips": [
            "Block two weekly hours for query optimization exercises, schema refinement, and data quality audits.",
            "Maintain a data dictionary documenting lineage, transformation logic, and source-of-truth ownership across datasets.",
            "Run weekly data quality reviews, tracking completeness, accuracy, and freshness metrics against established SLAs."
        ],
        "complementary_tracks": [
            ("Advanced Analytics & Machine Learning", "Learn predictive modeling, statistical methods, and experimentation frameworks"),
            ("Data Architecture & Engineering", "Master ETL/ELT patterns, data warehouse design, and pipeline orchestration"),
            ("Business Intelligence & Reporting", "Deepen dashboard design, storytelling with data, and executive communication")
        ]
    },
    "ai": {
        "prerequisites": [
            "Python programming proficiency: libraries (NumPy, Pandas, scikit-learn), data structures, and API usage",
            "Statistics and probability fundamentals: distributions, hypothesis testing, and experimental design",
            "Machine learning basics: supervised learning, hyperparameter tuning, and model evaluation metrics",
            "Hands-on experience with notebooks (Jupyter), experiment tracking, and model versioning systems"
        ],
        "capstone_2": "Train and validate a production-quality model with documented assumptions, performance baselines, and ablation studies proving component necessity.",
        "capstone_3": "Package model with deployment specifications, performance monitoring setup, retraining triggers, and stakeholder communication materials for inference API rollout.",
        "study_tips": [
            "Dedicate two weekly blocks for model experimentation, hyperparameter variation, and ablation study execution.",
            "Maintain an experiment log tracking dataset versions, feature changes, model architectures, and performance deltas between iterations.",
            "Conduct weekly model performance reviews, monitoring inference accuracy drift and retraining signal detection against production data."
        ],
        "complementary_tracks": [
            ("LLMs & Generative AI", "Master fine-tuning, prompt engineering, and RAG architecture patterns"),
            ("MLOps & Model Deployment", "Learn model serving, A/B testing, and continuous model improvement workflows"),
            ("Production AI Systems", "Deepen model monitoring, drift detection, and operational governance")
        ]
    },
    "software": {
        "prerequisites": [
            "Programming language proficiency with solid grasp of data structures, algorithms, and design patterns",
            "Version control mastery: Git workflows, code review, merge conflict resolution, and collaborative development",
            "Testing fundamentals: unit testing, test-driven development, mocking, and test coverage analysis",
            "Debugging and profiling skills: breakpoint debugging, performance flame graphs, and memory analysis"
        ],
        "capstone_2": "Implement a production-grade feature with comprehensive test coverage, performance optimization, and documentation demonstrating design tradeoffs and trade correctness.",
        "capstone_3": "Present code review readiness, security audit results, deployment plan with rollback strategy, and knowledge transfer documentation for handoff to operations.",
        "study_tips": [
            "Reserve two weekly deep-work sessions for code quality review, refactoring, and cross-browser/platform testing.",
            "Maintain a technical debt ledger tracking complexity hotspots, test gaps, and performance bottlenecks requiring attention.",
            "Run weekly code review discussions, learning from peer feedback and measuring code quality metrics (coverage, maintainability index, cyclomatic complexity)."
        ],
        "complementary_tracks": [
            ("Web Development (Frontend/Backend)", "Specialize in modern frameworks, API design, and full-stack architecture"),
            ("System Design & Architecture", "Master scalability patterns, distributed systems, and reliability engineering"),
            ("DevOps & Quality Assurance", "Learn CI/CD integration, automated testing, and production monitoring")
        ]
    },
    "business": {
        "prerequisites": [
            "Project management fundamentals: scope definition, stakeholder communication, and timeline estimation accuracy",
            "Business analysis skills: requirements gathering, user story crafting, and acceptance criteria specification",
            "Process mapping and workflow redesign experience with focus on efficiency and stakeholder value",
            "Familiarity with project management tools (Jira, Asana, Monday) and kanban board optimization"
        ],
        "capstone_2": "Execute a cross-functional project delivery with stakeholder alignment, scope governance, and measurable business outcome achievement against approval criteria.",
        "capstone_3": "Present post-project review findings, ROI analysis, process improvement recommendations, and knowledge transfer documentation for organizational learning.",
        "study_tips": [
            "Block two weekly hours for stakeholder interviews, requirement refinement, and process flow documentation.",
            "Maintain a project retrospective log capturing what worked, what didn't, and explicit process improvements for subsequent projects.",
            "Conduct weekly status reviews with stakeholder feedback loops, adjusting scope and timeline based on market signals and priority changes."
        ],
        "complementary_tracks": [
            ("Agile & Scrum Leadership", "Master sprint planning, retrospectives, and team coaching techniques"),
            ("Strategic Planning & Change Management", "Learn enterprise roadmap alignment, change impact, and transformation communication"),
            ("Business Analysis & Data-Driven Decision Making", "Deepen market research, competitive analysis, and ROI modeling")
        ]
    },
    "technical_writing": {
        "prerequisites": [
            "Audience analysis experience: defining user personas, documentation needs, and communication preferences",
            "Technical background sufficient to understand API responses, system architecture, and implementation constraints",
            "Docs-as-code familiarity: version control, markup languages (Markdown, reStructuredText), and documentation build tools",
            "Style guide and editing workflow experience, including consistency standards and review processes"
        ],
        "capstone_2": "Create a complete technical documentation suite (API docs, getting started guide, troubleshooting manual) with proper audience targeting, code examples, and consistency validation.",
        "capstone_3": "Present documentation usability validation results (user testing feedback, support ticket reduction metrics), style guide governance, and a documentation maintenance roadmap.",
        "study_tips": [
            "Dedicate two weekly blocks for single-sourcing exercises, modular content authoring, and technical accuracy verification.",
            "Maintain an editing log documenting clarity improvements, terminology standardization, and documentation debt paydown.",
            "Run weekly documentation audits measuring against audience-specific success metrics, checking completeness, and identifying knowledge gaps that require additional coverage."
        ],
        "complementary_tracks": [
            ("API Documentation Best Practices", "Master OpenAPI specs, interactive documentation, and developer experience design"),
            ("Content Modularization & Reuse", "Learn single-sourcing patterns, topic-based authoring, and component management"),
            ("User Education & Community", "Deepen tutorial design, video documentation, and community-driven content strategies")
        ]
    }
}

def get_domain_from_filename(filename):
    """Infer domain from curriculum filename."""
    slug = filename.replace("curriculum-", "").replace(".html", "").lower()

    # Prioritized matching to reduce cross-domain collisions.
    techwriting_keywords = ["technical-writing", "business-writing", "professional-writing", "copywriting", "content-writing", "api-docs"]
    security_keywords = ["security", "cissp", "casp", "cism", "cysa", "sscp", "appsec", "ccsk", "giac", "ethical-hacking", "penetration-testing", "network-security", "sc-100", "sc-200", "az-500", "cybersecurity"]
    cloud_keywords = ["aws", "azure", "gcp", "cloud", "kubernetes", "landing-zones", "landing-zone", "nosql-cloud", "solutions-architect"]
    devops_keywords = ["devops", "ansible", "terraform", "gitlab", "jenkins", "docker", "ci-cd", "infrastructure-automation"]
    ai_keywords = ["ai", "machine-learning", "llm", "mlops", "nlp", "neural", "deep-learning", "tensorflow", "pytorch"]
    data_keywords = ["data", "sql", "tableau", "looker", "analytics", "business-intelligence", "excel", "data-engineering", "database"]
    marketing_keywords = ["marketing", "ads", "google-ads", "meta-ads", "youtube", "adsense", "seo", "email", "shopify", "amazon-retail", "programmatic", "tiktok", "social-media"]
    design_keywords = ["design", "ui", "ux", "figma", "adobe", "graphic", "canva", "autocad", "archicad", "brand", "visual", "motion-graphics"]
    software_keywords = ["javascript", "python", "node", "react", "backend", "frontend", "programming", "c-sharp", "java", "css", "html", "web", "leetcode", "algorithms", "dsa", "software-development", "full-stack"]

    if any(kw in slug for kw in techwriting_keywords):
        return "technical_writing"
    if any(kw in slug for kw in security_keywords):
        return "security"
    if any(kw in slug for kw in cloud_keywords):
        return "cloud"
    if any(kw in slug for kw in devops_keywords):
        return "devops"
    if any(kw in slug for kw in ai_keywords):
        return "ai"
    if any(kw in slug for kw in data_keywords):
        return "data"
    if any(kw in slug for kw in marketing_keywords):
        return "marketing"
    if any(kw in slug for kw in design_keywords):
        return "design"
    if any(kw in slug for kw in software_keywords):
        return "software"
    return "business"

def extract_course_title(html_content):
    """Extract course title from HTML."""
    soup = BeautifulSoup(html_content, 'html.parser')
    header = soup.find('h1')
    return header.text.strip() if header else "Unknown Course"

def remove_course_suffix(text, course_title):
    """Remove 'for <course>' suffix from text."""
    # Remove " for <course>." pattern
    pattern = rf" for {re.escape(course_title)}\.?"
    return re.sub(pattern, "", text).strip()

def update_prerequisites_section(soup, domain, course_title):
    """Update prerequisites section with domain-specific content."""
    # Find prerequisites section
    for section in soup.find_all('div', class_='section'):
        if 'Prerequisites' in section.get_text():
            ul = section.find('ul')
            if ul:
                ul.clear()
                for prereq in DOMAIN_CONTENT[domain]["prerequisites"]:
                    li = soup.new_tag('li')
                    li.string = prereq
                    ul.append(li)
            break

def update_complementary_tracks(soup, domain, course_title):
    """Update complementary tracks section."""
    for section in soup.find_all('div', class_='section'):
        if 'Complementary' in section.get_text() or 'Recommended' in section.get_text():
            grid = section.find('div', class_='resource-grid')
            if grid:
                grid.clear()
                for track_name, track_desc in DOMAIN_CONTENT[domain]["complementary_tracks"]:
                    item = soup.new_tag('div', attrs={'class': 'resource-item'})
                    h4 = soup.new_tag('h4')
                    h4.string = track_name
                    p = soup.new_tag('p')
                    p.string = track_desc
                    item.append(h4)
                    item.append(p)
                    grid.append(item)
            break

def update_resources_section(soup, domain, course_title):
    """Update resources section with domain-specific resources."""
    for section in soup.find_all('div', class_='section'):
        if 'Resources' in section.get_text() or 'Learning Resources' in section.get_text():
            ul = section.find('ul')
            if ul:
                # Build domain-specific resources
                if domain == "security":
                    resources = [
                        "NIST Cybersecurity Framework, CIS Controls, and OWASP threat modeling guides",
                        "Incident simulation datasets, detection rule templates, and control efficacy checklists",
                        "Security architecture patterns repository and threat modeling workshop materials"
                    ]
                elif domain == "cloud":
                    resources = [
                        "Cloud architecture reference implementations and Well-Architected Framework reviews",
                        "Infrastructure-as-Code templates and cloud service comparison matrices",
                        "Cost optimization playbooks and resilience validation runbooks"
                    ]
                elif domain == "devops":
                    resources = [
                        "CI/CD pipeline patterns and deployment strategy reference implementations",
                        "Infrastructure automation templates and reliability engineering guides",
                        "Observability stack setup instructions and incident response playbooks"
                    ]
                elif domain == "marketing":
                    resources = [
                        "Ad platform best practices, audience segmentation templates, and campaign brief frameworks",
                        "Analytics dashboards, attribution model comparisons, and A/B testing calculators",
                        "Competitive analysis templates and growth strategy playbooks"
                    ]
                elif domain == "design":
                    resources = [
                        "Design system templates, component libraries, and accessibility audit checklists",
                        "Figma starter kits with typography scales, color systems, and responsive breakpoints",
                        "Usability testing scripts and design critique frameworks"
                    ]
                elif domain == "data":
                    resources = [
                        "SQL optimization guides, query pattern library, and performance tuning references",
                        "Data modeling templates, dimensional design patterns, and quality framework schemas",
                        "Analytics cookbook with common calculations, transformations, and business metric definitions"
                    ]
                elif domain == "ai":
                    resources = [
                        "Model development workflow guides, hyperparameter tuning references, and experiment tracking templates",
                        "Feature engineering playbooks, model evaluation metrics library, and production deployment checklists",
                        "Research paper repository, implementation examples, and performance benchmarking tools"
                    ]
                elif domain == "software":
                    resources = [
                        "Language-specific style guides, design patterns reference, and debugging tools inventory",
                        "Testing frameworks, mock libraries, and performance profiling instructions for your tech stack",
                        "Refactoring patterns, security best practices, and code quality tooling configurations"
                    ]
                elif domain == "business":
                    resources = [
                        "Project Charter template, WBS examples, and stakeholder analysis worksheets",
                        "Risk register, change log, and lessons learned repository templates",
                        "ROI calculation models, benefits tracking dashboards, and governance frameworks"
                    ]
                elif domain == "technical_writing":
                    resources = [
                        "Style guide templates, API documentation standards, and audience persona worksheets",
                        "Docs-as-code setup instructions, documentation build tool references, and version control workflows",
                        "Technical review checklists, usability testing scripts, and content modularization patterns"
                    ]
                else:
                    resources = []
                
                ul.clear()
                for resource in resources:
                    li = soup.new_tag('li')
                    li.string = resource
                    ul.append(li)
            break

def update_capstone_section(soup, domain, course_title):
    """Update capstone section with domain-specific cards 2 & 3."""
    for section in soup.find_all('div', class_='section'):
        if 'Capstone' in section.get_text():
            items = section.find_all('div', class_='resource-item')
            if len(items) >= 3:
                # Update card 2
                h4_2 = items[1].find('h4')
                p_2 = items[1].find('p')
                if h4_2:
                    h4_2.string = 'Capstone 2'
                if p_2:
                    p_2.string = DOMAIN_CONTENT[domain]["capstone_2"]
                
                # Update card 3
                h4_3 = items[2].find('h4')
                p_3 = items[2].find('p')
                if h4_3:
                    h4_3.string = 'Capstone 3'
                if p_3:
                    p_3.string = DOMAIN_CONTENT[domain]["capstone_3"]
            break

def update_study_tips_section(soup, domain):
    """Update study tips with domain-specific guidance."""
    for section in soup.find_all('div', class_='section'):
        if 'Study Tips' in section.get_text():
            ul = section.find('ul')
            if ul:
                ul.clear()
                for tip in DOMAIN_CONTENT[domain]["study_tips"]:
                    li = soup.new_tag('li')
                    li.string = tip
                    ul.append(li)
            break

def update_roadmap_section(soup, domain):
    """Update roadmap section by removing 'for <course>' suffixes."""
    for section in soup.find_all('div', class_='section'):
        if 'Roadmap' in section.get_text():
            ul = section.find('ul')
            if ul:
                # Get domain-specific roadmap content
                if domain == "security":
                    roadmap = [
                        "Early Weeks: Core controls, identity hardening, and baseline security posture",
                        "Middle Weeks: Detection engineering, incident handling, and service resilience",
                        "Late Weeks: Compliance evidence, executive reporting, and capstone defense"
                    ]
                elif domain == "cloud":
                    roadmap = [
                        "Early Weeks: Core cloud services, networking fundamentals, and basic deployments",
                        "Middle Weeks: Advanced architectures, multi-region deployment, and disaster recovery",
                        "Late Weeks: Cost optimization, governance frameworks, and production readiness"
                    ]
                elif domain == "devops":
                    roadmap = [
                        "Early Weeks: Version control workflows, CI foundation, and automation basics",
                        "Middle Weeks: Advanced CI/CD, container orchestration, and pipeline optimization",
                        "Late Weeks: Production reliability, observability, and operational excellence"
                    ]
                elif domain == "marketing":
                    roadmap = [
                        "Early Weeks: Audience fundamentals, platform setup, and campaign planning",
                        "Middle Weeks: Creative optimization, multi-channel strategies, and attribution",
                        "Late Weeks: Advanced analytics, scaling, and growth automation"
                    ]
                elif domain == "design":
                    roadmap = [
                        "Early Weeks: Design fundamentals, visual hierarchy, and component basics",
                        "Middle Weeks: Design systems, accessibility standards, and interaction patterns",
                        "Late Weeks: Portfolio building, stakeholder communication, and design leadership"
                    ]
                elif domain == "data":
                    roadmap = [
                        "Early Weeks: SQL fundamentals, data modeling, and quality basics",
                        "Middle Weeks: Complex transformations, performance optimization, and BI tools",
                        "Late Weeks: Data governance, advanced analytics, and strategic reporting"
                    ]
                elif domain == "ai":
                    roadmap = [
                        "Early Weeks: ML fundamentals, data preparation, and baseline models",
                        "Middle Weeks: Advanced model techniques, experimentation, and tuning",
                        "Late Weeks: Production deployment, monitoring, and continuous improvement"
                    ]
                elif domain == "software":
                    roadmap = [
                        "Early Weeks: Language fundamentals, testing basics, and design patterns",
                        "Middle Weeks: Advanced architectures, performance optimization, and debugging",
                        "Late Weeks: Production systems, scalability, and cross-platform deployment"
                    ]
                elif domain == "business":
                    roadmap = [
                        "Early Weeks: Project fundamentals, planning, and stakeholder management",
                        "Middle Weeks: Execution excellence, risk management, and adaptive strategies",
                        "Late Weeks: Delivery validation, lessons learned, and strategic impact"
                    ]
                elif domain == "technical_writing":
                    roadmap = [
                        "Early Weeks: Audience analysis, documentation planning, and style foundations",
                        "Middle Weeks: Technical accuracy, usability testing, and modular content",
                        "Late Weeks: Documentation systems, maintenance strategy, and user education"
                    ]
                else:
                    roadmap = []
                
                ul.clear()
                for item in roadmap:
                    li = soup.new_tag('li')
                    li.string = item
                    ul.append(li)
            break

def remediate_file(filepath):
    """Apply semantic remediation to a single curriculum file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        soup = BeautifulSoup(content, 'html.parser')
        
        # Get course title and domain
        course_title = extract_course_title(content)
        domain = get_domain_from_filename(filepath)
        
        print(f"  Remediating: {Path(filepath).name} → {domain}")
        
        # Update sections
        update_prerequisites_section(soup, domain, course_title)
        update_complementary_tracks(soup, domain, course_title)
        update_resources_section(soup, domain, course_title)
        update_capstone_section(soup, domain, course_title)
        update_study_tips_section(soup, domain)
        update_roadmap_section(soup, domain)
        
        # Write remediated content
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(str(soup))
        
        return True
    except Exception as e:
        print(f"  ERROR: {Path(filepath).name} - {str(e)}")
        return False

def main():
    """Main remediation workflow."""
    curriculum_dir = Path('/mnt/d/projects/mine/hexadigitall/hexadigitall/public/curriculums')
    
    # Get all curriculum files
    files = sorted(curriculum_dir.glob('curriculum-*.html'))
    print(f"Found {len(files)} curriculum files")
    print()
    
    success = 0
    failed = 0
    
    for filepath in files:
        if remediate_file(str(filepath)):
            success += 1
        else:
            failed += 1
    
    print()
    print(f"✓ Remediated: {success}")
    print(f"✗ Failed: {failed}")
    print()
    print("Semantic remediation complete!")

if __name__ == '__main__':
    main()
