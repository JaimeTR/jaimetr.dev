import ClientProjectPage from './ClientProjectPage'
import { translations } from '@/helpers/translations'

export async function generateMetadata({ params }) {
    const { lang } = await params
    const t = translations[lang] || translations['es']
    const desc = lang === 'es' 
      ? 'Explora mi portafolio de proyectos de desarrollo web, sistemas a medida e inteligencia artificial.' 
      : 'Explore my portfolio of web development projects, custom systems and artificial intelligence.'
      
    return {
        title: `${t.proyectos} | Jaime Tarazona Rodriguez`,
        description: desc,
        keywords: ['proyectos', 'portafolio', 'desarrollo web', 'full-stack', 'react', 'next.js', 'wordpress', 'ia'],
        metadataBase: new URL('https://jaimetr.dev'),
        authors: [{ name: 'Jaime Tarazona Rodriguez', url: 'https://jaimetr.dev' }],
        alternates: {
            canonical: `https://jaimetr.dev/${lang}/projects`,
            languages: {
                es: 'https://jaimetr.dev/es/projects',
                en: 'https://jaimetr.dev/en/projects',
            },
        },
        openGraph: {
            title: `${t.proyectos} | Jaime Tarazona Rodriguez`,
            description: desc,
            url: `https://jaimetr.dev/${lang}/projects`,
            type: 'website',
            images: [{ url: '/images/og.webp', width: 1200, height: 630, alt: t.proyectos }],
        },
        twitter: {
            card: 'summary_large_image',
            title: t.proyectos,
            description: desc,
            creator: '@jaimetrdev',
        },
        robots: 'index, follow',
    }
}

export default async function ProjectsPage({ params }) {
    const { lang } = await params
    return (
        <ClientProjectPage />
    )
}
