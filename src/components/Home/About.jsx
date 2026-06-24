'use client'
import { AiOutlineFileProtect } from 'react-icons/ai'
import { Container } from '../Container'
import { SectionTitle } from '../SectionTitle'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { useTranslation } from '@/helpers/translations'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export const About = () => {
    const [mounted, setMounted] = useState(false)
    const [profile, setProfile] = useState(null)
    const { language } = useLanguage()
    const t = useTranslation(language)
    
    useEffect(() => {
        setMounted(true)
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        const { data, error } = await supabase.from('profile').select('*').limit(1).single()
        if (!error && data) {
            setProfile(data)
        }
    }
    
    if (!mounted) return null

    const defaultCv = "https://www.canva.com/design/DAGgrk_oQPk/IhasfT6xFthdmFESPVhaGA/view?utm_content=DAGgrk_oQPk&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h5c32fd6fe8"

    return (
        <Container id="sobre-mi">
            <SectionTitle className="text-center md:text-center">{t('sobreMi')}</SectionTitle>
            <div className="pt-12 md:pt-2">
                <div className="w-full">
                    <Image
                        src={profile?.about_image_url || "/images/Jaime_tarazona.webp"}
                        alt="Jaime Tarazona - Foto de perfil de ingeniero y fullstack"
                        width={288}
                        height={288}
                        className="object-cover rounded-full size-72 shadow-lg shadow-dark-900/20 dark:shadow-dark-50/10 mx-auto"
                        priority
                    />

                    {(profile?.about_me_paragraphs && profile.about_me_paragraphs.length > 0) ? (
                        <div className={`mt-8 text-dark-700 dark:text-dark-200 md:w-11/12 text-base leading-relaxed space-y-4 text-${profile.about_me_alignment || 'left'}`}>
                            {profile.about_me_paragraphs.map((p, index) => {
                                const text = language === 'es' ? (p.es || p.en) : (p.en || p.es)
                                if (!text) return null
                                return (
                                    <div key={index} dangerouslySetInnerHTML={{ __html: text }} />
                                )
                            })}
                        </div>
                    ) : (
                        <>
                            <p className="mt-8 text-dark-700 dark:text-dark-200 md:w-11/12 text-pretty text-base">
                                {t('holaYo')}{' '}
                                <span className="font-bold text-primary-700 dark:text-primary-400">{t('ingenieroSistemas')}</span>{' '}
                                y{' '}
                                <span className="font-bold text-primary-700 dark:text-primary-400">
                                    {t('webDeveloper')}
                                </span>{' '}
                                {t('experienciaAnios')} en el desarrollo de aplicaciones y páginas web. Actualmente, trabajo creando sitios web en WordPress, {' '}
                                <span className=" text-crusta-800 dark:text-crusta-300 font-bold">
                                    {t('desarrollando')}
                                </span>{' '}
                                {t('garantizando')}
                            </p>
                            <p className="mt-4 text-dark-700 dark:text-dark-200 md:w-11/12 text-pretty text-base">
                                {t('unoPrincipal')}{' '}
                                <span className="text-crusta-800 dark:text-crusta-300 font-bold">
                                <a
                                        href="https://asistente-inoia-tbuk.vercel.app/"
                                        rel="noopener noreferrer"
                                        target="_blank"
                                        className="underline"
                                    >
                                        {t('inoia')},
                                    </a> {t('asistente')}{' '}
                                    
                                </span>{' '}
                                {t('ofrece')}
                            </p>
                            <p className="mt-4 text-dark-700 dark:text-dark-200 md:w-11/12 text-pretty text-base">
                                {t('tambienProyecto')}{' '}
                                <Link href={'/posts'} className="text-crusta-800 dark:text-crusta-300 font-bold underline">
                                    {t('articulos_desc')}
                                </Link>
                                {t('compartir')}
                            </p>
                            <p className="mt-4 text-dark-700 dark:text-dark-200 md:w-11/12 text-pretty text-base">
                                {t('ultimamente')}
                            </p>
                        </>
                    )}
                </div>
            </div>
            <div className="flex justify-center w-full mt-8">
                <a
                    className="rounded-full text-dark-800 dark:text-dark-200 border border-gray-300/60 dark:border-white/20 shadow-sm hover:shadow-md flex justify-center items-center gap-x-2 py-2 px-6 md:py-3 text-sm md:text-base md:px-8 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-950 hover:scale-105 transition-all font-bold"
                    href={profile?.cv_url || defaultCv}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {language === 'es' ? (profile?.cv_btn_text_es || t('cv')) : (profile?.cv_btn_text_en || t('cv'))} <AiOutlineFileProtect className="w-5 h-5" />
                </a>
            </div>
        </Container>
    )
}
