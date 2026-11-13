'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'

function PostRow({ post, basePath, lang }) {
  const [imageFailed, setImageFailed] = useState(false)
  const date = post.publicadoEn ? new Intl.DateTimeFormat(lang, { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(post.publicadoEn)) : ''
  const hasImage = post.imagen && !imageFailed
  return <Link href={`${basePath}/${post.slug}`} className={`rule-top group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-3 py-5 ${hasImage ? 'md:grid-cols-[120px_minmax(0,1fr)_minmax(10rem,auto)]' : 'md:grid-cols-[minmax(0,1fr)_minmax(10rem,auto)]'}`}>
    {hasImage && <div className="relative hidden aspect-[4/3] w-[120px] overflow-hidden rounded-[4px] md:block"><Image src={post.imagen} alt={post.imagenAlt || post.titulo} fill sizes="120px" className="object-cover" onError={() => setImageFailed(true)} /></div>}
    <div className="min-w-0"><p className="tabular text-sm text-ink-3">{date}</p><h2 className="display display-m mt-2 group-hover:text-accent">{post.titulo}</h2><p className="mt-2 line-clamp-2 text-ink-2">{post.resumen}</p></div>
    <p className="col-span-2 text-sm text-ink-3 md:col-span-1 md:text-right">{post.etiquetas?.join(', ')}</p>
  </Link>
}

export default function FilteredPosts({ posts, basePath, lang }) {
  const [tag, setTag] = useState('')
  const [query, setQuery] = useState('')
  const tags = useMemo(() => {
    const counts = new Map()
    posts.forEach(post => (post.etiquetas || []).forEach(item => counts.set(item, (counts.get(item) || 0) + 1)))
    return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], lang))
  }, [posts, lang])
  const visible = posts.filter(post => (!tag || post.etiquetas?.includes(tag)) && `${post.titulo} ${post.resumen}`.toLocaleLowerCase(lang).includes(query.toLocaleLowerCase(lang)))
  return <>
    <div className="rule-bottom flex flex-col gap-5 py-6 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-wrap gap-x-5 gap-y-2" aria-label={lang === 'es' ? 'Filtrar por etiqueta' : 'Filter by tag'}>
        <button type="button" onClick={() => setTag('')} aria-pressed={!tag} className={!tag ? 'text-ink' : 'text-ink-3'}>{lang === 'es' ? 'Todas' : 'All'} <span className="tabular">{posts.length}</span></button>
        {tags.map(([item, count]) => <button key={item} type="button" onClick={() => setTag(tag === item ? '' : item)} aria-pressed={tag === item} className={tag === item ? 'text-ink' : 'text-ink-3'}>{item} <span className="tabular">{count}</span></button>)}
      </div>
      <label className="flex w-full max-w-xs flex-col text-sm text-ink-3">{lang === 'es' ? 'Buscar' : 'Search'}<input type="search" value={query} onChange={event => setQuery(event.target.value)} className="border-b border-rule bg-transparent py-2 text-base text-ink outline-none focus:border-accent" /></label>
    </div>
    <p className="tabular py-5 text-sm text-ink-3">{visible.length} {lang === 'es' ? (visible.length === 1 ? 'artículo' : 'artículos') : (visible.length === 1 ? 'article' : 'articles')}</p>
    {visible.length ? visible.map(post => <PostRow key={post.slug} post={post} basePath={basePath} lang={lang} />) : <p className="rule-top py-8 text-ink-2">{lang === 'es' ? 'No hay artículos que coincidan.' : 'No matching articles.'}</p>}
  </>
}
