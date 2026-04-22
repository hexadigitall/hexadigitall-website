'use client'

import { useRef, useState, useEffect } from 'react'

interface CurriculumEmbedProps {
  title: string
  htmlUrl: string
  courseSlug: string
}

const PRINT_STYLE_ID = 'hexadigitall-curriculum-print-style'
const MOBILE_STYLE_ID = 'hexadigitall-curriculum-mobile-style'

function injectMobileStyles(frame: HTMLIFrameElement | null) {
  if (!frame) return

  const doc = frame.contentDocument
  if (!doc) return

  if (!doc.getElementById(MOBILE_STYLE_ID)) {
    const style = doc.createElement('style')
    style.id = MOBILE_STYLE_ID
    style.textContent = `
      * {
        box-sizing: border-box;
      }

      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
      }

      @media (max-width: 768px) {
        body, html {
          font-size: 14px;
          overflow-x: hidden;
        }

        img, table, pre, code, video, iframe {
          max-width: 100% !important;
          height: auto !important;
        }

        pre, code {
          font-size: 12px;
          word-break: break-word;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        table {
          font-size: 13px;
          display: block;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          width: 100%;
        }

        h1 { font-size: 24px; line-height: 1.3; }
        h2 { font-size: 20px; line-height: 1.3; }
        h3 { font-size: 18px; line-height: 1.3; }
        h4 { font-size: 16px; line-height: 1.2; }

        p, li { font-size: 14px; line-height: 1.6; }
        
        body {
          padding: 12px;
        }
      }
    `
    doc.head.appendChild(style)
  }
}

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
        margin: 0;
        padding: 0;
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
  if (!frame || !frame.contentDocument) return

  try {
    const doc = frame.contentDocument
    const bodyHeight = doc.body?.scrollHeight ?? 0
    const htmlHeight = doc.documentElement?.scrollHeight ?? 0
    const targetHeight = Math.max(bodyHeight, htmlHeight, 600)

    frame.style.height = `${targetHeight + 48}px`
  } catch (error) {
    console.warn('Failed to autosize frame:', error)
    // Fallback to minimum
    frame.style.height = '600px'
  }
}

export default function CurriculumEmbed({ title, htmlUrl, courseSlug }: CurriculumEmbedProps) {
  const frameRef = useRef<HTMLIFrameElement | null>(null)
  const [printing, setPrinting] = useState(false)
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    // Set up a ResizeObserver to watch for content changes
    let resizeObserver: ResizeObserver | null = null
    let loadTimer: ReturnType<typeof setTimeout> | null = null

    const setupFrame = () => {
      try {
        if (frame.contentDocument) {
          injectMobileStyles(frame)
          injectPrintStyles(frame)
          autosizeFrame(frame)

          // Watch for content size changes
          if (typeof ResizeObserver !== 'undefined') {
            resizeObserver?.disconnect()
            resizeObserver = new ResizeObserver(() => {
              autosizeFrame(frame)
            })
            const body = frame.contentDocument.body
            if (body) {
              resizeObserver.observe(body)
            }
          }

          setLoading(false)
          setError(false)
        }
      } catch (error) {
        console.warn('Frame setup error:', error)
        setError(true)
        setLoading(false)
      }
    }

    // Try to set up immediately if already loaded
    if (frame.contentDocument?.readyState === 'complete') {
      setupFrame()
    }

    // Also set up on load event
    const handleLoad = () => {
      // Small delay to ensure content is fully rendered
      if (loadTimer) {
        clearTimeout(loadTimer)
      }
      loadTimer = setTimeout(setupFrame, 150)
    }

    const handleError = () => {
      console.error('Failed to load curriculum iframe')
      setError(true)
      setLoading(false)
    }

    frame.addEventListener('load', handleLoad)
    frame.addEventListener('error', handleError)

    // Watch for window resize and adjust frame height
    const handleResize = () => {
      autosizeFrame(frame)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      frame.removeEventListener('load', handleLoad)
      frame.removeEventListener('error', handleError)
      window.removeEventListener('resize', handleResize)
      if (loadTimer) {
        clearTimeout(loadTimer)
      }
      resizeObserver?.disconnect()
    }
  }, [])

  const onLoad = () => {
    try {
      injectMobileStyles(frameRef.current)
      injectPrintStyles(frameRef.current)
      autosizeFrame(frameRef.current)
      setLoading(false)
      setError(false)
    } catch (e) {
      console.error('Error on iframe load:', e)
      setError(true)
    }
  }

  const onPrint = () => {
    const frame = frameRef.current
    if (!frame) return

    injectPrintStyles(frame)
    setPrinting(true)

    setTimeout(() => {
      frame.contentWindow?.focus()
      frame.contentWindow?.print()
      // Keep button disabled long enough to avoid rapid double-triggering.
      setTimeout(() => {
        setPrinting(false)
      }, 300)
    }, 80)
  }

  const onDownloadPdf = async () => {
    setDownloadingPdf(true)
    try {
      const response = await fetch(`/api/curriculum/${courseSlug}/pdf`)
      if (!response.ok) throw new Error('PDF generation failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${courseSlug}-curriculum.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to download PDF:', error)
      alert('Failed to generate PDF. Please try printing instead.')
    } finally {
      setDownloadingPdf(false)
    }
  }

  return (
    <section className="space-y-4 w-full">
      <div className="flex flex-col xs:flex-row gap-2 flex-wrap">
        <button
          type="button"
          onClick={onDownloadPdf}
          className="inline-flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60 transition-colors whitespace-nowrap"
          disabled={downloadingPdf}
        >
          {downloadingPdf ? 'Generating...' : 'Download PDF'}
        </button>
        <button
          type="button"
          onClick={onPrint}
          className="inline-flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-60 transition-colors whitespace-nowrap"
          disabled={printing}
        >
          {printing ? 'Preparing...' : 'Print / Save'}
        </button>
        <a
          href={htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-lg border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
        >
          View HTML
        </a>
      </div>

      <div className="w-full">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm font-semibold text-red-900 mb-3">
              Unable to load curriculum preview
            </p>
            <p className="text-xs text-red-700 mb-4">
              The embedded preview may not be available. Please try viewing the HTML directly:
            </p>
            <a
              href={htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Open Curriculum in New Tab
            </a>
          </div>
        )}

        {!error && (
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm w-full">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-slate-800/70 z-10">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-4 border-gray-200 dark:border-slate-600 border-t-primary rounded-full animate-spin" />
                  <p className="text-xs text-gray-600 font-medium">Loading curriculum...</p>
                </div>
              </div>
            )}
            <iframe
              ref={frameRef}
              title={`${title} curriculum`}
              src={htmlUrl}
              className="w-full min-h-[400px] sm:min-h-[600px] md:min-h-[800px] block border-none"
              onLoad={onLoad}
              style={{ display: 'block', overflow: 'hidden' }}
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        )}
      </div>
    </section>
  )
}
