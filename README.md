# 👨‍💻 Portafolio Jaime Tarazona — jaimetr.dev

Portafolio y blog técnico construido con [Next.js](https://nextjs.org/) 15 (App Router), Tailwind CSS y Supabase como backend de contenido.

## 🚀 Stack

- Next.js 15 (App Router) + React 19
- Tailwind CSS
- Supabase (perfil, proyectos, secciones del home, header/footer, chat) — administrable desde `/admin`
- MDX (`gray-matter` + `markdown-to-jsx`) para el blog, archivos en `src/posts/`
- i18n manual (ES/EN) vía middleware — sin librería de i18n
- Generación de contenido asistida por IA (Groq / Gemini / OpenAI, configurable)

## 📋 Requisitos

- Node.js 20.6+ (usa `process.loadEnvFile`, nativo desde esa versión)
- npm

## 🔧 Instalación

```bash
npm install
cp .env.example .env.local   # completar credenciales (Supabase, AI provider, etc.)
```

## 🏃 Desarrollo

```bash
npm run dev
```

Next.js elige un puerto libre automáticamente si el 3000 está ocupado. El middleware (`src/middleware.js`) redirige toda ruta sin prefijo de idioma a `/es` o `/en` según `Accept-Language`.

## 📦 Build y producción

```bash
npm run build
npm start
```

> Nota: en Windows, correr `npm run build` mientras `npm run dev` sigue activo puede corromper la caché de `.next` (bundles de dev con errores de sintaxis fantasma). Si el dev server se comporta raro después de un build, pará el server, borrá `.next` y reiniciá.

## 🗂️ Estructura del proyecto

```
├── public/
│   ├── images/posts/       # Portadas de blog generadas (ver src/services/cover.mjs)
│   ├── projects/           # Screenshots de proyectos (legacy, no todos en uso)
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── [lang]/         # Todas las rutas públicas (home, posts, projects) — layout propio con <html>/<body>
│   │   ├── admin/          # Panel admin — layout propio, independiente del de [lang]
│   │   ├── api/            # Rutas API (admin, chat, tts, projects)
│   │   └── sitemap.js
│   ├── components/
│   │   ├── Home/           # Secciones del landing (Banner, About, Experience, Projects, Stack, Articles)
│   │   ├── portfolio/      # Galería de proyectos real (lee de Supabase, no de archivos estáticos)
│   │   ├── Articles/       # Listado/filtro de posts del blog
│   │   └── Admin/          # UI del panel admin
│   ├── services/
│   │   ├── ai.mjs          # Generación de posts vía IA (Groq/Gemini/OpenAI) + traducción EN
│   │   └── cover.mjs       # Generador de portadas SVG→WebP por tema (sin texto de título, solo ícono)
│   ├── lib/mdx.js          # Lectura de posts .mdx / .en.mdx
│   ├── posts/               # Artículos del blog (ES: slug.mdx, EN: slug.en.mdx)
│   └── middleware.js        # Enrutamiento por idioma + rewrites /proyectos → /projects, /articulos → /posts
├── scripts/                 # CLIs: generate-blog, generate-monthly, translate-existing-blogs, fix-covers, migraciones
└── docs/                    # Documentación de sesiones anteriores y notas de arquitectura
```

### Arquitectura sin root layout

El proyecto **no tiene** `src/app/layout.js`. Cada segmento de primer nivel (`[lang]` y `admin`) define su propio `<html>`/`<body>` de forma independiente. Esto significa:

- Un `not-found.js` en la raíz (`src/app/not-found.js`) **no funciona** sin un layout raíz real — Next.js lo exige explícitamente. Por eso el 404 vive en `src/app/[lang]/not-found.js` (cubre el 99% de los casos reales, ya que el middleware fuerza el prefijo de idioma en cualquier URL).
- Las páginas `[slug]` (posts) llaman `notFound()` explícitamente cuando el slug no existe — antes no lo hacían y renderizaban una página casi vacía con el slug crudo como título.

### Proyectos: una sola fuente de verdad

El listado de proyectos (`/projects` y la sección del home) se alimenta **en vivo desde Supabase** (`ProjectGallery.tsx` → tabla `projects`), administrable desde `/admin`. No existe (ni debería recrearse) un archivo estático `src/helpers/projects.js` con proyectos hardcodeados — esa fuente existió en algún momento con datos de ejemplo/placeholder y fue eliminada por no reflejar proyectos reales.

## 🧠 Generación de blog con IA

`src/services/ai.mjs` resuelve automáticamente el proveedor disponible (`resolveDefaultProvider()`): usa `GROQ_API_KEY` si existe, si no `GEMINI_API_KEY`, si no `OPENAI_API_KEY`. Podés forzarlo con `AI_PROVIDER=groq|gemini|openai` en `.env.local`.

```bash
# Generar un post nuevo (ES + EN + portada)
npm run generate:blog -- "Optimización de rendimiento en Next.js"

# Traducir posts existentes que no tengan versión .en.mdx
npm run translate:blogs

# Regenerar portadas (por tema, sin texto de título)
npm run fix:covers
```

Cada post genera:
- `src/posts/<slug>.mdx` (y `.en.mdx` si corresponde) con frontmatter SEO completo.
- `public/images/posts/<slug>.webp` — portada generada localmente (SVG→WebP con `sharp`, sin llamadas a APIs de imagen), con un motivo gráfico + paleta elegidos según el tema del post (`pickTheme()` en `cover.mjs`).

## 🔐 Seguridad y SEO

- Headers de seguridad HTTP (CSP, X-Frame-Options, etc.) en `next.config.js`.
- `sitemap.xml` dinámico (`src/app/sitemap.js`) — solo incluye rutas reales; ya no lista proyectos individuales (no tienen página de detalle propia).
- Metadata dinámica, Open Graph, Twitter Cards y JSON-LD por página.
- `llms.txt` en `public/` para crawlers de IA/GEO.

## 👨‍💻 Autor

**Jaime Tarazona Rodriguez** — Ingeniero de Sistemas, Desarrollador Full-Stack, Web Developer.
