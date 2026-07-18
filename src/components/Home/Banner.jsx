'use client'
import { Pill } from '../Pill'
import ArticleIcon from '../icons/Article'
import CodeIcon from '../icons/Code'
import EmailIcon from '../icons/Email'
import GitHubIcon from '../icons/GitHub'
import LinkedInIcon from '../icons/LinkedIn'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { useTranslation } from '@/helpers/translations'
import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { SiTiktok } from 'react-icons/si'
import { FaInstagram, FaFacebook } from 'react-icons/fa'
import { FiFileText, FiLink, FiCode, FiBriefcase, FiLayers, FiUser } from 'react-icons/fi'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const ParticlesBackground = dynamic(() => import('@/components/portfolio/ParticlesBackground'), { ssr: false })

const FALLBACK_IMAGE = '/images/Jaime_tarazona.webp'

export const Banner = () => {
    const [mounted, setMounted] = useState(false)
    const [profile, setProfile] = useState(null)
    const [imgSrc, setImgSrc] = useState(FALLBACK_IMAGE)
    const { language } = useLanguage()
    const t = useTranslation(language)
    
    useEffect(() => {
        setMounted(true)
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        const { data, error } = await supabase.from('profile').select('*').limit(1).single()
        if (error) {
            console.warn('Banner: Error fetching profile from Supabase:', error.message)
            return
        }
        if (data) {
            setProfile(data)
            if (data.hero_image_url) {
                setImgSrc(data.hero_image_url)
            }
        }
    }

    const handleImgError = useCallback(() => {
        if (imgSrc !== FALLBACK_IMAGE) {
            console.warn('Banner: Failed to load hero image, using fallback')
            setImgSrc(FALLBACK_IMAGE)
        }
    }, [imgSrc])
    
    const getIcon = (iconName) => {
        switch (iconName) {
            case 'code': return <FiCode className="size-4 md:size-6" />
            case 'briefcase': return <FiBriefcase className="size-4 md:size-6" />
            case 'layers': return <FiLayers className="size-4 md:size-6" />
            case 'user': return <FiUser className="size-4 md:size-6" />
            case 'file-text': return <FiFileText className="size-4 md:size-6" />
            default: return <FiLink className="size-4 md:size-6" />
        }
    }

    if (!mounted) {
        return (
            <section className="relative mx-auto container px-4 pt-24 pb-10 min-h-[100dvh] lg:min-h-0 lg:h-screen lg:pt-0 lg:pb-0 lg:max-w-5xl" id="inicio">
                <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse w-32 md:w-48 lg:w-[320px] aspect-square rounded-[2rem] bg-dark-200 dark:bg-dark-800" />
                </div>
            </section>
        )
    }
    return (
        <section className="relative mx-auto container px-4 pt-24 pb-10 min-h-[100dvh] flex flex-col justify-center lg:min-h-0 lg:h-screen overflow-hidden lg:pt-0 lg:pb-0 lg:max-w-5xl" id="inicio">
            {profile?.is_particles_visible !== false && <ParticlesBackground />}
            <div className="text-center lg:text-left lg:flex lg:flex-row-reverse lg:justify-between lg:items-center md:gap-x-12 z-10 relative">
                <div className="Hero-image mx-auto lg:mx-0 flex justify-center mb-6 lg:mb-0 w-32 md:w-48 lg:w-[320px] shrink-0 relative group">
                    {/* Glassmorphism Background Blob */}
                    <motion.div 
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                        className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-blue-500/20 dark:from-primary-500/10 dark:to-teal-500/10 backdrop-blur-3xl rounded-[3rem] -z-10 scale-105 transform translate-y-4 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
                    />
                    {/* Floating Image */}
                    <motion.div 
                        animate={{ y: [-8, 8, -8] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        whileHover={{ scale: 1.05 }}
                        className="relative w-full"
                    >
                        <Image
                            src={imgSrc}
                            alt={language === 'es' ? (profile?.name_es || "Jaime Tarazona Rodriguez") : (profile?.name_en || "Jaime Tarazona Rodriguez")}
                            width={400}
                            height={400}
                            priority
                            fetchPriority="high"
                            onError={handleImgError}
                            unoptimized={imgSrc !== FALLBACK_IMAGE && !imgSrc.startsWith('/')}
                            className="drop-shadow-2xl w-full h-full aspect-square rounded-[2rem] object-cover shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(255,255,255,0.05)] border-[6px] border-white/40 dark:border-white/10 backdrop-blur-sm transition-all duration-300"
                        />
                    </motion.div>
                </div>
                <header className="lg:flex-1">
                    <h1 className="text-3xl font-bold lg:text-5xl text-dark-700 dark:text-dark-200">
                        {language === 'es' ? (profile?.greeting_es || t('hola')) : (profile?.greeting_en || t('hola'))},{' '}
                        <span className="text-primary-600 dark:text-primary-400">
                            {language === 'es' ? (profile?.name_es || 'soy Jaime T.R') : (profile?.name_en || 'I am Jaime T.R')}
                        </span>
                    </h1>
                    <span className="font-semibold inline-flex animate-background-shine bg-[linear-gradient(110deg,#64748b,45%,#0f172a,55%,#64748b)] dark:bg-[linear-gradient(110deg,#b6eaff,45%,#065074,55%,#b6eaff)] bg-[length:250%_100%] bg-clip-text text-sm sm:text-base md:text-xl mt-2 text-transparent">
                        {language === 'es' ? (profile?.hero_title_es || t('profesion1')) : (profile?.hero_title_en || t('profesion1'))}
                    </span>
                    <h2 className="lg:text-2xl mt-6 md:mt-10 text-dark-700 dark:text-dark-200 text-pretty">
                        {language === 'es' ? (profile?.years_experience_es || t('experiencia_anios')) : (profile?.years_experience_en || t('experiencia_anios'))}{' '}
                        <span className="text-crusta-800 dark:text-crusta-300">
                            {language === 'es' ? (profile?.role_description_es || t('experiencia_desc')) : (profile?.role_description_en || t('experiencia_desc'))}
                        </span>
                        .{' '}
                        <span className="text-daintree-700 dark:text-daintree-200">
                            {language === 'es' ? (profile?.specialization_es || t('especializado')) : (profile?.specialization_en || t('especializado'))}
                        </span>
                        . {language === 'es' ? (profile?.availability_es || t('dispuesto')) : (profile?.availability_en || t('dispuesto'))}
                    </h2>
                </header>
            </div>
            <ul className="mt-8 lg:mt-10 flex flex-wrap gap-4 justify-center lg:justify-start relative z-10">
                {(profile?.hero_buttons_order || ["cv", "linkedin", "github", "email", "facebook", "tiktok", "instagram", "button1", "button2"]).map((btnId) => {
                    switch (btnId) {
                        case 'cv':
                            return (profile?.is_cv_visible !== false && profile?.cv_url) ? (
                                <li key="cv">
                                    <Pill url={profile.cv_url} externalUrl={true} ariaLabel="Curriculum Vitae">
                                        <FiFileText className="size-4 md:size-6" aria-hidden="true" /> CV
                                    </Pill>
                                </li>
                            ) : null;
                        case 'linkedin':
                            return (profile?.is_linkedin_visible !== false) ? (
                                <li key="linkedin">
                                    <Pill url={profile?.linkedin_url || 'https://www.linkedin.com/in/jaimetr/'} externalUrl={true} ariaLabel="LinkedIn">
                                        <LinkedInIcon className="size-4 md:size-6" aria-hidden="true" /> LinkedIn
                                    </Pill>
                                </li>
                            ) : null;
                        case 'github':
                            return (profile?.is_github_visible !== false) ? (
                                <li key="github">
                                    <Pill url={profile?.github_url || 'https://github.com/JaimeTR'} externalUrl={true} ariaLabel="GitHub">
                                        <GitHubIcon className="size-4 md:size-6" aria-hidden="true" /> GitHub
                                    </Pill>
                                </li>
                            ) : null;
                        case 'email':
                            return (profile?.is_email_visible !== false) ? (
                                <li key="email">
                                    <Pill url={`mailto:${profile?.email || 'jaimetr1309@gmail.com'}`} externalUrl={true} ariaLabel={t('contacto')}>
                                        <EmailIcon className="size-4 md:size-6" aria-hidden="true" /> {t('contacto')}
                                    </Pill>
                                </li>
                            ) : null;
                        case 'tiktok':
                            return (profile?.is_tiktok_visible === true && profile?.tiktok_url) ? (
                                <li key="tiktok">
                                    <Pill url={profile.tiktok_url} externalUrl={true}>
                                        <SiTiktok className="size-4 md:size-6" /> TikTok
                                    </Pill>
                                </li>
                            ) : null;
                        case 'facebook':
                            return (profile?.is_facebook_visible === true && profile?.facebook_url) ? (
                                <li key="facebook">
                                    <Pill url={profile.facebook_url} externalUrl={true}>
                                        <FaFacebook className="size-4 md:size-6" /> Facebook
                                    </Pill>
                                </li>
                            ) : null;
                        case 'instagram':
                            return (profile?.is_instagram_visible === true && profile?.instagram_url) ? (
                                <li key="instagram">
                                    <Pill url={profile.instagram_url} externalUrl={true}>
                                        <FaInstagram className="size-4 md:size-6" /> Instagram
                                    </Pill>
                                </li>
                            ) : null;
                        case 'button1':
                            return (profile?.is_button1_visible !== false) ? (
                                <li key="button1">
                                    <Pill 
                                        url={profile?.hero_button1_link || '#projects'}
                                        externalUrl={(profile?.hero_button1_link || '').startsWith('http')}
                                    >
                                        {getIcon(profile?.hero_button1_icon)} {language === 'es' ? (profile?.hero_button1_text_es || t('proyectos')) : (profile?.hero_button1_text_en || t('proyectos'))}
                                    </Pill>
                                </li>
                            ) : null;
                        case 'button2':
                            return (profile?.is_button2_visible !== false) ? (
                                <li key="button2">
                                    <Pill 
                                        url={profile?.hero_button2_link || '#articles'}
                                        externalUrl={(profile?.hero_button2_link || '').startsWith('http')}
                                    >
                                        {getIcon(profile?.hero_button2_icon)} {language === 'es' ? (profile?.hero_button2_text_es || t('articulos')) : (profile?.hero_button2_text_en || t('articulos'))}
                                    </Pill>
                                </li>
                            ) : null;
                        default:
                            return null;
                    }
                })}
            </ul>
            <div className="absolute hidden md:flex bottom-4 w-full justify-center z-10 pointer-events-none">
                <a
                    href="#experience"
                    className="md:flex gap-2 animate-bounce text-primary-500 dark:text-primary-400 font-bold pointer-events-auto"
                >
                    {t('experienciaSeccion')}{' '}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75"
                        />
                    </svg>
                </a>
            </div>
        </section>
    )
}
