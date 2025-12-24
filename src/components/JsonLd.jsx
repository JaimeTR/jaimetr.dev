export default function JsonLd() {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Jaime Tarazona Rodriguez',
        url: 'https://jaimetr.dev',
        image: 'https://jaimetr.dev/images/Jaime_tarazona.webp',
        jobTitle: 'Ingeniero de Sistemas | Desarrollador Full-Stack',
        description: 'Ingeniero de Sistemas y Desarrollador FullStack con más de 4 años de experiencia en desarrollo web',
        sameAs: [
            'https://www.linkedin.com/in/jaimetr/',
            'https://github.com/JaimeTR',
        ],
        knowsAbout: [
            'Desarrollo Web',
            'JavaScript',
            'React',
            'Next.js',
            'WordPress',
            'PHP',
            'Laravel',
            'Node.js',
            'Inteligencia Artificial',
        ],
        alumniOf: {
            '@type': 'Organization',
            name: 'Universidad',
        },
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    )
}
