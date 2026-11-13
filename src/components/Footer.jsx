'use client'
import Link from 'next/link'
import { FiDownload, FiMail } from 'react-icons/fi'
import { useLanguage } from '@/app/providers/LanguageProvider'

/** Cierre global: banda con la llamada a escribir (como las bandas "Hablemos" de DEVMARK) y pie con redes y enlaces. */
export const Footer = ({ perfil }) => {
    const { language } = useLanguage()
    const es = language === 'es'
    const p = perfil || {}

    const correo = p.is_email_visible !== false ? p.email : null
    const cv = p.is_cv_visible !== false ? p.cv_url : null
    const redes = [
        p.is_linkedin_visible !== false && p.linkedin_url && { nombre: 'LinkedIn', url: p.linkedin_url },
        p.is_github_visible !== false && p.github_url && { nombre: 'GitHub', url: p.github_url },
        p.is_tiktok_visible !== false && p.tiktok_url && { nombre: 'TikTok', url: p.tiktok_url },
        p.is_instagram_visible === true && p.instagram_url && { nombre: 'Instagram', url: p.instagram_url },
    ].filter(Boolean)
    const enlaces = (Array.isArray(p.footer_links) ? p.footer_links : []).filter((l) => l.visible !== false)
    // El texto del boton viene del perfil y puede estar en MAYUSCULAS: se muestra como oracion, conservando "CV".
    const crudoCv = (es ? p.cv_btn_text_es : p.cv_btn_text_en) || (es ? 'Descargar CV' : 'Download CV')
    const bajo = crudoCv.toLocaleLowerCase(language).replace(/\bcv\b/g, 'CV')
    const etiquetaCv = bajo.charAt(0).toLocaleUpperCase(language) + bajo.slice(1)
    const texto = (es ? p.footer_text_es : p.footer_text_en) || (es ? 'Portafolio de Jaime Tarazona' : "Jaime Tarazona's portfolio")

    return (
        <footer id="contacto" className="mt-24">
            <div className="inicio-wrap">
                <div className="inicio-banda">
                    <h2 className="inicio-titulo">
                        {es ? 'Trabajemos ' : "Let's build "}
                        <em>{es ? 'juntos' : 'together'}</em>
                    </h2>
                    {correo && (
                        <a href={`mailto:${correo}`} className="inicio-banda__correo">
                            {correo}
                        </a>
                    )}
                    <div className="inicio-acciones" style={{ marginTop: '2rem' }}>
                        {correo && (
                            <a href={`mailto:${correo}`} className="inicio-btn inicio-btn--blanco">
                                <FiMail aria-hidden="true" />
                                {es ? 'Escríbeme' : 'Write to me'}
                            </a>
                        )}
                        {cv && (
                            <a href={cv} target="_blank" rel="noopener noreferrer" className="inicio-btn inicio-btn--vidrio">
                                <FiDownload aria-hidden="true" />
                                {etiquetaCv}
                            </a>
                        )}
                    </div>
                </div>
                <Link href={`/${language}`} aria-label="JAIMETR" style={{ display: 'inline-block' }}>
                    <img src="/marca/jaimetr-isologo-web.svg" alt="JAIMETR" className="inicio-pie__logo" width="48" height="48" />
                </Link>
                <div className="inicio-pie">
                    <p>
                        <Link href={`/${language}`} style={{ textDecoration: 'none' }}>
                            {texto}
                        </Link>{' '}
                        · {new Date().getFullYear()}
                    </p>
                    <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '0 1.5rem', listStyle: 'none', padding: 0 }}>
                        {redes.map((r) => (
                            <li key={r.nombre}>
                                <a href={r.url} target="_blank" rel="noopener noreferrer">
                                    {r.nombre}
                                </a>
                            </li>
                        ))}
                        {enlaces.map((l, i) => (
                            <li key={l.id || i}>
                                <Link href={(es ? l.url_es : l.url_en) || '/'}>{es ? l.label_es : l.label_en}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    )
}
