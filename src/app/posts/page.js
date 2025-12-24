import { Banner } from '@/components/Banner'
import { getAllPostsMetadata } from '@/lib/mdx'
import { ListOfPosts } from '@/components/Articles/ListOfPosts'

export const metadata = {
    title: 'Blog de Programación | Jaime Tarazona Rodriguez 👨‍💻',
    description:
        'Blog de programación en español. Explora tecnologías, aprende desarrollo web con JavaScript, React, Next.js, PHP, Laravel y más. Guías, tutoriales y trucos para desarrolladores.',
    keywords: 'blog programación, JavaScript, React, Next.js, web development, tutorial, PHP, Laravel, desarrollo web, coding',
    metadataBase: new URL('https://jaimetr.dev'),
    alternates: {
        canonical: 'https://jaimetr.dev/posts',
    },
    openGraph: {
        title: 'Blog de Programación | Jaime Tarazona Rodriguez',
        description: 'Aprende desarrollo web con tutoriales y guías de programación en español.',
        url: 'https://jaimetr.dev/posts',
        type: 'website',
        images: [
            {
                url: 'https://jaimetr.dev/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Blog de Programación',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Blog de Programación',
        description: 'Aprende desarrollo web con tutoriales y guías en español.',
        creator: '@jaimetrdev',
    },
    robots: 'index, follow',
    author: 'jaimetrdev',
}
export default function PostsPage() {
    const posts = getAllPostsMetadata()

    return (
        <>
            <Banner title={'Blog de programación'} image={'/images/bloggin.png'} />
            <section className="pt-24 container mx-auto px-2 lg:w-[740px] ">
                <ListOfPosts posts={posts} />
            </section>
        </>
    )
}
