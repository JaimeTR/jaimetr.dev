'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { ThemeSwitch } from './ThemeSwitch'
import { LanguageSwitch } from './LanguageSwitch'

const ENLACES_BASE = [
    { id: 'proyectos', label_es: 'Proyectos', label_en: 'Projects', url_es: '/{lang}/proyectos', url_en: '/{lang}/projects' },
    { id: 'experiencia', label_es: 'Experiencia', label_en: 'Experience', url_es: '/{lang}/#experience', url_en: '/{lang}/#experience' },
    { id: 'blog', label_es: 'Artículos', label_en: 'Articles', url_es: '/{lang}/articulos', url_en: '/{lang}/posts' },
]

/** La barra no consulta nada: recibe el perfil ya resuelto por el servidor (sin parpadeo ni contenido vacio). */
export const Navbar = ({ perfil }) => {
    const { language } = useLanguage()
    const [abierto, setAbierto] = useState(false)
    const es = language === 'es'

    const enlaces = (Array.isArray(perfil?.header_links) && perfil.header_links.length ? perfil.header_links : ENLACES_BASE).filter((l) => l.visible !== false)
    const urlDe = (l) => ((es ? l.url_es : l.url_en) || '').replace('{lang}', language)
    // En el perfil del ERP las etiquetas pueden venir en MAYUSCULAS: aqui se muestran con mayuscula inicial.
    const normal = (t) => { const s = (t || '').toLocaleLowerCase(language); return s.charAt(0).toLocaleUpperCase(language) + s.slice(1) }
    const nombreDe = (l) => normal((es ? l.label_es : l.label_en) || l.label_es || l.label_en)

    useEffect(() => {
        if (!abierto) return
        const cerrar = (e) => e.key === 'Escape' && setAbierto(false)
        document.addEventListener('keydown', cerrar)
        const previo = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', cerrar)
            document.body.style.overflow = previo
        }
    }, [abierto])

    return (
        <header className="sticky top-0 z-40 border-b border-rule bg-bg">
            <nav className="wrap flex h-16 items-center justify-between" aria-label={es ? 'Principal' : 'Main'}>
                <Link href={`/${language}`} className="display text-xl font-semibold tracking-tight no-underline" onClick={() => setAbierto(false)}>
                    {perfil?.header_logo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={perfil.header_logo_url} alt="Jaime Tarazona" className="h-8 w-auto object-contain" />
                    ) : (
                        'Jaime Tarazona'
                    )}
                </Link>

                <div className="hidden items-center gap-8 md:flex">
                    <ul className="flex items-center gap-7 text-sm">
                        {enlaces.map((l, i) => (
                            <li key={l.id || i}>
                                <Link href={urlDe(l)} className="text-ink-2 no-underline transition-colors hover:text-ink">
                                    {nombreDe(l)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="flex items-center gap-2 border-l border-rule pl-6">
                        {perfil?.is_language_switch_visible !== false && <LanguageSwitch />}
                        {perfil?.is_theme_switch_visible !== false && <ThemeSwitch />}
                    </div>
                </div>

                <button
                    type="button"
                    className="-mr-2 px-2 py-2 text-sm text-ink md:hidden"
                    onClick={() => setAbierto((v) => !v)}
                    aria-expanded={abierto}
                    aria-controls="menu-principal"
                >
                    {abierto ? (es ? 'Cerrar' : 'Close') : es ? 'Menú' : 'Menu'}
                </button>
            </nav>

            {abierto && (
                <div id="menu-principal" className="fixed inset-x-0 bottom-0 top-16 z-30 overflow-y-auto bg-bg md:hidden">
                    <ul className="wrap flex flex-col pt-4">
                        {enlaces.map((l, i) => (
                            <li key={l.id || i} className="border-b border-rule">
                                <Link href={urlDe(l)} onClick={() => setAbierto(false)} className="display display-m block py-5 no-underline">
                                    {nombreDe(l)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="wrap flex items-center gap-4 py-6">
                        {perfil?.is_language_switch_visible !== false && <LanguageSwitch />}
                        {perfil?.is_theme_switch_visible !== false && <ThemeSwitch />}
                    </div>
                </div>
            )}
        </header>
    )
}
