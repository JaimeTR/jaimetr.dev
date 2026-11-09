import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { proyectosDelErp } from '@/lib/erp'
import OpenProject from './OpenProject'
export const revalidate = 600
export async function generateStaticParams() {
  return (await proyectosDelErp() || []).filter(p => p.slug).flatMap(p => ['es', 'en'].map(lang => ({ lang, slug: p.slug })))
}
export async function generateMetadata({ params }) {
  const { lang, slug } = await params
  const project = (await proyectosDelErp() || []).find(p => p.slug === slug)
  if (!project) return {}
  const title = lang === 'en' ? project.titleEn || project.title : project.title
  const description = lang === 'en' ? project.descriptionEn || project.description : project.description
  return { title: `${title} | Jaime Tarazona Rodriguez`, description }
}
export default async function ProjectDetail({ params }) {
  const { lang, slug } = await params
  const projects = await proyectosDelErp() || []
  const project = projects.find(p => p.slug === slug)
  if (!project) notFound()
  const english = lang === 'en'
  const title = english ? project.titleEn || project.title : project.title
  const description = english ? project.descriptionEn || project.description : project.description
  const related = projects.filter(p => p.slug && p.slug !== slug).slice(0, 3)
  return <main className="container mx-auto max-w-5xl px-4 py-24">
    <Link href={`/${lang}/projects`} className="text-primary-600">? {english ? 'All projects' : 'Todos los proyectos'}</Link>
    <h1 className="mt-6 text-4xl font-bold">{title}</h1>
    {project.image_url && <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl"><Image src={project.image_url} alt={title} fill priority className="object-cover" /></div>}
    <p className="my-8 whitespace-pre-line text-lg leading-8">{description}</p>
    <div className="flex flex-wrap gap-2">{(project.technologies || []).map(tech => <span key={tech} className="rounded-full border px-3 py-1">{tech}</span>)}</div>
    <div className="mt-8 flex flex-wrap gap-4">{project.link_url && <a className="rounded-lg border px-5 py-3" href={project.link_url} target="_blank" rel="noreferrer">{english ? 'Visit website' : 'Visitar sitio'}</a>}{project.link_url && <OpenProject url={project.link_url} label={english ? 'Open in viewer' : 'Abrir en visor'} />}</div>
    {related.length > 0 && <section className="mt-16"><h2 className="mb-5 text-2xl font-bold">{english ? 'Related projects' : 'Proyectos relacionados'}</h2><ul className="grid gap-4 sm:grid-cols-3">{related.map(p => <li key={p.slug}><Link className="underline" href={`/${lang}/projects/${p.slug}`}>{english ? p.titleEn || p.title : p.title}</Link></li>)}</ul></section>}
  </main>
}
