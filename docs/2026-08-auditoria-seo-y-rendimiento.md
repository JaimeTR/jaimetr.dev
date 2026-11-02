# Auditoría de rendimiento, SEO y limpieza — agosto 2026

Resumen de una sesión de trabajo enfocada en preparar el sitio para posicionar mejor: limpieza de código muerto, corrección de bugs reales encontrados durante la revisión, y una reescritura de contenido del blog que estaba generando riesgo de penalización SEO.

## 1. Limpieza de código muerto y archivos basura

- ~17 MB de archivos sin relación con el proyecto en la raíz del repo (residuo de una exportación de Keynote, imágenes/CSS/JS sueltos) — borrados.
- Import muerto de `Prism` en `ArticleBody.jsx` (el highlighting real lo hacía `highlight.js`; dos librerías de syntax highlighting cargadas, una inerte).
- `public/prismjs/` (copia estática duplicada del paquete npm `prismjs`) — borrado.
- 9 imágenes huérfanas en `public/projects/` no referenciadas por ningún proyecto — borradas.
- Dependencias sin uso (`tailwind-merge`, `@gsap/react`) — quitadas de `package.json`.
- Favicon declarado dos veces en `<head>` (manual + `metadata.icons`) — Google/redes veían el ícono repetido 3 veces en el HTML final.
- 8 archivos `.md` de sesiones anteriores movidos de la raíz a `docs/`.
- `migrate.mjs` (script real, migra imágenes de proyectos a Supabase Storage) estaba suelto en la raíz en vez de en `scripts/` — reubicado.

## 2. El problema grave: contenido de blog generado por plantilla

15 de ~30 posts del blog (tanda generada 24–31 dic 2025 + 2 más en 2026) compartían un **texto plantilla idéntico**, solo cambiaba el sustantivo del tema — patrón que Google penaliza bajo su política de *Scaled Content Abuse*. Además:

- La `description` de esos posts salía **cruda al HTML** (`<meta>`, `og:description`, JSON-LD) con markdown sin limpiar y cortada a mitad de frase.
- 9 versiones en inglés (`.en.mdx`) tenían el **texto en español** bajo `hreflang="en"`.
- 9 versiones en inglés usaban la imagen genérica del sitio (`/images/og.png`) como portada en vez de una propia.
- Dos pares de posts duplicados canibalizando la misma keyword (JWT/NextAuth, event handlers vs addEventListener) — se conservó la versión más completa de cada par y se borró la otra.

### Causa raíz (en el pipeline de generación, `src/services/ai.mjs` y `scripts/`)

1. **Ningún script cargaba `.env.local`** — la API key nunca estaba disponible, toda llamada a IA fallaba en silencio (`catch {}` sin loggear nada) y el código caía al template hardcodeado.
2. El modelo de Groq hardcodeado (`llama-3.3-70b-versatile`) fue descontinuado por el proveedor → 404 en cada llamada.
3. `max_tokens: 8000` excedía el límite de 8000 tokens/minuto de la cuenta (cuenta prompt + respuesta) → 413 en cada llamada.
4. `generateEnglishVersion` traducía el cuerpo pero **nunca el `title`/`description`** del frontmatter.
5. `fix-covers.mjs` excluía explícitamente los archivos `.en.mdx` de su alcance.
6. `generate-blog.mjs` generaba la portada real pero nunca escribía el path de vuelta al frontmatter (quedaba `og.png` para siempre).

Los 6 puntos se corrigieron en el código (no solo en el contenido ya publicado), para que la próxima generación no repita el problema.

### Qué se hizo con el contenido

- 14 posts reescritos con contenido real (código funcional, datos/cifras, tablas comparativas, ~1500–2000 palabras c/u) usando el pipeline ya corregido.
- 8 traducciones al inglés regeneradas correctamente (frontmatter + cuerpo).
- 2 posts duplicados eliminados (ES + EN + portadas asociadas).

## 3. Portadas del blog

- Antes: siempre la misma paleta de color ("Cyber Neon") sin importar el tema, con el título como texto grande superpuesto.
- Ahora (`src/services/cover.mjs`): sin texto de título — un motivo gráfico geométrico grande (escudo, cilindro de base de datos, red neuronal, lupa, engranaje, contenedores, grilla hexagonal) elegido según el tema/tags del post, con una de 6 paletas de color, y solo "jaimetr.dev" chico en la esquina.
- Bug de recorte real encontrado: el hero de la página de detalle usa `aspect-[21/9]` con `object-cover` sobre una imagen 1200×800 (3:2) — recorta ~18% arriba y abajo. Los íconos más altos (escudo, grilla hexagonal) se salían de esa franja. Se corrigió con una escala calculada por ícono para que el punto más lejano en Y siempre quede dentro de la zona visible.
- La card de artículos (`ArticleCard.jsx`) se rediseñó: imagen completa arriba en proporción 3:2 (igual a la portada nativa, cero recorte), tags como pills glassmorphism sobre la imagen, título a 2 líneas máx + elipsis, todas las cards del mismo alto (CSS grid stretch).

## 4. Datos de proyectos falsos

Se encontraron **dos sistemas de proyectos desconectados**:

- El real y en vivo: `/projects` y la sección del home leen de la tabla `projects` de Supabase vía `ProjectGallery.tsx` — proyectos reales, administrables desde `/admin`.
- Uno viejo y huérfano: `src/helpers/projects.js`, 5 proyectos de ejemplo/placeholder ("Portal Vitrina Colombia", "Sitio web Colraices", "momentum-app", "Instapets PWA", "CMS de inmuebles") que alimentaban páginas de detalle (`/es/projects/[slug]`) a las que ya no linkeaba ninguna parte de la UI real, pero **seguían en el sitemap** — Google las indexaba como si fueran proyectos reales del dueño del sitio.

Confirmado por el dueño que ninguno de los 5 es un proyecto real. Se eliminó todo el sistema huérfano: `helpers/projects.js`, la ruta `[lang]/projects/[slug]/`, `ProjectBody.jsx`, `ProjectJsonLd.jsx`, `ProjectCard.jsx` (no confundir con `portfolio/ProjectCard.tsx`, que sigue en uso), `ListOfProjects.jsx` (ya estaba huérfano, no se importaba en ningún lado), y las entradas correspondientes del sitemap. El listado real de proyectos (Supabase) no se tocó y sigue funcionando igual.

## 5. Links rotos y página 404

- No existía ningún `not-found.js` — un link roto mostraba el 404 genérico de Next sin marca ni forma de volver.
- Las páginas de detalle de posts y proyectos **no llamaban `notFound()`** cuando el slug no existía — renderizaban una página casi vacía con el slug crudo como título (ej. `undefined | Jaime Tarazona Rodriguez`).
- Fix: `src/app/[lang]/not-found.js` con diseño del sitio y links a inicio/blog; `notFound()` agregado en `generateMetadata` y en el componente de página tanto para posts como proyectos.
- Nota de arquitectura: el proyecto no tiene `src/app/layout.js` raíz (cada segmento de primer nivel define su propio `<html>/<body>`), por lo que un `not-found.js` en la raíz no es viable sin agregar ese layout — se optó por no tocar esa arquitectura y confiar en el `not-found.js` de `[lang]`, que cubre prácticamente todos los casos reales gracias al middleware de idioma.
- Bug real en el footer: los links por defecto no llevaban prefijo de idioma (`/projects` en vez de `/es/projects` o `/en/projects`), y en inglés apuntaban igual que en español — corregido.

## 6. Otros bugs encontrados durante la verificación

- `StatsCard.tsx` renderizaba `<Image src="">` (string vacío) en cada carga hasta que el fetch a Supabase resolvía — error de consola en cada visita, y si el campo no estaba seteado en la base, el error era permanente. Se agregó guard condicional.
- `ArticleCard.jsx` usaba `<img>` crudo (flaggeado por el linter de Next por impacto en LCP) — vuelto a `next/image`.

## Pendiente / a considerar

- El schema actual de la tabla `projects` en Supabase (`title, description, image_url, category, technologies[], link_url, github_url, ...`) no tiene campos para una página de detalle rica (abstract, features, galería de imágenes) como tenía el viejo sistema estático. Si en algún momento se quiere una página de "case study" por proyecto, hay que ampliar el schema — no recrear un archivo JSON/JS estático en paralelo (por eso pasó esto la primera vez).
- `docs/*` (excepto este archivo) son reportes de sesiones anteriores, no siempre reflejan el estado actual del código — usar como contexto histórico, verificar contra el código antes de asumir vigencia.
