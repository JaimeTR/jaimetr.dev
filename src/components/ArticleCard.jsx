import Image from 'next/image'
import Link from 'next/link'
import { ShowDate } from './ShowDate'

export const ArticleCard = ({ article, basePath = '/posts' }) => {
    const tagsList = Array.isArray(article?.tags)
        ? article.tags
        : typeof article?.tags === 'string'
        ? article.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : []

    return (
        <Link href={`${basePath}/${article.slug}`} className="w-full h-full block group">
            <article
                className={`h-full flex flex-col overflow-hidden rounded-2xl shadow-sm border border-transparent
                transition-all duration-300 ease-out
                hover:shadow-xl hover:-translate-y-1 hover:border-primary-500/30
                bg-white/80 dark:bg-dark-800/80 backdrop-blur-md
                ${article.is_featured ? 'ring-1 ring-primary-500/50 shadow-primary-500/10' : ''}`}
            >
                <div className="relative w-full aspect-[3/2] shrink-0 overflow-hidden">
                    <Image
                        src={article?.cover}
                        alt={article?.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {article.is_featured && (
                        <span className="absolute top-3 right-3 inline-flex items-center rounded-full bg-white/20 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white ring-1 ring-inset ring-white/30">
                            ⭐ Destacado
                        </span>
                    )}

                    {tagsList.length > 0 && (
                        <ul className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
                            {tagsList.slice(0, 3).map((tag) => (
                                <li
                                    key={tag}
                                    className="rounded-full bg-white/20 backdrop-blur-md ring-1 ring-inset ring-white/30 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-white"
                                >
                                    {tag}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="flex flex-col flex-1 p-4 md:p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <ShowDate date={article?.date} className="text-xs font-medium text-dark-500 dark:text-dark-300" />
                        <span className="text-xs text-dark-400 dark:text-dark-500">·</span>
                        <span className="text-xs font-medium text-dark-500 dark:text-dark-400">{article?.author || 'JaimeTR'}</span>
                    </div>

                    <h3 className="text-dark-900 dark:text-gray-100 font-bold text-lg leading-snug line-clamp-2 min-h-[2.75rem] group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {article?.title}
                    </h3>

                    <p className="mt-2 text-dark-600 dark:text-dark-300 line-clamp-2 text-sm leading-relaxed flex-1">
                        {article?.description}
                    </p>
                </div>
            </article>
        </Link>
    )
}
