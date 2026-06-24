import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// Validar token de administrador
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin123'

function validateAdminToken(request) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  return token === ADMIN_TOKEN
}

// POST: Actualizar batch de estados (is_hidden, is_featured, featured_order)
export async function POST(request) {
  try {
    if (!validateAdminToken(request)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { updates } = await request.json()
    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json({ error: 'Formato de updates inválido' }, { status: 400 })
    }

    const postsDir = path.join(process.cwd(), 'src', 'posts')
    const files = fs.readdirSync(postsDir)

    for (const update of updates) {
      const { slug, is_hidden, is_featured, featured_order } = update
      if (!slug) continue

      const file = files.find(f => f.startsWith(slug) && (f.endsWith('.mdx') || f.endsWith('.md')))
      if (!file) continue

      const filePath = path.join(postsDir, file)
      const raw = fs.readFileSync(filePath, 'utf-8')
      const parsed = matter(raw)
      const data = parsed.data || {}

      if (is_hidden !== undefined) data.is_hidden = is_hidden
      if (is_featured !== undefined) data.is_featured = is_featured
      if (featured_order !== undefined) data.featured_order = featured_order

      const newContent = matter.stringify(parsed.content, data)
      fs.writeFileSync(filePath, newContent, 'utf-8')
    }

    return NextResponse.json({ success: true, message: 'Estados actualizados correctamente' })
  } catch (error) {
    console.error('Error en POST /api/admin/blog/status:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
