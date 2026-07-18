export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { validateAdminRequest } from '@/lib/auth'
import { getAllPostsMetadata } from '@/lib/mdx'



function getExistingTitlesContext() {
  try {
    const posts = getAllPostsMetadata('es')
    const titles = posts.map(p => p.title).filter(Boolean)
    return titles.length > 0
      ? `\nIMPORTANTE - EVITA CUALQUIER SIMILITUD CON ESTOS TITULOS EXISTENTES:\n${titles.map(t => `- ${t}`).join('\n')}`
      : ''
  } catch (e) {
    return ''
  }
}

const SYSTEM_PROMPT = `Eres Jaime Tarazona Rodriguez, Ingeniero de Software Senior, Tech Lead y Full Stack Developer con mas de 10 anos de experiencia. Escribes para un blog tecnico de alto nivel.

Stack principal: Next.js, React, TypeScript, Node.js, Python, WordPress, Supabase, PostgreSQL, Docker.
Areas de expertise: Desarrollo Full Stack, Arquitectura de Software, IA (LLMs, RAG, Agentes), Performance Web (Core Web Vitals), SEO Tecnico, DevOps, Automatizaciones.

Los titulos que generas deben:
- Reflejar innovacion, casos de uso del mundo real y tendencias 2025.
- Ser tutoriales avanzados o analisis tecnicos profundos.
- Usar keywords SEO de alto valor.
- Sonar como escritos por un Senior Engineer / Tech Lead.`

function buildTitlePrompt(topic, existingTitlesContext) {
  return `${SYSTEM_PROMPT}

Genera 3 titulos diferentes, hiper-profesionales y atractivos (en espanol) para un articulo sobre: "${topic}"

Cada titulo debe:
- Ser conciso (maximo 60 caracteres)
- Extremadamente descriptivo y llamar la atencion de desarrolladores Senior o Tech Leads
- Incluir palabras clave relevantes (SEO)
- Ser unico, novedoso y diferente a los otros dos
- Reflejar tendencias actuales 2025
${existingTitlesContext}

Devuelve EXACTAMENTE 3 titulos, uno por linea, sin numeracion ni puntos ni comillas. Solo los titulos.`
}

async function generateTitlesWithGroq(topic, existingTitlesContext) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('GROQ_API_KEY no configurada')

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.8,
      max_tokens: 300,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildTitlePrompt(topic, existingTitlesContext) },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `Groq API error: ${response.status}`)
  }

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content || ''
  return text.split('\n').filter(t => t.trim()).slice(0, 3).map(t => t.trim().replace(/^["'-]|["'-]$/g, '').trim())
}

async function generateTitlesWithGemini(topic, existingTitlesContext) {
  const { GoogleGenerativeAI } = await import('@google/generative-ai')
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) throw new Error('GEMINI_API_KEY no configurada')

  const client = new GoogleGenerativeAI(apiKey)
  const model = client.getGenerativeModel({ model: process.env.AI_GEMINI_MODEL || 'gemini-1.5-pro' })
  const result = await model.generateContent(buildTitlePrompt(topic, existingTitlesContext))
  const text = result.response.text()
  return text.split('\n').filter(t => t.trim()).slice(0, 3).map(t => t.trim().replace(/^["'-]|["'-]$/g, '').trim())
}

async function generateTitlesWithOpenAI(topic, existingTitlesContext) {
  const { OpenAI } = await import('openai')
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) throw new Error('OPENAI_API_KEY no configurada')

  const client = new OpenAI({ apiKey })
  const response = await client.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    temperature: 0.8,
    max_tokens: 300,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildTitlePrompt(topic, existingTitlesContext) },
    ],
  })

  const text = response.choices[0].message.content
  return text.split('\n').filter(t => t.trim()).slice(0, 3).map(t => t.trim().replace(/^["'-]|["'-]$/g, '').trim())
}

function generateTitlesFallback(topic) {
  const short = (s) => s.length > 60 ? s.slice(0, 57).trim() + '...' : s
  const clean = String(topic).trim()
  const now = new Date().getFullYear()
  return [
    short(`${clean}: Guia Completa para Desarrolladores ${now}`),
    short(`Como Implementar ${clean} en Produccion (Guia Real)`),
    short(`Dominando ${clean}: Arquitectura, Performance y Buenas Practicas`),
  ]
}

export async function POST(request) {
  try {
    if (!validateAdminRequest(request)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { topic, provider = 'groq' } = body

    if (!topic) {
      return NextResponse.json({ error: 'El tema del articulo es requerido' }, { status: 400 })
    }

    let titles
    const existingTitlesContext = getExistingTitlesContext()

    try {
      if (provider === 'openai') {
        titles = await generateTitlesWithOpenAI(topic, existingTitlesContext)
      } else if (provider === 'gemini') {
        titles = await generateTitlesWithGemini(topic, existingTitlesContext)
      } else {
        titles = await generateTitlesWithGroq(topic, existingTitlesContext)
      }
    } catch (e) {
      console.warn('Title generation failed, using fallback:', e.message)
      titles = generateTitlesFallback(topic)
    }

    return NextResponse.json({
      success: true,
      data: { titles, topic },
    })
  } catch (error) {
    console.error('Error generando titulos:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
