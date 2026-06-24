import ClientProjectPage from './ClientProjectPage'
import { translations } from '@/helpers/translations'

export async function generateMetadata({ params }) {
    const { lang } = await params
    const t = translations[lang] || translations['es']
    const desc = lang === 'es' 
      ? 'Explora mi portafolio de proyectos de desarrollo web, sistemas a medida e inteligencia artificial.' 
      : 'Explore my portfolio of web development projects, custom systems and artificial intelligence.'
      
    return {
        title: `${t.proyectos} | Jaime Tarazona Rodriguez 👨‍💻`,
        description: desc,
        alternates: {
            canonical: `https://jaimetr.dev/${lang}/projects`,
        },
        openGraph: {
            title: `${t.proyectos} | Jaime Tarazona Rodriguez`,
            description: desc,
            url: `https://jaimetr.dev/${lang}/projects`,
        },
    }
}

export default async function ProjectsPage({ params }) {
    const { lang } = await params
    return (
        <ClientProjectPage />
    )
}
