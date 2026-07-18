'use client'
import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

export const LanguageProvider = ({ children, initialLang = 'es' }) => {
    const [language, setLanguage] = useState(initialLang)
    const changeLanguage = (lang) => {
        setLanguage(lang)
        if (typeof window !== 'undefined') {
            document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000`
        }
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
