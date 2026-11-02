import { NextResponse } from 'next/server'
import { validateAdminRequest } from '@/lib/auth'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic';

// GET: Obtener datos de proyectos y experiencia
export async function GET(request) {
  try {
    if (!validateAdminRequest(request)) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const staticDataPath = path.join(process.cwd(), 'src/helpers/staticData.js')
    const content = fs.readFileSync(staticDataPath, 'utf-8')

    return NextResponse.json({
      success: true,
      content: content.substring(0, 500) // Devolver inicio del archivo
    })
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// POST: Agregar proyecto o experiencia
export async function POST(request) {
  try {
    if (!validateAdminRequest(request)) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { type, data } = body

    if (!type || !['experience'].includes(type)) {
      return NextResponse.json(
        { error: 'Tipo de dato inválido. Use "experience"' },
        { status: 400 }
      )
    }

    // Validar datos requeridos
    if (type === 'experience') {
      if (!data.role || !data.company || !data.date || !data.description) {
        return NextResponse.json(
          { error: 'Rol, empresa, fecha y descripción de experiencia son requeridos' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Experiencia agregada correctamente',
      data
    })
  } catch (error) {
    console.error('Error en POST /api/admin/data:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
