import Image from 'next/image'
import Link from 'next/link'
import { FiArrowRight, FiDownload, FiMail } from 'react-icons/fi'
import { datosPersonalesDelErp, proyectosDelErp } from '@/lib/erp'
import { agruparHabilidades, conFechas, masNuevoPrimero, normalizarExperiencia, oracion, partes, rutaProyectos, sinFechas } from '@/components/fx/datos'
import SmoothScroll from '@/components/fx/SmoothScroll'
import Escena from '@/components/inicio/Escena'
import Pila from '@/components/inicio/Pila'
import Revela from '@/components/inicio/Revela'
import '@/components/inicio/inicio.css'

export async function generateMetadata({ params }) {
    const { lang } = await params
    const title = 'Jaime Tarazona Rodriguez | Full-Stack Developer'
    const description =
        lang === 'es'
            ? 'Ingeniero de Sistemas y desarrollador Full-Stack especializado en React, Next.js, WordPress e inteligencia artificial.'
            : 'Systems Engineer and Full-Stack Developer specializing in React, Next.js, WordPress and artificial intelligence.'
    return {
        title,
        description,
        alternates: { canonical: `https://jaimetr.dev/${lang}`, languages: { es: 'https://jaimetr.dev/es', en: 'https://jaimetr.dev/en' } },
        openGraph: { title, description, url: `https://jaimetr.dev/${lang}`, type: 'website', images: [{ url: '/images/og.webp', width: 1200, height: 630, alt: 'Jaime Tarazona portfolio' }] },
        twitter: { card: 'summary_large_image', title, description, images: ['/images/og.webp'] },
    }
}

export default async function Inicio({ params }) {
    const { lang } = await params
    const es = lang === 'es'
    const ahora = Date.now()
    const [{ perfil = {}, experiencia = [], habilidades = [] }, proyectosTodos] = await Promise.all([datosPersonalesDelErp(), proyectosDelErp()])

    const todas = normalizarExperiencia(experiencia, lang, ahora)
    const fechadas = masNuevoPrimero(conFechas(todas))
    const pila = [...fechadas, ...sinFechas(todas)]
    const roles = partes(perfil[`role_description_${lang}`])
    const principal = roles[0] || (es ? 'Ingeniero de Sistemas' : 'Systems Engineer')
    const secundario = (roles[1] || (es ? 'Desarrollador Full-Stack' : 'Full-Stack Developer')).toLowerCase()
    const grupos = agruparHabilidades(habilidades, lang)
    const nombres = [...habilidades].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)).map((h) => h.nombre)
    const proyectos = (proyectosTodos || []).filter((p) => p.slug && p.image_url).sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || (a.sort_order ?? 999) - (b.sort_order ?? 999)).slice(0, 8)
    const correo = perfil.is_email_visible !== false ? perfil.email : null
    const cv = perfil.is_cv_visible !== false ? perfil.cv_url : null
    const cvTxt = oracion((es ? perfil.cv_btn_text_es : perfil.cv_btn_text_en) || (es ? 'Descargar CV' : 'Download CV'), lang)
    const parrafos = (perfil.about_me_paragraphs || []).map((p) => p[lang] || p[es ? 'en' : 'es']).filter(Boolean)
    const foto = perfil.about_image_url
    const base = rutaProyectos(lang)

    return (
        <div className="tema-inicio" id="inicio">
            <SmoothScroll />
            <Revela>
                <main>
                    <section className="inicio-hero" aria-labelledby="inicio-titulo">
                        <div className="inicio-wrap inicio-hero__grid">
                            <div>
                                <h1 id="inicio-titulo" className="inicio-titulo inicio-hero__h1">
                                    <span className="inicio-sr">Jaime Tarazona — </span>
                                    {principal} {es ? 'y' : '&'} <em>{secundario}</em>
                                </h1>
                                <p className="inicio-hero__sub">
                                    {perfil[`specialization_${lang}`]} {perfil[`availability_${lang}`]}
                                </p>
                                <div className="inicio-acciones inicio-hero__acciones">
                                    {correo && (
                                        <a href={`mailto:${correo}`} className="inicio-btn inicio-btn--pri">
                                            <FiMail aria-hidden="true" />
                                            {es ? 'Escríbeme' : 'Write to me'}
                                        </a>
                                    )}
                                    {cv && (
                                        <a href={cv} target="_blank" rel="noopener noreferrer" className="inicio-btn inicio-btn--vidrio">
                                            <FiDownload aria-hidden="true" />
                                            {cvTxt}
                                        </a>
                                    )}
                                </div>
                                <div className="inicio-hero__chips">
                                    <span className="inicio-chip">
                                        <i className="inicio-punto" aria-hidden="true" />
                                        {es ? 'Disponible' : 'Available'}
                                    </span>
                                    {nombres.slice(0, 5).map((n) => (
                                        <span key={n} className="inicio-chip">
                                            {n}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <Escena items={fechadas} habilidades={nombres} correo={correo} foto={foto} es={es} lang={lang} />
                        </div>
                    </section>

                    {pila.length > 0 && (
                        <section id="experience" className="inicio-seccion" aria-labelledby="inicio-exp">
                            <div className="inicio-wrap">
                                <div className="inicio-seccion__cab inicio-rev">
                                    <h2 id="inicio-exp" className="inicio-titulo inicio-h2">
                                        {es ? 'Experiencia que ' : 'Experience that '}
                                        <em>{es ? 'se nota' : 'shows'}</em>
                                    </h2>
                                </div>
                                <Pila items={pila} ahora={ahora} lang={lang} />
                            </div>
                        </section>
                    )}

                    {(parrafos.length > 0 || foto) && (
                        <section id="sobre-mi" className="inicio-seccion" aria-labelledby="inicio-sobre">
                            <div className="inicio-wrap">
                                <h2 id="inicio-sobre" className="inicio-titulo inicio-h2 inicio-rev" style={{ marginBottom: '2rem' }}>
                                    {es ? 'Sobre ' : 'About '}
                                    <em>{es ? 'mí' : 'me'}</em>
                                </h2>
                                <div className="inicio-sobre">
                                    <div className="inicio-sobre__texto inicio-rev">
                                        {parrafos.map((html, i) => (
                                            <div key={i} dangerouslySetInnerHTML={{ __html: html }} />
                                        ))}
                                    </div>
                                    {foto && (
                                        <div className="inicio-sobre__foto inicio-rev">
                                            <Image src={foto} alt={es ? 'Retrato de Jaime Tarazona' : 'Portrait of Jaime Tarazona'} fill sizes="(max-width: 900px) 100vw, 40vw" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}

                    {grupos.length > 0 && (
                        <section id="stack" className="inicio-seccion" aria-labelledby="inicio-stack">
                            <div className="inicio-wrap">
                                <h2 id="inicio-stack" className="inicio-titulo inicio-h2 inicio-rev" style={{ marginBottom: '2.25rem' }}>
                                    {es ? 'Con qué ' : 'What I '}
                                    <em>{es ? 'trabajo' : 'work with'}</em>
                                </h2>
                                <div className="inicio-grupos">
                                    {grupos.map((g) => (
                                        <div key={g.categoria} className="inicio-grupo">
                                            <h3>{g.etiqueta}</h3>
                                            <ul className="inicio-grupo__chips" style={{ listStyle: 'none', padding: 0 }}>
                                                {g.nombres.map((n) => (
                                                    <li key={n} style={{ display: 'contents' }}>
                                                        <span>{n}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {proyectos.length > 0 && (
                        <section id="projects" className="inicio-seccion" aria-labelledby="inicio-trabajo">
                            <div className="inicio-wrap">
                                <div className="inicio-rev" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'end', justifyContent: 'space-between', gap: '1.25rem', marginBottom: '2rem' }}>
                                    <h2 id="inicio-trabajo" className="inicio-titulo inicio-h2">
                                        {es ? 'Trabajo ' : 'Recent '}
                                        <em>{es ? 'reciente' : 'work'}</em>
                                    </h2>
                                    <Link href={base} className="inicio-btn inicio-btn--vidrio inicio-btn--chico">
                                        {es ? 'Ver todos' : 'See all'}
                                        <FiArrowRight aria-hidden="true" />
                                    </Link>
                                </div>
                                <ul className="inicio-carril inicio-rev" style={{ listStyle: 'none' }}>
                                    {proyectos.map((p) => (
                                        <li key={p.slug} className="inicio-proy">
                                            <Link href={`${base}/${p.slug}`}>
                                                <div className="inicio-proy__marco">
                                                    <div className="inicio-proy__img">
                                                        <Image src={p.image_url} alt="" fill sizes="(max-width: 768px) 78vw, 340px" />
                                                    </div>
                                                </div>
                                                <h3>{es ? p.title : p.titleEn || p.title}</h3>
                                                <p>{p.rubro || p.category}</p>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    )}
                </main>
            </Revela>
        </div>
    )
}
