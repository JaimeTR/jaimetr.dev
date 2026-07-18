export const dynamic = 'force-dynamic';

import { writePost, generateBlogMdx } from '@/services/ai.mjs'
import { generateCover } from '@/services/cover.mjs'
import { NextResponse } from 'next/server'
import { validateAdminRequest } from '@/lib/auth'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// GET: Obtener lista de blogs
export async function GET(request) {
  try {
    if (!validateAdminRequest(request)) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const postsDir = path.join(process.cwd(), 'src', 'posts')
    
    if (!fs.existsSync(postsDir)) {
      return NextResponse.json({
        success: true,
        data: []
      })
    }

    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
    
    const blogs = files.map(file => {
      const filePath = path.join(postsDir, file)
      const content = fs.readFileSync(filePath, 'utf-8')
      const { data, content: body } = matter(content)
      const slug = file.replace(/\.(mdx|md)$/, '')
      
      return {
        slug,
        title: data.title || slug,
        date: data.date || new Date().toISOString().split('T')[0],
        excerpt: data.excerpt || body.substring(0, 100).replace(/\n/g, ' '),
        tags: data.tags || [],
        coverImage: `/images/posts/${slug}.webp`,
        file: file,
        is_hidden: data.is_hidden || false,
        is_featured: data.is_featured || false,
        featured_order: data.featured_order || 999
      }
    }).sort((a, b) => {
      // First sort by featured_order if both are featured, then by date
      if (a.is_featured && b.is_featured) {
        if (a.featured_order !== b.featured_order) return a.featured_order - b.featured_order;
      }
      return new Date(b.date) - new Date(a.date);
    })

    return NextResponse.json({
      success: true,
      data: blogs
    })
  } catch (error) {
    console.error('Error en GET /api/admin/blog:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

async function saveUploadedImage(file, slug) {
  try {
    const sharp = (await import('sharp')).default
    const buffer = await file.arrayBuffer()
    const outDir = path.join(process.cwd(), 'public', 'images', 'posts')
    
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true })
    }

    const outFile = path.join(outDir, `${slug}.webp`)

    await sharp(buffer)
      .webp({ quality: 80 })
      .toFile(outFile)

    return `/images/posts/${slug}.webp`
  } catch (error) {
    console.error('Error saving uploaded image:', error)
    throw error
  }
}

function updateFrontmatterCover(filePath, coverPath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    const parsed = matter(raw)
    const data = parsed.data || {}
    // Actualizar la portada en el frontmatter
    data.cover = coverPath
    // Reconstruir MDX con frontmatter actualizado
    const updated = matter.stringify(parsed.content, data)
    fs.writeFileSync(filePath, updated, 'utf-8')
    return true
  } catch (err) {
    console.warn('No se pudo actualizar el frontmatter de cover:', err.message)
    return false
  }
}

export async function POST(request) {
  try {
    // Validar autenticación
    if (!validateAdminRequest(request)) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const topic = formData.get('topic')
    const customTitle = formData.get('title')
    const provider = formData.get('provider') || 'groq'
    const coverImageFile = formData.get('coverImage')
    const customContent = formData.get('content')

    if (!topic) {
      return NextResponse.json(
        { error: 'El tema del artículo es requerido' },
        { status: 400 }
      )
    }

    // Generar blog con IA (respeta contenido editado por el usuario)
    const { slug, mdx, title: generatedTitle, tags } = await generateBlogMdx({ 
      topic, 
      provider,
      titleOverride: customTitle,
      customContent: customContent || undefined,
    })

    // Usar título personalizado si se proporcionó, si no usar el generado
    const finalTitle = customTitle && customTitle.trim() ? customTitle : generatedTitle

    // Guardar archivo MDX
    const file = writePost({ slug, mdx })

    let coverPath = null

    // Si se subió una imagen, usarla; sino, generar automáticamente
    if (coverImageFile) {
      try {
        coverPath = await saveUploadedImage(coverImageFile, slug)
        console.log('Imagen subida guardada en:', coverPath)
        // Actualizar frontmatter con la portada subida
        updateFrontmatterCover(file, coverPath)
      } catch (err) {
        console.warn('Error guardando imagen subida, generando automáticamente:', err)
        try {
          coverPath = await generateCover({ slug, title: finalTitle, tags })
          updateFrontmatterCover(file, coverPath)
        } catch (err2) {
          console.warn('Error generando portada automática:', err2)
        }
      }
    } else {
      // Generar portada automáticamente
      try {
        coverPath = await generateCover({ slug, title: finalTitle, tags })
        updateFrontmatterCover(file, coverPath)
      } catch (err) {
        console.warn('Error generando portada:', err)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        slug,
        title: finalTitle,
        tags,
        file,
        coverPath,
        mdx: mdx.substring(0, 200) + '...',
        customCover: !!coverImageFile
      }
    })
  } catch (error) {
    console.error('Error en POST /api/admin/blog:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
