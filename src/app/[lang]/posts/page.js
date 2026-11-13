import FilteredPosts from '@/components/Articles/FilteredPosts'
import { articulosDelErp } from '@/lib/erp'

export const revalidate = 600

export async function generateMetadata({ params }) {
  const { lang } = await params
  const title = lang === 'en' ? 'Articles' : 'Artículos'
  return { title: `${title} | Jaime Tarazona Rodriguez`, alternates: { canonical: `https://jaimetr.dev/${lang}${lang === 'es' ? '/articulos' : '/posts'}`, languages: { es: 'https://jaimetr.dev/es/articulos', en: 'https://jaimetr.dev/en/posts' } } }
}

export default async function PostsPage({ params }) {
  const { lang } = await params
  const posts = await articulosDelErp(lang)
  return <main className="wrap py-16 md:py-24" aria-labelledby="posts-heading">
    <header className="rule-bottom pb-8"><h1 id="posts-heading" className="display display-l">{lang === 'es' ? 'Artículos' : 'Articles'}</h1><p className="tabular mt-4 text-ink-3">{posts.length} {lang === 'es' ? 'artículos' : 'articles'}</p></header>
    <FilteredPosts posts={posts} lang={lang} basePath={lang === 'es' ? '/es/articulos' : '/en/posts'} />
  </main>
}
