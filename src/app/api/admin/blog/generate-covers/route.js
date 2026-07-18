import { NextResponse } from 'next/server'
import { validateAdminRequest } from '@/lib/auth'

let _sharp
async function getSharpModule() {
  if (!_sharp) _sharp = (await import('sharp')).default
  return _sharp
}

export const dynamic = 'force-dynamic'



const WIDTH = 1200
const HEIGHT = 630

function buildPrompt(title, tags, style) {
  const topic = `${title} ${tags.join(' ')}`
  const keywords = extractKeywords(topic)

  const styles = {
    neon: `${keywords}, cyberpunk neon coding setup, vibrant purple cyan pink neon glow, dark background, dual monitors with glowing code, mechanical keyboard RGB, synthwave aesthetic, volumetric lighting, no text no watermark no letters`,
    dark: `${keywords}, dark futuristic developer workspace, holographic code projections, deep blue and teal ambient lighting, sleek modern desk, ultra detailed 8k, professional tech aesthetic, wide composition with negative space on sides, no text no watermark no letters`,
    abstract: `${keywords}, abstract futuristic technology network, glowing data streams, neon grid perspective, purple blue orange gradient, geometric low poly shapes, dark tech background, clean centered composition with border space, no text no watermark no letters`,
  }

  return styles[style] || styles.neon
}

function extractKeywords(text) {
  const lower = text.toLowerCase()
  const k = []

  if (/react|next\.?js|nextjs/i.test(lower)) k.push('React development')
  if (/node\.?js|nodejs/i.test(lower)) k.push('Node.js server')
  if (/typescript|ts\b/i.test(lower)) k.push('TypeScript programming')
  if (/python/i.test(lower)) k.push('Python coding')
  if (/docker/i.test(lower)) k.push('Docker containers')
  if (/kubernetes/i.test(lower)) k.push('Kubernetes orchestration')
  if (/ia|inteligencia artificial|llm|rag|agente/i.test(lower)) k.push('artificial intelligence')
  if (/api|rest|graphql/i.test(lower)) k.push('API backend')
  if (/performance|rendimiento|core web vitals|optimizacion/i.test(lower)) k.push('web performance')
  if (/seo/i.test(lower)) k.push('SEO optimization')
  if (/seguridad|security/i.test(lower)) k.push('cybersecurity')
  if (/devops|ci.cd|deploy/i.test(lower)) k.push('DevOps pipeline')
  if (/wordpress/i.test(lower)) k.push('WordPress development')
  if (/base de datos|database|sql|postgres|mysql|supabase/i.test(lower)) k.push('database architecture')
  if (/testing|test|pruebas/i.test(lower)) k.push('software testing')
  if (/microservicios|microservices|arquitectura/i.test(lower)) k.push('microservices')
  if (/automatizacion|n8n|workflow/i.test(lower)) k.push('automation')
  if (/ecommerce|e-commerce/i.test(lower)) k.push('ecommerce platform')
  if (/tailwind|css|sass|scss/i.test(lower)) k.push('web design')
  if (/webpack|vite|esbuild/i.test(lower)) k.push('build tools')
  if (/responsive|mobile|movil/i.test(lower)) k.push('mobile development')
  if (/animacion|animation|gsap|framer/i.test(lower)) k.push('motion design')

  return k.length ? k.join(', ') : 'software engineering coding'
}

function renderTitleOverlay(title, style) {
  const safeTitle = String(title).slice(0, 100)
  const fontSize = safeTitle.length > 60 ? 36 : safeTitle.length > 40 ? 42 : 48
  const lineHeight = fontSize + 12
  const words = safeTitle.split(' ')
  let line1 = ''
  let line2 = ''
  let currentLine = ''

  for (const word of words) {
    if ((currentLine + ' ' + word).length > 40 && line1) {
      line2 = line2 ? line2 + ' ' + word : word
    } else if ((currentLine + ' ' + word).length > 40) {
      line2 = word
    } else {
      line1 = line1 ? line1 + ' ' + word : word
    }
  }

  const hasSubtitle = !!line2
  const startY = hasSubtitle ? HEIGHT / 2 - lineHeight / 2 - 8 : HEIGHT / 2 + 8

  const themes = {
    neon: { primary: '#ff00ff', secondary: '#00ffff', glow: '#ff00ff', bgStart: 'rgba(10,5,30,0.8)', bgEnd: 'rgba(5,2,15,0.9)' },
    dark: { primary: '#00d4ff', secondary: '#60a5fa', glow: '#00d4ff', bgStart: 'rgba(5,15,30,0.8)', bgEnd: 'rgba(2,8,18,0.9)' },
    abstract: { primary: '#a855f7', secondary: '#fb923c', glow: '#a855f7', bgStart: 'rgba(15,5,25,0.8)', bgEnd: 'rgba(8,2,15,0.9)' },
  }

  const t = themes[style] || themes.neon

  return `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1"/>
      <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur2"/>
      <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur3"/>
      <feMerge>
        <feMergeNode in="blur3"/>
        <feMergeNode in="blur2"/>
        <feMergeNode in="blur1"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <linearGradient id="textGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${t.primary}"/>
      <stop offset="50%" stop-color="${t.secondary}"/>
      <stop offset="100%" stop-color="${t.primary}"/>
    </linearGradient>
    <linearGradient id="bgOverlay" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${t.bgStart}"/>
      <stop offset="100%" stop-color="${t.bgEnd}"/>
    </linearGradient>
  </defs>

  <!-- Background overlay for readability -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgOverlay)"/>

  <!-- Left decorative bar -->
  <rect x="60" y="${startY - 30}" width="4" height="${hasSubtitle ? 100 : 70}" rx="2" fill="${t.primary}" opacity="0.6"/>
  <rect x="60" y="${startY - 30}" width="4" height="${hasSubtitle ? 100 : 70}" rx="2" fill="${t.primary}" filter="url(#neonGlow)" opacity="0.4"/>

  <!-- Right decorative bar -->
  <rect x="${WIDTH - 64}" y="${startY - 30}" width="4" height="${hasSubtitle ? 100 : 70}" rx="2" fill="${t.primary}" opacity="0.6"/>
  <rect x="${WIDTH - 64}" y="${startY - 30}" width="4" height="${hasSubtitle ? 100 : 70}" rx="2" fill="${t.primary}" filter="url(#neonGlow)" opacity="0.4"/>

  <!-- Title line 1 -->
  <text x="${WIDTH / 2}" y="${startY}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="${fontSize}" font-weight="800" fill="url(#textGrad)" filter="url(#neonGlow)" letter-spacing="-1">${line1}</text>

  ${line2 ? `<text x="${WIDTH / 2}" y="${startY + lineHeight}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="${fontSize}" font-weight="800" fill="url(#textGrad)" filter="url(#neonGlow)" letter-spacing="-1">${line2}</text>` : ''}

  <!-- Branding line -->
  <text x="${WIDTH / 2}" y="${HEIGHT - 50}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="18" fill="${t.secondary}" opacity="0.7" letter-spacing="3" font-weight="600">JAIMETR.DEV</text>

  <!-- Top decorative dots -->
  <circle cx="${WIDTH / 2}" cy="30" r="3" fill="${t.primary}" opacity="0.5"/>
  <circle cx="${WIDTH / 2 - 80}" cy="30" r="2" fill="${t.primary}" opacity="0.3"/>
  <circle cx="${WIDTH / 2 + 80}" cy="30" r="2" fill="${t.primary}" opacity="0.3"/>
</svg>`
}

async function fetchAIImage(prompt, seed) {
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${WIDTH}&height=${HEIGHT}&seed=${seed}&nologo=true&enhance=true`
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) })
  if (!response.ok) throw new Error(`Pollinations API error: ${response.status}`)
  const arrayBuffer = await response.arrayBuffer()
  return (await getSharpModule())(Buffer.from(arrayBuffer))
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'center' })
    .webp({ quality: 88 })
    .toBuffer()
}

function generateFallbackBg(title, styleIndex) {
  const palettes = [
    { bg1: '#0a0020', bg2: '#150030', bg3: '#0d0040', accent: '#ff00ff', accent2: '#00ffff' },
    { bg1: '#001020', bg2: '#001830', bg3: '#002040', accent: '#00d4ff', accent2: '#60a5fa' },
    { bg1: '#100020', bg2: '#180030', bg3: '#0a0030', accent: '#a855f7', accent2: '#fb923c' },
  ]
  const p = palettes[styleIndex] || palettes[0]
  const seed = Math.floor(Math.random() * 9999)
  const cx1 = 300 + (seed % 500)
  const cy1 = 200 + ((seed * 3) % 300)
  const cx2 = 800 + ((seed * 7) % 300)
  const cy2 = 350 + ((seed * 5) % 200)

  return `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${p.bg1}"/>
      <stop offset="50%" stop-color="${p.bg2}"/>
      <stop offset="100%" stop-color="${p.bg3}"/>
    </linearGradient>
    <radialGradient id="g1"><stop offset="0%" stop-color="${p.accent}" stop-opacity="0.35"/><stop offset="100%" stop-color="${p.accent}" stop-opacity="0"/></radialGradient>
    <radialGradient id="g2"><stop offset="0%" stop-color="${p.accent2}" stop-opacity="0.25"/><stop offset="100%" stop-color="${p.accent2}" stop-opacity="0"/></radialGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="8"/></filter>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <circle cx="${cx1}" cy="${cy1}" r="280" fill="url(#g1)"/>
  <circle cx="${cx2}" cy="${cy2}" r="220" fill="url(#g2)"/>
  <g opacity="0.08" stroke="${p.accent}" stroke-width="1">
    ${Array.from({ length: 22 }, (_, i) => `<line x1="${i * 58}" y1="0" x2="${i * 58 + 40}" y2="${HEIGHT}"/>`).join('')}
    ${Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="${i * 58}" x2="${WIDTH}" y2="${i * 58 + 30}"/>`).join('')}
  </g>
  <g opacity="0.2">
    <circle cx="${cx1 + 60}" cy="${cy1 - 40}" r="3" fill="${p.accent}" filter="url(#glow)"/>
    <circle cx="${cx1 - 80}" cy="${cy1 + 50}" r="2" fill="${p.accent}" filter="url(#glow)"/>
    <circle cx="${cx2 + 40}" cy="${cy2 - 60}" r="4" fill="${p.accent2}" filter="url(#glow)"/>
    <circle cx="${WIDTH - 120}" cy="${150 + (seed % 300)}" r="2" fill="${p.accent}" filter="url(#glow)"/>
    <circle cx="${100 + (seed % 300)}" cy="${HEIGHT - 120}" r="3" fill="${p.accent2}" filter="url(#glow)"/>
  </g>
</svg>`
}

export async function POST(request) {
  try {
    if (!validateAdminRequest(request)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { title, tags = [] } = body

    if (!title) {
      return NextResponse.json({ error: 'El titulo es requerido' }, { status: 400 })
    }

    const styleKeys = ['neon', 'dark', 'abstract']
    const styleNames = ['Cyberpunk Neon', 'Tech Oscuro', 'Abstracto Futurista']
    const variants = []

    for (let i = 0; i < 3; i++) {
      try {
        const prompt = buildPrompt(title, tags, styleKeys[i])
        const seed = Math.floor(Math.random() * 99999) + i * 10000
        const bgBuffer = await fetchAIImage(prompt, seed)
        const overlaySvg = renderTitleOverlay(title, styleKeys[i])
        const overlayBuffer = Buffer.from(overlaySvg)

        const composed = await (await getSharpModule())(bgBuffer)
          .composite([{ input: overlayBuffer, top: 0, left: 0 }])
          .webp({ quality: 85 })
          .toBuffer()

        variants.push({
          id: i + 1,
          image: `data:image/webp;base64,${composed.toString('base64')}`,
          name: styleNames[i],
        })
      } catch (aiError) {
        console.warn(`Cover variant ${i + 1} AI failed, using fallback:`, aiError.message)
        try {
          const fallbackBg = generateFallbackBg(title, i)
          const overlaySvg = renderTitleOverlay(title, styleKeys[i])

          const composed = await (await getSharpModule())(Buffer.from(fallbackBg), { density: 100 })
            .composite([{ input: Buffer.from(overlaySvg), top: 0, left: 0 }])
            .webp({ quality: 80 })
            .toBuffer()

          variants.push({
            id: i + 1,
            image: `data:image/webp;base64,${composed.toString('base64')}`,
            name: styleNames[i] + ' (SVG)',
          })
        } catch (svgError) {
          console.error(`Fallback also failed:`, svgError)
        }
      }
    }

    return NextResponse.json({ success: true, data: { variants } })
  } catch (error) {
    console.error('Error generando portadas:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
