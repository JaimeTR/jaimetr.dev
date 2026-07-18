/* eslint-disable @next/next/no-img-element */
'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import { NavLink } from './NavLink'
import { FaLinkedinIn, FaGithub, FaFacebook, FaInstagram } from 'react-icons/fa'
import { SiTiktok } from 'react-icons/si'
import { ThemeSwitch } from './ThemeSwitch'
import { LanguageSwitch } from './LanguageSwitch'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { useTranslation } from '@/helpers/translations'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

export const Navbar = () => {
    const navRef = useRef()
    const [isOpen, setIsOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [profile, setProfile] = useState(null)
    const { language } = useLanguage()
    const t = useTranslation(language)
    
    useEffect(() => {
        const fetchProfile = async () => {
            const { data } = await supabase.from('profile').select('*').limit(1).single()
            if (data) setProfile(data)
        }
        fetchProfile()

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const showNavBar = () => {
        navRef.current.classList.toggle('hidden')
        setIsOpen(!isOpen)
    }

    const headerClass = `fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'top-0 sm:top-4 px-0 sm:px-4' : 'top-0 px-0'}`
    const navClass = `container max-w-6xl mx-auto flex flex-wrap items-center justify-between transition-all duration-300 ${
        isScrolled || isOpen
            ? 'px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-xl bg-white/80 dark:bg-dark-900/80 border-b sm:border border-dark-200/50 dark:border-dark-700/50 shadow-lg shadow-dark-900/5 sm:rounded-[2rem]'
            : 'px-4 sm:px-6 py-4 sm:py-6 bg-transparent border-transparent'
    }`

    const headerLinks = profile?.header_links || [
        { id: "link1", label_es: "Proyectos", label_en: "Projects", url_es: `/${language}/${t('rutaProyectos')}`, url_en: `/${language}/${t('rutaProyectos')}`, visible: true },
        { id: "link2", label_es: "Experiencia", label_en: "Experience", url_es: `/${language}/#experience`, url_en: `/${language}/#experience`, visible: true },
        { id: "link3", label_es: "Blog", label_en: "Blog", url_es: `/${language}/${t('rutaArticulos')}`, url_en: `/${language}/${t('rutaArticulos')}`, visible: true },
        { id: "link4", label_es: "Servicios", label_en: "Services", url_es: "https://www.devmarkpe.com/", url_en: "https://www.devmarkpe.com/", visible: true }
    ]

    const getLinkUrl = (link) => {
        const url = language === 'es' ? link.url_es : link.url_en;
        return (url || '').replace('{lang}', language);
    }

    const renderSocialIcon = useCallback((network) => {
        const iconClass = "text-dark-700 hover:text-dark-500 dark:text-dark-200 dark:hover:text-dark-50 transition-colors duration-300";
        switch (network) {
            case 'linkedin':
                return (
                    <li>
                        <a href={profile?.linkedin_url || "https://www.linkedin.com/in/jaimetr/"} target="_blank" rel="noopener noreferrer" className={iconClass} aria-label="LinkedIn">
                            <FaLinkedinIn />
                        </a>
                    </li>
                )
            case 'github':
                return (
                    <li>
                        <a href={profile?.github_url || "https://github.com/JaimeTR"} target="_blank" rel="noopener noreferrer" className={iconClass} aria-label="GitHub">
                            <FaGithub />
                        </a>
                    </li>
                )
            case 'facebook':
                return profile?.facebook_url ? (
                    <li>
                        <a href={profile.facebook_url} target="_blank" rel="noopener noreferrer" className={iconClass} aria-label="Facebook">
                            <FaFacebook />
                        </a>
                    </li>
                ) : null;
            case 'instagram':
                return profile?.instagram_url ? (
                    <li>
                        <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer" className={iconClass} aria-label="Instagram">
                            <FaInstagram />
                        </a>
                    </li>
                ) : null;
            case 'tiktok':
                return profile?.tiktok_url ? (
                    <li>
                        <a href={profile.tiktok_url} target="_blank" rel="noopener noreferrer" className={iconClass} aria-label="TikTok">
                            <SiTiktok />
                        </a>
                    </li>
                ) : null;
            default:
                return null;
        }
    }, [profile])

    return (
        <header className={headerClass}>
            <nav className={navClass}>
                <Link
                    href={`/${language}`}
                    className="flex gap-2 items-center self-center text-3xl font-black whitespace-nowrap text-primary-600 dark:text-primary-400"
                >
                    {profile?.header_logo_url ? (
                        <img src={profile.header_logo_url} alt="Logo" className="h-10 w-auto object-contain" />
                    ) : (
                        'Portafolio'
                    )}
                </Link>
                <div className="md:order-2">
                    <ul className="hidden md:flex md:space-x-8 items-center ">
                        {(profile?.header_show_linkedin !== false) && renderSocialIcon('linkedin')}
                        {(profile?.header_show_github !== false) && renderSocialIcon('github')}
                        {(profile?.header_show_facebook === true) && renderSocialIcon('facebook')}
                        {(profile?.header_show_instagram === true) && renderSocialIcon('instagram')}
                        {(profile?.header_show_tiktok === true) && renderSocialIcon('tiktok')}
                        
                        {profile?.is_theme_switch_visible !== false && (
                            <li><ThemeSwitch /></li>
                        )}
                        {profile?.is_language_switch_visible !== false && (
                            <li><LanguageSwitch /></li>
                        )}
                    </ul>
                    <div className="flex items-center gap-2 md:hidden">
                        {profile?.is_theme_switch_visible !== false && <ThemeSwitch show={false} />}
                        {profile?.is_language_switch_visible !== false && <LanguageSwitch show={false} />}
                        <button
                            className="p-2 text-sm text-dark-700 dark:text-dark-200 rounded-lg"
                            onClick={showNavBar}
                            aria-label={isOpen ? 'Cerrar menu' : 'Abrir menu'}
                            aria-expanded={isOpen}
                        >
                            {isOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
                <div
                    ref={navRef}
                    className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 transition-all duration-500"
                >
                    <ul className="flex flex-col gap-6 p-4 md:p-0 mt-4 font-medium md:flex-row md:mt-0 md:border-0">
                        {headerLinks.filter(l => l.visible !== false).map((link, idx) => (
                            <li key={link.id || idx} className="text-center">
                                <NavLink 
                                    label={language === 'es' ? link.label_es : link.label_en} 
                                    link={getLinkUrl(link)} 
                                    action={showNavBar} 
                                />
                            </li>
                        ))}
                    </ul>
                    <ul className="flex justify-center space-x-8 my-4 md:hidden">
                        {(profile?.header_show_linkedin !== false) && renderSocialIcon('linkedin')}
                        {(profile?.header_show_github !== false) && renderSocialIcon('github')}
                        {(profile?.header_show_facebook === true) && renderSocialIcon('facebook')}
                        {(profile?.header_show_instagram === true) && renderSocialIcon('instagram')}
                        {(profile?.header_show_tiktok === true) && renderSocialIcon('tiktok')}
                    </ul>
                </div>
            </nav>
        </header>
    )
}
