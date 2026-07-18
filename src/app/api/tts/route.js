import { NextResponse } from 'next/server'
import { rateLimit, RATE_LIMITS } from '@/lib/ratelimit'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    const rl = rateLimit(`tts:${ip}`, RATE_LIMITS.tts)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Demasiadas solicitudes' }, { status: 429 })
    }

    const { text } = await req.json()

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Texto requerido' }, { status: 400 })
    }

    const voiceId = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID
    const apiKey = process.env.ELEVENLABS_API_KEY

    if (!voiceId || !apiKey) {
      console.error('TTS: Faltan credenciales')
      return NextResponse.json({ error: 'Credenciales faltantes' }, { status: 500 })
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: text.trim(),
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    )

    if (!response.ok) {
      const errText = await response.text()
      console.error('TTS Error:', response.status, errText)
      return NextResponse.json({ error: 'TTS failed', status: response.status }, { status: response.status })
    }

    const arrayBuffer = await response.arrayBuffer()
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(arrayBuffer.byteLength),
      },
    })
  } catch (error) {
    console.error('TTS Error:', error.message)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
