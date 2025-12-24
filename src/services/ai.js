// Servicio de IA para generar contenido MDX con SEO
// Soporta OpenAI vía env OPENAI_API_KEY; si no hay clave, devuelve contenido de ejemplo.

import fs from 'fs'
import path from 'path'

// Genera MDX usando el proveedor indicado: 'gemini' | 'openai' | fallback
export async function generateBlogMdx({
  topic,
  tone = 'profesional',
  keywords = [],
  audience = 'desarrolladores y clientes técnicos',
  brand = 'Jaime Tarazona',
  provider = process.env.AI_PROVIDER || 'gemini',
}) {
  const date = new Date().toISOString().slice(0, 10)
  const slug = slugify(topic)
  // Usamos un cover seguro existente (puedes cambiarlo a una imagen específica por post)
  const cover = `/images/og.png`
  const tagsList = keywords.length ? keywords : inferTagsFromTopic(topic)

  const system = [
    'Eres un redactor técnico senior y SEO especializado en desarrollo web.',
    'Escribe en español neutro, tono ' + tone + ', claro y conciso.',
    'Estructura en MDX con encabezados H2/H3, listas, y algún bloque de código cuando aplique.',
    'Incluye ejemplos prácticos y mejores prácticas.',
    'Optimiza para SEO: título <60 caracteres, descripción 150-160, keywords relevantes.',
    'Incluye llamados a la acción hacia servicios: desarrollo web, optimización, WordPress, Next.js.',
  ].join(' ')

  const user = `Tema: ${topic}\nAudiencia: ${audience}\nPalabras clave: ${tagsList.join(', ')}\nMarca: ${brand}\n`

  let body = ''
  try {
    if (provider === 'gemini') {
      const apiKey = process.env.GEMINI_API_KEY
      if (apiKey) {
        const { GoogleGenerativeAI } = await import('@google/generative-ai')
        const genAI = new GoogleGenerativeAI(apiKey)
        const modelName = process.env.AI_GEMINI_MODEL || 'gemini-1.5-pro'
        const model = genAI.getGenerativeModel({ model: modelName })
        const prompt = `${system}\n\n${user}\nGenera el cuerpo del artículo en MDX sin frontmatter.`
        const result = await model.generateContent(prompt)
        body = result?.response?.text() || ''
      } else {
        body = sampleBody(topic)
      }
    } else if (provider === 'openai') {
      const apiKey = process.env.OPENAI_API_KEY
      if (apiKey) {
        const { OpenAI } = await import('openai')
        const openai = new OpenAI({ apiKey })
        const completion = await openai.chat.completions.create({
          model: 'gpt-4.1-mini',
          temperature: 0.7,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user + '\nGenera el cuerpo del artículo en MDX sin frontmatter.' },
          ],
        })
        body = completion.choices?.[0]?.message?.content || ''
      } else {
        body = sampleBody(topic)
      }
    } else {
      body = sampleBody(topic)
    }
  } catch (e) {
    body = sampleBody(topic)
  }

  const title = proposeTitle(topic)
  const description = proposeDescription(body)

  const frontmatter = `---\n` +
    `title: ${escapeYaml(title)}\n` +
    `date: '${date}'\n` +
    `description: >-\n    ${escapeYaml(description)}\n` +
    `toc: true\n` +
    `tags:\n${tagsList.map(t => `    - ${escapeYaml(t)}`).join('\n')}\n` +
    `cover: '${cover}'\n` +
    `author: 'jaimetrdev'\n` +
    `---\n\n`

  const mdx = frontmatter + body.trim() + '\n'

  // Persistencia opcional en Supabase (si hay credenciales)
  try {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_ANON_KEY
    if (url && key) {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(url, key)
      await supabase.from('posts').insert({
        slug,
        title,
        description,
        date,
        cover,
        tags,
        author: 'jaimetrdev',
      })
    }
  } catch {}

  return { slug, mdx }
}

export function writePost({ slug, mdx }) {
  const outDir = path.join(process.cwd(), 'src', 'posts')
  const outFile = path.join(outDir, `${slug}.mdx`)
  fs.writeFileSync(outFile, mdx, 'utf-8')
  return outFile
}

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function escapeYaml(str) {
  return String(str).replace(/"/g, '\\"')
}

function inferTagsFromTopic(topic) {
  const base = ['desarrollo web', 'javascript', 'react', 'next.js', 'seo']
  if (/wordpress/i.test(topic)) base.push('wordpress')
  if (/tailwind/i.test(topic)) base.push('tailwindcss')
  if (/php|laravel/i.test(topic)) base.push('php', 'laravel')
  if (/ecommerce|tienda/i.test(topic)) base.push('ecommerce', 'performance')
  if (/ia|inteligencia\s*artificial|asistente/i.test(topic)) base.push('ia', 'gemini')
  return base
}

function proposeTitle(topic) {
  // Título breve optimizado
  const clean = topic.replace(/\.$/, '')
  return clean.length <= 60 ? clean : clean.slice(0, 57) + '…'
}

function proposeDescription(body) {
  const plain = body.replace(/\s+/g, ' ').trim()
  const max = 160
  return plain.length <= max ? plain : plain.slice(0, max - 1) + '…'
}

function sampleBody(topic) {
  return `## ${topic}\n\n` +
    `En este artículo exploramos ${topic} desde una perspectiva práctica, ` +
    `con enfoque en buenas prácticas, rendimiento y SEO.\n\n` +
    `### ¿Por qué es importante?\n` +
    `- Mejora la visibilidad en buscadores.\n` +
    `- Optimiza la experiencia del usuario.\n` +
    `- Alinea el contenido con objetivos de negocio.\n\n` +
    `### Ejemplo de implementación\n` +
    `\`\`\`js\n// Ejemplo ilustrativo\nexport function ejemplo() {\n  return 'Hola Mundo';\n}\n\`\`\`\n\n` +
    `### Conclusión\n` +
    `Si necesitas ayuda profesional para implementar ${topic} con alto impacto, ` +
    `contáctame para evaluar tu caso y proponer una solución a medida.`
}
