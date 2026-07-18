import { NextResponse } from 'next/server'
import { validateAdminRequest } from '@/lib/auth'
import matter from 'gray-matter'
import { generateBlogMdx } from '@/services/ai.mjs'

export const dynamic = 'force-dynamic';



export async function POST(request) {
  try {
    if (!validateAdminRequest(request)) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { topic, title, provider = 'gemini' } = body

    if (!topic) {
      return NextResponse.json(
        { error: 'El tema del artículo es requerido' },
        { status: 400 }
      )
    }

    // Genera el MDX (incluye frontmatter) utilizando el servicio común
    const generated = await generateBlogMdx({ topic, provider, titleOverride: title })

    // Extrae body y frontmatter
    const parsed = matter(generated.mdx)
    const contentBody = parsed.content.trim()
    const fm = parsed.data || {}

    // Si se envió un título seleccionado, úsalo para el frontmatter (solo para vista previa)
    const finalTitle = (title && String(title).trim()) || fm.title || generated.title

    return NextResponse.json({
      success: true,
      data: {
        content: contentBody,
        title: finalTitle,
        slug: generated.slug,
        tags: generated.tags,
      }
    })
  } catch (error) {
    console.error('Error generando contenido:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno' },
      { status: 500 }
    )
  }
}
