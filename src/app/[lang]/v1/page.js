import Link from 'next/link'
import { FiArrowRight, FiDownload } from 'react-icons/fi'
import { datosPersonalesDelErp, proyectosDelErp } from '@/lib/erp'
import { agruparHabilidades, conFechas, masNuevoPrimero, normalizarExperiencia, oracion, partes, redesDe, sinFechas } from '@/components/fx/datos'
import SmoothScroll from '@/components/fx/SmoothScroll'
import Fondo from '@/components/v1/Fondo'
import Entrada from '@/components/v1/Entrada'
import LineaTiempo from '@/components/v1/LineaTiempo'
import Experiencia from '@/components/v1/Experiencia'
import Habilidades from '@/components/v1/Habilidades'
import Trabajo from '@/components/v1/Trabajo'
import '@/components/v1/v1.css'

export const metadata = {
    title: 'Jaime Tarazona · Ingeniero de Sistemas (v1)',
    robots: { index: false, follow: false },
}

export default async function InicioV1({ params }) {
    const { lang } = await params
    const es = lang === 'es'
    const otro = es ? 'en' : 'es'
    const ahora = Date.now()
    const [{ perfil = {}, experiencia = [], habilidades = [] }, proyectosTodos] = await Promise.all([datosPersonalesDelErp(), proyectosDelErp()])

    const todas = normalizarExperiencia(experiencia, lang, ahora)
    const fechadas = conFechas(todas)
    const lineaDeTiempo = fechadas
    const lista = [...masNuevoPrimero(fechadas), ...sinFechas(todas)]
    const roles = partes(perfil[`role_description_${lang}`])
    const titulo = roles.length ? roles : es ? ['Ingeniero de Sistemas', 'Desarrollador Full-Stack'] : ['Systems Engineer', 'Full-Stack Developer']
    const desde = fechadas.length ? Math.min(...fechadas.map((x) => x.inicio)) : null
    const desdeTxt = desde ? new Intl.DateTimeFormat(lang, { month: 'long', year: 'numeric' }).format(desde) : null
    const grupos = agruparHabilidades(habilidades, lang)
    const proyectos = (proyectosTodos || []).filter((p) => p.slug && p.image_url).sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || (a.sort_order ?? 999) - (b.sort_order ?? 999)).slice(0, 8)
    const correo = perfil.is_email_visible !== false ? perfil.email : null
    const cv = perfil.is_cv_visible !== false ? perfil.cv_url : null
    const cvTxt = oracion((es ? perfil.cv_btn_text_es : perfil.cv_btn_text_en) || (es ? 'Descargar CV' : 'Download CV'), lang)
    const redes = redesDe(perfil)
    const especializacion = perfil[`specialization_${lang}`]
    const disponibilidad = perfil[`availability_${lang}`]

    return (
        <div className="theme-v1" id="inicio">
            <SmoothScroll />
            <Fondo />
            <header className="v1-cabecera">
                <div className="v1-wrap v1-cabecera__fila">
                    <Link href={`/${lang}/v1`} className="v1-marca" aria-label="Jaime Tarazona">
                        Jaime <b>Tarazona</b>
                    </Link>
                    <nav className="v1-nav" aria-label={es ? 'Secciones' : 'Sections'}>
                        {lista.length > 0 && <a href="#experiencia">{es ? 'Experiencia' : 'Experience'}</a>}
                        {grupos.length > 0 && <a href="#habilidades">{es ? 'Habilidades' : 'Skills'}</a>}
                        {proyectos.length > 0 && <a href="#trabajo">{es ? 'Trabajo' : 'Work'}</a>}
                        <a href="#contacto">{es ? 'Contacto' : 'Contact'}</a>
                    </nav>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="v1-lang" role="group" aria-label={es ? 'Idioma' : 'Language'}>
                            <Link href={`/es/v1`} hrefLang="es" lang="es" aria-current={es ? 'true' : undefined}>
                                es
                            </Link>
                            <Link href={`/en/v1`} hrefLang="en" lang="en" aria-current={!es ? 'true' : undefined}>
                                en
                            </Link>
                        </div>
                        {correo && (
                            <a href={`mailto:${correo}`} className="v1-btn v1-btn--relleno v1-btn--compacto">
                                {es ? 'Escríbeme' : 'Write to me'}
                            </a>
                        )}
                    </div>
                </div>
            </header>

            <main className="v1-contenido">
                <Entrada>
                    <section className="v1-hero" aria-labelledby="v1-titulo">
                        <div className="v1-wrap">
                            <h1 id="v1-titulo" className="v1-display v1-hero__titulo">
                                <span className="v1-sr">Jaime Tarazona — </span>
                                {titulo.map((r) => (
                                    <span key={r} className="v1-linea">
                                        <span>{r}</span>
                                    </span>
                                ))}
                            </h1>
                            <div className="v1-hero__grid">
                                <div className="v1-hero__texto v1-entra">
                                    {desdeTxt && (
                                        <p>
                                            {es ? 'Desarrollando software desde ' : 'Building software since '}
                                            <strong>{desdeTxt}</strong>.
                                        </p>
                                    )}
                                    {especializacion && <p style={{ marginTop: '0.75rem' }}>{especializacion}</p>}
                                    {disponibilidad && <p style={{ marginTop: '0.75rem' }}>{disponibilidad}</p>}
                                </div>
                                <div className="v1-acciones v1-entra">
                                    {correo && (
                                        <a href={`mailto:${correo}`} className="v1-btn v1-btn--relleno">
                                            {es ? 'Escríbeme' : 'Write to me'}
                                            <FiArrowRight aria-hidden="true" />
                                        </a>
                                    )}
                                    {cv && (
                                        <a href={cv} target="_blank" rel="noopener noreferrer" className="v1-btn v1-btn--borde">
                                            {cvTxt}
                                            <FiDownload aria-hidden="true" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="v1-entra">
                            <LineaTiempo items={lineaDeTiempo} ahora={ahora} lang={lang} />
                        </div>
                    </section>
                </Entrada>

                <Experiencia items={lista} lang={lang} />
                <Habilidades grupos={grupos} lang={lang} />
                <Trabajo proyectos={proyectos} lang={lang} />

                <footer id="contacto" className="v1-cierre">
                    <div className="v1-wrap">
                        <h2 className="v1-display v1-h2">{es ? '¿Trabajamos juntos?' : 'Shall we work together?'}</h2>
                        {correo && (
                            <p style={{ marginTop: '1.5rem' }}>
                                <a href={`mailto:${correo}`} className="v1-display v1-correo">
                                    {correo}
                                </a>
                            </p>
                        )}
                        <div className="v1-acciones" style={{ marginTop: '2rem' }}>
                            {correo && (
                                <a href={`mailto:${correo}`} className="v1-btn v1-btn--relleno">
                                    {es ? 'Escríbeme' : 'Write to me'}
                                    <FiArrowRight aria-hidden="true" />
                                </a>
                            )}
                            {cv && (
                                <a href={cv} target="_blank" rel="noopener noreferrer" className="v1-btn v1-btn--borde">
                                    {cvTxt}
                                    <FiDownload aria-hidden="true" />
                                </a>
                            )}
                        </div>
                        <div className="v1-pie">
                            <p>© {new Date(ahora).getFullYear()} Jaime Tarazona</p>
                            <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '0 1.5rem' }}>
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
                                    <Link href={`/${otro}/v1`}>{es ? 'English' : 'Español'}</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    )
}
