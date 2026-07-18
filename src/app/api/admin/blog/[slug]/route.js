import { NextResponse } from 'next/server'
import { validateAdminRequest } from '@/lib/auth'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export const dynamic = 'force-dynamic';



// GET: Obtener un blog específico
export async function GET(request, { params }) {
  try {
    if (!validateAdminRequest(request)) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { slug } = await params
    const postsDir = path.join(process.cwd(), 'src', 'posts')
    
    // Buscar el archivo
    const files = fs.readdirSync(postsDir)
    const file = files.find(f => f.startsWith(slug) && (f.endsWith('.mdx') || f.endsWith('.md')))
    
    if (!file) {
      return NextResponse.json(
        { error: 'Blog no encontrado' },
        { status: 404 }
      )
    }

    const filePath = path.join(postsDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    const { data, content: body } = matter(content)
    
    const coverImagePath = path.join(process.cwd(), 'public', 'images', 'posts', `${slug}.webp`)
    const hasCoverImage = fs.existsSync(coverImagePath)

    return NextResponse.json({
      success: true,
      data: {
        slug,
        title: data.title || slug,
        date: data.date || '',
        excerpt: data.excerpt || '',
        description: data.description || '',
        tags: data.tags || [],
        content: body,
        hasCoverImage,
        coverImage: `/images/posts/${slug}.webp`,
        is_featured: data.is_featured || false
      }
    })
  } catch (error) {
    console.error('Error en GET /api/admin/blog/[slug]:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// PUT: Actualizar un blog
export async function PUT(request, { params }) {
  try {
    if (!validateAdminRequest(request)) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { slug } = await params
    const formData = await request.formData()
    
    const title = formData.get('title')
    const date = formData.get('date')
    const excerpt = formData.get('excerpt')
    const description = formData.get('description')
    const tags = formData.get('tags') ? JSON.parse(formData.get('tags')) : []
    const content = formData.get('content')
    const coverImageFile = formData.get('coverImage')
    const is_featured = formData.get('is_featured') === 'true'

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Título y contenido son requeridos' },
        { status: 400 }
      )
    }

    const postsDir = path.join(process.cwd(), 'src', 'posts')
    
    // Buscar el archivo original
    const files = fs.readdirSync(postsDir)
    const file = files.find(f => f.startsWith(slug) && (f.endsWith('.mdx') || f.endsWith('.md')))
    
    if (!file) {
      return NextResponse.json(
        { error: 'Blog no encontrado' },
        { status: 404 }
      )
    }

    const filePath = path.join(postsDir, file)

    // Construir el nuevo contenido MDX
    const frontmatter = {
      title,
      date: date || new Date().toISOString().split('T')[0],
      excerpt: excerpt || '',
      description: description || '',
      tags: tags || [],
      cover: `/images/posts/${slug}.webp`,
      author: 'jaimetrdev',
      is_featured
    }

    const newContent = `---
${Object.entries(frontmatter)
  .map(([key, value]) => {
    if (key === 'tags' && Array.isArray(value)) {
      if (value.length === 0) return `${key}: []`
      return `${key}:\n${value.map(v => `    - ${v}`).join('\n')}`
    }
    if (typeof value === 'string') {
      // Si contiene caracteres especiales de YAML, usar comillas simples
      if (value.includes(':') || value.includes('#') || value.includes('-')) {
        return `${key}: '${value.replace(/'/g, "''")}'`
      }
      return `${key}: ${value}`
    }
    return `${key}: ${value}`
  })
  .join('\n')}
---

${content}`

    // Guardar el archivo actualizado
    fs.writeFileSync(filePath, newContent, 'utf-8')

    // Si se subió una imagen, procesarla
    if (coverImageFile) {
      try {
        const sharp = (await import('sharp')).default
        const buffer = await coverImageFile.arrayBuffer()
        const outDir = path.join(process.cwd(), 'public', 'images', 'posts')
        
        if (!fs.existsSync(outDir)) {
          fs.mkdirSync(outDir, { recursive: true })
        }

        const outFile = path.join(outDir, `${slug}.webp`)

        await sharp(buffer)
          .webp({ quality: 80 })
          .toFile(outFile)
      } catch (err) {
        console.warn('Error procesando imagen:', err)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Blog actualizado correctamente',
      data: {
        slug,
        title,
        date,
        excerpt,
        description,
        tags
      }
    })
  } catch (error) {
    console.error('Error en PUT /api/admin/blog/[slug]:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// DELETE: Eliminar un blog
export async function DELETE(request, { params }) {
  try {
    if (!validateAdminRequest(request)) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { slug } = await params
    const postsDir = path.join(process.cwd(), 'src', 'posts')
    
    // Buscar y eliminar el archivo
    const files = fs.readdirSync(postsDir)
    const file = files.find(f => f.startsWith(slug) && (f.endsWith('.mdx') || f.endsWith('.md')))
    
    if (!file) {
      return NextResponse.json(
        { error: 'Blog no encontrado' },
        { status: 404 }
      )
    }

    const filePath = path.join(postsDir, file)
    fs.unlinkSync(filePath)

    // Intentar eliminar la imagen
    const imagePath = path.join(process.cwd(), 'public', 'images', 'posts', `${slug}.webp`)
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath)
    }

    return NextResponse.json({
      success: true,
      message: 'Blog eliminado correctamente'
    })
  } catch (error) {
    console.error('Error en DELETE /api/admin/blog/[slug]:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
