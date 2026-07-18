import { ProjectBody } from '@/components/ProjectBody'
import { ProjectJsonLd } from '@/components/ProjectJsonLd'
import { PROJECTS } from '@/helpers/projects'

export async function generateMetadata({ params }, parent) {
    const { slug, lang } = await params
    const project = PROJECTS.find((project) => project.slug === slug)
    const previousImages = (await parent).openGraph?.images || []
    const fallbackDesc = lang === 'es' ? 'desarrollo web, proyectos' : 'web development, projects'

    return {
        metadataBase: new URL('https://jaimetr.dev'),
        title: `${project?.title} | Jaime Tarazona Rodriguez`,
        description: project?.content?.abstract || fallbackDesc,
        keywords: project?.stack?.join(', ') || fallbackDesc,
        authors: [{ name: 'Jaime Tarazona Rodriguez', url: 'https://jaimetr.dev' }],
        alternates: {
            canonical: `https://jaimetr.dev/${lang}/projects/${slug}`,
            languages: {
                es: `https://jaimetr.dev/es/projects/${slug}`,
                en: `https://jaimetr.dev/en/projects/${slug}`,
            },
        },
        openGraph: {
            type: 'article',
            title: project?.title,
            description: project?.content?.abstract || fallbackDesc,
            url: `https://jaimetr.dev/${lang}/projects/${slug}`,
            images: project?.content?.images?.cover ? [project.content.images.cover, ...previousImages] : previousImages,
        },
        twitter: {
            card: 'summary_large_image',
            title: project?.title,
            description: project?.content?.abstract || fallbackDesc,
            images: project?.content?.images?.cover ? [project.content.images.cover] : [],
            creator: '@jaimetrdev',
        },
        robots: 'index, follow',
    }
}

export default async function ProjectPage({ params }) {
    const { slug } = await params
    const data = PROJECTS.find((project) => project.slug === slug)
    return (
        <>
            <ProjectJsonLd project={data} slug={slug} />
            <ProjectBody data={data} />
        </>
    )
}
