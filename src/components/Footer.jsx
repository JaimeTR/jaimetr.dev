'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/app/providers/LanguageProvider'

/** Cierre real de la pagina: la accion (escribir) a gran tamano, y debajo las redes y los enlaces. */
export const Footer = ({ perfil }) => {
    const { language } = useLanguage()
    const pathname = usePathname()
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

    if (['v1', 'v2', 'v3'].includes((pathname || '').split('/')[2])) return null

    return (
        <footer id="contacto" className="mt-32 border-t border-rule">
            <div className="wrap grid gap-12 py-20 md:grid-cols-12 md:gap-8">
                <h2 className="display display-m md:col-span-5">{es ? '¿Tienes un proyecto o una vacante? Hablemos.' : 'Have a project or an opening? Let’s talk.'}</h2>
                <div className="md:col-span-6 md:col-start-7">
                    {correo && (
                        <a href={`mailto:${correo}`} className="display text-ink no-underline transition-colors hover:text-accent" style={{ fontSize: 'clamp(1.5rem, 3.1vw, 2.75rem)', lineHeight: 1.05, overflowWrap: 'anywhere' }}>
                            {correo}
                        </a>
                    )}
                    {cv && (
                        <p className="mt-8">
                            <a href={cv} target="_blank" rel="noopener noreferrer" className="link-line text-lg">
                                {etiquetaCv}
                            </a>
                        </p>
                    )}
                </div>
            </div>
            <div className="border-t border-rule">
                <div className="wrap flex flex-col gap-6 py-6 text-sm text-ink-3 md:flex-row md:items-center md:justify-between">
                    <p>
                        <Link href={`/${language}`} className="no-underline hover:text-ink">
                            {texto}
                        </Link>{' '}
                        <span className="tabular">· {new Date().getFullYear()}</span>
                    </p>
                    <ul className="flex flex-wrap gap-x-6 gap-y-2">
                        {redes.map((r) => (
                            <li key={r.nombre}>
                                <a href={r.url} target="_blank" rel="noopener noreferrer" className="no-underline transition-colors hover:text-ink">
                                    {r.nombre}
                                </a>
                            </li>
                        ))}
                        {enlaces.map((l, i) => (
                            <li key={l.id || i}>
                                <Link href={(es ? l.url_es : l.url_en) || '/'} className="no-underline transition-colors hover:text-ink">
                                    {es ? l.label_es : l.label_en}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    )
}
