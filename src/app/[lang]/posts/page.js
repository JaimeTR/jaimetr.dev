import { Banner } from '@/components/Banner'
import { getAllPostsMetadata } from '@/lib/mdx'
import { FilteredPosts } from '@/components/Articles/FilteredPosts'
import { translations } from '@/helpers/translations'

export async function generateMetadata({ params }) {
    const { lang } = await params
    const t = translations[lang] || translations['es']
    const desc = lang === 'es' 
      ? 'Blog de programación en español. Explora tecnologías, aprende desarrollo web con JavaScript, React, Next.js, PHP, Laravel y más. Guías, tutoriales y trucos para desarrolladores.'
      : 'Programming blog. Explore technologies, learn web development with JavaScript, React, Next.js, PHP, Laravel and more. Guides, tutorials and tips for developers.'

    const keywords = lang === 'es'
      ? 'blog programación, JavaScript, React, Next.js, web development, tutorial, PHP, Laravel, desarrollo web, coding'
      : 'programming blog, JavaScript, React, Next.js, web development, tutorial, PHP, Laravel, coding'

    return {
        title: `${t.blogProgramacion} | Jaime Tarazona Rodriguez 👨‍💻`,
        description: desc,
        keywords: keywords,
        metadataBase: new URL('https://jaimetr.dev'),
        alternates: {
            canonical: `https://jaimetr.dev/${lang}/posts`,
        },
        openGraph: {
            title: `${t.blogProgramacion} | Jaime Tarazona Rodriguez`,
            description: desc,
            url: `https://jaimetr.dev/${lang}/posts`,
            type: 'website',
            images: [
                {
                    url: 'https://jaimetr.dev/og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: t.blogProgramacion,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: t.blogProgramacion,
            description: desc,
            creator: '@jaimetrdev',
        },
        robots: 'index, follow',
        author: 'jaimetrdev',
    }
}

export default async function PostsPage({ params }) {
    const { lang } = await params
    let posts = getAllPostsMetadata(lang)
    
    // Filtrar los ocultos
    posts = posts.filter(post => !post.is_hidden)

    return (
        <>
            <Banner title={lang === 'en' ? 'Programming Blog' : 'Blog de programación'} image={'/images/bloggin.png'} />
            <section className="pt-24 container mx-auto px-4 lg:px-8 max-w-[1200px]">
                <FilteredPosts posts={posts} basePath={`/${lang}/posts`} />
            </section>
        </>
    )
}
