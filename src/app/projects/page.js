import { Banner } from '@/components/Banner'
import { ListOfProjects } from '@/components/Projects/ListOfProjects'
import { Suspense } from 'react'
export const metadata = {
    title: 'Jaime Tarazona Rodriguez 👨‍💻 | Portafolio',
    description:
        'Explora mí portafolio web y descubre mis proyectos más destacados. Desde aplicaciones interactivas hasta sitios web de última generación, este portafolio te brinda una visión única de mi habilidad y creatividad.',
    metadataBase: new URL('https://jaimetr.dev'),
    author: 'jaimetrdev',
}
export default function ProjectsPage() {
    return (
        <>
            <Banner title={'Portafolio de proyectos'} />
            <section className="mt-16 container mx-auto px-2 lg:w-[740px] grid gap-4 place-items-center md:grid-cols-2 md:gap-6 ">
                <Suspense>
                    <ListOfProjects />
                </Suspense>
            </section>
        </>
    )
}
