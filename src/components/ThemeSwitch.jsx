'use client'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { FiMoon, FiSun } from 'react-icons/fi'

export const ThemeSwitch = ({ show = true }) => {
    const [montado, setMontado] = useState(false)
    const { resolvedTheme, setTheme } = useTheme()
    const { language } = useLanguage()

    useEffect(() => setMontado(true), [])

    // Reserva el espacio para que la barra no salte al hidratar.
    if (!montado) return <span className={`block h-9 w-9 ${show ? '' : 'md:hidden'}`} aria-hidden="true" />

    const oscuro = resolvedTheme !== 'light'
    const etiqueta = oscuro ? (language === 'es' ? 'Cambiar a tema claro' : 'Switch to light theme') : (language === 'es' ? 'Cambiar a tema oscuro' : 'Switch to dark theme')

    return (
        <button
            type="button"
            onClick={() => setTheme(oscuro ? 'light' : 'dark')}
            aria-label={etiqueta}
            title={etiqueta}
            className={`grid h-9 w-9 place-items-center text-ink-2 transition-colors hover:text-ink ${show ? '' : 'md:hidden'}`}
        >
            {oscuro ? <FiSun size={18} aria-hidden="true" /> : <FiMoon size={18} aria-hidden="true" />}
        </button>
    )
}
