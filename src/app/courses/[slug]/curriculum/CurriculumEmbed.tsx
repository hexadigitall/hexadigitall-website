'use client'

import { useRef, useState } from 'react'

interface CurriculumEmbedProps {
  title: string
  htmlUrl: string
}

const PRINT_STYLE_ID = 'hexadigitall-curriculum-print-style'

function injectPrintStyles(frame: HTMLIFrameElement | null) {
  if (!frame) return

  const doc = frame.contentDocument
  if (!doc) return

  if (!doc.getElementById(PRINT_STYLE_ID)) {
    const style = doc.createElement('style')
    style.id = PRINT_STYLE_ID
    style.textContent = `
      @page {
        size: A4;
        margin: 14mm;
      }

      html, body {
        background: #fff !important;
      }

      * {
        box-sizing: border-box;
      }

      img, table, pre, code, blockquote {
        max-width: 100% !important;
        page-break-inside: avoid;
      }

      h1, h2, h3, h4 {
        page-break-after: avoid;
      }

      p, li {
        orphans: 3;
        widows: 3;
      }

      @media print {
        body {
          overflow: visible !important;
        }

        a[href]::after {
          content: "";
        }
      }
    `
    doc.head.appendChild(style)
  }
}

function autosizeFrame(frame: HTMLIFrameElement | null) {
  if (!frame) return
  const doc = frame.contentDocument
  if (!doc) return

  const bodyHeight = doc.body?.scrollHeight ?? 0
  const htmlHeight = doc.documentElement?.scrollHeight ?? 0
  const targetHeight = Math.max(bodyHeight, htmlHeight, 900)

  frame.style.height = `${targetHeight + 24}px`
}

export default function CurriculumEmbed({ title, htmlUrl }: CurriculumEmbedProps) {
  const frameRef = useRef<HTMLIFrameElement | null>(null)
  const [printing, setPrinting] = useState(false)

  const onLoad = () => {
    injectPrintStyles(frameRef.current)
    autosizeFrame(frameRef.current)
  }

  const onPrint = () => {
    const frame = frameRef.current
    if (!frame) return

    injectPrintStyles(frame)
    setPrinting(true)

    setTimeout(() => {
      frame.contentWindow?.focus()
      frame.contentWindow?.print()
      setPrinting(false)
    }, 80)
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onPrint}
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
          disabled={printing}
        >
          {printing ? 'Preparing print...' : 'Print / Save as PDF'}
        </button>
        <a
          href={htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-gray-300"
        >
          Open Source HTML
        </a>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <iframe
          ref={frameRef}
          title={`${title} curriculum`}
          src={htmlUrl}
          className="w-full min-h-[75vh]"
          onLoad={onLoad}
        />
      </div>
    </section>
  )
}
