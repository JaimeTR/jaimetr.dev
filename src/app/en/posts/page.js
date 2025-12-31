import { Banner } from '@/components/Banner'
import { getAllPostsMetadata } from '@/lib/mdx'
import { ListOfPosts } from '@/components/Articles/ListOfPosts'

export const metadata = {
    title: 'Programming Blog | Jaime Tarazona Rodriguez 👨‍💻',
    description:
        'Programming blog in English. Explore technologies, learn web development with JavaScript, React, Next.js, PHP, Laravel and more. Guides, tutorials and tips for developers.',
    keywords: 'programming blog, JavaScript, React, Next.js, web development, tutorial, PHP, Laravel, coding',
    metadataBase: new URL('https://jaimetr.dev'),
    alternates: {
        canonical: 'https://jaimetr.dev/en/posts',
    },
    openGraph: {
        title: 'Programming Blog | Jaime Tarazona Rodriguez',
        description: 'Learn web development with tutorials and programming guides in English.',
        url: 'https://jaimetr.dev/en/posts',
        type: 'website',
        images: [
            {
                url: 'https://jaimetr.dev/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Programming Blog',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Programming Blog',
        description: 'Learn web development with tutorials and guides in English.',
        creator: '@jaimetrdev',
    },
    robots: 'index, follow',
    author: 'jaimetrdev',
}

export default function PostsPageEn() {
    const posts = getAllPostsMetadata('en')

    return (
        <>
            <Banner title={'Programming Blog'} image={'/images/bloggin.png'} />
            <section className="pt-24 container mx-auto px-2 lg:w-[740px] ">
                <ListOfPosts posts={posts} basePath="/en/posts" />
            </section>
        </>
    )
}
