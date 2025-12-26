'use client'
import { AiOutlineFileProtect } from 'react-icons/ai'
import { Container } from '../Container'
import { SectionTitle } from '../SectionTitle'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { useTranslation } from '@/helpers/translations'
import { useEffect, useState } from 'react'

export const About = () => {
    const [mounted, setMounted] = useState(false)
    const { language } = useLanguage()
    const t = useTranslation(language)
    
    useEffect(() => {
        setMounted(true)
    }, [])
    
    if (!mounted) return null
    return (
        <Container id="sobre-mi">
            <SectionTitle>{t('sobreMi')}</SectionTitle>
            <div className="pt-12 md:pt-2">
                <div className="w-full">
                    <Image
                        src="/images/Jaime_tarazona.webp"
                        alt="Jaime Tarazona - Foto de perfil de ingeniero y fullstack"
                        width={288}
                        height={288}
                        className="object-cover rounded-full size-72 shadow-lg shadow-dark-900/20 dark:shadow-dark-50/10 mx-auto"
                        priority
                    />

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
                </div>
            </div>
            <div className="flex justify-center w-full mt-8">
                <a
                    className="flex items-center gap-2 px-6 py-2 font-bold relative z-10 overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:h-full before:w-0 before:rounded-full before:bg-primary-600 before:-z-10 before:transition-all before:duration-300 before:hover:w-full text-dark-100 bg-dark-800 rounded-full hover:bg-dark-600 hover:shadow-md hover:shadow-primary-500/50 ease duration-500"
                    href="https://www.canva.com/design/DAGgrk_oQPk/IhasfT6xFthdmFESPVhaGA/view?utm_content=DAGgrk_oQPk&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h5c32fd6fe8"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {t('cv')} <AiOutlineFileProtect />
                </a>
            </div>
        </Container>
    )
}
