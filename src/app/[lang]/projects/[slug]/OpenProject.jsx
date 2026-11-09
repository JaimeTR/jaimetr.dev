'use client'
import { useState } from 'react'
import ProjectViewer from '@/components/portfolio/ProjectViewer'
export default function OpenProject({ url, label }) {
  const [open, setOpen] = useState(false)
  return <>
    <button onClick={() => setOpen(true)} className="rounded-lg bg-primary-600 px-5 py-3 font-semibold text-white">{label}</button>
    {open && <ProjectViewer url={url} onClose={() => setOpen(false)} />}
  </>
}
