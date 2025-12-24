import { getPostBySlug, getPosts } from '@/lib/mdx'
import { ArticleBody } from '@/components/ArticleBody'
import { ArticleJsonLd } from '@/components/ArticleJsonLd'

export async function generateStaticParams() {
    const posts = getPosts()
    const paths = posts.map((post) => ({
        slug: post.replace(/\.mdx?$/, ''),
    }))

    return paths
}
export async function generateMetadata({ params }, parent) {
    const { slug } = params
    const { frontmatter } = await getPostBySlug(slug)
    const previousImages = (await parent).openGraph?.images || []
    const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : (typeof frontmatter.tags === 'string' ? [frontmatter.tags] : [])
    const seoKeywords = tags.join(', ') || 'programación, javascript, web development'

    return {
        metadataBase: new URL('https://jaimetr.dev'),
        title: `${frontmatter?.title} | Jaime Tarazona Rodriguez 👨‍💻`,
        description: frontmatter.description,
        keywords: `${seoKeywords}, tutorial, guía, desarrollo web`,
        authors: [{ name: 'Jaime Tarazona Rodriguez', url: 'https://jaimetr.dev' }],
        alternates: {
            canonical: `https://jaimetr.dev/posts/${slug}`,
        },
        openGraph: {
            type: 'article',
            title: frontmatter?.title,
            description: frontmatter.description,
            url: `https://jaimetr.dev/posts/${slug}`,
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

export default async function PostPage({ params }) {
    const { content, frontmatter } = await getPostBySlug(params.slug)
    return (
        <><ArticleJsonLd frontmatter={frontmatter} slug={params.slug} />
            {/* <Banner image={frontmatter?.cover} title={frontmatter?.title} /> */}
            <ArticleBody content={content} frontmatter={frontmatter} />
        </>
    )
}
