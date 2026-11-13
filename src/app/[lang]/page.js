import Image from 'next/image'
import Link from 'next/link'
import { datosPersonalesDelErp, proyectosDelErp, articulosDelErp } from '@/lib/erp'
import ProjectIndex from '@/components/portfolio/ProjectIndex'

export async function generateMetadata({ params }) {
  const { lang } = await params
  const title = 'Jaime Tarazona Rodriguez | Full-Stack Developer'
  const description = lang === 'es'
    ? 'Ingeniero de Sistemas y desarrollador Full-Stack especializado en React, Next.js, WordPress e inteligencia artificial.'
    : 'Systems Engineer and Full-Stack Developer specializing in React, Next.js, WordPress and artificial intelligence.'
  return { title, description, alternates: { canonical: `https://jaimetr.dev/${lang}` }, openGraph: { title, description, url: `https://jaimetr.dev/${lang}`, type: 'website', images: [{ url: '/images/og.webp', width: 1200, height: 630, alt: 'Jaime Tarazona portfolio' }] }, twitter: { card: 'summary_large_image', title, description, images: ['/images/og.webp'] } }
}

// Los textos del perfil usan "|" como separador (cargo | especialidad): cada parte va en su linea.
const partes = (texto) => String(texto || '').split('|').map((p) => p.trim()).filter(Boolean)

export default async function Home({ params }) {
  const { lang } = await params
  const english = lang === 'en'
  const [{ perfil = {}, experiencia = [], habilidades = [] }, projectData, articlesData] = await Promise.all([
    datosPersonalesDelErp(), proyectosDelErp(), articulosDelErp(lang),
  ])
  const projects = (projectData || []).filter(p => p.is_visible !== false && p.slug).sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || (a.sort_order ?? 999) - (b.sort_order ?? 999))
  const firstProject = projects[0]
  const articles = [...(articlesData || [])].sort((a, b) => new Date(b.publicadoEn) - new Date(a.publicadoEn)).slice(0, 3)
  // El nombre es de marca y no cambia con el perfil (hero_title es el rol, no el nombre).
  const firstName = 'Jaime'
  const secondName = 'Tarazona'
  const groups = ['frontend', 'backend', 'learning', 'tools'].map(category => ({
    category,
    label: ({ frontend: 'Frontend', backend: 'Backend', learning: english ? 'Learning' : 'Aprendiendo', tools: english ? 'Tools' : 'Herramientas' })[category],
    names: habilidades.filter(skill => skill.categoria === category).map(skill => skill.nombre).filter(Boolean),
  })).filter(group => group.names.length)
  const dateFormat = new Intl.DateTimeFormat(lang, { year: 'numeric', month: 'short', day: 'numeric' })
  const projectHref = slug => `/${lang}/${english ? 'projects' : 'proyectos'}/${slug}`

  return <main>
    <section className="wrap pb-14 pt-12 md:pb-20 md:pt-16" aria-labelledby="home-title">
      <h1 id="home-title" className="display display-xl max-w-full break-words"><span className="block">{firstName}</span><span className="block">{secondName}</span></h1>
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-6">
        <div className="rise md:col-span-6" style={{ '--d': '120ms' }}>
          {perfil[`role_description_${lang}`] && <p className="max-w-[26ch] text-2xl leading-tight text-ink md:text-3xl">{partes(perfil[`role_description_${lang}`]).map((linea, i) => <span key={i} className="block">{linea}</span>)}</p>}
          {perfil[`specialization_${lang}`] && <p className="mt-4 max-w-[55ch] text-lg text-ink-2">{perfil[`specialization_${lang}`]}</p>}
        </div>
        <div className="rise md:col-span-5 md:col-start-8" style={{ '--d': '240ms' }}>
          {perfil[`availability_${lang}`] && <p className="mb-5 max-w-[36ch] text-ink-2">{perfil[`availability_${lang}`]}</p>}
          {perfil.email && <a className="inline-flex min-h-14 items-center bg-accent px-6 py-3 font-medium text-accent-ink transition-opacity hover:opacity-85" href={`mailto:${perfil.email}`}>{english ? 'Write to me' : 'Escríbeme'}</a>}
          {perfil.is_cv_visible !== false && perfil.cv_url && <a className="link-line ml-5 inline-block py-3 text-ink" href={perfil.cv_url} target="_blank" rel="noopener noreferrer">{english ? 'CV' : 'Currículum'}</a>}
        </div>
      </div>
      {firstProject?.image_url && <Link href={projectHref(firstProject.slug)} className="rise mt-12 block overflow-hidden" style={{ '--d': '360ms' }} aria-label={`${english ? 'Featured project' : 'Proyecto destacado'}: ${english ? firstProject.titleEn || firstProject.title : firstProject.title}`}>
        <div className="relative aspect-[16/7] w-full"><Image src={firstProject.image_url} alt={english ? firstProject.titleEn || firstProject.title : firstProject.title} fill priority sizes="(max-width: 768px) 100vw, 92vw" className="object-cover" /></div>
      </Link>}
    </section>

    <section id="projects" className="wrap py-16 md:py-24" aria-labelledby="projects-title">
      <h2 id="projects-title" className="display display-l">{english ? 'Work' : 'Proyectos'}</h2>
      <div className="mt-8">{projects.length ? <ProjectIndex proyectos={projects} lang={lang} limit={8} /> : <p className="rule-top py-6 text-ink-2">{english ? 'Soon.' : 'Pronto.'}</p>}</div>
      {projects.length > 8 && <Link className="link-line mt-8 inline-block text-ink" href={`/${lang}/${english ? 'projects' : 'proyectos'}`}>{english ? `View all ${projects.length} projects` : `Ver los ${projects.length} proyectos`}</Link>}
      {!projects.length && <Link className="link-line mt-6 inline-block text-ink" href={`/${lang}/${english ? 'projects' : 'proyectos'}`}>{english ? 'All projects' : 'Todos los proyectos'}</Link>}
    </section>

    {experiencia.length > 0 && <section id="experience" className="wrap py-16 md:py-24" aria-labelledby="experience-title">
      <h2 id="experience-title" className="display display-l">{english ? 'Experience' : 'Experiencia'}</h2>
      <ul className="mt-8">{experiencia.map((job, i) => {
        const role = english ? job.cargoEn || job.cargo : job.cargo
        const company = english ? job.empresaNombreEn || job.empresaNombre : job.empresaNombre
        const description = english ? job.descripcionEn || job.descripcion : job.descripcion
        const period = english ? job.periodoEn || job.periodo : job.periodo
        const more = /más experiencias|more experience/i.test(`${role || ''} ${company || ''}`)
        return <li key={`${role}-${i}`} className={`rule-top grid gap-3 py-6 md:grid-cols-12 md:gap-6 ${more ? 'text-ink-3' : ''}`}>
          <p className="tabular text-sm text-ink-3 md:col-span-2">{period}</p>
          <div className="md:col-span-4"><h3 className={`display ${more ? 'text-xl' : 'display-s'}`}>{partes(role).map((linea, i) => <span key={i} className="block">{linea}</span>)}</h3>{company && <p className="mt-3 text-ink-2">{partes(company).map((linea, i) => <span key={i} className="block">{linea}</span>)}</p>}</div>
          {description && <p className="max-w-[65ch] text-ink-2 md:col-span-5 md:col-start-8">{description}</p>}
        </li>
      })}</ul>
    </section>}

    {(perfil.about_me_paragraphs?.some(paragraph => paragraph[lang] || paragraph[english ? 'es' : 'en']) || perfil.about_image_url || groups.length > 0) && <section id="sobre-mi" className="wrap py-16 md:py-24" aria-labelledby="about-title">
      <h2 id="about-title" className="display display-l">{english ? 'About me' : 'Sobre mí'}</h2>
      <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-16">
        <div className="max-w-[68ch] space-y-5 leading-relaxed text-ink-2">{(perfil.about_me_paragraphs || []).map((paragraph, i) => {
          const html = paragraph[lang] || paragraph[english ? 'es' : 'en']
          return html ? <div key={i} className="[&_a]:link-line [&_a]:text-ink [&_strong]:text-ink" dangerouslySetInnerHTML={{ __html: html }} /> : null
        })}</div>
        <div>{perfil.about_image_url && <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-[4px]"><Image src={perfil.about_image_url} alt={english ? 'Portrait of Jaime Tarazona' : 'Retrato de Jaime Tarazona'} fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" /></div>}
          {groups.length > 0 && <div id="stack" className={`${perfil.about_image_url ? 'mt-8' : ''} space-y-6`}><h3 className="display display-m">{english ? 'Skills' : 'Habilidades'}</h3>{groups.map(group => <div key={group.category} className="rule-top pt-4"><h4 className="text-ink-2">{group.label}</h4><p className="mt-2 leading-relaxed text-ink-3">{group.names.join(', ')}</p></div>)}</div>}
        </div>
      </div>
    </section>}

    {articles.length > 0 && <section className="wrap py-16 md:py-24" aria-labelledby="articles-title">
      <h2 id="articles-title" className="display display-l">{english ? 'Articles' : 'Artículos'}</h2>
      <ul className="mt-8">{articles.map(article => <li key={article.slug} className="rule-top grid gap-2 py-5 md:grid-cols-12 md:gap-6"><time className="tabular text-sm text-ink-3 md:col-span-2" dateTime={article.publicadoEn}>{dateFormat.format(new Date(article.publicadoEn))}</time><div className="md:col-span-5"><Link className="link-line text-lg text-ink" href={`/${lang}/posts/${article.slug}`}>{article.titulo}</Link></div><p className="max-w-[55ch] text-ink-2 md:col-span-5">{article.resumen}</p></li>)}</ul>
      <Link className="link-line mt-8 inline-block text-ink" href={`/${lang}/${english ? 'posts' : 'articulos'}`}>{english ? 'View all articles' : 'Ver todos los artículos'}</Link>
    </section>}
  </main>
}
