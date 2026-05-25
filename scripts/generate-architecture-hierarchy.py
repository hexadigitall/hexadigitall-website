import os

# Directories to completely ignore
IGNORE_DIRS = {'.git', 'node_modules', '.next', '__pycache__', '.pytest_cache', '.turbo'}

# Directories to show, but collapse their contents entirely
COLLAPSE_DIRS = {
    '.venv', '.qa-venv', '.sanity', '.build-scripts', '.github', '.gemini', 
    'scripts', '.venv-imgcover', '.venv-kdp', '.vercel', 'tests', 'test'
}

# Important root files to explicitly show
IMPORTANT_ROOT_FILES = {
    'package.json', 
    'next.config.ts', 
    'tailwind.config.ts', 
    'tsconfig.json', 
    'postcss.config.mjs',
    'eslint.config.js',
    'sanity.config.ts', 
    'sanity.cli.js',
    'README.md', 
    '.env.example', 
    '.env.local',
    'jest.config.ts',
    'middleware.ts'
}

def generate_tree(dir_path, prefix='', is_root=False):
    lines = []
    try:
        entries = sorted(os.listdir(dir_path))
    except PermissionError:
        return lines

    entries = [e for e in entries if e not in IGNORE_DIRS]
    
    # Sort folders first, then files
    folders = [e for e in entries if os.path.isdir(os.path.join(dir_path, e))]
    files = [e for e in entries if os.path.isfile(os.path.join(dir_path, e))]
    
    if is_root:
        important_files = [f for f in files if f in IMPORTANT_ROOT_FILES]
        other_files = [f for f in files if f not in IMPORTANT_ROOT_FILES]
        display_entries = folders + important_files
        has_other = len(other_files) > 0
        other_count = len(other_files)
    else:
        display_entries = folders + files
        has_other = False
        other_count = 0
        
    MAX_ITEMS = 25 # Strict limit to keep folders readable
    if len(display_entries) > MAX_ITEMS and not is_root:
        has_other = True
        other_count = len(display_entries) - MAX_ITEMS
        display_entries = display_entries[:MAX_ITEMS]

    for i, entry in enumerate(display_entries):
        path = os.path.join(dir_path, entry)
        is_last = (i == len(display_entries) - 1) and not has_other
        connector = '└── ' if is_last else '├── '
        lines.append(f"{prefix}{connector}{entry}")
        
        if os.path.isdir(path):
            if entry in COLLAPSE_DIRS:
                extension = '    ' if is_last else '│   '
                lines.append(f"{prefix}{extension}└── ... (collapsed)")
            else:
                extension = '    ' if is_last else '│   '
                lines.extend(generate_tree(path, prefix + extension, is_root=False))
                
    if has_other:
        connector = '└── '
        if is_root:
            lines.append(f"{prefix}{connector}... and {other_count} more root files (e.g. *.md, *.py, *.html)")
        else:
            lines.append(f"{prefix}{connector}... and {other_count} more files/folders")
        
    return lines

tree_lines = ["."] + generate_tree('.', is_root=True)

md_content = "# Hexadigitall Streamlined Architecture Hierarchy\n\n```text\n" + '\n'.join(tree_lines) + "\n```\n"
docs_content = "Hexadigitall Streamlined Architecture Hierarchy\n===============================================\n\n" + '\n'.join(tree_lines) + "\n"

with open('ARCHITECTURE_HIERARCHY.md', 'w', encoding='utf-8') as f:
    f.write(md_content)

with open('ARCHITECTURE_HIERARCHY.docs', 'w', encoding='utf-8') as f:
    f.write(docs_content)

print('\n'.join(tree_lines))
