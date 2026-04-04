#!/usr/bin/env python3
from pathlib import Path
import re
from bs4 import BeautifulSoup

ROOT = Path('/mnt/d/projects/mine/hexadigitall/hexadigitall/public/curriculums')


def normalize_space(text: str) -> str:
    return re.sub(r'\s+', ' ', (text or '')).strip()


def parse_level(soup: BeautifulSoup) -> str:
    for meta in soup.select('.meta-item'):
        txt = normalize_space(meta.get_text(' ', strip=True))
        if 'Level:' in txt:
            level = txt.split('Level:')[-1].strip().lower()
            return level
    return 'intermediate'


def classify_course_type(filename: str, title: str) -> str:
    text = f"{filename} {title}".lower()
    if 'intro' in text or 'beginner' in text or '101' in text:
        return 'intro'
    if 'crash' in text or 'bootcamp' in text or 'fast-track' in text or 'quick-start' in text or 'jumpstart' in text:
        return 'crash'
    if 'advanced' in text or 'mastery' in text or 'expert' in text:
        return 'advanced'
    if 'fundamentals' in text or 'essentials' in text or 'core' in text or 'foundation' in text:
        return 'core'
    return 'standard'


def infer_domain(title: str, filename: str, topic: str) -> str:
    text = f"{title} {filename} {topic}".lower()
    rules = [
        ('security', ['security', 'cissp', 'casp', 'cism', 'cyber', 'soc', 'threat', 'incident']),
        ('cloud', ['cloud', 'aws', 'azure', 'gcp', 'kubernetes', 'infrastructure']),
        ('devops', ['devops', 'ci/cd', 'ansible', 'terraform', 'pipeline', 'sre']),
        ('data', ['data', 'sql', 'analytics', 'bi', 'warehouse', 'etl']),
        ('ai', ['ai', 'ml', 'machine learning', 'llm', 'model', 'neural']),
        ('marketing', ['marketing', 'ads', 'seo', 'campaign', 'attribution', 'growth']),
        ('design', ['design', 'ui', 'ux', 'figma', 'visual', 'prototype']),
        ('writing', ['writing', 'copywriting', 'documentation', 'technical writing', 'api docs']),
        ('software', ['backend', 'frontend', 'javascript', 'python', 'java', 'react', 'software', 'programming', 'api']),
    ]
    for domain, keys in rules:
        if any(k in text for k in keys):
            return domain
    return 'business'


def infer_file_domain(title: str, filename: str) -> str:
    # Token-based filename inference avoids false positives like 'ai' inside unrelated words.
    slug = filename.replace('curriculum-', '').replace('.html', '').lower()
    tokens = set(re.split(r'[^a-z0-9]+', slug))

    def has_any(keys):
        return any(k in tokens for k in keys)

    if has_any({'technical', 'writing', 'copywriting', 'docs', 'documentation'}):
        return 'writing'
    if has_any({'security', 'cissp', 'casp', 'cism', 'cybersecurity', 'ethical', 'hacking', 'appsec', 'sc', 'az', 'cysa'}):
        return 'security'
    if has_any({'aws', 'azure', 'gcp', 'cloud', 'kubernetes', 'k8s'}):
        return 'cloud'
    if has_any({'devops', 'ansible', 'terraform', 'jenkins', 'docker', 'gitlab'}):
        return 'devops'
    if has_any({'machine', 'learning', 'llm', 'mlops', 'neural', 'tensorflow', 'pytorch'}):
        return 'ai'
    if has_any({'data', 'sql', 'analytics', 'tableau', 'looker', 'bi'}):
        return 'data'
    if has_any({'marketing', 'ads', 'seo', 'campaign', 'social', 'youtube', 'google', 'meta', 'tiktok'}):
        return 'marketing'
    if has_any({'design', 'ui', 'ux', 'figma', 'adobe', 'canva', 'graphic', 'visual'}):
        return 'design'
    if has_any({'backend', 'frontend', 'javascript', 'python', 'java', 'react', 'software', 'coding', 'programming', 'dsa', 'algorithms'}):
        return 'software'
    return 'business'


def bloom_band(week_idx: int, total_weeks: int, level: str, course_type: str):
    if total_weeks <= 1:
        progress = 1.0
    else:
        progress = week_idx / (total_weeks - 1)

    # Intro/crash starts lighter; advanced starts at apply/analyze.
    if course_type in ('intro', 'crash') or level in ('beginner',):
        if progress < 0.34:
            return ('identify', 'explain', 'apply', 'document')
        if progress < 0.67:
            return ('apply', 'analyze', 'evaluate', 'document')
        return ('analyze', 'evaluate', 'create', 'defend')

    if course_type == 'advanced' or level in ('advanced', 'expert'):
        if progress < 0.34:
            return ('analyze', 'evaluate', 'design', 'justify')
        if progress < 0.67:
            return ('evaluate', 'design', 'optimize', 'justify')
        return ('design', 'optimize', 'architect', 'defend')

    # Core/standard/intermediate
    if progress < 0.34:
        return ('understand', 'apply', 'analyze', 'document')
    if progress < 0.67:
        return ('apply', 'analyze', 'evaluate', 'justify')
    return ('analyze', 'evaluate', 'create', 'defend')


def level_rigor_phrase(course_type: str, level: str) -> str:
    if course_type == 'intro':
        return 'with scaffolded guidance and beginner-safe checkpoints'
    if course_type == 'crash':
        return 'in time-boxed sprints with rapid feedback loops'
    if course_type == 'advanced' or level in ('advanced', 'expert'):
        return 'at advanced depth with architecture-level decision quality'
    if course_type == 'core':
        return 'through structured core competency milestones'
    return 'through progressive practical delivery milestones'


def domain_artifact(domain: str) -> str:
    return {
        'security': 'control validation dossier',
        'cloud': 'architecture decision record',
        'devops': 'pipeline reliability report',
        'data': 'analytics quality workbook',
        'ai': 'model evaluation brief',
        'marketing': 'campaign optimization brief',
        'design': 'design system case study',
        'writing': 'documentation portfolio sample',
        'software': 'engineering implementation dossier',
        'business': 'delivery strategy memo',
    }.get(domain, 'portfolio evidence pack')


def rewrite_week_list_items(soup, ul, title, topic, domain, v1, v2, v3, v4, course_type, level):
    existing = ul.find_all('li')
    n = max(4, len(existing))
    topic_clean = normalize_space(topic)
    artifact = domain_artifact(domain)

    bullets = [
        f"{v1.capitalize()} the principles of {topic_clean} and link them to course outcomes {level_rigor_phrase(course_type, level)}.",
        f"{v2.capitalize()} {topic_clean} in a guided scenario using realistic tools, constraints, and quality gates.",
        f"{v3.capitalize()} trade-offs, risks, and decision points for {topic_clean}, then record rationale for stakeholder review.",
        f"{v4.capitalize()} a portfolio-ready {artifact} for {topic_clean} with measurable success criteria and next actions.",
    ]

    if n >= 5:
        bullets.append(
            "Track measurable progress using rubric scores, defect/risk trends, and evidence completeness each week."
        )
    if n >= 6:
        bullets.append(
            "Run a short retrospective focused on what to retain, improve, and scale into the following week."
        )
    if n >= 7:
        bullets.append(
            "Incorporate peer or mentor feedback and revise the week deliverable to professional publication quality."
        )
    if n >= 8:
        bullets.append(
            "Publish the week output into your cumulative portfolio with concise outcome narrative and proof artifacts."
        )

    ul.clear()
    for i in range(n):
        li = soup.new_tag('li')
        li.string = bullets[i]
        ul.append(li)


def rewrite_lab_section(soup, week_block, topic):
    for lab in week_block.select('.lab-section'):
        ul = lab.find('ul')
        if not ul:
            continue
        lis = ul.find_all('li')
        count = max(2, len(lis))
        lab_lines = [
            f"Execute a hands-on lab for {normalize_space(topic)} and capture evidence (screenshots, logs, configuration notes, and outcomes).",
            "Package the lab output as a portfolio artifact with rubric score, risk notes, and a concrete improvement plan for next week.",
        ]
        if count > 2:
            for _ in range(count - 2):
                lab_lines.append("Verify completeness against acceptance criteria before marking the week deliverable ready for review.")
        ul.clear()
        for line in lab_lines:
            li = soup.new_tag('li')
            li.string = line
            ul.append(li)


def update_welcome_text(soup, title, course_type, level):
    section = soup.select_one('.welcome-section')
    if not section:
        return
    ps = section.find_all('p')
    if not ps:
        return

    orientation = {
        'intro': 'foundational concepts to confident application',
        'crash': 'high-impact fundamentals to delivery-ready execution',
        'advanced': 'advanced analysis to architecture-grade creation',
        'core': 'core competencies to integrated professional delivery',
        'standard': 'practical foundations to measurable professional outcomes',
    }.get(course_type, 'practical foundations to measurable professional outcomes')

    ps[0].string = (
        f"This curriculum for {title} follows a Bloom-aligned progression from {orientation}, "
        f"with weekly evidence, labs, and portfolio outputs matched to {level} expectations."
    )
    if len(ps) > 1:
        ps[1].string = (
            "Each week advances from comprehension and application toward evaluation and creation, "
            "ensuring progressive learning and capstone readiness."
        )
    if len(ps) > 2:
        strong = ps[2].find('strong')
        if strong:
            strong.string = "Your success is our priority."
            ps[2].append(" You will graduate with a professionally curated portfolio that demonstrates scope, depth, and delivery quality.")


def process_file(path: Path):
    html = path.read_text(encoding='utf-8')
    soup = BeautifulSoup(html, 'html.parser')

    title_el = soup.find('h1')
    title = normalize_space(title_el.get_text()) if title_el else path.stem.replace('curriculum-', '').replace('-', ' ').title()
    level = parse_level(soup)
    course_type = classify_course_type(path.name, title)
    file_domain = infer_file_domain(title, path.name)

    update_welcome_text(soup, title, course_type, level)

    week_blocks = soup.select('.week-block')
    total = len(week_blocks)
    updated = 0
    for idx, wb in enumerate(week_blocks):
        topic_el = wb.select_one('.week-topic')
        topic = normalize_space(topic_el.get_text()) if topic_el else f"Week {idx + 1} Delivery"
        domain = file_domain
        v1, v2, v3, v4 = bloom_band(idx, total, level, course_type)

        ul = None
        week_content = wb.select_one('.week-content')
        if week_content:
            ul = week_content.find('ul')
        if ul:
            rewrite_week_list_items(soup, ul, title, topic, domain, v1, v2, v3, v4, course_type, level)
            updated += 1

        rewrite_lab_section(soup, wb, topic)

    if updated:
        path.write_text(str(soup), encoding='utf-8')
    return total, updated, course_type, level


def main():
    files = sorted(ROOT.glob('curriculum-*.html'))
    touched = 0
    stats = {'intro': 0, 'crash': 0, 'advanced': 0, 'core': 0, 'standard': 0}

    for f in files:
        total, updated, ctype, _ = process_file(f)
        if updated:
            touched += 1
        stats[ctype] = stats.get(ctype, 0) + 1

    print(f"processed_files={len(files)}")
    print(f"touched_files={touched}")
    print(f"course_types={stats}")


if __name__ == '__main__':
    main()
