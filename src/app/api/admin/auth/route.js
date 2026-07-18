import { NextResponse } from 'next/server'
import { createAuthToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contrasena requeridos' }, { status: 400 })
    }

    // Validacion server-side - sin exponer en cliente
    const adminEmail = process.env.ADMIN_EMAIL || 'jaimetr1309@gmail.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'Tarazona1309'

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
    }

    // Token con expiracion de 24h
    const token = createAuthToken({ email, role: 'admin' })

    return NextResponse.json({ success: true, token })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
