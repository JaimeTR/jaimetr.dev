import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req) {
  try {
    const { messages, language = 'es' } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Mensajes inválidos' }, { status: 400 });
    }

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
1. Sé MUY amigable, profesional y habla bien. Usa emojis.
2. Respuestas BREVES (1 a 3 líneas máximo). NUNCA generes muros de texto.
3. Si el usuario quiere ver su experiencia, invítalos a revisar la sección de experiencia usando este link en Markdown: [Ver mi experiencia](/es/#experiencia). 
4. Si el usuario quiere agendar una cita, dales el email de Jaime o invítalos a usar la sección de contacto: [Ir a Contacto](/es/#contact).
5. Habla SOLO de temas relacionados con Jaime y su portafolio.
6. NUNCA INVENTES DATOS. Si no sabes la respuesta o no tienes un dato, di honestamente que no tienes esa información a la mano, e invítalos a contactar a Jaime directamente.
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
3. If the user wants to see his experience, invite them to check the experience section using this Markdown link: [See my experience](/en/#experiencia).
4. If the user wants to schedule a meeting, provide Jaime's email or invite them to use the contact section: [Go to Contact](/en/#contact).
5. ONLY discuss topics related to Jaime and his portfolio.
6. NEVER INVENT DATA. If you don't know the answer or lack a specific piece of information, honestly say you don't have it on hand, and invite them to contact Jaime directly.
Here is info about Jaime:
${dynamicContext}
`;

    const systemMessage = {
      role: 'system',
      content: language === 'en' ? systemPromptEn : systemPromptEs
    };

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 150,
    });

    const reply = response.choices[0].message.content;

    return NextResponse.json({ reply });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
