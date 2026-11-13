import ProjectIndex from '@/components/portfolio/ProjectIndex'
import { proyectosDelErp } from '@/lib/erp'

export async function generateMetadata({ params }) {
  const { lang } = await params
  const english = lang === 'en'
  const title = english ? 'Work' : 'Proyectos'
  const description = english ? 'Selected web development, custom software and AI projects.' : 'Proyectos seleccionados de desarrollo web, software a medida e inteligencia artificial.'
  return { title: `${title} | Jaime Tarazona Rodriguez`, description, alternates: { canonical: `https://jaimetr.dev/${lang}/${english ? 'projects' : 'proyectos'}` }, openGraph: { title, description, type: 'website' } }
}

export default async function ProjectsPage({ params }) {
  const { lang } = await params
  const english = lang === 'en'
  const projects = (await proyectosDelErp() || []).filter(p => p.is_visible !== false && p.slug).sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || (a.sort_order ?? 999) - (b.sort_order ?? 999))
  return <main className="wrap py-12 md:py-20">
    <h1 className="display display-l">{english ? 'Work' : 'Proyectos'}</h1>
    <p className="tabular mt-4 text-ink-3">{projects.length} {english ? 'projects' : 'proyectos'}</p>
    <div className="mt-8"><ProjectIndex proyectos={projects} lang={lang} filtros /></div>
  </main>
}
