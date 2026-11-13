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
        <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-3">
          {items.map((item, i) => (
            <li key={item.url} className="flex items-center gap-1">
              {i > 0 && <span className="mx-1">/</span>}
              {i < items.length - 1 ? (
                <Link
                  href={item.url}
                  className="transition-colors hover:text-ink"
                >
                  {item.name}
                </Link>
              ) : (
                <span className="truncate font-medium text-ink max-w-[200px] sm:max-w-xs">
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
