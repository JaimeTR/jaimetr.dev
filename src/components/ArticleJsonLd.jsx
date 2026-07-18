export function ArticleJsonLd({ frontmatter, slug, lang = 'es' }) {
    const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : (typeof frontmatter.tags === 'string' ? [frontmatter.tags] : [])
    
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        '@id': `https://jaimetr.dev/${lang}/posts/${slug}#article`,
        headline: frontmatter.title,
        description: frontmatter.description || frontmatter.excerpt || '',
        image: frontmatter.cover ? `https://jaimetr.dev${frontmatter.cover}` : 'https://jaimetr.dev/images/og.webp',
        datePublished: frontmatter.date,
        dateModified: frontmatter.date,
        inLanguage: lang === 'en' ? 'en-US' : 'es-ES',
        author: {
            '@type': 'Person',
            name: 'Jaime Tarazona Rodriguez',
            url: 'https://jaimetr.dev',
            sameAs: [
                'https://github.com/JaimeTR',
                'https://www.linkedin.com/in/jaimetr/',
            ],
        },
        publisher: {
            '@type': 'Person',
            name: 'Jaime Tarazona Rodriguez',
            url: 'https://jaimetr.dev',
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://jaimetr.dev/${lang}/posts/${slug}`,
        },
        keywords: tags.join(', '),
        articleBody: frontmatter.description || '',
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}
