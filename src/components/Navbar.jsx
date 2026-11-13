'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { LanguageSwitch } from './LanguageSwitch'

const ENLACES_BASE = [
    { id: 'experiencia', label_es: 'Experiencia', label_en: 'Experience', url_es: '/{lang}/#experience', url_en: '/{lang}/#experience' },
    { id: 'proyectos', label_es: 'Proyectos', label_en: 'Projects', url_es: '/{lang}/proyectos', url_en: '/{lang}/projects' },
    { id: 'blog', label_es: 'Artículos', label_en: 'Articles', url_es: '/{lang}/articulos', url_en: '/{lang}/posts' },
]

/** Barra flotante de vidrio. Recibe el perfil ya resuelto por el servidor: sin parpadeo ni contenido vacio. */
export const Navbar = ({ perfil }) => {
    const { language } = useLanguage()
    const [abierto, setAbierto] = useState(false)
    const es = language === 'es'

    const enlaces = (Array.isArray(perfil?.header_links) && perfil.header_links.length ? perfil.header_links : ENLACES_BASE).filter((l) => l.visible !== false)
    const urlDe = (l) => ((es ? l.url_es : l.url_en) || '').replace('{lang}', language)
    // En el perfil del ERP las etiquetas pueden venir en MAYUSCULAS: aqui se muestran con mayuscula inicial.
    const normal = (t) => {
        const s = (t || '').toLocaleLowerCase(language)
        return s.charAt(0).toLocaleUpperCase(language) + s.slice(1)
    }
    const nombreDe = (l) => normal((es ? l.label_es : l.label_en) || l.label_es || l.label_en)
    const correo = perfil?.is_email_visible !== false ? perfil?.email : null

    useEffect(() => {
        if (!abierto) return
        const cerrar = (e) => e.key === 'Escape' && setAbierto(false)
        document.addEventListener('keydown', cerrar)
        return () => document.removeEventListener('keydown', cerrar)
    }, [abierto])

    return (
        <header className="inicio-barra">
            <Link href={`/${language}`} className="inicio-marca" aria-label="Jaime Tarazona" onClick={() => setAbierto(false)}>
                {/* Con espacio: imagotipo completo; en pantallas chicas, solo el isologo. */}
                <img src="/marca/jaimetr-imagotipo-fondo-oscuro-sin-lema.svg" alt="JAIMETR" className="inicio-marca__largo" height="30" />
                <img src="/marca/jaimetr-isologo.svg" alt="JAIMETR" className="inicio-marca__corto" width="34" height="34" />
            </Link>

            <nav className="inicio-nav" aria-label={es ? 'Principal' : 'Main'}>
                {enlaces.map((l, i) => (
                    <Link key={l.id || i} href={urlDe(l)}>
                        {nombreDe(l)}
                    </Link>
                ))}
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {perfil?.is_language_switch_visible !== false && <LanguageSwitch />}
                {correo && (
                    <a href={`mailto:${correo}`} className="inicio-btn inicio-btn--pri inicio-btn--chico">
                        {es ? 'Hablemos' : "Let's talk"}
                    </a>
                )}
                <button type="button" className="inicio-menu" onClick={() => setAbierto((v) => !v)} aria-expanded={abierto} aria-controls="menu-principal">
                    {abierto ? (es ? 'Cerrar' : 'Close') : es ? 'Menú' : 'Menu'}
                </button>
            </div>

            {abierto && (
                <nav id="menu-principal" className="inicio-panel" aria-label={es ? 'Menú' : 'Menu'}>
                    {enlaces.map((l, i) => (
                        <Link key={l.id || i} href={urlDe(l)} onClick={() => setAbierto(false)}>
                            {nombreDe(l)}
                        </Link>
                    ))}
                </nav>
            )}
        </header>
    )
}
