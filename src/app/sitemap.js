import { getAllPostsMetadata, getPosts } from '@/lib/mdx'
import { PROJECTS } from '@/helpers/projects'
import fs from 'fs'
import path from 'path'

export default function sitemap() {
  const baseUrl = 'https://jaimetr.dev'
  const entries = []

  // Paginas estaticas
  const staticRoutes = [
    { route: '', priority: 1.0, freq: 'weekly' },
    { route: '/posts', priority: 0.9, freq: 'daily' },
    { route: '/projects', priority: 0.9, freq: 'monthly' },
  ]

  const postsDir = path.join(process.cwd(), 'src', 'posts')

  for (const locale of ['es', 'en']) {
    // Rutas estaticas
    for (const { route, priority, freq } of staticRoutes) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date('2025-01-01').toISOString(),
        changeFrequency: freq,
        priority,
      })
    }

    // Posts - filtrar por idioma
    const allPosts = getAllPostsMetadata(locale).filter(p => !p.is_hidden)
    for (const post of allPosts) {
      // Para EN, solo incluir si existe el archivo .en.mdx
      if (locale === 'en') {
        const enFile = path.join(postsDir, `${post.slug}.en.mdx`)
        if (!fs.existsSync(enFile)) continue
      }

      const date = post.date ? new Date(post.date) : new Date('2025-01-01')
      if (isNaN(date.getTime())) continue

      entries.push({
        url: `${baseUrl}/${locale}/posts/${post.slug}`,
        lastModified: date.toISOString(),
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }
  }

  // Projects - solo ES
  for (const project of PROJECTS) {
    const date = project.date ? new Date(project.date) : new Date('2022-01-01')
    if (isNaN(date.getTime())) continue

    entries.push({
      url: `${baseUrl}/es/projects/${project.slug}`,
      lastModified: date.toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    })
  }

  return entries
}
