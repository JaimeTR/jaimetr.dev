import Link from 'next/link'
import { FiArrowRight, FiDownload } from 'react-icons/fi'
import { datosPersonalesDelErp, proyectosDelErp } from '@/lib/erp'
import { conFechas, masAntiguoPrimero, normalizarExperiencia, oracion, partes, redesDe, sinFechas } from '@/components/fx/datos'
import SmoothScroll from '@/components/fx/SmoothScroll'
import Aurora from '@/components/v2/Aurora'
import Hero from '@/components/v2/Hero'
import Intro from '@/components/v2/Intro'
import Trayecto from '@/components/v2/Trayecto'
import Habilidades from '@/components/v2/Habilidades'
import Trabajo from '@/components/v2/Trabajo'
import Magnetico from '@/components/v2/Magnetico'
import '@/components/v2/v2.css'

export const metadata = {
    title: 'Jaime Tarazona · Ingeniero de Sistemas (v2)',
    robots: { index: false, follow: false },
}

const sinEtiquetas = (html) => String(html || '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()

export default async function InicioV2({ params }) {
    const { lang } = await params
    const es = lang === 'es'
    const otro = es ? 'en' : 'es'
    const ahora = Date.now()
    const [{ perfil = {}, experiencia = [], habilidades = [] }, proyectosTodos] = await Promise.all([datosPersonalesDelErp(), proyectosDelErp()])

    const todas = normalizarExperiencia(experiencia, lang, ahora)
    const recorrido = [...masAntiguoPrimero(conFechas(todas)), ...sinFechas(todas)]
    const roles = partes(perfil[`role_description_${lang}`])
    const parrafo = sinEtiquetas((perfil.about_me_paragraphs || [])[0]?.[lang] || (perfil.about_me_paragraphs || [])[0]?.[es ? 'en' : 'es'])
    const nombres = [...habilidades].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)).map((h) => h.nombre)
    const proyectos = (proyectosTodos || []).filter((p) => p.slug && p.image_url).sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || (a.sort_order ?? 999) - (b.sort_order ?? 999)).slice(0, 6)
    const correo = perfil.is_email_visible !== false ? perfil.email : null
    const cv = perfil.is_cv_visible !== false ? perfil.cv_url : null
    const cvTxt = oracion((es ? perfil.cv_btn_text_es : perfil.cv_btn_text_en) || (es ? 'Descargar CV' : 'Download CV'), lang)
    const redes = redesDe(perfil)

    return (
        <div className="theme-v2" id="inicio">
            <SmoothScroll />
            <Aurora />
            <header className="v2-barra">
                <Link href={`/${lang}/v2`} className="v2-marca" aria-label="Jaime Tarazona">
                    Jaime Tarazona
                </Link>
                <nav className="v2-nav" aria-label={es ? 'Secciones' : 'Sections'}>
                    {recorrido.length > 0 && <a href="#trayecto">{es ? 'Trayecto' : 'Path'}</a>}
                    {nombres.length > 0 && <a href="#habilidades">{es ? 'Habilidades' : 'Skills'}</a>}
                    {proyectos.length > 0 && <a href="#trabajo">{es ? 'Trabajo' : 'Work'}</a>}
                    <a href="#contacto">{es ? 'Contacto' : 'Contact'}</a>
                </nav>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="v2-lang" role="group" aria-label={es ? 'Idioma' : 'Language'}>
                        <Link href="/es/v2" hrefLang="es" lang="es" aria-current={es ? 'true' : undefined}>
                            es
                        </Link>
                        <Link href="/en/v2" hrefLang="en" lang="en" aria-current={!es ? 'true' : undefined}>
                            en
                        </Link>
                    </div>
                    {correo && (
                        <a href={`mailto:${correo}`} className="v2-btn v2-btn--pri v2-btn--chico">
                            {es ? 'Escríbeme' : 'Write to me'}
                        </a>
                    )}
                </div>
            </header>

            <main className="v2-contenido">
                <Hero roles={roles} sub={perfil[`specialization_${lang}`]} disponibilidad={perfil[`availability_${lang}`]} correo={correo} cv={cv} cvTxt={cvTxt} es={es} />
                <Intro texto={parrafo} />
                <Trayecto items={recorrido} lang={lang} />
                <Habilidades nombres={nombres} es={es} />
                <Trabajo proyectos={proyectos} lang={lang} />

                <footer id="contacto" className="v2-cierre">
                    <div className="v2-wrap">
                        <h2 className="v2-display v2-cierre__titulo">{es ? '¿Hacemos algo juntos?' : 'Shall we build something?'}</h2>
                        {correo && (
                            <a href={`mailto:${correo}`} className="v2-display v2-correo">
                                {correo}
                            </a>
                        )}
                        <div className="v2-acciones" style={{ marginTop: '2.25rem' }}>
                            {correo && (
                                <Magnetico fuerza={0.35}>
                                    <a href={`mailto:${correo}`} className="v2-btn v2-btn--pri">
                                        {es ? 'Escríbeme' : 'Write to me'}
                                        <FiArrowRight aria-hidden="true" />
                                    </a>
                                </Magnetico>
                            )}
                            {cv && (
                                <Magnetico>
                                    <a href={cv} target="_blank" rel="noopener noreferrer" className="v2-btn v2-btn--vidrio">
                                        {cvTxt}
                                        <FiDownload aria-hidden="true" />
                                    </a>
                                </Magnetico>
                            )}
                        </div>
                        <div className="v2-pie">
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
                                    <Link href={`/${otro}/v2`}>{es ? 'English' : 'Español'}</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    )
}
