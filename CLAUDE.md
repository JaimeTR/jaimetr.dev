# jaimetr.dev — contexto para Claude Code

Portafolio + blog de Jaime Tarazona Rodriguez. Next.js 15 (App Router), Tailwind, Supabase como backend de contenido. Ver `README.md` para stack y comandos.

## Arquitectura clave (no obvia)

- **Sin root layout**: no existe `src/app/layout.js`. `[lang]/layout.js` y `admin/layout.js` cada uno define su propio `<html>/<body>` de forma independiente. No agregar un `src/app/layout.js` genérico — rompería el HTML (dos `<html>` anidados) en cuanto envuelva a cualquiera de los dos.
- **i18n manual**: no hay librería de i18n. `src/middleware.js` reescribe cualquier ruta sin prefijo a `/es` o `/en` según `Accept-Language`, y mapea `/es/proyectos` → `/es/projects`, `/es/articulos` → `/es/posts`. El default es `es`.
- **Proyectos = Supabase, no archivos**: `/projects` y la sección del home leen en vivo desde la tabla `projects` de Supabase vía `ProjectGallery.tsx`. NO recrear un archivo estático tipo `helpers/projects.js` con proyectos hardcodeados — existió antes con datos placeholder/de ejemplo y se eliminó porque no eran proyectos reales del dueño del sitio. Si en el futuro se pide una "página de detalle" de proyecto, la tabla Supabase actual (`title, description, image_url, category, technologies[], link_url, github_url, ...`) no tiene los campos ricos (abstract, features, galería de imágenes) que tenía el viejo sistema — habría que ampliar el schema, no reinventar un JSON estático en paralelo.
- **Blog = MDX + gray-matter**, no `@next/mdx`. `src/lib/mdx.js` lee `src/posts/<slug>.mdx` (ES) y `<slug>.en.mdx` (EN); si no hay `.en.mdx`, hace fallback a ES. `getPostBySlug` devuelve `null` si el slug no existe — la página debe llamar `notFound()` explícitamente (ya lo hace).
- **Portadas de blog = generadas localmente**, no IA de imágenes. `src/services/cover.mjs` genera un SVG (ícono geométrico grande según el tema del post + paleta de color) y lo convierte a WebP con `sharp`. Sin llamadas a red. `pickTheme()` mapea tags/título a un ícono+color coherente (seguridad→escudo rojo, DB/API→cilindro azul, IA→red dorada, etc.) con fallback por hash del slug. Las portadas **no llevan texto de título** — solo el ícono y "jaimetr.dev" chico en la esquina (decisión explícita del dueño).
- **Generación de contenido con IA** (`src/services/ai.mjs`): `resolveDefaultProvider()` elige Groq → Gemini → OpenAI según qué `*_API_KEY` esté seteada en `.env.local`. Los scripts en `scripts/` (`generate-blog.mjs`, `generate-monthly.mjs`, `translate-existing-blogs.mjs`) dependen de que `ai.mjs` cargue `.env.local` — lo hace automáticamente con `process.loadEnvFile` al importarse (antes NINGÚN script cargaba el .env, por eso durante meses cada generación caía al template hardcodeado sin que nadie lo notara).

## Gotchas de este entorno (Windows + dev server)

- **`npm run build` mientras `npm run dev` sigue corriendo corrompe `.next`** de forma consistente en este entorno — produce `SyntaxError: Invalid or unexpected token` en el bundle del cliente aunque el código fuente esté perfecto (confirmado: el mismo build corría limpio en modo producción). Si el preview se ve raro después de un build: parar el dev server, `rm -rf .next`, reiniciar.
- El rate limit de Groq en el tier gratuito (`on_demand`) es **8000 tokens/minuto combinando prompt+respuesta**. `generateWithGroq` usa `max_tokens: 4000` por defecto y reintenta una vez con backoff en 429 — no subir `max_tokens` sin bajar el tamaño del system prompt, o vuelve a romperse en silencio (cae al fallback template).
- El modelo Groq hardcodeado puede quedar obsoleto (pasó con `llama-3.3-70b-versatile`, descontinuado). Si `generateBlogMdx` empieza a devolver contenido plantilla genérico otra vez, lo primero a revisar es `GET https://api.groq.com/openai/v1/models` con la key actual para ver qué modelos están realmente disponibles.

## Convenciones

- Sin comentarios explicando el "qué" — solo el "por qué" cuando no es obvio (ver ejemplos arriba en el código real: los comentarios que sí existen documentan bugs corregidos o constraints no evidentes, no repiten el código).
- Cobertura de idioma: todo contenido público (posts, metadata) debe tener versión ES real; si se genera una versión EN, `generateEnglishVersion` traduce tanto el body como `title`/`description` del frontmatter — antes solo traducía el body y el resto quedaba en español bajo `hreflang="en"`.
- No usar `<img>` crudo en componentes públicos — usar `next/image` (LCP). Excepción documentada: `Navbar.jsx` tiene `/* eslint-disable @next/next/no-img-element */` a propósito para el logo admin-configurable (dimensiones desconocidas de antemano).

## Dónde mirar antes de tocar

- `docs/` — reportes de sesiones anteriores (mayormente históricos/desactualizados, útiles como contexto de decisiones pasadas, no como fuente de verdad del estado actual).
- `supabase_schema.sql` — schema de referencia de las tablas (puede haber divergido del schema real en producción; verificar en el dashboard de Supabase antes de asumir columnas).
