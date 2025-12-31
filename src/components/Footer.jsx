'use client'
import Link from 'next/link'
import { useLanguage } from '@/app/providers/LanguageProvider'

export const Footer = () => {
    const { language } = useLanguage()
    return (
        <footer className="container mx-auto px-2 lg:px-28 2xl:px-52 mt-14 mb-8">
            <div className="rounded-lg border-dark-100 dark:border-dark-700 shadow dark:shadow-dark-700 mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between ">
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                    <a href="https://www.jaimetr.dev/" className="hover:underline">
                        {language === 'es' ? 'Portafolio' : 'Portfolio'}
                    </a>
                </span>
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                    <li>
                        <Link href="/" className="mr-4 hover:underline md:mr-6 ">
                            {language === 'es' ? 'Inicio' : 'Home'}
                        </Link>
                    </li>
                    <li>
                        <Link href="/#experience" className="mr-4 hover:underline md:mr-6">
                            {language === 'es' ? 'Experiencia' : 'Experience'}
                        </Link>
                    </li>
                    <li>
                        <Link href="/projects" className="mr-4 hover:underline md:mr-6">
                            {language === 'es' ? 'Proyectos' : 'Projects'}
                        </Link>
                    </li>
                </ul>
            </div>
        </footer>
    )
}
