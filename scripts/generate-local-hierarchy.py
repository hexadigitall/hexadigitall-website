import os

IGNORE_DIRS = {'.git', 'node_modules', '.next', '.qa-venv', '__pycache__', '.pytest_cache'}

def generate_tree(dir_path, prefix=''):
    lines = []
    try:
        entries = sorted(os.listdir(dir_path))
    except PermissionError:
        return lines

    # Filter out ignored directories
    entries = [e for e in entries if e not in IGNORE_DIRS]

    for i, entry in enumerate(entries):
        path = os.path.join(dir_path, entry)
        is_last = (i == len(entries) - 1)
        connector = '└── ' if is_last else '├── '
        lines.append(f"{prefix}{connector}{entry}")
        
        if os.path.isdir(path):
            extension = '    ' if is_last else '│   '
            lines.extend(generate_tree(path, prefix + extension))
    return lines

tree_lines = ["."] + generate_tree('.')

md_content = "# Local Repository Hierarchy\n\n```text\n" + '\n'.join(tree_lines) + "\n```\n"
docs_content = "Local Repository Hierarchy\n==========================\n\n" + '\n'.join(tree_lines) + "\n"

with open('LOCAL_REPO_HIERARCHY.md', 'w', encoding='utf-8') as f:
    f.write(md_content)

with open('LOCAL_REPO_HIERARCHY.docs', 'w', encoding='utf-8') as f:
    f.write(docs_content)

# Print a summary for the console output (up to 40 lines)
print('\n'.join(tree_lines[:40]))
if len(tree_lines) > 40:
    print(f"... and {len(tree_lines) - 40} more lines.")

