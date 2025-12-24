import fs from 'fs'
import path from 'path'

// Estructura ESM para uso desde CLI
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

  const tagsList = keywords.length ? keywords : inferTagsFromTopic(topic)
  const system = [
    'Eres un redactor técnico senior y experto en SEO especializado en desarrollo web con más de 10 años de experiencia.',
    'Escribe en español neutro, tono ' + tone + ', preciso, didáctico y muy detallado.',
    '',
    'ESTRUCTURA DEL ARTÍCULO (OBLIGATORIO):',
    '1. Introducción contextual (2-3 párrafos): Explica el problema, su relevancia y por qué es importante.',
    '2. Fundamentos técnicos (sección H2): Conceptos clave, terminología, bases teóricas.',
    '3. Implementación práctica (sección H2): Paso a paso detallado con ejemplos de código completos y comentados.',
    '4. Casos de uso reales (sección H2): 3-4 escenarios del mundo real con soluciones específicas.',
    '5. Mejores prácticas (sección H2): Recomendaciones de performance, seguridad, mantenibilidad.',
    '6. Comparativas (sección H2 si aplica): Comparar enfoques, librerías o frameworks alternativos.',
    '7. Errores comunes (sección H2): 4-5 errores frecuentes y cómo evitarlos.',
    '8. Recursos adicionales (sección H2): Enlaces a documentación oficial, herramientas, repos.',
    '9. Conclusión (2 párrafos): Resumen de puntos clave y siguientes pasos.',
    '',
    'REQUISITOS DE CONTENIDO:',
    '- Extensión mínima: 1500-2000 palabras (artículo extenso y completo)',
    '- Incluir 4-6 ejemplos de código con sintaxis correcta (JavaScript/TypeScript/PHP según el tema)',
    '- Cada ejemplo de código debe tener comentarios explicativos detallados',
    '- Usar encabezados H2 para secciones principales, H3 para subsecciones',
    '- Incluir listas numeradas para pasos, listas con bullets para conceptos',
    '- Agregar tablas comparativas cuando sea relevante (sintaxis markdown)',
    '- Incluir al menos 3 bloques de código con diferentes enfoques/soluciones',
    '- Explicar el "por qué" detrás de cada decisión técnica, no solo el "cómo"',
    '',
    'CÓDIGO DE EJEMPLO:',
    '- Todos los bloques de código deben usar sintaxis markdown: ```javascript, ```typescript, ```php, ```bash',
    '- Código completo funcional, no fragmentos incompletos',
    '- Incluir comentarios inline que expliquen lógica compleja',
    '- Mostrar diferentes niveles de implementación: básico, intermedio, avanzado',
    '',
    'SECCIONES OBLIGATORIAS:',
    '- "¿Por qué es importante?" (subsección H3 en intro)',
    '- "Prerequisitos" (qué debe saber el lector antes de continuar)',
    '- "Ventajas y desventajas" (análisis balanceado)',
    '- "Performance y optimización" (benchmarks, tips de velocidad)',
    '- "Compatibilidad y soporte" (browsers, versiones, polyfills)',
    '',
    'SEO Y ENGAGEMENT:',
    '- Título optimizado <60 caracteres, atractivo y descriptivo',
    '- Descripción 150-160 caracteres que resuma el valor del artículo',
    '- Usar keywords naturalmente en títulos, subtítulos y primeros párrafos',
    '- Incluir llamados a la acción sutiles: "Si necesitas ayuda implementando [tema], contáctame para asesoría especializada"',
    '- Referencias a servicios: desarrollo web, optimización, WordPress, Next.js, consultoría técnica',
    '',
    'ESTILO DE ESCRITURA:',
    '- Usa ejemplos del mundo real que los desarrolladores reconozcan',
    '- Explica conceptos complejos con analogías simples',
    '- Evita jerga innecesaria, pero usa terminología técnica correcta',
    '- Incluye "Pro Tips" o "⚡ Tip" para destacar consejos avanzados',
    '- Usa emojis sutilmente para mejorar lectura: ✅ ❌ ⚠️ 💡 🚀',
  ].join('\n')
  const user = `Tema: ${topic}\n\nAudiencia: ${audience}\n\nPalabras clave principales: ${tagsList.join(', ')}\n\nMarca/Autor: ${brand}\n\nIMPORTANTE: Genera un artículo EXTENSO y COMPLETO de al menos 1500 palabras. Profundiza en cada sección, incluye múltiples ejemplos de código, casos de uso variados, y análisis detallado. El artículo debe ser una referencia completa sobre el tema.`

  let body = ''
  try {
    if (provider === 'gemini') {
      const apiKey = process.env.GEMINI_API_KEY
      if (apiKey) {
        const { GoogleGenerativeAI } = await import('@google/generative-ai')
        const genAI = new GoogleGenerativeAI(apiKey)
        const modelName = process.env.AI_GEMINI_MODEL || 'gemini-1.5-pro'
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8000, // Incrementado para artículos extensos
          },
        })
        const prompt = `${system}\n\n${user}\n\nGenera el cuerpo completo del artículo en formato MDX sin frontmatter. El artículo debe ser EXTENSO (mínimo 1500 palabras), con todas las secciones mencionadas, múltiples ejemplos de código bien comentados, casos de uso reales y análisis profundo de cada aspecto técnico.`
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
          model: 'gpt-4-turbo-preview',
          temperature: 0.7,
          max_tokens: 4000, // Incrementado para contenido más extenso
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user + '\n\nGenera el cuerpo completo del artículo en formato MDX sin frontmatter. Asegúrate de incluir todas las secciones requeridas con profundidad y múltiples ejemplos de código.' },
          ],
        })
        body = completion.choices?.[0]?.message?.content || ''
      } else {
        body = sampleBody(topic)
      }
    } else {
      body = sampleBody(topic)
    }
  } catch {
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
    `cover: '/images/og.png'\n` +
    `author: 'jaimetrdev'\n` +
    `---\n\n`

  const mdx = frontmatter + body.trim() + '\n'
  return { slug, mdx, title, description, date, tags: tagsList }
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

function escapeYaml(str) { return String(str).replace(/"/g, '\\"') }

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
  const clean = topic.replace(/\.$/, '')
  return clean.length <= 60 ? clean : clean.slice(0, 57) + '…'
}

function proposeDescription(body) {
  const plain = body.replace(/\s+/g, ' ').trim()
  const max = 160
  return plain.length <= max ? plain : plain.slice(0, max - 1) + '…'
}

function sampleBody(topic) {
  return `## Introducción a ${topic}\n\n` +
    `En el desarrollo web moderno, ${topic} se ha convertido en un aspecto fundamental que todo desarrollador debe dominar. ` +
    `Este artículo explora de manera exhaustiva todos los aspectos relacionados con ${topic}, desde los fundamentos básicos ` +
    `hasta técnicas avanzadas de implementación.\n\n` +
    `En las siguientes secciones, abordaremos:\n` +
    `- Fundamentos teóricos y conceptos clave\n` +
    `- Implementación práctica paso a paso\n` +
    `- Casos de uso del mundo real\n` +
    `- Mejores prácticas y optimizaciones\n` +
    `- Errores comunes y cómo evitarlos\n\n` +
    `### ¿Por qué es importante ${topic}?\n\n` +
    `La importancia de ${topic} radica en varios factores críticos:\n\n` +
    `1. **Mejora la experiencia del usuario**: Implementar ${topic} correctamente resulta en una mejor UX.\n` +
    `2. **Optimiza el rendimiento**: Reduce tiempos de carga y mejora métricas de performance.\n` +
    `3. **Aumenta la visibilidad SEO**: Los buscadores priorizan sitios que implementan ${topic} adecuadamente.\n` +
    `4. **Facilita el mantenimiento**: Código bien estructurado es más fácil de mantener a largo plazo.\n\n` +
    `## Fundamentos Técnicos\n\n` +
    `Antes de profundizar en la implementación, es crucial entender los conceptos fundamentales:\n\n` +
    `### Conceptos Clave\n\n` +
    `**Definición**: ${topic} se refiere a [concepto técnico relevante al tema].\n\n` +
    `**Componentes principales**:\n` +
    `- Configuración inicial y setup\n` +
    `- Estructura de datos y patrones de diseño\n` +
    `- Integración con otras tecnologías\n` +
    `- Testing y validación\n\n` +
    `### Prerequisitos\n\n` +
    `Para seguir este tutorial, necesitas:\n` +
    `- Conocimientos básicos de JavaScript/TypeScript\n` +
    `- Familiaridad con el ecosistema de Node.js\n` +
    `- Editor de código (VS Code recomendado)\n` +
    `- Terminal/línea de comandos\n\n` +
    `## Implementación Práctica\n\n` +
    `Vamos a implementar ${topic} paso a paso con ejemplos completos y funcionales.\n\n` +
    `### Paso 1: Configuración Inicial\n\n` +
    `Primero, configuramos el entorno básico:\n\n` +
    `\`\`\`bash\n` +
    `# Instalar dependencias necesarias\n` +
    `npm install --save-dev [paquetes-relevantes]\n\n` +
    `# Inicializar configuración\n` +
    `npx [herramienta] init\n` +
    `\`\`\`\n\n` +
    `### Paso 2: Implementación Básica\n\n` +
    `\`\`\`javascript\n` +
    `// Ejemplo básico de implementación\n` +
    `export function implementacionBasica() {\n` +
    `  // Configuración inicial\n` +
    `  const config = {\n` +
    `    opcion1: true,\n` +
    `    opcion2: 'valor',\n` +
    `    // Más opciones...\n` +
    `  };\n\n` +
    `  // Lógica principal\n` +
    `  return procesarDatos(config);\n` +
    `}\n\n` +
    `function procesarDatos(config) {\n` +
    `  // Implementación detallada\n` +
    `  console.log('Procesando con:', config);\n` +
    `  return { exito: true, data: [] };\n` +
    `}\n` +
    `\`\`\`\n\n` +
    `### Paso 3: Implementación Avanzada\n\n` +
    `Para casos más complejos, podemos usar un enfoque más robusto:\n\n` +
    `\`\`\`javascript\n` +
    `// Implementación avanzada con manejo de errores\n` +
    `class GestorAvanzado {\n` +
    `  constructor(opciones = {}) {\n` +
    `    this.config = { ...opcionesPorDefecto, ...opciones };\n` +
    `    this.inicializar();\n` +
    `  }\n\n` +
    `  inicializar() {\n` +
    `    // Setup inicial\n` +
    `    this.validarConfiguracion();\n` +
    `    this.prepararRecursos();\n` +
    `  }\n\n` +
    `  async ejecutar() {\n` +
    `    try {\n` +
    `      const resultado = await this.procesamientoAsincrono();\n` +
    `      return this.formatearResultado(resultado);\n` +
    `    } catch (error) {\n` +
    `      this.manejarError(error);\n` +
    `      throw error;\n` +
    `    }\n` +
    `  }\n\n` +
    `  validarConfiguracion() {\n` +
    `    // Validaciones necesarias\n` +
    `    if (!this.config.required) {\n` +
    `      throw new Error('Configuración incompleta');\n` +
    `    }\n` +
    `  }\n` +
    `}\n` +
    `\`\`\`\n\n` +
    `## Casos de Uso Reales\n\n` +
    `Veamos cómo aplicar ${topic} en escenarios del mundo real:\n\n` +
    `### Caso 1: Aplicación E-commerce\n\n` +
    `En una tienda online, ${topic} se usa para optimizar el checkout:\n\n` +
    `\`\`\`javascript\n` +
    `// Implementación para e-commerce\n` +
    `async function procesarPedido(carrito, usuario) {\n` +
    `  // Validar stock disponible\n` +
    `  const stockValido = await validarInventario(carrito);\n` +
    `  \n` +
    `  if (!stockValido) {\n` +
    `    throw new Error('Productos sin stock');\n` +
    `  }\n\n` +
    `  // Calcular total con impuestos\n` +
    `  const total = calcularTotal(carrito, usuario.ubicacion);\n` +
    `  \n` +
    `  // Procesar pago\n` +
    `  return await procesarPago(total, usuario.metodoPago);\n` +
    `}\n` +
    `\`\`\`\n\n` +
    `### Caso 2: Dashboard Analítico\n\n` +
    `Para dashboards, ${topic} mejora la visualización de datos en tiempo real.\n\n` +
    `### Caso 3: API REST\n\n` +
    `En APIs, ${topic} optimiza el manejo de solicitudes y respuestas.\n\n` +
    `## Mejores Prácticas\n\n` +
    `### Performance y Optimización\n\n` +
    `✅ **Hacer**:\n` +
    `- Cachear resultados cuando sea posible\n` +
    `- Usar lazy loading para recursos pesados\n` +
    `- Implementar paginación en listas grandes\n` +
    `- Monitorear métricas de rendimiento\n\n` +
    `❌ **Evitar**:\n` +
    `- Cargar datos innecesarios\n` +
    `- Múltiples re-renders\n` +
    `- Bloquear el thread principal\n` +
    `- Ignorar memory leaks\n\n` +
    `### Seguridad\n\n` +
    `💡 **Pro Tip**: Siempre valida y sanitiza inputs del usuario.\n\n` +
    `\`\`\`javascript\n` +
    `// Validación de entrada segura\n` +
    `function sanitizarInput(input) {\n` +
    `  return input\n` +
    `    .trim()\n` +
    `    .replace(/[<>]/g, '') // Prevenir XSS\n` +
    `    .slice(0, 1000); // Limitar tamaño\n` +
    `}\n` +
    `\`\`\`\n\n` +
    `## Errores Comunes y Soluciones\n\n` +
    `### Error 1: No manejar estados de carga\n\n` +
    `**Problema**: La UI se congela mientras se cargan datos.\n\n` +
    `**Solución**: Implementar estados de loading:\n\n` +
    `\`\`\`javascript\n` +
    `const [loading, setLoading] = useState(false);\n` +
    `const [data, setData] = useState(null);\n\n` +
    `async function cargarDatos() {\n` +
    `  setLoading(true);\n` +
    `  try {\n` +
    `    const resultado = await fetch('/api/data');\n` +
    `    setData(resultado);\n` +
    `  } finally {\n` +
    `    setLoading(false);\n` +
    `  }\n` +
    `}\n` +
    `\`\`\`\n\n` +
    `### Error 2: Ignorar compatibilidad de navegadores\n\n` +
    `**Problema**: Código que solo funciona en Chrome.\n\n` +
    `**Solución**: Usar polyfills y feature detection.\n\n` +
    `### Error 3: No optimizar para móviles\n\n` +
    `**Problema**: La experiencia en móvil es deficiente.\n\n` +
    `**Solución**: Diseño responsive y touch-friendly desde el inicio.\n\n` +
    `## Recursos Adicionales\n\n` +
    `Para profundizar más en ${topic}, consulta:\n\n` +
    `- 📚 Documentación oficial\n` +
    `- 🛠️ Herramientas de desarrollo recomendadas\n` +
    `- 💻 Repositorios de ejemplo en GitHub\n` +
    `- 🎓 Cursos y tutoriales avanzados\n\n` +
    `## Conclusión\n\n` +
    `${topic} es una habilidad esencial en el desarrollo web moderno. A lo largo de este artículo, hemos cubierto:\n\n` +
    `- Fundamentos teóricos y conceptos clave\n` +
    `- Implementación práctica con ejemplos completos\n` +
    `- Casos de uso del mundo real\n` +
    `- Mejores prácticas de performance y seguridad\n` +
    `- Errores comunes y cómo evitarlos\n\n` +
    `La clave está en practicar constantemente y mantenerse actualizado con las últimas tendencias del ecosistema.\n\n` +
    `### Próximos Pasos\n\n` +
    `1. Implementa los ejemplos en tu propio proyecto\n` +
    `2. Experimenta con diferentes configuraciones\n` +
    `3. Mide el impacto en performance\n` +
    `4. Comparte tus resultados con la comunidad\n\n` +
    `Si necesitas ayuda profesional para implementar ${topic} en tu proyecto, o requieres consultoría especializada en desarrollo web, ` +
    `optimización de performance, arquitectura de aplicaciones o integración de nuevas tecnologías, no dudes en contactarme. ` +
    `Ofrezco servicios de desarrollo full-stack con React, Next.js, WordPress, y soluciones personalizadas para cada necesidad.`
}
