import Link from 'next/link'

export default async function NotFound({ params }) {
    const resolvedParams = params ? await params : null
    const lang = resolvedParams?.lang === 'en' ? 'en' : 'es'

    const t = lang === 'en'
        ? {
            title: 'Page not found',
            desc: "The page you're looking for doesn't exist or was moved.",
            home: 'Back to home',
            blog: 'View blog',
        }
        : {
            title: 'Página no encontrada',
            desc: 'La página que buscas no existe o fue movida.',
            home: 'Volver al inicio',
            blog: 'Ver el blog',
        }

    return (
        <div className="min-h-screen bg-dark-50 dark:bg-dark-950 flex items-center justify-center px-6">
            <div className="text-center max-w-md">
                <p className="text-7xl font-black text-primary-600 dark:text-primary-400 mb-2">404</p>
                <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-4">
                    {t.title}
                </h1>
                <p className="text-dark-600 dark:text-dark-400 mb-8">
                    {t.desc}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link
                        href={`/${lang}`}
                        className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition"
                    >
                        {t.home}
                    </Link>
                    <Link
                        href={`/${lang}/posts`}
                        className="px-6 py-3 bg-dark-100 dark:bg-dark-900 hover:bg-dark-200 dark:hover:bg-dark-800 text-dark-700 dark:text-dark-200 rounded-xl font-semibold transition"
                    >
                        {t.blog}
                    </Link>
                </div>
            </div>
        </div>
    )
}
