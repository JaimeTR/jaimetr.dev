import Image from 'next/image'
import Link from 'next/link'
import { FiArrowRight, FiDownload, FiMail } from 'react-icons/fi'
import '@fontsource-variable/schibsted-grotesk'
import '@fontsource/instrument-serif/400-italic.css'
import { datosPersonalesDelErp, proyectosDelErp } from '@/lib/erp'
import { agruparHabilidades, conFechas, masNuevoPrimero, normalizarExperiencia, oracion, partes, redesDe, rutaProyectos, sinFechas } from '@/components/fx/datos'
import SmoothScroll from '@/components/fx/SmoothScroll'
import Escena from '@/components/v3/Escena'
import Pila from '@/components/v3/Pila'
import Revela from '@/components/v3/Revela'
import '@/components/v3/v3.css'

export const metadata = {
    title: 'Jaime Tarazona · Ingeniero de Sistemas (v3)',
    robots: { index: false, follow: false },
}

export default async function InicioV3({ params }) {
    const { lang } = await params
    const es = lang === 'es'
    const otro = es ? 'en' : 'es'
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
    const redes = redesDe(perfil)
    const parrafos = (perfil.about_me_paragraphs || []).map((p) => p[lang] || p[es ? 'en' : 'es']).filter(Boolean)
    const foto = perfil.about_image_url
    const base = rutaProyectos(lang)

    return (
        <div className="theme-v3" id="inicio">
            <SmoothScroll />
            <div className="v3-fondo" aria-hidden="true" />

            <header className="v3-barra">
                <Link href={`/${lang}/v3`} className="v3-marca" aria-label="Jaime Tarazona">
                    <i aria-hidden="true" />
                    Jaime Tarazona
                </Link>
                <nav className="v3-nav" aria-label={es ? 'Secciones' : 'Sections'}>
                    {pila.length > 0 && <a href="#experiencia">{es ? 'Experiencia' : 'Experience'}</a>}
                    {parrafos.length > 0 && <a href="#sobre-mi">{es ? 'Sobre mí' : 'About'}</a>}
                    {grupos.length > 0 && <a href="#stack">Stack</a>}
                    {proyectos.length > 0 && <a href="#trabajo">{es ? 'Trabajo' : 'Work'}</a>}
                </nav>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div className="v3-lang" role="group" aria-label={es ? 'Idioma' : 'Language'}>
                        <Link href="/es/v3" hrefLang="es" lang="es" aria-current={es ? 'true' : undefined}>
                            es
                        </Link>
                        <Link href="/en/v3" hrefLang="en" lang="en" aria-current={!es ? 'true' : undefined}>
                            en
                        </Link>
                    </div>
                    {correo && (
                        <a href={`mailto:${correo}`} className="v3-btn v3-btn--pri v3-btn--chico">
                            {es ? 'Hablemos' : "Let's talk"}
                        </a>
                    )}
                </div>
            </header>

            <Revela>
                <main className="v3-contenido">
                    <section className="v3-hero" aria-labelledby="v3-titulo">
                        <div className="v3-wrap v3-hero__grid">
                            <div>
                                <h1 id="v3-titulo" className="v3-titulo v3-hero__h1">
                                    <span className="v3-sr">Jaime Tarazona — </span>
                                    {principal} {es ? 'y' : '&'} <em>{secundario}</em>
                                </h1>
                                <p className="v3-hero__sub">
                                    {perfil[`specialization_${lang}`]} {perfil[`availability_${lang}`]}
                                </p>
                                <div className="v3-acciones v3-hero__acciones">
                                    {correo && (
                                        <a href={`mailto:${correo}`} className="v3-btn v3-btn--pri">
                                            <FiMail aria-hidden="true" />
                                            {es ? 'Escríbeme' : 'Write to me'}
                                        </a>
                                    )}
                                    {cv && (
                                        <a href={cv} target="_blank" rel="noopener noreferrer" className="v3-btn v3-btn--vidrio">
                                            <FiDownload aria-hidden="true" />
                                            {cvTxt}
                                        </a>
                                    )}
                                </div>
                                <div className="v3-hero__chips">
                                    <span className="v3-chip">
                                        <i className="v3-punto" aria-hidden="true" />
                                        {es ? 'Disponible' : 'Available'}
                                    </span>
                                    {nombres.slice(0, 5).map((n) => (
                                        <span key={n} className="v3-chip">
                                            {n}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <Escena items={fechadas} habilidades={nombres} correo={correo} foto={foto} es={es} lang={lang} />
                        </div>
                    </section>

                    {pila.length > 0 && (
                        <section id="experiencia" className="v3-seccion" aria-labelledby="v3-exp">
                            <div className="v3-wrap">
                                <div className="v3-seccion__cab v3-rev">
                                    <h2 id="v3-exp" className="v3-titulo v3-h2">
                                        {es ? 'Experiencia que ' : 'Experience that '}
                                        <em>{es ? 'se nota' : 'shows'}</em>
                                    </h2>
                                </div>
                                <Pila items={pila} ahora={ahora} lang={lang} />
                            </div>
                        </section>
                    )}

                    {(parrafos.length > 0 || foto) && (
                        <section id="sobre-mi" className="v3-seccion" aria-labelledby="v3-sobre">
                            <div className="v3-wrap">
                                <h2 id="v3-sobre" className="v3-titulo v3-h2 v3-rev" style={{ marginBottom: '2rem' }}>
                                    {es ? 'Sobre ' : 'About '}
                                    <em>{es ? 'mí' : 'me'}</em>
                                </h2>
                                <div className="v3-sobre">
                                    <div className="v3-sobre__texto v3-rev">
                                        {parrafos.map((html, i) => (
                                            <div key={i} dangerouslySetInnerHTML={{ __html: html }} />
                                        ))}
                                    </div>
                                    {foto && (
                                        <div className="v3-sobre__foto v3-rev">
                                            <Image src={foto} alt={es ? 'Retrato de Jaime Tarazona' : 'Portrait of Jaime Tarazona'} fill sizes="(max-width: 900px) 100vw, 40vw" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}

                    {grupos.length > 0 && (
                        <section id="stack" className="v3-seccion" aria-labelledby="v3-stack">
                            <div className="v3-wrap">
                                <h2 id="v3-stack" className="v3-titulo v3-h2 v3-rev" style={{ marginBottom: '2.25rem' }}>
                                    {es ? 'Con qué ' : 'What I '}
                                    <em>{es ? 'trabajo' : 'work with'}</em>
                                </h2>
                                <div className="v3-grupos">
                                    {grupos.map((g) => (
                                        <div key={g.categoria} className="v3-grupo">
                                            <h3>{g.etiqueta}</h3>
                                            <ul className="v3-grupo__chips" style={{ listStyle: 'none', padding: 0 }}>
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
                        <section id="trabajo" className="v3-seccion" aria-labelledby="v3-trabajo">
                            <div className="v3-wrap">
                                <div className="v3-rev" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'end', justifyContent: 'space-between', gap: '1.25rem', marginBottom: '2rem' }}>
                                    <h2 id="v3-trabajo" className="v3-titulo v3-h2">
                                        {es ? 'Trabajo ' : 'Recent '}
                                        <em>{es ? 'reciente' : 'work'}</em>
                                    </h2>
                                    <Link href={base} className="v3-btn v3-btn--vidrio v3-btn--chico">
                                        {es ? 'Ver todos' : 'See all'}
                                        <FiArrowRight aria-hidden="true" />
                                    </Link>
                                </div>
                                <ul className="v3-carril v3-rev" style={{ listStyle: 'none' }}>
                                    {proyectos.map((p) => (
                                        <li key={p.slug} className="v3-proy">
                                            <Link href={`${base}/${p.slug}`}>
                                                <div className="v3-proy__marco">
                                                    <div className="v3-proy__img">
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

                    <footer id="contacto">
                        <div className="v3-wrap">
                            <div className="v3-banda v3-rev">
                                <h2 className="v3-titulo">
                                    {es ? 'Trabajemos ' : "Let's build "}
                                    <em>{es ? 'juntos' : 'together'}</em>
                                </h2>
                                {correo && (
                                    <a href={`mailto:${correo}`} className="v3-banda__correo">
                                        {correo}
                                    </a>
                                )}
                                <div className="v3-acciones" style={{ marginTop: '2rem' }}>
                                    {correo && (
                                        <a href={`mailto:${correo}`} className="v3-btn v3-btn--blanco">
                                            <FiMail aria-hidden="true" />
                                            {es ? 'Escríbeme' : 'Write to me'}
                                        </a>
                                    )}
                                    {cv && (
                                        <a href={cv} target="_blank" rel="noopener noreferrer" className="v3-btn v3-btn--vidrio">
                                            <FiDownload aria-hidden="true" />
                                            {cvTxt}
                                        </a>
                                    )}
                                </div>
                            </div>
                            <div className="v3-pie">
                                <p>© {new Date(ahora).getFullYear()} Jaime Tarazona</p>
                                <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '0 1.5rem', listStyle: 'none', padding: 0 }}>
                                    {redes.map((r) => (
                                        <li key={r.nombre}>
                                            <a href={r.url} target="_blank" rel="noopener noreferrer">
                                                {r.nombre}
                                            </a>
                                        </li>
                                    ))}
                                    <li>
                                        <a href="#inicio">{es ? 'Volver arriba' : 'Back to top'}</a>
                                    </li>
                                    <li>
                                        <Link href={`/${otro}/v3`}>{es ? 'English' : 'Español'}</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </footer>
                </main>
            </Revela>
        </div>
    )
}
