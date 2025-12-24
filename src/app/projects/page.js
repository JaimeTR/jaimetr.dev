import { Banner } from '@/components/Banner'
import { ListOfProjects } from '@/components/Projects/ListOfProjects'
import { Suspense } from 'react'
import { Container } from '@/components/Container'
import { SectionTitle } from '@/components/SectionTitle'

export const metadata = {
    title: 'Portafolio de Proyectos Web | Jaime Tarazona Rodriguez 👨‍💻',
    description:
        'Explora mi portafolio web y descubre mis proyectos destacados. Desarrollo full-stack con React, Next.js, JavaScript, PHP, Laravel y más. Aplicaciones interactivas y sitios responsive.',
    keywords: 'portafolio, proyectos web, desarrollo full-stack, React, Next.js, JavaScript, PHP, Laravel, web developer',
    metadataBase: new URL('https://jaimetr.dev'),
    alternates: {
        canonical: 'https://jaimetr.dev/projects',
    },
    openGraph: {
        title: 'Portafolio de Proyectos Web | Jaime Tarazona Rodriguez',
        description: 'Descubre mis proyectos destacados en desarrollo web full-stack',
        url: 'https://jaimetr.dev/projects',
        images: [
            {
                url: 'https://jaimetr.dev/og.png',
                width: 1200,
                height: 630,
                alt: 'Portafolio de Proyectos',
            },
        ],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Portafolio de Proyectos',
        description: 'Descubre mis proyectos destacados en desarrollo web',
        creator: '@jaimetrdev',
    },
    robots: 'index, follow',
}

export default function ProjectsPage() {
    return (
        <>
            <Banner title={'Portafolio de Proyectos'} />
            <Container>
                <div className="text-center mb-8">
                    <SectionTitle>Mis Proyectos</SectionTitle>
                    <p className="text-dark-700 dark:text-dark-200 mt-4 max-w-2xl mx-auto">
                        Una colección de proyectos que demuestran mi experiencia en desarrollo web, 
                        desde aplicaciones full-stack hasta sitios responsive y optimizados.
                    </p>
                </div>
                
                <section className="grid gap-6 place-items-center md:grid-cols-2 lg:grid-cols-2 xl:gap-8">
                    <Suspense fallback={
                        <div className="col-span-full text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                            <p className="mt-4 text-dark-600 dark:text-dark-300">Cargando proyectos...</p>
                        </div>
                    }>
                        <ListOfProjects />
                    </Suspense>
                </section>
            </Container>
        </>
    )
}
