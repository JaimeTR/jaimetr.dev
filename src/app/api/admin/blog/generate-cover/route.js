import { NextResponse } from 'next/server'
import { validateAdminRequest } from '@/lib/auth'
import { generateCoverVariants } from '@/services/cover.mjs'

export const dynamic = 'force-dynamic';



export async function POST(request) {
  try {
    if (!validateAdminRequest(request)) {
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
