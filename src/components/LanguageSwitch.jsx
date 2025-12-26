'use client'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/app/providers/LanguageProvider'

export const LanguageSwitch = ({ show = true }) => {
    const [mounted, setMounted] = useState(false)
    const { language, changeLanguage } = useLanguage()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <div className={`bg-dark-300 dark:bg-dark-700 p-1 rounded-md flex gap-1 ${!show && 'md:hidden'}`}>
            <button
                onClick={() => changeLanguage('es')}
                className={`px-2 py-1 text-sm font-medium rounded transition-colors duration-300 ${
                    language === 'es'
                        ? 'bg-primary-600 text-white dark:bg-primary-500'
                        : 'text-dark-700 hover:text-dark-500 dark:text-dark-300 dark:hover:text-dark-100'
                }`}
                title="Cambiar a Español"
                aria-label="Español"
            >
                ES
            </button>
            <button
                onClick={() => changeLanguage('en')}
                className={`px-2 py-1 text-sm font-medium rounded transition-colors duration-300 ${
                    language === 'en'
                        ? 'bg-primary-600 text-white dark:bg-primary-500'
                        : 'text-dark-700 hover:text-dark-500 dark:text-dark-300 dark:hover:text-dark-100'
                }`}
                title="Change to English"
                aria-label="English"
            >
                EN
            </button>
        </div>
    )
}
