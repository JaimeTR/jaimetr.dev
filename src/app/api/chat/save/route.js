import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const { sessionId, messages } = await request.json()

    if (!sessionId || !messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'sessionId y messages (array) son requeridos' }, { status: 400 })
    }

    const supabase = createServiceRoleClient()

    const rows = messages.map((msg) => ({
      session_id: sessionId,
      role: msg.role,
      content: msg.content,
      language: msg.language || 'es'
    }))

    const { error } = await supabase.from('chat_messages').insert(rows)

    if (error) {
      console.error('Error guardando chat messages:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Chat save API error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
