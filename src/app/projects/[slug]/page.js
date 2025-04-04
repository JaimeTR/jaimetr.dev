import { ProjectBody } from '@/components/ProjectBody'
import { PROJECTS } from '@/helpers/projects'

export async function generateMetadata({ params }, parent) {
    const { slug } = params
    const project = PROJECTS.find((project) => project.slug === slug)
    const previousImages = (await parent).openGraph?.images || []
    return {
        metadataBase: new URL('https://jaimetr.dev'),
        title: `Jaime Tarazona Rodriguez 👨‍💻 | ${project.title}`,
        description: project?.content?.abstract,
        openGraph: {
            title: `Jaime Tarazona Rodriguez 👨‍💻 | ${project.title}`,
            description: project?.content?.abstract,
            images: [project?.content?.images?.cover, ...previousImages],
            author: 'jaimetrdev',
        },
    }
}
export default async function ProjectPage({ params }) {
    const { slug } = params
    const data = PROJECTS.find((project) => project.slug === slug)
    return (
        <>
            <ProjectBody data={data} />
        </>
    )
}
