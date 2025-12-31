import { Banner } from '@/components/Banner'
import { ListOfProjects } from '@/components/Projects/ListOfProjects'
import { Suspense } from 'react'
import { Container } from '@/components/Container'
import { SectionTitle } from '@/components/SectionTitle'

export const metadata = {
    title: 'Web Projects Portfolio | Jaime Tarazona Rodriguez 👨‍💻',
    description:
        'Explore my web portfolio and discover featured projects. Full‑stack development with React, Next.js, JavaScript, PHP, Laravel and more. Interactive apps and responsive sites.',
    keywords: 'portfolio, web projects, full‑stack development, React, Next.js, JavaScript, PHP, Laravel, web developer',
    metadataBase: new URL('https://jaimetr.dev'),
    alternates: {
        canonical: 'https://jaimetr.dev/en/projects',
    },
    openGraph: {
        title: 'Web Projects Portfolio | Jaime Tarazona Rodriguez',
        description: 'Discover my featured projects in full‑stack web development',
        url: 'https://jaimetr.dev/en/projects',
        images: [
            {
                url: 'https://jaimetr.dev/og.png',
                width: 1200,
                height: 630,
                alt: 'Projects Portfolio',
            },
        ],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Projects Portfolio',
        description: 'Discover my featured projects in web development',
        creator: '@jaimetrdev',
    },
    robots: 'index, follow',
}

export default function ProjectsPageEn() {
    return (
        <>
            <Banner title={'Projects Portfolio'} />
            <Container>
                <div className="text-center mb-8">
                    <SectionTitle>My Projects</SectionTitle>
                    <p className="text-dark-700 dark:text-dark-200 mt-4 max-w-2xl mx-auto">
                        A collection of projects showcasing my web development experience, from full‑stack applications to responsive, optimized sites.
                    </p>
                </div>
                
                <section className="grid gap-6 place-items-center md:grid-cols-2 lg:grid-cols-2 xl:gap-8">
                    <Suspense fallback={
                        <div className="col-span-full text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                            <p className="mt-4 text-dark-600 dark:text-dark-300">Loading projects...</p>
                        </div>
                    }>
                        <ListOfProjects basePath="/en/projects" />
                    </Suspense>
                </section>
            </Container>
        </>
    )
}
