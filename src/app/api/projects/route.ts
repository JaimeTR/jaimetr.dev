import { NextResponse } from 'next/server'
import { proyectosDelErp } from '@/lib/erp'
import { supabase } from '@/lib/supabase'

export const revalidate = 1800

// Primero el ERP (la fuente); si no esta disponible, la tabla projects de Supabase como respaldo.
export async function GET() {
  const delErp = await proyectosDelErp()
  if (delErp) return NextResponse.json(delErp)
  const { data, error } = await supabase.from('projects').select('*').eq('is_visible', true).order('sort_order', { ascending: true })
  if (error) return NextResponse.json({ error: 'No se pudieron leer los proyectos' }, { status: 500 })
  return NextResponse.json(data)
}
