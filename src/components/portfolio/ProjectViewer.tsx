'use client'

import { useEffect, useRef, useState } from 'react'

interface ProjectViewerProps { url: string; lang: string; onClose: () => void }

export default function ProjectViewer({ url, lang, onClose }: ProjectViewerProps) {
  const [embeddable, setEmbeddable] = useState<boolean | null>(null)
  const [failed, setFailed] = useState(false)
  const english = lang === 'en'
  const dialog = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButton.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || !dialog.current) return
      const focusable = [...dialog.current.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)')]
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    fetch(`/api/check-embeddable?url=${encodeURIComponent(url)}`).then(response => response.json()).then(data => {
      setEmbeddable(data.embeddable !== false)
    }).catch(() => setEmbeddable(true))
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [url, onClose])

  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg/90 p-4" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <div ref={dialog} role="dialog" aria-modal="true" aria-label="Project preview" className="flex max-h-[90vh] w-full max-w-6xl flex-col border border-rule bg-bg">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule p-4">
        <p className="max-w-[60ch] truncate text-sm text-ink-2">{url}</p>
        <div className="flex items-center gap-5"><a className="link-line text-ink" href={url} target="_blank" rel="noopener noreferrer">{english ? 'Open in new tab' : 'Abrir en una pestaña nueva'}</a><button ref={closeButton} type="button" onClick={onClose} className="link-line text-ink">{english ? 'Close' : 'Cerrar'}</button></div>
      </div>
      <div className="relative min-h-[55vh] flex-1 bg-bg">
        {embeddable === null && <p className="p-8 text-ink-2">{english ? 'Checking site preview…' : 'Comprobando la vista previa…'}</p>}
        {(embeddable === false || failed) && <div className="flex h-full min-h-[55vh] flex-col items-start justify-center gap-4 p-8"><p className="text-ink-2">{english ? 'This site does not allow an embedded preview.' : 'Este sitio no permite una vista previa integrada.'}</p><a className="inline-flex min-h-12 items-center bg-accent px-5 text-accent-ink" href={url} target="_blank" rel="noopener noreferrer">{english ? 'Open the site' : 'Abrir el sitio'}</a></div>}
        {embeddable && !failed && <iframe src={url} title={english ? 'Project preview' : 'Vista previa del proyecto'} className="absolute inset-0 h-full min-h-[55vh] w-full border-0" onError={() => setFailed(true)} sandbox="allow-same-origin allow-scripts allow-popups allow-forms" />}
      </div>
    </div>
  </div>
}
