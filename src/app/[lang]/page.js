import { About } from '@/components/Home/About'
import { Articles } from '@/components/Home/Articles'
import { Banner } from '@/components/Home/Banner'
import { Experience } from '@/components/Home/Experience'
import { Projects } from '@/components/Home/Projects'
import { Stack } from '@/components/Home/Stack'
import { promises as fsp } from 'fs'
import path from 'path'

const componentMap = {
    'profile': Banner,
    'aboutme': About,
    'experience': Experience,
    'project': Projects,
    'manage-blog': Articles,
    'skills': Stack
}

const fallbackSections = [
    { id: 'profile', is_hidden: false },
    { id: 'experience', is_hidden: false },
    { id: 'project', is_hidden: false },
    { id: 'aboutme', is_hidden: false },
    { id: 'manage-blog', is_hidden: false },
    { id: 'skills', is_hidden: false }
]

async function getSections() {
    try {
        const filePath = path.join(process.cwd(), 'src', 'data', 'sections.json')
        const data = await fsp.readFile(filePath, 'utf8')
        return JSON.parse(data)
    } catch (e) {
        return fallbackSections
    }
}

export async function generateMetadata({ params }) {
    const { lang } = await params
    const title = lang === 'es'
        ? 'Jaime Tarazona Rodriguez | Full-Stack Developer'
        : 'Jaime Tarazona Rodriguez | Full-Stack Developer'
    const desc = lang === 'es'
        ? 'Ingeniero de Sistemas y Desarrollador FullStack con mas de 5 anos de experiencia. Especializado en React, Next.js, WordPress e Inteligencia Artificial.'
        : 'Systems Engineer and FullStack Developer with 5+ years of experience. Specialized in React, Next.js, WordPress and Artificial Intelligence.'

    return {
        title,
        description: desc,
        keywords: ['Jaime Tarazona', 'Full-Stack', 'React', 'Next.js', 'WordPress', 'IA', 'Desarrollador Web', 'Portafolio'],
        alternates: {
            canonical: `https://jaimetr.dev/${lang}`,
        },
        openGraph: {
            title: `${title} | Portfolio`,
            description: desc,
            url: `https://jaimetr.dev/${lang}`,
            type: 'website',
            images: [{ url: '/images/og.webp', width: 1200, height: 630, alt: 'Jaime Tarazona Portfolio' }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: desc,
            images: ['/images/og.webp'],
            creator: '@jaimetrdev',
        },
        robots: 'index, follow',
    }
}

export default async function Home() {
    const sections = await getSections()

    return (
        <>
            <div className="absolute top-0 z-[-2] h-screen w-full bg-dark-50 dark:bg-dark-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,153,255,0.25),rgba(255,255,255,0))]"></div>
            {sections
                .filter(section => !section.is_hidden)
                .map(section => {
                    const Component = componentMap[section.id]
                    return Component ? <Component key={section.id} /> : null
                })
            }
        </>
    )
}
