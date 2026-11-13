'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/app/providers/LanguageProvider'

const IDIOMAS = [
    { code: 'es', nombre: 'Español' },
    { code: 'en', nombre: 'English' },
]

/** ES / EN como dos enlaces reales: el rastreador y el visitante van a la misma ruta en el otro idioma. */
export const LanguageSwitch = ({ show = true }) => {
    const { language, changeLanguage } = useLanguage()
    const pathname = usePathname()

    const rutaEn = (nuevo) => {
        const partes = (pathname || '/').split('/')
        if (partes[1] === 'es' || partes[1] === 'en') partes[1] = nuevo
        else partes.splice(1, 0, nuevo)
        return partes.join('/') || `/${nuevo}`
    }

    return (
        <div className={`flex items-center gap-1 text-sm ${show ? '' : 'md:hidden'}`} role="group" aria-label={language === 'es' ? 'Idioma' : 'Language'}>
            {IDIOMAS.map(({ code, nombre }, i) => (
                <span key={code} className="flex items-center gap-1">
                    {i > 0 && <span aria-hidden="true" className="text-ink-3">/</span>}
                    <Link
                        href={rutaEn(code)}
                        hrefLang={code}
                        lang={code}
                        onClick={() => changeLanguage(code)}
                        aria-label={nombre}
                        aria-current={language === code ? 'true' : undefined}
                        className={`px-1 py-1 uppercase tracking-wide transition-colors ${language === code ? 'text-ink' : 'text-ink-3 hover:text-ink'}`}
                    >
                        {code}
                    </Link>
                </span>
            ))}
        </div>
    )
}
