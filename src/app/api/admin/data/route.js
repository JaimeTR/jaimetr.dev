import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Validar token de administrador
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin123'

function validateAdminToken(request) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  return token === ADMIN_TOKEN
}

// GET: Obtener datos de proyectos y experiencia
export async function GET(request) {
  try {
    if (!validateAdminToken(request)) {
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
    if (!validateAdminToken(request)) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { type, data } = body

    if (!type || !['project', 'experience'].includes(type)) {
      return NextResponse.json(
        { error: 'Tipo de dato inválido. Use "project" o "experience"' },
        { status: 400 }
      )
    }

    // Validar datos requeridos
    if (type === 'project') {
      if (!data.name || !data.description) {
        return NextResponse.json(
          { error: 'Nombre y descripción del proyecto son requeridos' },
          { status: 400 }
        )
      }
    }

    if (type === 'experience') {
      if (!data.role || !data.company || !data.date || !data.description) {
        return NextResponse.json(
          { error: 'Rol, empresa, fecha y descripción de experiencia son requeridos' },
          { status: 400 }
        )
      }
    }

    // Aquí se añadiría la lógica para guardar en BD o archivo
    // Por ahora retornamos éxito

    return NextResponse.json({
      success: true,
      message: `${type === 'project' ? 'Proyecto' : 'Experiencia'} agregado correctamente`,
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
