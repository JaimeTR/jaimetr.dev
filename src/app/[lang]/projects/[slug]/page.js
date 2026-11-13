import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { proyectosDelErp } from '@/lib/erp'
import OpenProject from './OpenProject'

export const revalidate = 600

export async function generateStaticParams() {
  return (await proyectosDelErp() || []).filter(project => project.slug).flatMap(project => ['es', 'en'].map(lang => ({ lang, slug: project.slug })))
}

export async function generateMetadata({ params }) {
  const { lang, slug } = await params
  const project = (await proyectosDelErp() || []).find(item => item.slug === slug)
  if (!project) return {}
  const title = lang === 'en' ? project.titleEn || project.title : project.title
  const description = lang === 'en' ? project.descriptionEn || project.description : project.description
  return { title: `${title} | Jaime Tarazona Rodriguez`, description, openGraph: { title, description, type: 'article', images: project.image_url ? [{ url: project.image_url, alt: title }] : [] } }
}

export default async function ProjectDetail({ params }) {
  const { lang, slug } = await params
  const english = lang === 'en'
  const projects = (await proyectosDelErp() || []).filter(item => item.slug)
  const index = projects.findIndex(item => item.slug === slug)
  if (index < 0) notFound()
  const project = projects[index]
  const title = english ? project.titleEn || project.title : project.title
  const description = english ? project.descriptionEn || project.description : project.description
  const technologies = project.technologies || []
  const category = project.rubro || project.category
  const previous = projects[index - 1]
  const next = projects[index + 1]
  const hrefFor = item => `/${lang}/${english ? 'projects' : 'proyectos'}/${item.slug}`
  const moreInCategory = projects.filter(item => item.slug !== slug && item.category === project.category).slice(0, 3)

  return <main className="wrap py-12 md:py-20">
    <h1 className="display display-l">{title}</h1>
    <dl className="mt-8 grid gap-x-8 md:grid-cols-2">
      {[[english ? 'Industry' : 'Rubro', category], [english ? 'Category' : 'Categoría', project.category], [english ? 'Client' : 'Cliente', project.client || project.cliente], [english ? 'Technologies' : 'Tecnologías', technologies.join(', ')], [english ? 'Link' : 'Enlace', project.link_url]].filter(([, value]) => value).map(([label, value]) => <div key={label} className="rule-top grid grid-cols-[8rem_1fr] gap-4 py-4"><dt className="text-ink-3">{label}</dt><dd className="text-ink-2">{label === (english ? 'Link' : 'Enlace') ? <a className="link-line break-all text-ink" href={value} target="_blank" rel="noopener noreferrer">{value}</a> : value}</dd></div>)}
    </dl>
    {project.image_url && <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-[4px]"><Image src={project.image_url} alt={title} fill priority sizes="(max-width: 768px) 100vw, 92vw" className="object-cover" /></div>}
    {description && <p className="prose-ed my-10 whitespace-pre-line font-sans">{description}</p>}
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      {project.link_url && <OpenProject url={project.link_url} lang={lang} label={english ? 'View the site' : 'Ver el sitio'} />}
      {project.github_url && <a className="link-line text-ink" href={project.github_url} target="_blank" rel="noopener noreferrer">GitHub</a>}
    </div>
    {(previous || next) && <nav className="mt-16" aria-label={english ? 'Project navigation' : 'Navegación de proyectos'}><div className="grid gap-6 md:grid-cols-2">
      {next && <Link className="rule-top py-5" href={hrefFor(next)}><span className="block text-sm text-ink-3">{english ? 'Next project' : 'Siguiente proyecto'}</span><span className="display display-m mt-2 block">{english ? next.titleEn || next.title : next.title}</span></Link>}
      {previous && <Link className="rule-top py-5 md:text-right" href={hrefFor(previous)}><span className="block text-sm text-ink-3">{english ? 'Previous project' : 'Proyecto anterior'}</span><span className="display display-m mt-2 block">{english ? previous.titleEn || previous.title : previous.title}</span></Link>}
    </div></nav>}
    {moreInCategory.length > 0 && <section className="mt-12" aria-labelledby="related-title"><h2 id="related-title" className="display display-m">{english ? `More in ${project.category}` : `Más de ${project.category}`}</h2><ul className="mt-4">{moreInCategory.map(item => <li key={item.slug} className="rule-top py-4"><Link className="link-line text-ink" href={hrefFor(item)}>{english ? item.titleEn || item.title : item.title}</Link></li>)}</ul></section>}
  </main>
}
