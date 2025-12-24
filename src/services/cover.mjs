import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const WIDTH = 1200
const HEIGHT = 630

export async function generateCover({ slug, title, tags = [] }) {
  const outDir = path.join(process.cwd(), 'public', 'images', 'posts')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
  const outFile = path.join(outDir, `${slug}.webp`)

  const maxLen = 70
  const safeTitle = String(title || slug)
  const displayTitle = safeTitle.length > maxLen ? safeTitle.slice(0, maxLen - 1) + '…' : safeTitle
  const brand = 'jaimetr.dev'

  // Colores vibrantescontraste alto
  const primaryYellow = '#FFD700' // Amarillo dorado
  const accentCyan = '#00D9FF' // Cyan/Turquesa
  const darkBg = '#0a1628' // Azul muy oscuro
  const darkAccent = '#1a2f4a' // Azul más claro

  // Generar SVG con estilo moderno
  const svg = `
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

  <!-- Título principal en amarillo vibrante -->
  <text 
    x="80" 
    y="300" 
    font-family="'Onest', 'Arial Black', sans-serif" 
    font-size="68" 
    font-weight="900" 
    fill="${primaryYellow}"
    filter="url(#glow)"
  >
    ${escapeXml(displayTitle.substring(0, 40))}
  </text>

  <!-- Continuación del título si es muy largo -->
  ${displayTitle.length > 40 ? `
  <text 
    x="80" 
    y="380" 
    font-family="'Onest', 'Arial Black', sans-serif" 
    font-size="68" 
    font-weight="900" 
    fill="${primaryYellow}"
    filter="url(#glow)"
  >
    ${escapeXml(displayTitle.substring(40))}
  </text>
  ` : ''}

  <!-- Subtítulo con tags -->
  <text 
    x="80" 
    y="450" 
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

