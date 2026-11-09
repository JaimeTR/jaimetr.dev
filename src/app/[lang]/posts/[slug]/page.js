import { notFound } from 'next/navigation'
import { articuloDelErp } from '@/lib/erp'
import { ArticleJsonLd } from '@/components/ArticleJsonLd'
import Breadcrumbs from '@/components/Breadcrumbs'

export const revalidate = 600

export async function generateMetadata({ params }) {
  const { slug, lang } = await params
  const post = await articuloDelErp(slug)
  if (!post) return {}
  const path = lang === 'es' ? '/es/articulos/' : '/en/posts/'
  return {
    title: `${post.titulo} | Jaime Tarazona Rodriguez`,
    description: post.resumen,
    alternates: {
      canonical: `https://jaimetr.dev${path}${slug}`,
      languages: {
        es: `https://jaimetr.dev/es/articulos/${post.traduccion?.idioma === 'es' ? post.traduccion.slug : slug}`,
        en: `https://jaimetr.dev/en/posts/${post.traduccion?.idioma === 'en' ? post.traduccion.slug : slug}`,
      },
    },
  }
}

function prepareArticleHtml(html = '') {
  const headings = []
  const content = html.replace(/<(h2|h3)(\s[^>]*)?>([\s\S]*?)<\/\1>/gi, (match, tag, attrs = '', inner) => {
    const title = inner.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').trim()
    const existingId = attrs.match(/\bid=["']([^"']+)["']/i)?.[1]
    const id = existingId || title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    if (title) headings.push({ id, title, level: tag.toLowerCase() })
    return existingId ? match : `<${tag}${attrs} id="${id}">${inner}</${tag}>`
  })
  return { content, headings }
}

export default async function PostPage({ params }) {
  const { slug, lang } = await params
  const post = await articuloDelErp(slug)
  if (!post) notFound()
  const fm = { title: post.titulo, description: post.resumen, cover: post.imagen, date: post.publicadoEn, tags: post.etiquetas || [] }
  const { content, headings } = prepareArticleHtml(post.contenido)
  return <>
    <ArticleJsonLd frontmatter={fm} slug={slug} lang={lang} />
    <div className="container mx-auto max-w-4xl px-4 pt-24 lg:px-8">
      <Breadcrumbs items={[{ name: lang === 'en' ? 'Home' : 'Inicio', url: `/${lang}` }, { name: 'Blog', url: lang === 'en' ? '/en/posts' : '/es/articulos' }, { name: post.titulo, url: '#' }]} />
      {headings.length > 1 && <nav aria-label={lang === 'en' ? 'Table of contents' : 'Tabla de contenidos'} className="my-8 rounded-xl border border-dark-200 p-5 dark:border-dark-700">
        <h2 className="mb-3 font-semibold">{lang === 'en' ? 'Contents' : 'Contenido'}</h2>
        <ol className="space-y-2">{headings.map(item => <li key={item.id} className={item.level === 'h3' ? 'ml-5 text-sm' : ''}><a className="text-primary-700 hover:underline dark:text-primary-300" href={`#${item.id}`}>{item.title}</a></li>)}</ol>
      </nav>}
      <article className="article-content my-12" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  </>
}
