import { NextResponse } from 'next/server'
import { validateAdminRequest } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic';



const ALLOWED_TABLES = ['profile', 'projects', 'experience', 'skills', 'posts', 'messages', 'chat_messages']

const ALLOWED_COLUMNS = {
  profile: ['hero_title_es', 'hero_title_en', 'hero_subtitle_es', 'hero_subtitle_en', 'name_es', 'name_en', 'greeting_es', 'greeting_en', 'hero_image_url', 'hero_button1_text_es', 'hero_button1_text_en', 'hero_button1_link', 'hero_button1_icon', 'hero_button2_text_es', 'hero_button2_text_en', 'hero_button2_link', 'hero_button2_icon', 'about_me_es', 'about_me_en', 'about_me_paragraphs', 'role_description_es', 'role_description_en', 'specialization_es', 'specialization_en', 'availability_es', 'availability_en', 'years_experience_es', 'years_experience_en', 'cv_url', 'email', 'contact_email', 'contact_phone', 'github_url', 'linkedin_url', 'tiktok_url', 'facebook_url', 'instagram_url', 'stats_projects_completed', 'is_particles_visible', 'is_cv_visible', 'is_linkedin_visible', 'is_github_visible', 'is_email_visible', 'is_tiktok_visible', 'is_facebook_visible', 'is_instagram_visible', 'is_button1_visible', 'is_button2_visible', 'hero_buttons_order', 'updated_at'],
  projects: ['title', 'description', 'image_url', 'category', 'rubro', 'technologies', 'link_url', 'github_url', 'is_featured', 'is_visible', 'sort_order', 'updated_at'],
  experience: ['role', 'role_en', 'company', 'company_en', 'description', 'description_en', 'date_string', 'date_en_string', 'start_date', 'end_date', 'is_active', 'is_featured', 'sort_order', 'updated_at'],
  skills: ['name', 'category', 'icon_name', 'proficiency', 'sort_order', 'updated_at'],
  posts: ['title', 'excerpt', 'content', 'cover_image_url', 'tags', 'status', 'is_featured', 'published_at', 'updated_at'],
  messages: ['is_read'],
  chat_messages: ['is_read'],
}

function filterAllowedColumns(body, table) {
  const allowed = ALLOWED_COLUMNS[table]
  if (!allowed) return body
  const filtered = {}
  for (const key of Object.keys(body)) {
    if (allowed.includes(key)) filtered[key] = body[key]
  }
  return filtered
}

export async function GET(request, { params }) {
  if (!validateAdminRequest(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { table } = await params
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
  if (!validateAdminRequest(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { table } = await params
  if (!ALLOWED_TABLES.includes(table)) return NextResponse.json({ error: 'Tabla no permitida' }, { status: 400 })

  const body = await request.json()
  const cleanBody = filterAllowedColumns(body, table)
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase.from(table).insert(cleanBody).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

export async function PUT(request, { params }) {
  if (!validateAdminRequest(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { table } = await params
  if (!ALLOWED_TABLES.includes(table)) return NextResponse.json({ error: 'Tabla no permitida' }, { status: 400 })

  const body = await request.json()
  const { id, ...rawUpdateData } = body
  const updateData = filterAllowedColumns(rawUpdateData, table)

  if (!id) return NextResponse.json({ error: 'ID es requerido para actualizar' }, { status: 400 })

  const supabase = createServiceRoleClient()
  updateData.updated_at = new Date().toISOString()

  const { data, error } = await supabase.from(table).update(updateData).eq('id', id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

export async function DELETE(request, { params }) {
  if (!validateAdminRequest(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { table } = await params
  if (!ALLOWED_TABLES.includes(table)) return NextResponse.json({ error: 'Tabla no permitida' }, { status: 400 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) return NextResponse.json({ error: 'ID es requerido para eliminar' }, { status: 400 })

  const supabase = createServiceRoleClient()
  const { error } = await supabase.from(table).delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
