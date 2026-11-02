import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// None of the CLI scripts under scripts/ were loading .env.local (only migrate.mjs
// had its own manual parser). Every AI provider call silently ran with no API key,
// so generation always fell through to the canned fallback template. Node 20.6+
// supports loadEnvFile natively; do it once here since every script imports this module
// before making any provider call. Safe to skip if the file doesn't exist (e.g. CI/prod
// where env vars are injected by the platform instead).
try {
  process.loadEnvFile(path.join(process.cwd(), '.env.local'))
} catch {
  // no .env.local present — assume env vars are already set (CI/production)
}

// =============================================================================
// 0. PROVIDER RESOLUTION
// =============================================================================

// Picks the first provider that actually has a configured API key, instead of
// defaulting to 'gemini' regardless of what's set (silent fallback to canned content).
export function resolveDefaultProvider() {
  if (process.env.AI_PROVIDER) return process.env.AI_PROVIDER
  if (process.env.GROQ_API_KEY) return 'groq'
  if (process.env.GEMINI_API_KEY) return 'gemini'
  if (process.env.OPENAI_API_KEY) return 'openai'
  return 'groq'
}

// =============================================================================
// 1. SYSTEM PROMPT BUILDER
// =============================================================================

function buildSystemPrompt({ tone, titleForContent, audience, tagsList }) {
  return [
    'Eres Jaime Tarazona Rodriguez, Ingeniero de Software Senior con mas de 10 anos de experiencia.',
    'Stack tecnologico principal: Next.js, React, TypeScript, Node.js, Python, WordPress, Supabase, PostgreSQL, Docker.',
    'Areas de expertise: Desarrollo Full Stack, Arquitectura de Software, IA (LLMs, RAG, Agentes), Performance Web (Core Web Vitals), SEO Tecnico, DevOps, Automatizaciones.',
    '',
    'Tu tono es de mentor tecnico, hablas de ingeniero a ingeniero, en espanol neutro. Audiencia: ' + audience + '.',
    'Estilo: ' + tone + ', preciso, didactico, sin relleno ("fluff"). Ve directo al grano.',
    '',
    'ESTRUCTURA DEL ARTICULO (9 SECCIONES OBLIGATORIAS):',
    '1. Introduccion contextual (3-4 parrafos): El problema de ingenieria, su relevancia actual, contexto historico y por que es critico resolverlo hoy. Menciona metricas o datos del ecosistema si aplica.',
    '2. Fundamentos y Arquitectura (H2): Conceptos clave explicados en profundidad. Decisiones de diseno, trade-offs (ventajas/desventajas), diagramas conceptuales descritos en texto.',
    '3. Implementacion practica (H2): Paso a paso detallado con codigo REAL de produccion. Mostrar evolucion: de un enfoque naive/basico a uno optimizado/avanzado. Minimo 3 ejemplos de esta evolucion.',
    '4. Casos de uso reales (H2): 3-4 escenarios empresariales concretos con soluciones especificas. Explica el contexto del negocio, la solucion implementada y los resultados obtenidos.',
    '5. Escalabilidad y Performance (H2): Recomendaciones de rendimiento (Core Web Vitals, complejidad algoritmica Big O), seguridad, mantenibilidad, caching strategies, lazy loading, code splitting.',
    '6. Comparativas (H2): Tabla markdown comparando al menos 3 enfoques, librerias o arquitecturas. Columnas: Criterio, Opcion A, Opcion B, Opcion C. Explica cuando elegir cada una.',
    '7. Anti-patrones y Errores comunes (H2): 4-5 errores frecuentes en produccion, por que ocurren, como detectarlos y soluciones paso a paso con codigo correctivo.',
    '8. Recursos adicionales (H2): Documentacion oficial, repositorios relevantes, herramientas, comunidades. NO inventes URLs. Usa referencias genericas como "documentacion oficial de [herramienta]" o "repositorio oficial en GitHub".',
    '9. Conclusion (2-3 parrafos): Resumen ejecutivo de aprendizajes clave, siguientes pasos practicos y llamado a la accion sutil.',
    '',
    'REQUISITOS DE CONTENIDO:',
    '- Extension minima: 2000-3000 palabras. Articulo EXTENSO, profundo y muy tecnico.',
    '- 5-8 ejemplos de codigo REAL de produccion (TypeScript, React, Node.js, Python, SQL, bash). NADA de placeholders como "// TODO" o "[completar]".',
    '- Cada ejemplo debe ser COMPLETO: imports, tipos, manejo de errores, validaciones, export. Codigo que un ingeniero copiaria y usaria en produccion.',
    '- Mostrar EVOLUCION en los ejemplos: version inicial basica → version optimizada con mejoras explicadas.',
    '- Al menos 1 tabla comparativa en formato markdown (no HTML).',
    '- Explicar el "por que" detras de cada decision tecnica. No solo el "como", sino el razonamiento de ingenieria.',
    '- Usar H2 para secciones principales, H3 para subsecciones, H4 si es necesario.',
    '',
    'CODIGO DE EJEMPLO:',
    '- Todos los bloques de codigo con sintaxis markdown: ```typescript, ```javascript, ```python, ```bash, ```sql, ```yaml',
    '- Cada bloque debe tener minimo 15 lineas de codigo funcional.',
    '- Incluir comentarios en espanol que expliquen cada parte importante.',
    '- Mostrar patrones de diseno reales (Singleton, Factory, Observer, Repository, etc.) cuando aplique.',
    '- Codigo realista: usa nombres de variables descriptivos, constantes bien nombradas, estructura de proyecto real.',
    '',
    'FORMATO DE SALIDA (CRITICO):',
    '- Responde UNICAMENTE con el cuerpo del articulo en markdown, empezando directamente con "## 1. Introduccion contextual" (o el H2 que corresponda).',
    '- NO repitas el titulo como texto plano ni como H1 al inicio. NO incluyas una linea "Autor:". NO incluyas una seccion "Titulo SEO" ni "Meta-descripcion" dentro del cuerpo: esos van en el frontmatter, generados aparte, nunca como texto visible del articulo.',
    '',
    'SEO Y ENGAGEMENT:',
    '- Titulo optimizado para SEO, atractivo y descriptivo.',
    '- Descripcion 150-160 caracteres que resuma el valor tecnico del articulo.',
    '- Usa las palabras clave de manera natural, sin keyword stuffing.',
    '- Incluye llamado a la accion sutil al final.',
    '- Referencias a servicios: desarrollo full-stack, Next.js, IA, optimizacion, arquitectura cloud, WordPress.',
    '',
    'ALINEACION AL TITULO (CRITICO):',
    '- El contenido debe estar ESTRICTA y ABSOLUTAMENTE alineado con el titulo exacto: "' + titleForContent + '"',
    '- NO hables de temas fuera del alcance del titulo.',
    '- Manten el foco conceptual y semantico del titulo durante todo el articulo.',
    '- Cada seccion debe responder a una pregunta o necesidad que el titulo plantea.',
  ].join('\n')
}

function buildUserPrompt({ topic, titleForContent, audience, tagsList, brand }) {
  return [
    'Tema sugerido: ' + topic,
    '',
    'Titulo EXACTO a desarrollar: ' + titleForContent,
    '',
    'Audiencia: ' + audience,
    '',
    'Palabras clave: ' + tagsList.join(', '),
    '',
    'Autor: ' + brand,
    '',
    'IMPORTANTE: Eres Jaime Tarazona Rodriguez. Genera un articulo de ingenieria de software EXTENSO (minimo 2000-3000 palabras) en espanol neutro, estrictamente alineado con el titulo indicado. Usa un tono de mentor tecnico, habla de ingeniero a ingeniero. Incluye 5-8 ejemplos de codigo REAL de produccion con evolucion basico→optimizado, al menos 1 tabla comparativa markdown, casos de uso empresariales reales y analisis profundo de trade-offs. NO uses placeholders. Todo el codigo debe ser funcional y completo.',
  ].join('\n')
}

// =============================================================================
// 2. GROQ PROVIDER
// =============================================================================

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function generateWithGroq(system, user, maxTokens = 4000, retriesLeft = 3) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return null

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.AI_GROQ_MODEL || 'openai/gpt-oss-120b',
      temperature: 0.7,
      // This account's on_demand tier caps combined prompt+completion at 8000
      // tokens per minute; the system prompt alone runs ~1200-1500 tokens, so
      // max_tokens must leave headroom or every call 413s and silently falls
      // back to the canned template.
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })

  if (response.status === 429 && retriesLeft > 0) {
    const body = await response.text()
    const waitMatch = body.match(/try again in ([\d.]+)s/i)
    const waitMs = waitMatch ? Math.ceil(parseFloat(waitMatch[1]) * 1000) + 500 : 5000
    await sleep(waitMs)
    return generateWithGroq(system, user, maxTokens, retriesLeft - 1)
  }

  if (!response.ok) {
    throw new Error('Groq API error: ' + response.status + ' ' + (await response.text()))
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || null
}

// =============================================================================
// 3. GEMINI PROVIDER
// =============================================================================

async function generateWithGemini(system, user, maxTokens = 8000) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return null

  const { GoogleGenerativeAI } = await import('@google/generative-ai')
  const genAI = new GoogleGenerativeAI(apiKey)
  const modelName = process.env.AI_GEMINI_MODEL || 'gemini-1.5-pro'
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: maxTokens,
    },
  })

  const prompt = system + '\n\n' + user
  const result = await model.generateContent(prompt)
  return result?.response?.text() || null
}

// =============================================================================
// 4. OPENAI PROVIDER
// =============================================================================

async function generateWithOpenAI(system, user, maxTokens = 8000) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  const { OpenAI } = await import('openai')
  const openai = new OpenAI({ apiKey })

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    temperature: 0.7,
    max_tokens: maxTokens,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  })

  return completion.choices?.[0]?.message?.content || null
}

// =============================================================================
// 5. PROVIDER ROUTER
// =============================================================================

async function generateContent({ provider, system, user, topic, titleForContent, fallbackBody }) {
  let body = null

  if (provider === 'groq') {
    body = await generateWithGroq(system, user)
  } else if (provider === 'gemini') {
    body = await generateWithGemini(system, user)
  } else if (provider === 'openai') {
    body = await generateWithOpenAI(system, user)
  }

  if (!body) {
    body = fallbackBody
  }

  return body
}

// =============================================================================
// 6. MAIN EXPORTS
// =============================================================================

export async function generateBlogMdx({
  topic,
  tone = 'profesional',
  keywords = [],
  audience = 'desarrolladores y clientes tecnicos',
  brand = 'Jaime Tarazona',
  provider = resolveDefaultProvider(),
  titleOverride,
  customContent,
}) {
  const date = new Date().toISOString().slice(0, 10)
  const slug = slugify(topic)

  const tagsList = keywords.length ? keywords : inferTagsFromTopic(topic)
  const titleForContent = titleOverride ? String(titleOverride).trim() : proposeTitle(topic)

  const system = buildSystemPrompt({ tone, titleForContent, audience, tagsList })
  const user = buildUserPrompt({ topic, titleForContent, audience, tagsList, brand })

  let body = ''

  if (customContent && String(customContent).length > 200) {
    body = String(customContent).trim()
  } else {
    const fallbackBody = sampleBody(topic, titleForContent)
    try {
      body = await generateContent({
        provider,
        system,
        user,
        topic,
        titleForContent,
        fallbackBody,
      })
    } catch (error) {
      console.error('generateBlogMdx: AI generation failed, using fallback template:', error.message)
      body = fallbackBody
    }
  }

  const title = titleForContent
  // The model sometimes echoes "Titulo SEO / Autor / Meta-descripcion" as visible
  // prose before the real article starts despite the format instructions above.
  // Strip anything before the first real section heading so it never renders.
  const rawBody = body
  body = stripPreamble(rawBody)
  const description = proposeDescription(rawBody, body)

  const frontmatter =
    '---\n' +
    'title: ' + escapeYaml(title) + '\n' +
    'date: \'' + date + '\'\n' +
    'description: >-\n    ' + escapeYaml(description) + '\n' +
    'toc: true\n' +
    'tags:\n' + tagsList.map(t => '    - ' + escapeYaml(t)).join('\n') + '\n' +
    'cover: \'/images/og.png\'\n' +
    'author: \'jaimetrdev\'\n' +
    '---\n\n'

  const mdx = frontmatter + body + '\n'
  return { slug, mdx, title, description, date, tags: tagsList }
}

export function writePost({ slug, mdx, language = 'es' }) {
  const outDir = path.join(process.cwd(), 'src', 'posts')
  const extension = language === 'en' ? '.en.mdx' : '.mdx'
  const outFile = path.join(outDir, slug + extension)
  fs.writeFileSync(outFile, mdx, 'utf-8')
  return outFile
}

async function translateText(system, user, provider) {
  if (provider === 'groq') {
    if (!process.env.GROQ_API_KEY) return null
    return await generateWithGroq(system, user)
  } else if (provider === 'gemini') {
    return await generateWithGemini(system, user, 8000)
  } else if (provider === 'openai') {
    return await generateWithOpenAI(system, user, 8000)
  }
  return null
}

export async function generateEnglishVersion({ topic, mdx, provider = resolveDefaultProvider() }) {
  const frontmatterMatch = mdx.match(/^---([\s\S]*?)---/)
  const frontmatterBlock = frontmatterMatch ? frontmatterMatch[1] : ''
  const body = mdx.replace(/^---[\s\S]*?---/, '').trim()
  const data = matter(mdx).data

  const bodySystem = [
    'You are an expert technical translator specialized in software engineering and web development documentation.',
    'Your task is to translate a technical blog article from Spanish to English with professional, native-level quality.',
    'Maintain the exact structure, headers, code blocks, and formatting. Only translate text, descriptions, and inline comments.',
    'Use standard industry English terminology. Preserve all markdown formatting, code fences, and YAML blocks intact.',
    'Translate code comments to English but keep variable names, function names, and identifiers unchanged.',
    'Ensure the translated content reads naturally as if originally written in English by a Senior Software Engineer.',
  ].join('\n')

  const bodyUser = [
    'Translate the following technical web development article from Spanish to English. Keep all code blocks, YAML, and structure untouched. Only translate natural language content and code comments.',
    '',
    body,
  ].join('\n')

  let translatedBody = body
  let translatedTitle = data.title || ''
  let translatedDescription = data.description || ''

  try {
    const result = await translateText(bodySystem, bodyUser, provider)
    if (result) translatedBody = result
  } catch (error) {
    console.warn('Body translation failed with AI, using original content:', error.message)
  }

  // Frontmatter (title/description) was previously left untranslated, causing
  // the .en.mdx file to render Spanish text under a hreflang="en" URL.
  if (data.title || data.description) {
    try {
      const metaSystem = 'You are an expert technical translator. Translate the given JSON values from Spanish to English, professional native-level quality. Return ONLY valid JSON with the same keys, no commentary, no markdown fences.'
      const metaUser = JSON.stringify({ title: data.title || '', description: data.description || '' })
      const metaResult = await translateText(metaSystem, metaUser, provider)
      if (metaResult) {
        const cleaned = metaResult.trim().replace(/^```(json)?/i, '').replace(/```$/, '').trim()
        const parsed = JSON.parse(cleaned)
        if (parsed.title) translatedTitle = parsed.title
        if (parsed.description) translatedDescription = parsed.description
      }
    } catch (error) {
      console.warn('Frontmatter translation failed with AI, keeping original text:', error.message)
    }
  }

  const newData = { ...data }
  if (translatedTitle) newData.title = translatedTitle
  if (translatedDescription) newData.description = translatedDescription

  const englishMdx = matter.stringify(translatedBody.trim() + '\n', newData)
  return englishMdx
}

// =============================================================================
// 7. UTILITY FUNCTIONS
// =============================================================================

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
  const s = String(str)
  if (s.includes(':') || s.includes('#') || s.includes('-') || s.includes('\n') || s.includes('"')) {
    return "'" + s.replace(/'/g, "''") + "'"
  }
  return s
}

function inferTagsFromTopic(topic) {
  const topicLower = topic.toLowerCase()
  const tags = new Set()

  if (/react/i.test(topic)) tags.add('react')
  if (/next\.?js|nextjs/i.test(topic)) tags.add('next.js')
  if (/vue/i.test(topic)) tags.add('vue')
  if (/angular/i.test(topic)) tags.add('angular')
  if (/svelte/i.test(topic)) tags.add('svelte')
  if (/astro/i.test(topic)) tags.add('astro')

  if (/node\.?js|nodejs/i.test(topic)) tags.add('node.js')
  if (/express/i.test(topic)) tags.add('express')
  if (/php/i.test(topic)) tags.add('php')
  if (/laravel/i.test(topic)) tags.add('laravel')
  if (/wordpress/i.test(topic)) tags.add('wordpress')
  if (/django|python/i.test(topic)) tags.add('python')

  if (/javascript|js(?!\w)/i.test(topic)) tags.add('javascript')
  if (/typescript|ts(?!\w)/i.test(topic)) tags.add('typescript')

  if (/tailwind/i.test(topic)) tags.add('tailwind')
  if (/css/i.test(topic)) tags.add('css')
  if (/sass|scss/i.test(topic)) tags.add('sass')
  if (/styled[\s-]components/i.test(topic)) tags.add('styled-components')

  if (/mongodb|mongo/i.test(topic)) tags.add('mongodb')
  if (/postgres|postgresql/i.test(topic)) tags.add('postgresql')
  if (/mysql/i.test(topic)) tags.add('mysql')
  if (/prisma/i.test(topic)) tags.add('prisma')
  if (/supabase/i.test(topic)) tags.add('supabase')
  if (/firebase/i.test(topic)) tags.add('firebase')

  if (/seo/i.test(topic)) tags.add('seo')
  if (/performance|rendimiento|optimizacion/i.test(topic)) tags.add('performance')
  if (/seguridad|security/i.test(topic)) tags.add('seguridad')
  if (/testing|tests|pruebas/i.test(topic)) tags.add('testing')
  if (/api|rest|graphql/i.test(topic)) tags.add('api')
  if (/microservicios|microservices/i.test(topic)) tags.add('arquitectura')
  if (/monolito|mvc/i.test(topic)) tags.add('arquitectura')
  if (/deploy|deployment|despliegue/i.test(topic)) tags.add('devops')
  if (/docker|kubernetes/i.test(topic)) tags.add('devops')

  if (/ia|inteligencia\s*artificial|ai/i.test(topic)) tags.add('ia')
  if (/gemini|gpt|openai|chatgpt|llm|rag/i.test(topic)) tags.add('ia')
  if (/machine\s*learning|ml/i.test(topic)) tags.add('machine learning')

  if (/ecommerce|e-commerce|tienda|shop/i.test(topic)) tags.add('ecommerce')
  if (/stripe|paypal|pago/i.test(topic)) tags.add('pagos')

  if (/html/i.test(topic)) tags.add('html')
  if (/accesibilidad|accessibility|a11y/i.test(topic)) tags.add('accesibilidad')
  if (/responsive|adaptable/i.test(topic)) tags.add('responsive')
  if (/animacion|animation/i.test(topic)) tags.add('animaciones')

  if (/git/i.test(topic)) tags.add('git')
  if (/vscode|visual\s*studio\s*code/i.test(topic)) tags.add('herramientas')
  if (/webpack|vite|esbuild/i.test(topic)) tags.add('build-tools')

  if (tags.size < 3) {
    tags.add('desarrollo web')
  }

  if (/guia|tutorial|paso\s*a\s*paso|aprende|como/i.test(topic)) {
    tags.add('tutorial')
  }

  return Array.from(tags).slice(0, 6)
}

function proposeTitle(topic) {
  // Titles used to be hard-truncated at 60 chars with a trailing ellipsis,
  // producing broken mid-sentence titles like "...cu\u00e1ndo\u2026". Trust the caller's
  // topic/title text as-is; callers that need a shorter title should pass one.
  return topic.replace(/\.$/, '').trim()
}

function cleanPlainText(s) {
  return s
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`{1,3}(.+?)`{1,3}/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/>\s+/g, '')
    .replace(/[-*+]\s+/g, '')
    .replace(/\d+\.\s+/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function truncateAtBoundary(plain, max = 158) {
  if (plain.length <= max) return plain
  const cut = plain.slice(0, max)
  const lastDot = cut.lastIndexOf('.')
  const lastSpace = cut.lastIndexOf(' ')
  const boundary = lastDot > max * 0.6 ? lastDot : lastSpace
  const trimmed = cut.slice(0, boundary > 0 ? boundary : cut.length).trim()
  return trimmed.endsWith('.') ? trimmed : trimmed + '.'
}

// The model sometimes echoes "Titulo SEO / Autor / Meta-descripcion" as visible
// prose before the real article starts. Drop everything before the first real
// section heading so that preamble never renders on the page.
function stripPreamble(rawBody) {
  const firstHeadingIdx = rawBody.search(/^##\s+/m)
  if (firstHeadingIdx === -1) return rawBody.trim()
  return rawBody.slice(firstHeadingIdx).trim()
}

function proposeDescription(rawBody, cleanedBody = rawBody) {
  // Prefer whatever the model put after "Meta-descripcion" in a leaked preamble,
  // since that text was written to be a real 150-160 char summary, not filler.
  const metaMatch = rawBody.match(/Meta[\s\u2011-]?descripci[o\u00f3]n[^:]*:?\s*\n?\s*([^\n]+)/i)
  if (metaMatch) {
    const candidate = cleanPlainText(metaMatch[1]).replace(/^\*+|\*+$/g, '').trim()
    if (candidate.length > 40) return truncateAtBoundary(candidate)
  }
  const firstParagraph = cleanedBody
    .replace(/^---[\s\S]*?---/m, '')
    .split(/\n{2,}/)
    .find(p => p.trim().length > 60) || cleanedBody
  return truncateAtBoundary(cleanPlainText(firstParagraph))
}

function sampleBody(topic, title) {
  return '# ' + title + '\n\n' +
    '## Introduccion\n\n' +
    'Este articulo explora en profundidad ' + topic + ' desde la perspectiva de un Ingeniero de Software Senior con mas de 10 anos de experiencia en produccion. ' +
    'A diferencia de tutoriales superficiales, aqui encontraras fundamentos solidos, codigo real de produccion con manejo de errores y tipado estricto, ' +
    'analisis de trade-offs (ventajas y desventajas de cada decision tecnica), y casos de uso empresariales reales.\n\n' +
    '**Lo que aprenderas:**\n\n' +
    '- Fundamentos tecnicos y conceptos clave de ' + topic + '\n' +
    '- Implementacion practica: de codigo basico a solucion optimizada para produccion\n' +
    '- Casos de uso reales en entornos empresariales\n' +
    '- Mejores practicas de performance, seguridad y mantenibilidad\n' +
    '- Errores comunes en produccion y como solucionarlos\n\n' +
    '## Fundamentos y Arquitectura\n\n' +
    '### Conceptos Clave\n\n' +
    'Antes de escribir codigo, es fundamental entender los principios de arquitectura detras de ' + topic + '.\n\n' +
    '### Decisiones de diseno y trade-offs\n\n' +
    '**Ventajas principales:**\n' +
    '- Mayor mantenibilidad y escalabilidad del codigo\n' +
    '- Mejor experiencia de usuario y metricas de rendimiento\n' +
    '- Integracion nativa con el ecosistema JavaScript/TypeScript\n\n' +
    '**Desventajas a considerar:**\n' +
    '- Curva de aprendizaje inicial\n' +
    '- Puede requerir refactorizacion de codigo existente\n\n' +
    '### Comparativa de enfoques\n\n' +
    '| Criterio | Enfoque Basico | Enfoque Intermedio | Enfoque Avanzado |\n' +
    '|---|---|---|---|\n' +
    '| Complejidad | Baja | Media | Alta |\n' +
    '| Performance | Regular | Buena | Excelente |\n' +
    '| Mantenibilidad | Baja | Media | Alta |\n' +
    '| Escalabilidad | Limitada | Moderada | Alta |\n\n' +
    '## Implementacion Practica\n\n' +
    '### Version basica\n\n' +
    'Empecemos con una implementacion funcional pero simple:\n\n' +
    '```javascript\n' +
    'function procesarDatos(datos, opciones = {}) {\n' +
    '  if (!datos || !Array.isArray(datos)) {\n' +
    '    throw new Error("Se requiere un array de datos valido");\n' +
    '  }\n' +
    '  const resultados = [];\n' +
    '  for (const item of datos) {\n' +
    '    if (item.activo) {\n' +
    '      resultados.push(transformarItem(item));\n' +
    '    }\n' +
    '  }\n' +
    '  return resultados;\n' +
    '}\n' +
    '\n' +
    'function transformarItem(item) {\n' +
    '  return {\n' +
    '    id: item.id,\n' +
    '    nombre: item.nombre.toUpperCase(),\n' +
    '    fecha: new Date(item.timestamp),\n' +
    '  };\n' +
    '}\n' +
    '```\n\n' +
    '### Version optimizada para produccion\n\n' +
    '```typescript\n' +
    'interface DatosEntrada {\n' +
    '  id: string;\n' +
    '  nombre: string;\n' +
    '  activo: boolean;\n' +
    '  timestamp: number;\n' +
    '  metadata?: Record<string, unknown>;\n' +
    '}\n' +
    '\n' +
    'interface DatosProcesados {\n' +
    '  id: string;\n' +
    '  nombre: string;\n' +
    '  fecha: Date;\n' +
    '  metadata?: Record<string, unknown>;\n' +
    '}\n' +
    '\n' +
    'class ProcesadorDatos {\n' +
    '  private cache = new Map<string, DatosProcesados>();\n' +
    '  private readonly cacheTTL: number;\n' +
    '\n' +
    '  constructor(cacheTTL = 300000) {\n' +
    '    this.cacheTTL = cacheTTL;\n' +
    '  }\n' +
    '\n' +
    '  procesar(datos: DatosEntrada[]): DatosProcesados[] {\n' +
    '    if (!datos?.length) return [];\n' +
    '    return datos\n' +
    '      .filter(item => item.activo)\n' +
    '      .map(item => this.transformarConCache(item));\n' +
    '  }\n' +
    '\n' +
    '  private transformarConCache(item: DatosEntrada): DatosProcesados {\n' +
    '    const cacheado = this.cache.get(item.id);\n' +
    '    if (cacheado) return cacheado;\n' +
    '    const procesado: DatosProcesados = {\n' +
    '      id: item.id,\n' +
    '      nombre: item.nombre.toUpperCase(),\n' +
    '      fecha: new Date(item.timestamp),\n' +
    '      metadata: item.metadata,\n' +
    '    };\n' +
    '    this.cache.set(item.id, procesado);\n' +
    '    return procesado;\n' +
    '  }\n' +
    '}\n' +
    '```\n\n' +
    '## Casos de Uso Reales\n\n' +
    '### Caso 1: Dashboard de monitoreo en tiempo real\n\n' +
    'En un proyecto para una fintech, implementamos ' + topic + ' para procesar mas de 100,000 transacciones por minuto con latencia menor a 50ms.\n\n' +
    '### Caso 2: E-commerce con alto trafico\n\n' +
    'Una tienda online con 500,000 productos optimizo su renderizado usando las tecnicas descritas, mejorando el LCP en un 40%.\n\n' +
    '### Caso 3: API Gateway empresarial\n\n' +
    'Implementacion de rate limiting, caching distribuido y circuit breaker para una API que sirve a 50 microservicios.\n\n' +
    '## Escalabilidad y Performance\n\n' +
    '**Metricas objetivo:**\n' +
    '- LCP < 2.5s\n' +
    '- FID < 100ms\n' +
    '- CLS < 0.1\n\n' +
    '## Anti-patrones y Errores Comunes\n\n' +
    '1. **Ignorar el manejo de errores**: No usar try/catch en operaciones asincronas\n' +
    '2. **No implementar caching**: Consultar la misma fuente de datos repetidamente\n' +
    '3. **Mutacion de estado global**: Causa bugs dificiles de rastrear en produccion\n' +
    '4. **Code splitting ausente**: Bundles de +500KB que degradan el rendimiento inicial\n\n' +
    '## Conclusion\n\n' +
    'Dominar ' + topic + ' requiere practica constante y exposicion a problemas reales de produccion. ' +
    'Las tecnicas avanzadas presentadas aqui son el resultado de anos de iteracion en proyectos empresariales.\n\n' +
    '> Si necesitas ayuda implementando ' + topic + ' en tu proyecto o requieres consultoria especializada, contactame para explorar como podemos trabajar juntos.\n'
}
