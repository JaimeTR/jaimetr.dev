import { getAllPostsMetadata } from '@/lib/mdx'

export const dynamic = 'force-dynamic'

export async function GET() {
  const posts = getAllPostsMetadata('es').filter(p => !p.is_hidden)
  const baseUrl = 'https://jaimetr.dev'

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Jaime Tarazona Rodriguez - Blog</title>
    <link>${baseUrl}</link>
    <description>Blog de desarrollo web, React, Next.js, JavaScript y mas</description>
    <language>es</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${posts.map(post => `
    <item>
      <title><![CDATA[${post.title || ''}]]></title>
      <link>${baseUrl}/es/posts/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/es/posts/${post.slug}</guid>
      <description><![CDATA[${post.description || post.excerpt || ''}]]></description>
      <pubDate>${new Date(post.date || Date.now()).toUTCString()}</pubDate>
      ${(post.tags || []).map(tag => `<category>${tag}</category>`).join('\n      ')}
    </item>`).join('')}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
