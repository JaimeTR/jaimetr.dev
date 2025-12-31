import { getPostBySlug, getPosts } from '@/lib/mdx'
import { ArticleBody } from '@/components/ArticleBody'
import { ArticleJsonLd } from '@/components/ArticleJsonLd'

export async function generateStaticParams() {
    const posts = getPosts('en')
    const paths = posts.map((post) => ({
        slug: post.replace(/\.mdx?$/, ''),
    }))

    return paths
}

export async function generateMetadata({ params }, parent) {
    const { slug } = params
    const { frontmatter } = await getPostBySlug(slug, 'en')
    const previousImages = (await parent).openGraph?.images || []
    const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : (typeof frontmatter.tags === 'string' ? [frontmatter.tags] : [])
    const seoKeywords = tags.join(', ') || 'programming, javascript, web development'

    return {
        metadataBase: new URL('https://jaimetr.dev'),
        title: `${frontmatter?.title} | Jaime Tarazona Rodriguez 👨‍💻`,
        description: frontmatter.description,
        keywords: `${seoKeywords}, tutorial, guide, web development`,
        authors: [{ name: 'Jaime Tarazona Rodriguez', url: 'https://jaimetr.dev' }],
        alternates: {
            canonical: `https://jaimetr.dev/en/posts/${slug}`,
        },
        openGraph: {
            type: 'article',
            title: frontmatter?.title,
            description: frontmatter.description,
            url: `https://jaimetr.dev/en/posts/${slug}`,
            images: [frontmatter.cover, ...previousImages],
            authors: ['Jaime Tarazona Rodriguez'],
            publishedTime: frontmatter.date,
            tags: tags,
        },
        twitter: {
            card: 'summary_large_image',
            title: frontmatter?.title,
            description: frontmatter.description,
            images: [frontmatter.cover],
            creator: '@jaimetrdev',
        },
        robots: 'index, follow',
    }
}

export default async function PostPageEn({ params }) {
    const { content, frontmatter } = await getPostBySlug(params.slug, 'en')
    return (
        <>
            <ArticleJsonLd frontmatter={frontmatter} slug={params.slug} />
            <ArticleBody content={content} frontmatter={frontmatter} />
        </>
    )
}
