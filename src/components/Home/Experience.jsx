'use client'
import { Container } from '../Container'
import { SectionTitle } from '../SectionTitle'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { useTranslation } from '@/helpers/translations'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export const Experience = () => {
    const [mounted, setMounted] = useState(false)
    const [experiences, setExperiences] = useState([])
    const { language } = useLanguage()
    const t = useTranslation(language)
    
    useEffect(() => {
        setMounted(true)
        fetchExperiences()
    }, [])

    const fetchExperiences = async () => {
        const { data, error } = await supabase
            .from('experience')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true })
        if (!error && data) {
            setExperiences(data)
        }
    }
    
    if (!mounted) return null
    
    const formatRange = (start, end, customStr, customStrEn) => {
        if (language === 'es' && customStr) return customStr
        if (language === 'en' && customStrEn) return customStrEn
        if (customStr) return customStr

        const locale = language === 'es' ? 'es-ES' : 'en-US'
        const fmt = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' })
        const present = language === 'es' ? 'Actualidad' : 'Present'
        if (start && !end) return `${fmt.format(new Date(start))} - ${present}`
        if (start && end) return `${fmt.format(new Date(start))} - ${fmt.format(new Date(end))}`
        return language === 'es' ? 'Experiencia' : 'Experience'
    }

    return (
        <Container id="experience">
            <SectionTitle>{t('experienciaSeccion')}</SectionTitle>
            <article className="container px-2 mt-10">
                <ul className="relative border-l border-dark-400 dark:border-dark-700">
                    {experiences.map((experience) => (
                        <li key={experience.id} className="mb-8 md:mb-6 ml-6 ">
                            <span className="absolute flex items-center justify-center w-6 h-6 bg-dark-600 rounded-full -left-3 ring-8 ring-dark-50 dark:ring-dark-950 dark:bg-dark-600">
                                <svg
                                    aria-hidden="true"
                                    className="w-4 h-4 text-primary-100 dark:text-primary-100"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                            </span>
                            <h3 className="flex items-center gap-2 mb-1 text-lg font-semibold text-primary-700 dark:text-primary-400">
                                {language === 'es' ? (experience.role || experience.role_en) : (experience.role_en || experience.role)}{' '}
                                <span className="dark:text-white text-dark-700 font-normal">-</span>
                                <span className="text-sm text-crusta-800 dark:text-crusta-300/90">
                                    {language === 'es' ? (experience.company || experience.company_en) : (experience.company_en || experience.company)}
                                </span>
                            </h3>
                            <time className="block mb-2 text-sm font-normal leading-none text-primary-950/80 dark:text-primary-200/90">
                                {formatRange(experience.start_date, experience.end_date, experience.date_string, experience.date_en_string)}
                            </time>
                            <p className="mb-4 font-normal text-dark-700 dark:text-dark-200 text-base text-pretty whitespace-pre-line">
                                {language === 'es' ? (experience.description || experience.description_en) : (experience.description_en || experience.description)}
                            </p>
                        </li>
                    ))}
                </ul>
            </article>
        </Container>
    )
}
