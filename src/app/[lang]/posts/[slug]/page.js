import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { articuloDelErp, articulosDelErp } from '@/lib/erp'
import ArticleBody from '@/components/ArticleBody'
import { ArticleJsonLd } from '@/components/ArticleJsonLd'
import Breadcrumbs from '@/components/Breadcrumbs'

export const revalidate = 600

export async function generateMetadata({ params }) {
  const { slug, lang } = await params
  const post = await articuloDelErp(slug)
  if (!post) return {}
  const path = lang === 'es' ? '/es/articulos/' : '/en/posts/'
  const translation = post.traduccion
  const translatedSlug = translation?.slug
  return {
    title: `${post.titulo} | Jaime Tarazona Rodriguez`, description: post.resumen,
    alternates: { canonical: `https://jaimetr.dev${path}${slug}`, languages: {
      es: `https://jaimetr.dev/es/articulos/${translation?.idioma === 'es' ? translatedSlug : slug}`,
      en: `https://jaimetr.dev/en/posts/${translation?.idioma === 'en' ? translatedSlug : slug}`,
    } },
    openGraph: { title: post.titulo, description: post.resumen, images: post.imagen ? [post.imagen] : [] },
  }
}

function prepareArticleHtml(html = '') {
  const headings = []
  const content = html.replace(/<(h2|h3|h4)(\s[^>]*)?>([\s\S]*?)<\/\1>/gi, (match, tag, attrs = '', inner) => {
    const title = inner.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').trim()
    const id = attrs.match(/\bid=["']([^"']+)["']/i)?.[1] || title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    if (title) headings.push({ id, title, level: tag.toLowerCase() })
    return attrs.match(/\bid=/i) ? match : `<${tag}${attrs} id="${id}">${inner}</${tag}>`
  })
  return { content, headings }
}

export default async function PostPage({ params }) {
  const { slug, lang } = await params
  const post = await articuloDelErp(slug)
  if (!post) notFound()
  const { content, headings } = prepareArticleHtml(post.contenido)
  const path = lang === 'es' ? '/es/articulos' : '/en/posts'
  const related = (await articulosDelErp(lang)).filter(item => item.slug !== slug).slice(0, 3)
  return <main className="wrap py-10 md:py-16">
    <ArticleJsonLd frontmatter={{ title: post.titulo, description: post.resumen, cover: post.imagen, date: post.publicadoEn, tags: post.etiquetas || [] }} slug={slug} lang={lang} />
    <Breadcrumbs items={[{ name: lang === 'en' ? 'Home' : 'Inicio', url: `/${lang}` }, { name: lang === 'en' ? 'Articles' : 'Artículos', url: path }, { name: post.titulo, url: `#` }]} />
    <article>
      <header className="rule-bottom py-8 md:py-12">
        <p className="tabular text-sm text-ink-3">{post.publicadoEn ? new Intl.DateTimeFormat(lang, { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(post.publicadoEn)) : ''}{post.etiquetas?.length ? ` · ${post.etiquetas.join(', ')}` : ''}</p>
        <h1 className="display display-l mt-6 max-w-[18ch]">{post.titulo}</h1>
        <p className="mt-6 max-w-[68ch] text-xl text-ink-2">{post.resumen}</p>
        {post.autor && <p className="mt-5 text-sm text-ink-3">{post.autor}</p>}
        {post.traduccion?.slug && <Link href={`${post.traduccion.idioma === 'en' ? '/en/posts' : '/es/articulos'}/${post.traduccion.slug}`} className="link-line mt-5 inline-block text-sm">{lang === 'es' ? 'Read in English' : 'Leer en español'}</Link>}
      </header>
      {post.imagen && <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[4px]"><Image src={post.imagen} alt={post.imagenAlt || post.titulo} fill priority sizes="(min-width: 1440px) 1344px, 94vw" className="object-cover" /></div>}
      <div className="grid gap-12 py-10 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <ArticleBody content={content} />
        {headings.length > 0 && <aside className="hidden lg:block"><nav aria-label={lang === 'en' ? 'Table of contents' : 'Tabla de contenidos'} className="sticky top-24"><h2 className="text-sm text-ink">{lang === 'en' ? 'Contents' : 'Contenido'}</h2><ol className="mt-4 space-y-3">{headings.map(item => <li key={item.id} className={item.level !== 'h2' ? 'ml-4' : ''}><a href={`#${item.id}`} className="text-sm text-ink-3 hover:text-ink">{item.title}</a></li>)}</ol></nav></aside>}
      </div>
    </article>
    {related.length > 0 && <section aria-labelledby="related-heading" className="mt-8"><h2 id="related-heading" className="display display-m rule-bottom pb-5">{lang === 'es' ? 'Más artículos' : 'More articles'}</h2>{related.map(item => <Link key={item.slug} href={`${path}/${item.slug}`} className="rule-top grid gap-2 py-5 sm:grid-cols-[10rem_1fr]"><span className="tabular text-sm text-ink-3">{item.publicadoEn ? new Intl.DateTimeFormat(lang, { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(item.publicadoEn)) : ''}</span><span><span className="display display-m block">{item.titulo}</span><span className="mt-2 block text-ink-2">{item.resumen}</span></span></Link>)}</section>}
  </main>
}
