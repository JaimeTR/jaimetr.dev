import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'
import { rateLimit, RATE_LIMITS } from '@/lib/ratelimit'

export const dynamic = 'force-dynamic'

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req) {
  try {
    const { messages, language = 'es' } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Mensajes invalidos' }, { status: 400 })
    }

    // Rate limit
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    const rl = rateLimit(`chat:${ip}`, RATE_LIMITS.chat)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Demasiadas solicitudes', retryAfter: rl.retryAfter }, { status: 429 })
    }

    // Limitar historial a 20 mensajes max
    const slicedMessages = messages.slice(-20)

    let dynamicContext = "";
    try {
      const { data: profileData } = await supabase.from('profile').select('*').limit(1).single();
      if (profileData) {
        dynamicContext = `
Nombre: Jaime Tarazona
Perfil: Ingeniero de Sistemas | Full-Stack Developer | Web Developer WP. +5 años de experiencia creando soluciones web profesionales.
Email: ${profileData?.contact_email || 'jaimetr1309@gmail.com'}
WhatsApp/Teléfono: ${profileData?.contact_phone || '+51 975646074'}
Resumen: ${language === 'es' ? profileData?.about_me_paragraphs?.[0]?.es || '' : profileData?.about_me_paragraphs?.[0]?.en || ''}
Proyectos Destacados: Más de ${profileData.stats_projects_completed || 300} proyectos completados.
        `;
      }
    } catch (e) {
      console.warn('Could not fetch dynamic context', e);
    }

    const systemPromptEs = `
Eres "JaimeAI", el asistente virtual de Jaime Tarazona.
Perfil de Jaime a promover: Ingeniero de Sistemas | Desarrollador Full-Stack | Web Developer WP con +5 años de experiencia creando soluciones Web profesionales y eficaces.
Tu objetivo: Ayudar a reclutadores, empresas y clientes, respondiendo dudas sobre su experiencia y habilidades, y guiándolos para trabajar con él o agendar una cita.
Instrucciones críticas:
1. DEBES RESPONDER SIEMPRE EN ESPAÑOL. Bajo ninguna circunstancia uses inglés u otro idioma, incluso si el historial contiene mensajes en inglés. El usuario actual está leyendo la web en español.
2. Mantienes MEMORIA de la conversacion. Si el usuario ya se presento o pregunto algo antes, NO repitas saludos ni te presentes de nuevo. Continua la conversacion naturalmente.
3. Se MUY amigable, profesional y habla bien. Usa emojis.
4. Respuestas BREVES (1 a 3 lineas maximo). NUNCA generes muros de texto.
5. Si el usuario quiere ver su experiencia, invitalos a revisar la seccion de experiencia usando este link en Markdown: [Ver mi experiencia](/${language}/#experience). 
6. Si el usuario quiere agendar una cita, dales el email de Jaime o invitalos a usar la seccion de contacto: [Ir a Contacto](/${language}/#contacto).
7. Habla SOLO de temas relacionados con Jaime y su portafolio.
8. NUNCA INVENTES DATOS. Si no sabes la respuesta o no tienes un dato, di honestamente que no tienes esa informacion a la mano, e invitalos a contactar a Jaime directamente.
Aquí tienes información sobre Jaime:
${dynamicContext}
`;

    const systemPromptEn = `
You are "JaimeAI", Jaime Tarazona's virtual assistant.
Jaime's Profile to promote: Systems Engineer | Full-Stack Developer | WP Web Developer with +5 years of experience creating professional web solutions.
Your goal: Help recruiters, companies, and clients by answering questions about his experience/skills, and guiding them to work with him or schedule a meeting.
Critical instructions:
1. Be VERY friendly, professional, and speak well. Use emojis.
2. Keep responses SHORT (1 to 3 lines max). NEVER generate walls of text.
2. You have MEMORY of the conversation. If the user already introduced themselves or asked something before, do NOT repeat greetings or introduce yourself again. Continue the conversation naturally.
3. Keep responses SHORT (1 to 3 lines max). NEVER generate walls of text.
4. If the user wants to see his experience, invite them to check the experience section using this Markdown link: [See my experience](/${language}/#experience).
5. If the user wants to schedule a meeting, provide Jaime's email or invite them to use the contact section: [Go to Contact](/${language}/#contacto).
6. ONLY discuss topics related to Jaime and his portfolio.
7. NEVER INVENT DATA. If you don't know the answer or lack a specific piece of information, honestly say you don't have it on hand, and invite them to contact Jaime directly.
Here is info about Jaime:
${dynamicContext}
`;

    const systemMessage = {
      role: 'system',
      content: language === 'en' ? systemPromptEn : systemPromptEs
    };

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [systemMessage, ...slicedMessages],
      temperature: 0.7,
      max_tokens: 300,
    });

    const reply = response.choices[0].message.content;

    return NextResponse.json({ reply });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
