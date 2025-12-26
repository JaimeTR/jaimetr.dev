'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('es')
    const [mounted, setMounted] = useState(false)

    // Cargar idioma del localStorage o detectar del navegador
    useEffect(() => {
        setMounted(true)
        
        // Primero intentar obtener del localStorage
        const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('language') : null
        
        if (savedLanguage) {
            setLanguage(savedLanguage)
        } else {
            // Si no hay guardado, detectar del navegador
            if (typeof window !== 'undefined') {
                const browserLanguage = navigator.language || navigator.userLanguage
                // Detectar si es español
                if (browserLanguage.startsWith('es')) {
                    setLanguage('es')
                    localStorage.setItem('language', 'es')
                } else if (browserLanguage.startsWith('en')) {
                    setLanguage('en')
                    localStorage.setItem('language', 'en')
                } else {
                    // Por defecto español
                    setLanguage('es')
                    localStorage.setItem('language', 'es')
                }
            }
        }
    }, [])

    // Guardar idioma en localStorage cuando cambia
    const changeLanguage = (lang) => {
        setLanguage(lang)
        if (typeof window !== 'undefined') {
            localStorage.setItem('language', lang)
        }
    }

    if (!mounted) {
        return null
    }

    return (
        <LanguageContext.Provider value={{ language, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLanguage = () => {
    const context = useContext(LanguageContext)
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider')
    }
    return context
}
