'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'

export default function ProjectIndex({ proyectos = [], lang, limit, filtros = false }) {
  const [category, setCategory] = useState('')
  const [preview, setPreview] = useState(null)
  const [point, setPoint] = useState({ x: 0, y: 0 })
  const english = lang === 'en'
  const categories = useMemo(() => [...new Set(proyectos.map(p => p.category).filter(Boolean))].sort((a, b) => a.localeCompare(b)), [proyectos])
  const filtered = proyectos.filter(p => !category || p.category === category)
  const visible = limit ? filtered.slice(0, limit) : filtered
  const hrefFor = slug => `/${lang}/${english ? 'projects' : 'proyectos'}/${slug}`

  function showPreview(project, event) {
    if (!project.image_url) return
    setPreview(project)
    if (event?.clientX) setPoint({ x: event.clientX, y: event.clientY })
  }

  return <div>
    {filtros && <div className="mb-6 flex flex-wrap gap-x-6 gap-y-3" aria-label={english ? 'Filter projects by category' : 'Filtrar proyectos por categoría'}>
      {[['', english ? 'All' : 'Todos'], ...categories.map(item => [item, item])].map(([value, label]) => {
        const count = value ? proyectos.filter(p => p.category === value).length : proyectos.length
        return <button key={value || 'all'} type="button" aria-pressed={category === value} onClick={() => setCategory(value)} className={`link-line py-1 ${category === value ? 'text-ink' : 'text-ink-3'}`}>
          {label} <span className="tabular ml-1 text-sm">{count}</span>
        </button>
      })}
    </div>}
    {visible.length ? <ul>{visible.map(project => {
      const title = english ? project.titleEn || project.title : project.title
      const technologies = (project.technologies || []).slice(0, 3)
      return <li key={project.slug} className="rule-top">
        <Link href={hrefFor(project.slug)} className="group grid grid-cols-[96px_1fr] items-center gap-4 py-5 focus-visible:outline-offset-4 md:grid-cols-[minmax(0,1fr)_minmax(12rem,0.8fr)_minmax(10rem,0.7fr)] md:gap-6"
          onPointerEnter={event => { if (event.pointerType === 'mouse') showPreview(project, event) }}
          onPointerMove={event => { if (event.pointerType === 'mouse' && preview?.slug === project.slug) setPoint({ x: event.clientX, y: event.clientY }) }}
          onPointerLeave={() => setPreview(null)}
          onFocus={() => showPreview(project)} onBlur={() => setPreview(null)}>
          {project.image_url && <span className="relative col-start-1 row-span-3 block aspect-[3/2] w-24 overflow-hidden [@media(pointer:fine)]:hidden">
            <Image src={project.image_url} alt="" fill sizes="96px" className="object-cover" />
          </span>}
          <span className="display display-m col-start-2 row-start-1 md:col-start-1 md:row-auto">{title}</span>
          <span className="col-start-2 row-start-2 text-ink-3 md:col-start-2 md:row-auto">{project.rubro || project.category}</span>
          <span className="col-start-2 row-start-3 text-sm text-ink-2 md:col-start-3 md:row-auto">{technologies.join(', ')}</span>
        </Link>
      </li>
    })}</ul> : <p className="rule-top py-6 text-ink-2">{english ? 'No projects in this category yet.' : 'Aún no hay proyectos en esta categoría.'}</p>}
    {preview?.image_url && <div aria-hidden="true" className="pointer-events-none fixed z-50 hidden overflow-hidden opacity-0 transition-[opacity,transform] duration-200 [@media(pointer:fine)]:block [@media(pointer:fine)]:opacity-100" style={{ width: 320, height: 200, left: Math.min(point.x + 24, (typeof window === 'undefined' ? 1440 : window.innerWidth) - 340), top: Math.min(point.y + 24, (typeof window === 'undefined' ? 900 : window.innerHeight) - 220), transform: 'translateY(0)' }}>
      <Image src={preview.image_url} alt="" fill sizes="320px" className="object-cover" />
    </div>}
  </div>
}
