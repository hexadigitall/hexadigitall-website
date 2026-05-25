import json

paths = []
with open('hexadigitall-filelist.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if line.endswith(','):
            line = line[:-1]
        try:
            data = json.loads(line)
            if 'path' in data:
                p = data['path']
                if p.startswith('./'):
                    p = p[2:]
                if p:
                    paths.append(p)
        except json.JSONDecodeError:
            pass

class TreeNode:
    def __init__(self):
        self.children = {}
        self.is_file = False

root = TreeNode()
for path in paths:
    parts = path.split('/')
    node = root
    for i, part in enumerate(parts):
        if part not in node.children:
            node.children[part] = TreeNode()
        node = node.children[part]
        if i == len(parts) - 1:
            node.is_file = True

def generate_tree(node, prefix='', depth=0, max_depth=None):
    lines = []
    keys = sorted(node.children.keys())
    for i, key in enumerate(keys):
        last = (i == len(keys) - 1)
        connector = '└── ' if last else '├── '
        lines.append(f"{prefix}{connector}{key}")
        
        child_node = node.children[key]
        if len(child_node.children) > 0:
            if max_depth is None or depth < max_depth:
                child_prefix = prefix + ('    ' if last else '│   ')
                lines.extend(generate_tree(child_node, child_prefix, depth + 1, max_depth))
            else:
                child_prefix = prefix + ('    ' if last else '│   ')
                lines.append(f"{child_prefix}└── ...")
    return lines

full_tree_lines = generate_tree(root)

with open('ECOSYSTEM_HIERARCHY.md', 'w', encoding='utf-8') as f:
    f.write("# Hexadigitall Ecosystem Hierarchy\n\n```text\n")
    f.write('\n'.join(full_tree_lines))
    f.write("\n```\n")

with open('ECOSYSTEM_HIERARCHY.docs', 'w', encoding='utf-8') as f:
    f.write("Hexadigitall Ecosystem Hierarchy\n=================================\n\n")
    f.write('\n'.join(full_tree_lines))

summary_lines = generate_tree(root, max_depth=1)
print('\n'.join(summary_lines[:50]))
if len(summary_lines) > 50:
    print(f"... and {len(summary_lines) - 50} more summary lines.")