import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export async function POST(request) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get('Authorization')
    const expectedToken = process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin123'
    
    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { slug, variantFilename } = body

    if (!slug || !variantFilename) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos' }, { status: 400 })
    }

    const publicDir = path.join(process.cwd(), 'public', 'images', 'posts')
    const variantPath = path.join(publicDir, variantFilename)
    const finalPath = path.join(publicDir, `${slug}.webp`)

    // Verificar que la variante existe
    if (!fs.existsSync(variantPath)) {
      return NextResponse.json({ error: 'Variante no encontrada' }, { status: 404 })
    }

    // Copiar la variante seleccionada como la portada final
    fs.copyFileSync(variantPath, finalPath)

    // Actualizar el frontmatter del MDX con la nueva portada
    const postsDir = path.join(process.cwd(), 'src', 'posts')
    const files = fs.readdirSync(postsDir)
    const mdxFile = files.find(f => f.startsWith(slug) && f.endsWith('.mdx'))
    
    if (mdxFile) {
      const mdxPath = path.join(postsDir, mdxFile)
      const fileContent = fs.readFileSync(mdxPath, 'utf-8')
      const { data, content } = matter(fileContent)
      
      // Actualizar el campo cover
      data.cover = `/images/posts/${slug}.webp`
      
      // Reconstruir el archivo con el frontmatter actualizado
      const newContent = matter.stringify(content, data)
      fs.writeFileSync(mdxPath, newContent, 'utf-8')
    }

    return NextResponse.json({ 
      success: true, 
      coverUrl: `/images/posts/${slug}.webp`
    })
  } catch (error) {
    console.error('Error seleccionando portada:', error)
    return NextResponse.json({ 
      error: error.message || 'Error al seleccionar la portada' 
    }, { status: 500 })
  }
}
