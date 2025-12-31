import { NextResponse } from 'next/server'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs'

// Validar token de administrador
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin123'

function validateAdminToken(request) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  return token === ADMIN_TOKEN
}

const WIDTH = 1200
const HEIGHT = 630

// Utilidad: elegir logos según tema/tags
function pickStackIcons(title, tags = []) {
  const key = `${title} ${tags.join(' ')}`.toLowerCase()
  const map = [
    { re: /(react|next)/, file: 'reactjs.png' },
    { re: /(next)/, file: 'next-js.png' },
    { re: /(node|express)/, file: 'nodejs.png' },
    { re: /(php|laravel)/, file: 'php.png' },
    { re: /(mysql)/, file: 'mysql.png' },
    { re: /(mongo)/, file: 'mongodb.png' },
    { re: /(css|sass|scss|tailwind)/, file: 'tailwind.png' },
    { re: /(git)/, file: 'git.png' },
    { re: /(html)/, file: 'html-5.png' },
    { re: /(javascript|js)/, file: 'js.png' },
    { re: /(nginx)/, file: 'nginx.svg' },
    { re: /(figma)/, file: 'figma.png' },
  ]
  const stackDir = path.join(process.cwd(), 'public', 'images', 'stack')
  const found = []
  for (const m of map) {
    if (m.re.test(key)) {
      const p = path.join(stackDir, m.file)
      if (fs.existsSync(p)) found.push(p)
    }
  }
  if (!found.length) {
    // Default set
    ['reactjs.png', 'nodejs.png', 'mysql.png'].forEach(f => {
      const p = path.join(stackDir, f)
      if (fs.existsSync(p)) found.push(p)
    })
  }
  // limitar a 3
  return found.slice(0, 3)
}

// Fondo base SVG tecnológico (sin texto)
function baseTechSvg() {
  return `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a192f"/>
      <stop offset="50%" stop-color="#112240"/>
      <stop offset="100%" stop-color="#1a365d"/>
    </linearGradient>
    <radialGradient id="glow">
      <stop offset="0%" stop-color="#64ffda" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#64ffda" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <circle cx="300" cy="200" r="150" fill="url(#glow)"/>
  <circle cx="900" cy="400" r="200" fill="url(#glow)"/>
  <g opacity="0.08" stroke="#64ffda" stroke-width="1">
    ${Array.from({length: 20}, (_, i) => `<line x1="${i * 60}" y1="0" x2="${i * 60}" y2="${HEIGHT}"/>`).join('')}
    ${Array.from({length: 11}, (_, i) => `<line x1="0" y1="${i * 60}" x2="${WIDTH}" y2="${i * 60}"/>`).join('')}
  </g>
</svg>`
}

// Variante 1: Composición con logos según tema
async function generateCoverVariant1(title, tags = []) {
  const svg = baseTechSvg()
  let base = await sharp(Buffer.from(svg), { density: 100 })
    .webp({ quality: 90 })
    .toBuffer()

  const icons = pickStackIcons(title, tags)
  const composites = []
  const positions = [
    { left: 180, top: 220 },
    { left: 500, top: 200 },
    { left: 820, top: 240 },
  ]

  for (let i = 0; i < icons.length; i++) {
    const iconPath = icons[i]
    const resized = await sharp(iconPath)
      .resize(220, 220, { fit: 'inside' })
      .toBuffer()
    composites.push({ input: resized, ...positions[i] })
  }

  base = await sharp(base).composite(composites).webp({ quality: 85 }).toBuffer()
  return base
}

// Variante 2: Estilo Arte/Abstracto
function generateCoverVariant2Svg(title) {
  const safeTitle = String(title).slice(0, 90)
  return `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgArt" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6a11cb"/>
      <stop offset="50%" stop-color="#2575fc"/>
      <stop offset="100%" stop-color="#1a1a2e"/>
    </linearGradient>
    <linearGradient id="shape1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ff006e"/>
      <stop offset="100%" stop-color="#ff7800"/>
    </linearGradient>
    <linearGradient id="shape2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#00d4ff"/>
      <stop offset="100%" stop-color="#0096c7"/>
    </linearGradient>
    <filter id="gooey">
      <feGaussianBlur in="SourceGraphic" stdDeviation="10"/>
      <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"/>
    </filter>
  </defs>
  
  <!-- Fondo -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgArt)"/>
  
  <!-- Formas abstractas con efecto blob -->
  <g filter="url(#gooey)" opacity="0.7">
    <circle cx="300" cy="200" r="180" fill="url(#shape1)"/>
    <circle cx="350" cy="300" r="150" fill="url(#shape1)"/>
    <circle cx="250" cy="280" r="120" fill="url(#shape1)"/>
  </g>
  
  <g filter="url(#gooey)" opacity="0.6">
    <circle cx="900" cy="400" r="200" fill="url(#shape2)"/>
    <circle cx="950" cy="350" r="160" fill="url(#shape2)"/>
    <circle cx="850" cy="450" r="140" fill="url(#shape2)"/>
  </g>
  
  <!-- Formas geométricas -->
  <polygon points="600,100 750,200 650,350 500,250" fill="none" stroke="#ffd60a" stroke-width="3" opacity="0.4"/>
  <polygon points="400,450 550,480 520,580 380,550" fill="#ff006e" opacity="0.2"/>
  
  <!-- Círculos decorativos -->
  <circle cx="150" cy="150" r="40" fill="none" stroke="#00d4ff" stroke-width="3" opacity="0.6"/>
  <circle cx="1050" cy="500" r="60" fill="none" stroke="#ffd60a" stroke-width="2" opacity="0.5"/>
  
  <!-- Líneas curvas -->
  <path d="M 100 ${HEIGHT} Q 400 300, 700 ${HEIGHT}" fill="none" stroke="#ff006e" stroke-width="2" opacity="0.3"/>
  <path d="M 0 315 Q 600 200, ${WIDTH} 400" fill="none" stroke="#00d4ff" stroke-width="2" opacity="0.3"/>
  
  <!-- Título superpuesto -->
  <g>
    <rect x="140" y="220" width="920" height="200" rx="16" fill="rgba(0,0,0,0.35)"/>
    <text x="180" y="320" font-family="Inter, Arial" font-size="48" fill="#ffffff" font-weight="700">${safeTitle}</text>
    <text x="180" y="360" font-family="Inter, Arial" font-size="22" fill="#e0e7ff" opacity="0.9">jaimetr.dev • Blog</text>
  </g>
</svg>`
}

// Variante 3: Imagen realista de dev/programación
async function generateCoverVariant3(title) {
  const imgPath = path.join(process.cwd(), 'public', 'images', 'programming.png')
  let base
  if (fs.existsSync(imgPath)) {
    base = await sharp(imgPath).resize(WIDTH, HEIGHT, { fit: 'cover' }).toBuffer()
  } else {
    // fallback: fondo tech
    base = await sharp(Buffer.from(baseTechSvg()), { density: 100 }).webp({ quality: 90 }).toBuffer()
  }
  // overlay degradado oscuro y tarjeta ligera
  const overlaySvg = `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(0,0,0,0.35)"/>
          <stop offset="100%" stop-color="rgba(0,0,0,0.55)"/>
        </linearGradient>
      </defs>
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#fade)"/>
      <rect x="220" y="160" width="760" height="310" rx="22" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>
    </svg>
  `
  const overlayBuf = Buffer.from(overlaySvg)
  const composed = await sharp(base)
    .composite([{ input: overlayBuf, left: 0, top: 0 }])
    .webp({ quality: 85 })
    .toBuffer()
  return composed
}

async function svgToWebp(svgContent) {
  try {
    const buffer = Buffer.from(svgContent)
    return await sharp(buffer, { density: 100 })
      .webp({ quality: 80 })
      .toBuffer()
  } catch (error) {
    console.error('Error converting SVG to WebP:', error)
    throw error
  }
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
    const { title, tags = [] } = body

    if (!title) {
      return NextResponse.json(
        { error: 'El título es requerido' },
        { status: 400 }
      )
    }

    // Variante 1: logos según tema
    const webp1 = await generateCoverVariant1(title, tags)
    // Variante 2: título superpuesto (SVG)
    const webp2 = await svgToWebp(generateCoverVariant2Svg(title))
    // Variante 3: imagen realista dev/programación
    const webp3 = await generateCoverVariant3(title)

    // Convertir a base64 para enviar al cliente
    const base641 = webp1.toString('base64')
    const base642 = webp2.toString('base64')
    const base643 = webp3.toString('base64')

    return NextResponse.json({
      success: true,
      data: {
        variants: [
          { id: 1, image: `data:image/webp;base64,${base641}`, name: 'Tema visual con logos' },
          { id: 2, image: `data:image/webp;base64,${base642}`, name: 'Título superpuesto' },
          { id: 3, image: `data:image/webp;base64,${base643}`, name: 'Imagen realista dev' }
        ]
      }
    })
  } catch (error) {
    console.error('Error generando portadas:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
