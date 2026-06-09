'use client'

import { useMemo } from 'react'

interface LabInstructionsProps {
  markdown: string
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function parseMarkdownLine(line: string): string {
  line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  line = line.replace(/\*(.+?)\*/g, '<em>$1</em>')
  line = line.replace(/`(.+?)`/g, '<code class="bg-slate-800 text-cyan-300 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
  line = line.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-cyan-400 hover:text-cyan-300 underline">$1</a>')
  return line
}

function parseMarkdown(md: string): string {
  const lines = md.split('\n')
  const html: string[] = []
  let inCodeBlock = false
  let codeBuffer: string[] = []
  let codeLang = ''
  let inList = false
  let listType: 'ul' | 'ol' | null = null

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]

    if (raw.trimStart().startsWith('```')) {
      if (inCodeBlock) {
        html.push(`<pre class="bg-slate-900 text-slate-200 p-4 rounded-lg overflow-x-auto text-sm font-mono mb-4 border border-slate-700"><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`)
        codeBuffer = []
        inCodeBlock = false
      } else {
        inCodeBlock = true
        codeLang = raw.trimStart().slice(3).trim()
        codeBuffer = []
      }
      continue
    }

    if (inCodeBlock) {
      codeBuffer.push(raw)
      continue
    }

    const trimmed = raw.trim()

    if (!trimmed) {
      if (inList) {
        html.push(listType === 'ul' ? '</ul>' : '</ol>')
        inList = false
        listType = null
      }
      html.push('')
      continue
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      if (inList) { html.push(listType === 'ul' ? '</ul>' : '</ol>'); inList = false; listType = null }
      html.push(`<h3 class="text-lg font-semibold text-slate-100 mt-6 mb-3">${escapeHtml(trimmed.slice(4))}</h3>`)
      continue
    }
    if (trimmed.startsWith('## ')) {
      if (inList) { html.push(listType === 'ul' ? '</ul>' : '</ol>'); inList = false; listType = null }
      html.push(`<h2 class="text-xl font-semibold text-slate-100 mt-8 mb-3">${escapeHtml(trimmed.slice(3))}</h2>`)
      continue
    }
    if (trimmed.startsWith('# ')) {
      if (inList) { html.push(listType === 'ul' ? '</ul>' : '</ol>'); inList = false; listType = null }
      html.push(`<h1 class="text-2xl font-bold text-slate-100 mt-8 mb-4">${escapeHtml(trimmed.slice(2))}</h1>`)
      continue
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,})$/.test(trimmed)) {
      if (inList) { html.push(listType === 'ul' ? '</ul>' : '</ol>'); inList = false; listType = null }
      html.push('<hr class="border-slate-700 my-6" />')
      continue
    }

    // Ordered list
    if (/^\d+\.\s/.test(trimmed)) {
      const content = parseMarkdownLine(escapeHtml(trimmed.replace(/^\d+\.\s/, '')))
      if (!inList || listType !== 'ol') {
        if (inList) html.push('</ul>')
        html.push('<ol class="list-decimal list-inside space-y-1 mb-4">')
        inList = true
        listType = 'ol'
      }
      html.push(`<li class="text-slate-300">${content}</li>`)
      continue
    }

    // Unordered list
    if (/^[-*+]\s/.test(trimmed)) {
      const content = parseMarkdownLine(escapeHtml(trimmed.replace(/^[-*+]\s/, '')))
      if (!inList || listType !== 'ul') {
        if (inList) html.push('</ol>')
        html.push('<ul class="list-disc list-inside space-y-1 mb-4">')
        inList = true
        listType = 'ul'
      }
      html.push(`<li class="text-slate-300">${content}</li>`)
      continue
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      if (inList) { html.push(listType === 'ul' ? '</ul>' : '</ol>'); inList = false; listType = null }
      html.push(`<blockquote class="border-l-4 border-cyan-600 pl-4 py-1 my-4 text-slate-400 italic">${parseMarkdownLine(escapeHtml(trimmed.slice(2)))}</blockquote>`)
      continue
    }

    // Tables
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      if (inList) { html.push(listType === 'ul' ? '</ul>' : '</ol>'); inList = false; listType = null }
      const cells = trimmed.split('|').filter(Boolean).map(c => c.trim())
      const separatorMatch = /^[\s|:-]+$/.test(trimmed)

      if (!separatorMatch) {
        html.push(`<tr class="border-b border-slate-700">${cells.map(c => `<td class="px-3 py-1.5 text-sm text-slate-300">${parseMarkdownLine(escapeHtml(c))}</td>`).join('')}</tr>`)
      }
      continue
    }

    // Default paragraph
    if (inList) { html.push(listType === 'ul' ? '</ul>' : '</ol>'); inList = false; listType = null }
    html.push(`<p class="text-slate-300 mb-3 leading-relaxed">${parseMarkdownLine(escapeHtml(trimmed))}</p>`)
  }

  if (inCodeBlock) {
    html.push(`<pre class="bg-slate-900 text-slate-200 p-4 rounded-lg overflow-x-auto text-sm font-mono mb-4 border border-slate-700"><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`)
  }
  if (inList) {
    html.push(listType === 'ul' ? '</ul>' : '</ol>')
  }

  return html.join('\n')
}

export default function LabInstructions({ markdown }: LabInstructionsProps) {
  const html = useMemo(() => parseMarkdown(markdown), [markdown])

  return (
    <div
      className="prose prose-invert prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
