import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const WIDTH = 1200
const HEIGHT = 800

// Paletas de colores para las 3 variantes
const COLOR_THEMES = {
  variant1: {
    name: 'Clásico',
    primaryYellow: '#FFD700',
    accentCyan: '#00D9FF',
    darkBg: '#0a1628',
    darkAccent: '#1a2f4a'
  },
  variant2: {
    name: 'Moderno',
    primaryYellow: '#FF6B35',
    accentCyan: '#7B68EE',
    darkBg: '#1a1a2e',
    darkAccent: '#16213e'
  },
  variant3: {
    name: 'Vibrante',
    primaryYellow: '#00F5A0',
    accentCyan: '#FF2E63',
    darkBg: '#0F2027',
    darkAccent: '#203A43'
  }
}

export async function generateCoverVariants({ slug, title, tags = [] }) {
  const outDir = path.join(process.cwd(), 'public', 'images', 'posts')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

  const variants = []
  
  for (const [key, theme] of Object.entries(COLOR_THEMES)) {
    const variantSlug = `${slug}-${key}`
    const outFile = path.join(outDir, `${variantSlug}.webp`)
    const svg = generateSVG({ title, theme, slug })
    
    const svgBuffer = Buffer.from(svg)
    const buffer = await sharp(svgBuffer)
      .webp({ quality: 90 })
      .toBuffer()

    fs.writeFileSync(outFile, buffer)
    
    variants.push({
      name: theme.name,
      url: `/images/posts/${variantSlug}.webp`,
      filename: `${variantSlug}.webp`
    })
  }

  return variants
}

function generateSVG({ title, theme, slug }) {
  const safeTitle = String(title || slug)
  const brand = 'jaimetr.dev'

  const { primaryYellow, accentCyan, darkBg, darkAccent } = theme

  // Función para dividir el texto en líneas que quepan en el ancho disponible
  function splitTextIntoLines(text, maxCharsPerLine) {
    const words = text.split(' ')
    const lines = []
    let currentLine = ''

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      
      if (testLine.length <= maxCharsPerLine) {
        currentLine = testLine
      } else {
        if (currentLine) lines.push(currentLine)
        currentLine = word
      }
    }
    
    if (currentLine) lines.push(currentLine)
    return lines
  }

  // Determinar tamaño de fuente y líneas según longitud del título
  let fontSize = 68
  let maxCharsPerLine = 35
  let lineHeight = 80
  
  if (safeTitle.length > 60) {
    fontSize = 52
    maxCharsPerLine = 45
    lineHeight = 65
  } else if (safeTitle.length > 40) {
    fontSize = 60
    maxCharsPerLine = 40
    lineHeight = 72
  }

  const titleLines = splitTextIntoLines(safeTitle, maxCharsPerLine).slice(0, 3) // Máximo 3 líneas

  return `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${darkBg}"/>
      <stop offset="100%" stop-color="${darkAccent}"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Fondo base con gradiente -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGrad)"/>

  <!-- Patrón de código de fondo (simulado) -->
  <text x="50" y="100" font-family="monospace" font-size="12" fill="#1a4d6d" opacity="0.3">
    const handler = () =&gt; console.log('event');
  </text>
  <text x="800" y="500" font-family="monospace" font-size="11" fill="#1a4d6d" opacity="0.25">
    export function optimize() { return true; }
  </text>

  <!-- Elementos decorativos geométricos -->
  <!-- Círculos decorativos -->
  <circle cx="150" cy="120" r="60" fill="none" stroke="${accentCyan}" stroke-width="2" opacity="0.4"/>
  <circle cx="150" cy="120" r="40" fill="none" stroke="${accentCyan}" stroke-width="1" opacity="0.2"/>
  
  <circle cx="1050" cy="500" r="80" fill="none" stroke="${primaryYellow}" stroke-width="2" opacity="0.3"/>
  <circle cx="1050" cy="500" r="55" fill="none" stroke="${primaryYellow}" stroke-width="1" opacity="0.15"/>

  <!-- Líneas decorativas -->
  <line x1="0" y1="0" x2="200" y2="100" stroke="${accentCyan}" stroke-width="2" opacity="0.2"/>
  <line x1="${WIDTH}" y1="${HEIGHT}" x2="${WIDTH - 250}" y2="${HEIGHT - 120}" stroke="${primaryYellow}" stroke-width="2" opacity="0.2"/>

  <!-- Rectángulo highlight lateral -->
  <rect x="0" y="220" width="8" height="200" fill="${primaryYellow}" opacity="0.6"/>

  <!-- Título principal (múltiples líneas si es necesario) -->
  ${titleLines.map((line, index) => `
  <text 
    x="80" 
    y="${250 + (index * lineHeight)}" 
    font-family="'Onest', 'Arial Black', sans-serif" 
    font-size="${fontSize}" 
    font-weight="900" 
    fill="${primaryYellow}"
    filter="url(#glow)"
  >
    ${escapeXml(line)}
  </text>
  `).join('')}

  <!-- Subtítulo con brand -->
  <text 
    x="80" 
    y="${250 + (titleLines.length * lineHeight) + 50}" 
    font-family="'Onest', 'Arial', sans-serif" 
    font-size="18" 
    fill="${accentCyan}"
    opacity="0.9"
  >
    ${escapeXml(brand)}
  </text>

  <!-- Branding en esquina inferior -->
  <text 
    x="80" 
    y="580" 
    font-family="'Onest', 'Arial', sans-serif" 
    font-size="16" 
    fill="#ffffff"
    opacity="0.7"
  >
    📝 Artículo de ${brand}
  </text>

  <!-- Pequeños acentos de puntos -->
  <circle cx="1100" cy="100" r="4" fill="${primaryYellow}" opacity="0.6"/>
  <circle cx="1130" cy="120" r="3" fill="${accentCyan}" opacity="0.5"/>
  <circle cx="1070" cy="140" r="3" fill="${primaryYellow}" opacity="0.4"/>
</svg>`
}

export async function generateCover({ slug, title, tags = [] }) {
  const outDir = path.join(process.cwd(), 'public', 'images', 'posts')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
  const outFile = path.join(outDir, `${slug}.webp`)

  // Usar el tema clásico por defecto
  const theme = COLOR_THEMES.variant1
  const svg = generateSVG({ title, theme, slug })

  // Convertir SVG a imagen con sharp
  const svgBuffer = Buffer.from(svg)
  const buffer = await sharp(svgBuffer)
    .webp({ quality: 90 })
    .toBuffer()

  fs.writeFileSync(outFile, buffer)
  return `/images/posts/${slug}.webp`
}

function escapeXml(s) {
  return String(s).replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&': return '&amp;'
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '"': return '&quot;'
      case "'": return '&#39;'
      default: return c
    }
  })
}

