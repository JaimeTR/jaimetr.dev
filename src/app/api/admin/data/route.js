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

    // Aquí guardamos en el archivo
    if (type === 'project') {
      const projectsPath = path.join(process.cwd(), 'src/data/projects.json')
      let projects = []
      
      try {
        if (fs.existsSync(projectsPath)) {
          const fileData = fs.readFileSync(projectsPath, 'utf8')
          projects = JSON.parse(fileData)
        }
      } catch (e) {
        console.error("Error leyendo projects.json", e)
      }

      const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id || 0)) + 1 : 1
      
      const newProject = {
        id: newId,
        title: data.name,
        description: data.description,
        image: data.image || "/developer.gif",
        category: "Webs", // Categoría por defecto
        rubro: "Otros",
        technologies: data.technologies || [],
        url: data.link || data.github || "",
        allowIframe: false
      }

      projects.unshift(newProject) // Agregar al inicio
      fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2))
    }

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
