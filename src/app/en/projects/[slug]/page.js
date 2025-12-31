import { ProjectBody } from '@/components/ProjectBody'
import { ProjectJsonLd } from '@/components/ProjectJsonLd'
import { PROJECTS } from '@/helpers/projects'

export async function generateMetadata({ params }, parent) {
    const { slug } = params
    const project = PROJECTS.find((project) => project.slug === slug)
    const previousImages = (await parent).openGraph?.images || []

    const title = project?.title_en || project?.title
    const abstract = project?.content?.abstract_en || project?.content?.abstract

    return {
        metadataBase: new URL('https://jaimetr.dev'),
        title: `${title} | Jaime Tarazona Rodriguez 👨‍💻`,
        description: abstract,
        keywords: project?.stack?.join(', ') || 'web development, projects',
        authors: [{ name: 'Jaime Tarazona Rodriguez', url: 'https://jaimetr.dev' }],
        alternates: {
            canonical: `https://jaimetr.dev/en/projects/${slug}`,
        },
        openGraph: {
            type: 'website',
            title,
            description: abstract,
            url: `https://jaimetr.dev/en/projects/${slug}`,
            images: [project?.content?.images?.cover, ...previousImages],
            creator: 'Jaime Tarazona Rodriguez',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: abstract,
            images: [project?.content?.images?.cover],
            creator: '@jaimetrdev',
        },
        robots: 'index, follow',
    }
}

export default async function ProjectPageEn({ params }) {
    const { slug } = params
    const project = PROJECTS.find((p) => p.slug === slug)
    // Override fields for EN rendering in JSON-LD while UI uses context inside ProjectBody
    const projectEN = {
        ...project,
        title: project?.title_en || project?.title,
        category: project?.category_en || project?.category,
        content: {
            ...project?.content,
            abstract: project?.content?.abstract_en || project?.content?.abstract,
            description: project?.content?.description_en || project?.content?.description,
            features: {
                ...project?.content?.features,
                intro: project?.content?.features?.intro_en || project?.content?.features?.intro,
                list: project?.content?.features?.list_en || project?.content?.features?.list,
            },
        },
    }

    return (
        <>
            <ProjectJsonLd project={projectEN} slug={slug} />
            <ProjectBody data={project} />
        </>
    )
}
