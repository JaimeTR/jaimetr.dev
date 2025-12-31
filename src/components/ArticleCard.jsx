import { LocalDate } from '@/lib/local-date'
import Image from 'next/image'
import Link from 'next/link'
import { ShowDate } from './ShowDate'

export const ArticleCard = ({ article, basePath = '/posts' }) => {
    // Seleccionar título y descripción según el archivo disponible
    // Si basePath es /en/posts, priorizar .en.mdx
    const isEnglish = basePath === '/en/posts'
    const tagsList = Array.isArray(article?.tags)
        ? article.tags
        : typeof article?.tags === 'string'
        ? article.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : []

    const tagStyle = (tag) => {
        const t = String(tag).toLowerCase()
        if (/(javascript|js)/.test(t)) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
        if (/react/.test(t)) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
        if (/next/.test(t)) return 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
        if (/php|laravel/.test(t)) return 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300'
        if (/seo/.test(t)) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
        if (/desarrollo\s*web|web/.test(t)) return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
        return 'bg-dark-200 text-dark-700 dark:bg-dark-700 dark:text-dark-200'
    }
    
    return (
        <Link href={`${basePath}/${article.slug}`} className="w-full">
            <article
                key={article.slug}
                className="relative mt-4 flex gap-x-6 px-4 py-6 rounded-xl shadow-lg items-center hover:scale-[1.02] transition-transform dark:shadow-dark-900"
            >
                <picture className="w-1/4 min-w-[160px] h-[110px] md:h-[130px] rounded-lg overflow-hidden shadow-md">
                    <img src={article?.cover} alt={article?.title} className="w-full h-full object-cover" loading="lazy" />
                </picture>
                <section className="w-3/4">
                    <header>
                        <ShowDate date={article?.date} />
                        <h1 className="text-primary-700 dark:text-primary-400 font-bold text-lg">{article?.title}</h1>
                    </header>
                    <div>
                        <p className="hidden lg:visible lg:line-clamp-1 text-dark-700 dark:text-dark-200 ">
                            {article?.description}
                        </p>
                        <ul className="flex flex-wrap gap-2 mt-3">
                            {tagsList.map((tag) => (
                                <li key={tag} className={`rounded-full text-xs px-2 py-1 ${tagStyle(tag)}`}>{tag}</li>
                            ))}
                        </ul>
                    </div>
                </section>
                <span className="absolute top-2 right-3 rounded-full bg-dark-200 dark:bg-dark-700 text-xs px-2 py-1 text-dark-700 dark:text-dark-200">
                    {article?.author || 'JaimeTR'}
                </span>
            </article>
        </Link>
    )
}
