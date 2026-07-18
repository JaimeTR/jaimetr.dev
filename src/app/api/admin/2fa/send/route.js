import { NextResponse } from 'next/server'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import { rateLimit, RATE_LIMITS } from '@/lib/ratelimit'

export const dynamic = 'force-dynamic'

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

function hashCode(code, email) {
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_TOKEN || 'jaimetr_internal_secret_2025'
  const timestamp = Math.floor(Date.now() / 60000)
  return crypto.createHash('sha256').update(`${code}:${email}:${secret}:${timestamp}`).digest('hex')
}

async function sendEmail(to, code) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`\n[DEV] 2FA CODE for ${to}: ${code}\n`)
    }
    return false
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: 'Codigo de Verificacion - Admin jaimetr.dev',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0f172a; border-radius: 16px; color: #e2e8f0;">
        <h1 style="color: #3b82f6; font-size: 24px;">Verificacion en 2 Pasos</h1>
        <p style="font-size: 16px; color: #94a3b8;">Acceso al panel de administracion de <strong>jaimetr.dev</strong>.</p>
        <div style="background: #1e293b; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
          <p style="font-size: 14px; color: #64748b; margin: 0 0 8px 0;">Tu codigo de verificacion:</p>
          <p style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #3b82f6; margin: 0; font-family: monospace;">${code}</p>
        </div>
        <p style="font-size: 13px; color: #64748b;">Expira en 5 minutos. Si no solicitaste esto, ignora este mensaje.</p>
      </div>
    `,
  })

  return true
}

export async function POST(req) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    const rl = rateLimit(`2fa:${ip}`, RATE_LIMITS.twofaSend)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Demasiadas solicitudes. Espera un minuto.' }, { status: 429 })
    }

    const body = await req.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
    }

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'jaimetr1309@gmail.com'
    if (email !== adminEmail) {
      return NextResponse.json({ error: 'Email no autorizado' }, { status: 403 })
    }

    const code = generateCode()
    const hash = hashCode(code, email)
    const emailSent = await sendEmail(email, code)

    return NextResponse.json({
      success: true,
      hash,
      emailSent,
      message: emailSent ? 'Codigo enviado a tu correo' : 'Codigo generado (revisa consola del servidor)',
    })
  } catch (error) {
    console.error('2FA Send Error:', error)
    return NextResponse.json({ error: 'Error al enviar codigo' }, { status: 500 })
  }
}
