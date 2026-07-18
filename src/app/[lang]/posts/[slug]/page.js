import { getPostBySlug, getPosts } from '@/lib/mdx'
import { ArticleBody } from '@/components/ArticleBody'
import { ArticleJsonLd } from '@/components/ArticleJsonLd'
import Breadcrumbs from '@/components/Breadcrumbs'

export async function generateStaticParams() {
    const posts = getPosts()
    return posts.map((slug) => ({ slug }))
}
export async function generateMetadata({ params }, parent) {
    const { slug, lang } = await params
    const { frontmatter } = await getPostBySlug(slug, lang)
    const previousImages = (await parent).openGraph?.images || []
    const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : (typeof frontmatter.tags === 'string' ? [frontmatter.tags] : [])
    const seoKeywords = tags.join(', ') || 'programacion, javascript, web development'

    return {
        metadataBase: new URL('https://jaimetr.dev'),
        title: `${frontmatter?.title} | Jaime Tarazona Rodriguez`,
        description: frontmatter.description,
        keywords: `${seoKeywords}, tutorial, guia, desarrollo web`,
        authors: [{ name: 'Jaime Tarazona Rodriguez', url: 'https://jaimetr.dev' }],
        alternates: {
            canonical: `https://jaimetr.dev/${lang}/posts/${slug}`,
            languages: {
                es: `https://jaimetr.dev/es/posts/${slug}`,
                en: `https://jaimetr.dev/en/posts/${slug}`,
            },
        },
        openGraph: {
            type: 'article',
            title: frontmatter?.title,
            description: frontmatter.description,
            url: `https://jaimetr.dev/${lang}/posts/${slug}`,
            images: frontmatter.cover ? [frontmatter.cover, ...previousImages] : previousImages,
            authors: ['Jaime Tarazona Rodriguez'],
            publishedTime: frontmatter.date,
            tags: tags,
        },
        twitter: {
            card: 'summary_large_image',
            title: frontmatter?.title,
            description: frontmatter.description,
            images: frontmatter.cover ? [frontmatter.cover] : [],
            creator: '@jaimetrdev',
        },
        robots: 'index, follow',
    }
}

export default async function PostPage({ params }) {
    const { slug, lang } = await params
    const { content, frontmatter } = await getPostBySlug(slug, lang)
    const t = lang === 'en' ? { home: 'Home', posts: 'Blog' } : { home: 'Inicio', posts: 'Blog' }
    return (
        <>
            <ArticleJsonLd frontmatter={frontmatter} slug={slug} lang={lang} />
            <div className="container mx-auto px-4 lg:px-8 max-w-4xl pt-24">
                <Breadcrumbs items={[
                    { name: t.home, url: `/${lang}` },
                    { name: t.posts, url: `/${lang}/posts` },
                    { name: frontmatter.title, url: `/${lang}/posts/${slug}` },
                ]} />
            </div>
            <ArticleBody content={content} frontmatter={frontmatter} />
        </>
    )
}
