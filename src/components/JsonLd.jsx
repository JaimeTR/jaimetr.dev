export default function JsonLd() {
    const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Person',
                name: 'Jaime Tarazona Rodriguez',
                url: 'https://jaimetr.dev',
                image: 'https://jaimetr.dev/images/Jaime_tarazona.webp',
                jobTitle: 'Ingeniero de Sistemas | Full-Stack Developer',
                description: 'Ingeniero de Sistemas y Desarrollador FullStack con mas de 5 anos de experiencia en desarrollo web, aplicaciones y automatizaciones con IA.',
                email: 'jaimetr1309@gmail.com',
                sameAs: [
                    'https://www.linkedin.com/in/jaimetr/',
                    'https://github.com/JaimeTR',
                ],
                knowsAbout: [
                    'Desarrollo Web',
                    'React',
                    'Next.js',
                    'TypeScript',
                    'JavaScript',
                    'Node.js',
                    'WordPress',
                    'PHP',
                    'Laravel',
                    'Python',
                    'Inteligencia Artificial',
                    'Supabase',
                    'PostgreSQL',
                    'Docker',
                    'SEO Tecnico',
                ],
                worksFor: {
                    '@type': 'Organization',
                    name: 'Independiente / Freelance',
                },
            },
            {
                '@type': 'WebSite',
                name: 'Jaime Tarazona Rodriguez - Portfolio',
                url: 'https://jaimetr.dev',
                description: 'Portfolio y blog de Jaime Tarazona Rodriguez. Ingeniero de Sistemas, Full-Stack Developer. Especializado en React, Next.js, WordPress e Inteligencia Artificial.',
                inLanguage: ['es', 'en'],
                potentialAction: {
                    '@type': 'SearchAction',
                    target: 'https://jaimetr.dev/es/posts?search={search_term_string}',
                    'query-input': 'required name=search_term_string',
                },
            },
        ],
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    )
}
