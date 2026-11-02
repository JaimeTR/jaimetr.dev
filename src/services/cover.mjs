import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const WIDTH = 1200
const HEIGHT = 800

// Paletas de colores por variante. generateCover() elige una segun el tema/tags
// del post (ver pickTheme) en vez de usar siempre la misma, para que el listado
// de blog no se vea con la portada repetida en cada articulo.
const COLOR_THEMES = {
  variant1: {
    name: 'Cyber Neon',
    primary: '#00FFA3', // Verde neón
    accent: '#00B8FF', // Azul cyber
    bg1: '#0A0A0F',
    bg2: '#12121A'
  },
  variant2: {
    name: 'Dark Glass',
    primary: '#F0F0F0', // Blanco humo
    accent: '#FF3366', // Rosa vibrante
    bg1: '#09090E',
    bg2: '#1A1A24'
  },
  variant3: {
    name: 'Tech Gold',
    primary: '#FFD700', // Dorado
    accent: '#8A2BE2', // Púrpura eléctrico
    bg1: '#050505',
    bg2: '#161616'
  },
  variant4: {
    name: 'Deep Ocean',
    primary: '#4CC9F0', // Azul cielo
    accent: '#4361EE', // Azul índigo
    bg1: '#03050F',
    bg2: '#0B1120'
  },
  variant5: {
    name: 'Crimson Circuit',
    primary: '#FF5B6A', // Rojo coral
    accent: '#FFB454', // Ámbar
    bg1: '#0C0505',
    bg2: '#1A0E0E'
  },
  variant6: {
    name: 'Emerald Grid',
    primary: '#7CFFB2', // Verde menta
    accent: '#2DD4BF', // Turquesa
    bg1: '#04100B',
    bg2: '#0B1F17'
  }
}

// Mapea temas/tags frecuentes del blog a una variante + motivo grafico coherente
// (seguridad -> candado rojo, datos -> base de datos azul, IA -> red neuronal
// dorada, etc). Si ningun tag matchea, cae a un hash determinista sobre el slug
// para repartir el resto entre todas las variantes/iconos.
const TAG_THEME_MAP = [
  { pattern: /seguridad|auth|jwt|oauth/i, variant: 'variant5', icon: 'shield' },
  { pattern: /bases?\s+de\s+datos|database|\bsql\b|postgres/i, variant: 'variant4', icon: 'database' },
  { pattern: /api|rest|graphql/i, variant: 'variant4', icon: 'network' },
  { pattern: /\bia\b|inteligencia artificial|ai\b|gemini|llm/i, variant: 'variant3', icon: 'brain' },
  { pattern: /performance|core web vitals/i, variant: 'variant6', icon: 'gauge' },
  { pattern: /caching|cache/i, variant: 'variant6', icon: 'database' },
  { pattern: /seo/i, variant: 'variant2', icon: 'search' },
  { pattern: /docker|devops|infraestructura/i, variant: 'variant1', icon: 'container' },
  { pattern: /wordpress/i, variant: 'variant1', icon: 'network' },
]

const ICON_KEYS = ['shield', 'database', 'brain', 'gauge', 'search', 'container', 'network', 'hexgrid']

function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0
  }
  return hash
}

const VARIANT_KEYS = Object.keys(COLOR_THEMES)
const COMBO_COUNT = VARIANT_KEYS.length * ICON_KEYS.length // 48 possible variant+icon pairs

function comboKey(variant, icon) {
  return `${variant}:${icon}`
}

// Preferred combo for a post: title-keyword match first, else a hash-seeded
// pick. Doesn't consider other posts — callers that care about catalog-wide
// uniqueness use pickTheme's `usedCombos` param instead of calling this raw.
function preferredCombo({ slug = '', title = '' }) {
  const match = TAG_THEME_MAP.find(({ pattern }) => pattern.test(title))
  if (match) return { variant: match.variant, icon: match.icon }

  const hash = hashString(slug || title)
  const variant = VARIANT_KEYS[hash % VARIANT_KEYS.length]
  const icon = ICON_KEYS[Math.floor(hash / VARIANT_KEYS.length) % ICON_KEYS.length]
  return { variant, icon }
}

// Reads every other post's frontmatter and computes which variant+icon combo
// each one would naturally get, so a new/regenerated cover can avoid repeating
// one already in use. With only 48 possible combos and ~30 posts, plain hashing
// collides often in practice (confirmed: 6+ unrelated posts rendering byte-
// identical covers) — this makes collisions the exception instead of the norm.
function getUsedCombos(excludeSlug) {
  const postsDir = path.join(process.cwd(), 'src', 'posts')
  const used = new Set()
  if (!fs.existsSync(postsDir)) return used

  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.mdx') && !f.endsWith('.en.mdx'))
  for (const file of files) {
    const slug = file.replace('.mdx', '')
    if (slug === excludeSlug) continue
    try {
      const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8')
      const titleMatch = raw.match(/^title:\s*['"]?(.*?)['"]?\s*$/m)
      const title = titleMatch ? titleMatch[1] : slug
      const { variant, icon } = preferredCombo({ slug, title })
      used.add(comboKey(variant, icon))
    } catch {
      // unreadable frontmatter shouldn't block cover generation for other posts
    }
  }
  return used
}

export function pickTheme({ slug = '', title = '', tags = [], usedCombos = null }) {
  let { variant, icon } = preferredCombo({ slug, title })

  if (usedCombos && usedCombos.size < COMBO_COUNT && usedCombos.has(comboKey(variant, icon))) {
    // Walk the full combo space in a fixed order, starting from a hash-seeded
    // offset so different posts fan out instead of all drifting toward variant1.
    const hash = hashString(slug || title)
    for (let i = 0; i < COMBO_COUNT; i++) {
      const idx = (hash + i) % COMBO_COUNT
      const candidateVariant = VARIANT_KEYS[idx % VARIANT_KEYS.length]
      const candidateIcon = ICON_KEYS[Math.floor(idx / VARIANT_KEYS.length) % ICON_KEYS.length]
      if (!usedCombos.has(comboKey(candidateVariant, candidateIcon))) {
        variant = candidateVariant
        icon = candidateIcon
        break
      }
    }
  }

  return { ...COLOR_THEMES[variant], icon, variantKey: variant }
}

export async function generateCoverVariants({ slug, title, tags = [] }) {
  const outDir = path.join(process.cwd(), 'public', 'images', 'posts')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

  const variants = []
  
  const { icon } = pickTheme({ slug, title, tags })

  for (const [key, theme] of Object.entries(COLOR_THEMES)) {
    const variantSlug = `${slug}-${key}`
    const outFile = path.join(outDir, `${variantSlug}.webp`)
    const svg = generateSVG({ theme, slug, icon })
    
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

// Motivos graficos abstractos por categoria, centrados en (cx, cy) a escala `s`.
// Todo trazo grueso / geometrico, nada de iconos "de librearia" ni texto.
const ICON_BUILDERS = {
  shield: (cx, cy, s, primary, accent) => `
    <path d="M ${cx} ${cy - 1.3 * s} L ${cx + 1.1 * s} ${cy - 0.75 * s} L ${cx + 1.1 * s} ${cy + 0.35 * s}
      C ${cx + 1.1 * s} ${cy + 1.15 * s} ${cx + 0.55 * s} ${cy + 1.65 * s} ${cx} ${cy + 1.9 * s}
      C ${cx - 0.55 * s} ${cy + 1.65 * s} ${cx - 1.1 * s} ${cy + 1.15 * s} ${cx - 1.1 * s} ${cy + 0.35 * s}
      L ${cx - 1.1 * s} ${cy - 0.75 * s} Z"
      fill="none" stroke="${primary}" stroke-width="${s * 0.06}" opacity="0.55" filter="url(#neonGlow)"/>
    <circle cx="${cx}" cy="${cy + 0.35 * s}" r="${s * 0.32}" fill="${accent}" opacity="0.5"/>
    <rect x="${cx - s * 0.06}" y="${cy + 0.35 * s}" width="${s * 0.12}" height="${s * 0.5}" fill="${accent}" opacity="0.5"/>`,

  database: (cx, cy, s, primary, accent) => `
    ${[0, 1, 2].map(i => `
    <ellipse cx="${cx}" cy="${cy - 1.1 * s + i * 0.85 * s}" rx="${s}" ry="${s * 0.32}"
      fill="none" stroke="${i === 1 ? accent : primary}" stroke-width="${s * 0.055}" opacity="0.55"/>`).join('')}
    <path d="M ${cx - s} ${cy - 1.1 * s} L ${cx - s} ${cy + 0.6 * s} A ${s} ${s * 0.32} 0 0 0 ${cx + s} ${cy + 0.6 * s} L ${cx + s} ${cy - 1.1 * s}"
      fill="none" stroke="${primary}" stroke-width="${s * 0.055}" opacity="0.35" filter="url(#neonGlow)"/>`,

  brain: (cx, cy, s, primary, accent) => {
    const nodes = [[-0.9, -0.9], [0.4, -1.15], [1.1, -0.2], [0.6, 0.9], [-0.5, 1.05], [-1.15, 0.15], [0, 0]]
    const pts = nodes.map(([dx, dy]) => [cx + dx * s, cy + dy * s])
    const edges = [[0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]]
    return `
    ${edges.map(([a, b]) => `<line x1="${pts[a][0]}" y1="${pts[a][1]}" x2="${pts[b][0]}" y2="${pts[b][1]}" stroke="${accent}" stroke-width="${s * 0.035}" opacity="0.4"/>`).join('')}
    ${pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i === 6 ? s * 0.16 : s * 0.1}" fill="${primary}" opacity="0.6" filter="url(#neonGlow)"/>`).join('')}`
  },

  gauge: (cx, cy, s, primary, accent) => `
    <path d="M ${cx - 1.2 * s} ${cy + 0.4 * s} A ${1.2 * s} ${1.2 * s} 0 0 1 ${cx + 1.2 * s} ${cy + 0.4 * s}"
      fill="none" stroke="${primary}" stroke-width="${s * 0.09}" opacity="0.35" stroke-linecap="round"/>
    <path d="M ${cx - 1.2 * s} ${cy + 0.4 * s} A ${1.2 * s} ${1.2 * s} 0 0 1 ${cx + 0.35 * s} ${cy - 1.17 * s}"
      fill="none" stroke="${accent}" stroke-width="${s * 0.09}" opacity="0.6" stroke-linecap="round" filter="url(#neonGlow)"/>
    <line x1="${cx}" y1="${cy + 0.15 * s}" x2="${cx + 0.75 * s}" y2="${cy - 0.65 * s}" stroke="${primary}" stroke-width="${s * 0.06}" opacity="0.7" stroke-linecap="round"/>
    <circle cx="${cx}" cy="${cy + 0.15 * s}" r="${s * 0.1}" fill="${primary}" opacity="0.8"/>`,

  search: (cx, cy, s, primary, accent) => `
    <circle cx="${cx - 0.15 * s}" cy="${cy - 0.15 * s}" r="${s * 0.85}" fill="none" stroke="${primary}" stroke-width="${s * 0.07}" opacity="0.5" filter="url(#neonGlow)"/>
    <line x1="${cx + 0.48 * s}" y1="${cy + 0.48 * s}" x2="${cx + 1.25 * s}" y2="${cy + 1.25 * s}" stroke="${primary}" stroke-width="${s * 0.09}" opacity="0.6" stroke-linecap="round"/>
    ${[-0.35, 0, 0.35].map(dy => `<line x1="${cx - 0.5 * s}" y1="${cy - 0.15 * s + dy * s}" x2="${cx + 0.2 * s}" y2="${cy - 0.15 * s + dy * s}" stroke="${accent}" stroke-width="${s * 0.045}" opacity="0.45"/>`).join('')}`,

  container: (cx, cy, s, primary, accent) => `
    ${[[-0.9, 0.15, primary], [0.1, 0.15, accent], [-0.4, -0.65, primary]].map(([dx, dy, color]) => `
    <g opacity="0.5">
      <path d="M ${cx + dx * s} ${cy + dy * s} l ${0.8 * s} ${-0.35 * s} l ${0.8 * s} ${0.35 * s} l ${-0.8 * s} ${0.35 * s} Z"
        fill="none" stroke="${color}" stroke-width="${s * 0.045}"/>
      <path d="M ${cx + dx * s} ${cy + dy * s} l 0 ${0.55 * s} l ${0.8 * s} ${0.35 * s} l 0 ${-0.55 * s}"
        fill="none" stroke="${color}" stroke-width="${s * 0.045}"/>
      <path d="M ${cx + dx * s + 1.6 * s} ${cy + dy * s} l 0 ${0.55 * s} l ${-0.8 * s} ${0.35 * s} l 0 ${-0.55 * s}"
        fill="none" stroke="${color}" stroke-width="${s * 0.045}"/>
    </g>`).join('')}`,

  network: (cx, cy, s, primary, accent) => {
    const nodes = [[0, -1.2], [1.05, -0.4], [0.65, 0.95], [-0.65, 0.95], [-1.05, -0.4]]
    const pts = nodes.map(([dx, dy]) => [cx + dx * s, cy + dy * s])
    return `
    ${pts.map(([x, y], i) => {
      const [nx, ny] = pts[(i + 1) % pts.length]
      return `<line x1="${x}" y1="${y}" x2="${nx}" y2="${ny}" stroke="${accent}" stroke-width="${s * 0.04}" opacity="0.4"/>`
    }).join('')}
    ${pts.map(([x, y]) => `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${primary}" stroke-width="${s * 0.03}" opacity="0.3"/>`).join('')}
    ${pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${s * 0.14}" fill="${primary}" opacity="0.6" filter="url(#neonGlow)"/>`).join('')}
    <circle cx="${cx}" cy="${cy}" r="${s * 0.18}" fill="${accent}" opacity="0.7" filter="url(#neonGlow)"/>`
  },

  hexgrid: (cx, cy, s, primary, accent) => {
    const hex = (x, y, r, color, op) => {
      const p = Array.from({ length: 6 }, (_, i) => {
        const a = Math.PI / 3 * i - Math.PI / 6
        return `${x + r * Math.cos(a)},${y + r * Math.sin(a)}`
      }).join(' ')
      return `<polygon points="${p}" fill="none" stroke="${color}" stroke-width="${s * 0.035}" opacity="${op}"/>`
    }
    const r = s * 0.55
    const dx = r * 1.73
    const dy = r * 1.5
    let out = ''
    const centers = [[0, 0], [dx, -dy], [dx, dy], [-dx, -dy], [-dx, dy], [0, -2 * dy], [0, 2 * dy]]
    centers.forEach(([ox, oy], i) => {
      out += hex(cx + ox, cy + oy, r, i === 0 ? accent : primary, i === 0 ? 0.6 : 0.3)
    })
    return out
  },
}

// El hero de la pagina de detalle usa aspect-[21/9] con object-cover sobre esta
// imagen de 1200x800 (3:2): eso recorta ~142.8px arriba y abajo (queda visible
// solo el 64.3% central de la altura). Cada icono tiene una extension vertical
// distinta (el escudo y la grilla hexagonal son mucho mas altos que el gauge o
// el contenedor), asi que un mismo tamano fijo hacia que los mas altos se
// recortaran. Cada builder recibe una escala calculada para que su punto mas
// lejano en Y quede dentro de la franja segura (radio 230px desde el centro).
const ICON_SAFE_SCALE = {
  shield: 121,
  database: 162,
  brain: 176,
  gauge: 192,
  search: 184,
  container: 192,
  network: 167,
  hexgrid: 105,
}

function generateSVG({ theme, icon }) {
  const brand = 'jaimetr.dev'
  const { primary, accent, bg1, bg2 } = theme
  const iconKey = ICON_BUILDERS[icon] ? icon : 'hexgrid'
  const scale = ICON_SAFE_SCALE[iconKey] || 150
  const motif = ICON_BUILDERS[iconKey](WIDTH * 0.6, HEIGHT / 2, scale, primary, accent)

  return `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="0%" r="100%" fx="50%" fy="0%">
      <stop offset="0%" stop-color="${bg2}"/>
      <stop offset="100%" stop-color="${bg1}"/>
    </radialGradient>

    <!-- Pattern de Grid -->
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${accent}" stroke-width="0.5" opacity="0.1"/>
    </pattern>

    <!-- Filtro de resplandor neón -->
    <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Fondo base con gradiente radial y Grid -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGrad)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)"/>

  <!-- Orbes de luz decorativos -->
  <circle cx="1000" cy="150" r="250" fill="${accent}" opacity="0.08" filter="blur(80px)"/>
  <circle cx="150" cy="700" r="300" fill="${primary}" opacity="0.05" filter="blur(100px)"/>

  <!-- Motivo grafico abstracto, sin texto de titulo -->
  ${motif}

  <!-- Branding: solo el nombre, chico, en la esquina -->
  <rect x="100" y="${HEIGHT - 90}" width="44" height="3" fill="${primary}"/>
  <text
    x="100"
    y="${HEIGHT - 60}"
    font-family="'Inter', 'Arial', sans-serif"
    font-size="20"
    font-weight="700"
    fill="#FFFFFF"
    opacity="0.85"
  >
    ${escapeXml(brand)}
  </text>
</svg>`
}

// Renders and writes a cover once the variant+icon are already decided. Split
// out from generateCover() so a caller regenerating the whole catalog in one
// pass (see regenerateAllCovers) can track real, already-assigned combos as it
// goes instead of each call independently re-guessing what everyone else will
// pick — that's what let posts collide even after per-call uniqueness checks.
export async function renderCoverForTheme({ slug, theme, icon }) {
  const outDir = path.join(process.cwd(), 'public', 'images', 'posts')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
  const outFile = path.join(outDir, `${slug}.webp`)

  const svg = generateSVG({ theme, icon })
  const svgBuffer = Buffer.from(svg)
  const buffer = await sharp(svgBuffer)
    .webp({ quality: 90 })
    .toBuffer()

  fs.writeFileSync(outFile, buffer)
  return `/images/posts/${slug}.webp`
}

export async function generateCover({ slug, title, tags = [] }) {
  const usedCombos = getUsedCombos(slug)
  const theme = pickTheme({ slug, title, tags, usedCombos })
  return renderCoverForTheme({ slug, theme, icon: theme.icon })
}

// Regenerates every post's cover in one coordinated pass, guaranteeing zero
// collisions whenever total posts <= the 48-combo space (variants x icons).
// Reads titles straight from src/posts/*.mdx frontmatter.
export async function regenerateAllCovers() {
  const postsDir = path.join(process.cwd(), 'src', 'posts')
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.mdx') && !f.endsWith('.en.mdx'))
  const usedCombos = new Set()
  const results = []

  for (const file of files) {
    const slug = file.replace('.mdx', '')
    const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8')
    const titleMatch = raw.match(/^title:\s*['"]?(.*?)['"]?\s*$/m)
    const title = titleMatch ? titleMatch[1] : slug

    const theme = pickTheme({ slug, title, usedCombos })
    usedCombos.add(comboKey(theme.variantKey, theme.icon))
    const url = await renderCoverForTheme({ slug, theme, icon: theme.icon })
    results.push({ slug, url })
  }

  return results
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

