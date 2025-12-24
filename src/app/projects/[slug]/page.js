import { ProjectBody } from '@/components/ProjectBody'
import { ProjectJsonLd } from '@/components/ProjectJsonLd'
import { PROJECTS } from '@/helpers/projects'

export async function generateMetadata({ params }, parent) {
    const { slug } = params
    const project = PROJECTS.find((project) => project.slug === slug)
    const previousImages = (await parent).openGraph?.images || []

    return {
        metadataBase: new URL('https://jaimetr.dev'),
        title: `${project?.title} | Jaime Tarazona Rodriguez 👨‍💻`,
        description: project?.content?.abstract,
        keywords: project?.stack?.join(', ') || 'desarrollo web, proyectos',
        authors: [{ name: 'Jaime Tarazona Rodriguez', url: 'https://jaimetr.dev' }],
        alternates: {
            canonical: `https://jaimetr.dev/projects/${slug}`,
        },
        openGraph: {
            type: 'website',
            title: project?.title,
            description: project?.content?.abstract,
            url: `https://jaimetr.dev/projects/${slug}`,
            images: [project?.content?.images?.cover, ...previousImages],
            creator: 'Jaime Tarazona Rodriguez',
        },
        twitter: {
            card: 'summary_large_image',
            title: project?.title,
            description: project?.content?.abstract,
            images: [project?.content?.images?.cover],
            creator: '@jaimetrdev',
        },
        robots: 'index, follow',
    }
}

export default async function ProjectPage({ params }) {
    const { slug } = params
    const data = PROJECTS.find((project) => project.slug === slug)
    return (
        <>
            <ProjectJsonLd project={data} slug={slug} />
            <ProjectBody data={data} />
        </>
    )
}
