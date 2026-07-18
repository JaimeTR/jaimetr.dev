import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAuthToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

function hashCode(code, email) {
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_TOKEN || 'jaimetr_internal_secret_2025'
  const timestamp = Math.floor(Date.now() / 60000)
  return crypto.createHash('sha256').update(`${code}:${email}:${secret}:${timestamp}`).digest('hex')
}

export async function POST(req) {
  try {
    const body = await req.json()
    const { email, code, hash } = body

    if (!email || !code || !hash) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    const now = Date.now()
    const secret = process.env.ADMIN_SECRET || process.env.ADMIN_TOKEN || 'jaimetr_internal_secret_2025'

    let valid = false
    for (let offset = 0; offset <= 5; offset++) {
      const timestamp = Math.floor((now - offset * 60000) / 60000)
      const expectedHash = crypto.createHash('sha256').update(`${code}:${email}:${secret}:${timestamp}`).digest('hex')
      if (hash === expectedHash) {
        valid = true
        break
      }
    }

    if (!valid) {
      return NextResponse.json({ error: 'Codigo invalido o expirado' }, { status: 401 })
    }

    const token = createAuthToken({ email, role: 'admin' })

    return NextResponse.json({ success: true, token })
  } catch (error) {
    console.error('2FA Verify Error:', error)
    return NextResponse.json({ error: 'Error al verificar' }, { status: 500 })
  }
}
