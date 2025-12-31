import { NextResponse } from 'next/server'
import { generateCoverVariants } from '@/services/cover.mjs'

export async function POST(request) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get('Authorization')
    const expectedToken = process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin123'
    
    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { slug, title, tags } = body

    if (!slug || !title) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos' }, { status: 400 })
    }

    // Generar las 3 variantes de portada
    const variants = await generateCoverVariants({ 
      slug, 
      title, 
      tags: tags || [] 
    })

    return NextResponse.json({ 
      success: true, 
      variants
    })
  } catch (error) {
    console.error('Error generando portadas:', error)
    return NextResponse.json({ 
      error: error.message || 'Error al generar las portadas' 
    }, { status: 500 })
  }
}
