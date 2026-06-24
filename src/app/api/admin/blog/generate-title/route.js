export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getAllPostsMetadata } from '@/lib/mdx'

// Validar token de administrador
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin123'

function validateAdminToken(request) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  return token === ADMIN_TOKEN
}

function getExistingTitlesContext() {
  try {
    const posts = getAllPostsMetadata('es')
    const titles = posts.map(p => p.title).filter(Boolean)
    return titles.length > 0 
      ? `\nIMPORTANTE - EVITA CUALQUIER SIMILITUD CON ESTOS TÍTULOS EXISTENTES:\n${titles.map(t => `- ${t}`).join('\n')}` 
      : ''
  } catch (e) {
    return ''
  }
}

const SYSTEM_PROMPT = `Eres Jaime Tarazona, un Ingeniero de Software experto. Escribes para un blog técnico de alto nivel.
Tus áreas de especialidad son: Arquitectura de Software, Next.js, React, Node.js, Inteligencia Artificial (LLMs, GenAI), Performance Web (Core Web Vitals) y DevOps.
Los títulos que generas deben reflejar innovación, casos de uso del mundo real, tutoriales avanzados y tendencias tecnológicas actuales.`

async function generateTitlesWithGemini(topic, existingTitlesContext) {
  const { GoogleGenerativeAI } = await import('@google/generative-ai')
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

  if (!apiKey) {
    throw new Error('GOOGLE_GENERATIVE_AI_API_KEY no configurada')
  }

  const client = new GoogleGenerativeAI(apiKey)
  const model = client.getGenerativeModel({ model: 'gemini-pro' })

  const prompt = `${SYSTEM_PROMPT}

Genera 3 títulos diferentes, hiper-profesionales y atractivos (en español) para un artículo sobre: "${topic}"

Cada título debe:
- Ser conciso (máximo 60 caracteres)
- Ser extremadamente descriptivo y llamar la atención de desarrolladores Senior o Tech Leads.
- Incluir palabras clave relevantes (SEO).
- Ser único, novedoso y diferente a los otros dos.
${existingTitlesContext}

Devuelve exactamente 3 títulos, uno por línea, sin numeración ni puntos. Solo los títulos.`

  const result = await model.generateContent(prompt)
  const text = result.response.text()
  const titles = text.split('\n').filter(t => t.trim()).slice(0, 3)
  return titles.map(t => t.trim())
}

async function generateTitlesWithOpenAI(topic, existingTitlesContext) {
  const OpenAI = (await import('openai')).default
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY no configurada')
  }

  const client = new OpenAI({ apiKey })

  const response = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT
      },
      {
        role: 'user',
        content: `Genera 3 títulos diferentes, hiper-profesionales y atractivos (en español) para un artículo sobre: "${topic}"

Cada título debe:
- Ser conciso (máximo 60 caracteres)
- Ser extremadamente descriptivo y llamar la atención de desarrolladores Senior o Tech Leads.
- Incluir palabras clave relevantes (SEO).
- Ser único, novedoso y diferente a los otros dos.
${existingTitlesContext}

Devuelve exactamente 3 títulos, uno por línea, sin numeración ni puntos. Solo los títulos.`
      }
    ],
    temperature: 0.7,
    max_tokens: 150
  })

  const text = response.choices[0].message.content
  const titles = text.split('\n').filter(t => t.trim()).slice(0, 3)
  return titles.map(t => t.trim())
}

// Fallback local sin proveedores: genera 3 títulos SEO en base al tema
function generateTitlesFallback(topic) {
  const t = (s) => s.length > 60 ? s.slice(0, 57).trim() + '…' : s
  const clean = String(topic).trim()
  const variants = [
    `Arquitectura de ${clean}: Guía Definitiva 2025`,
    `${clean} y Next.js: Optimizando el Performance`,
    `Dominando ${clean} en Desarrollo de Software Moderno`
  ]
  return variants.map(t)
}

export async function POST(request) {
  try {
    if (!validateAdminToken(request)) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { topic, provider = 'gemini' } = body

    if (!topic) {
      return NextResponse.json(
        { error: 'El tema del artículo es requerido' },
        { status: 400 }
      )
    }

    let titles
    const existingTitlesContext = getExistingTitlesContext()

    try {
      if (provider === 'openai') {
        titles = await generateTitlesWithOpenAI(topic, existingTitlesContext)
      } else {
        titles = await generateTitlesWithGemini(topic, existingTitlesContext)
      }
    } catch (e) {
      // Si falta API key u ocurre un error del proveedor, usar fallback local
      titles = generateTitlesFallback(topic)
    }

    return NextResponse.json({
      success: true,
      data: {
        titles: titles,
        topic: topic
      }
    })
  } catch (error) {
    console.error('Error generando títulos:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
