import Link from 'next/link'

export default function Breadcrumbs({ items = [] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="py-3">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-dark-500 dark:text-dark-400">
          {items.map((item, i) => (
            <li key={item.url} className="flex items-center gap-1">
              {i > 0 && <span className="mx-1">/</span>}
              {i < items.length - 1 ? (
                <Link
                  href={item.url}
                  className="hover:text-primary-600 dark:hover:text-primary-400 transition"
                >
                  {item.name}
                </Link>
              ) : (
                <span className="text-dark-900 dark:text-white font-medium truncate max-w-[200px] sm:max-w-xs">
                  {item.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
