'use client'
import { useState } from 'react'
import ProjectViewer from '@/components/portfolio/ProjectViewer'
export default function OpenProject({ url, label, lang }) {
  const [open, setOpen] = useState(false)
  return <>
    <button type="button" onClick={() => setOpen(true)} className="min-h-12 bg-accent px-5 py-3 font-medium text-accent-ink transition-opacity hover:opacity-85">{label}</button>
    {open && <ProjectViewer url={url} lang={lang} onClose={() => setOpen(false)} />}
  </>
}
