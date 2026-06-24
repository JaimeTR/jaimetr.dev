import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'

// Validar token de administrador (Middleman para seguridad)
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin123'

function validateAdminToken(request) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  return token === ADMIN_TOKEN
}

const ALLOWED_TABLES = ['profile', 'projects', 'experience', 'skills', 'posts', 'messages']

export async function GET(request, { params }) {
  if (!validateAdminToken(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const table = params.table
  if (!ALLOWED_TABLES.includes(table)) return NextResponse.json({ error: 'Tabla no permitida' }, { status: 400 })

  const supabase = createServiceRoleClient()
  
  let query = supabase.from(table).select('*')
  
  // Ordenamiento por defecto
  if (['projects', 'experience', 'skills'].includes(table)) {
    query = query.order('sort_order', { ascending: true })
  } else if (table === 'posts' || table === 'messages') {
    query = query.order('created_at', { ascending: false })
  }

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

export async function POST(request, { params }) {
  if (!validateAdminToken(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const table = params.table
  if (!ALLOWED_TABLES.includes(table)) return NextResponse.json({ error: 'Tabla no permitida' }, { status: 400 })

  const body = await request.json()
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase.from(table).insert(body).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

export async function PUT(request, { params }) {
  if (!validateAdminToken(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const table = params.table
  if (!ALLOWED_TABLES.includes(table)) return NextResponse.json({ error: 'Tabla no permitida' }, { status: 400 })

  const body = await request.json()
  const { id, ...updateData } = body

  if (!id) return NextResponse.json({ error: 'ID es requerido para actualizar' }, { status: 400 })

  const supabase = createServiceRoleClient()
  updateData.updated_at = new Date().toISOString()

  const { data, error } = await supabase.from(table).update(updateData).eq('id', id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

export async function DELETE(request, { params }) {
  if (!validateAdminToken(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const table = params.table
  if (!ALLOWED_TABLES.includes(table)) return NextResponse.json({ error: 'Tabla no permitida' }, { status: 400 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) return NextResponse.json({ error: 'ID es requerido para eliminar' }, { status: 400 })

  const supabase = createServiceRoleClient()
  const { error } = await supabase.from(table).delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
