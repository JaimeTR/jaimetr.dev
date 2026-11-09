# jaimetr.dev — Portafolio de Jaime Tarazona

Portafolio y blog técnico hecho con Next.js 15 (App Router), React 19 y Tailwind CSS. El ERP DEVMARK es la única fuente de contenido. La administración se realiza en [admin.devmarkpe.com](https://admin.devmarkpe.com), vista JaimeTR.

## Requisitos y comandos

- Node.js 20.6+
- `npm install`
- `npm run dev` para desarrollo
- `npm run lint` para lint
- `npm run build` y `npm start` para producción

## Variables de entorno

Copia `.env.example` a `.env.local` y configura:

- `ERP_API_URL`: URL base de la API del ERP.
- `SITIO_SIGNING_SECRET`: secreto usado en el servidor para la cabecera `x-sitio-signature`; nunca se envía al navegador.
- `SITIO_SLUG`: slug del sitio, por defecto `jaimetr-dev`.
- `SUPABASE_URL_ERP_IMAGENES`: solo el hostname del Storage servido por el ERP (por ejemplo `nbvasmxtqfshgxjimzxq.supabase.co`).
- Variables opcionales de IA: `GROQ_API_KEY`, `GEMINI_API_KEY`, `OPENAI_API_KEY`, `AI_PROVIDER`, `AI_GEMINI_MODEL`.

Sin conexión al ERP, el build y las páginas públicas usan contenido vacío seguro. Los datos se cachean con ISR por 600 segundos. Los artículos compartidos se sirven desde la API pública igual que los artículos propios.

## Contenido

Perfil, experiencia, habilidades, proyectos y artículos se editan en el ERP DEVMARK. El blog se publica en `/es/articulos` y `/en/posts`; los `.mdx` archivados en `docs/archivo-posts/` son respaldo histórico y no se renderizan.

La galería y las páginas de detalle usan los proyectos publicados por el ERP. Los formularios de contacto se envían por una ruta del servidor del sitio al endpoint firmado `/mensajes`.

## Estructura

- `src/app/[lang]`: páginas públicas ES/EN.
- `src/app/api`: proxies del servidor para ERP, chat y contacto.
- `src/lib/erp.js`: cliente ERP con firma, timeout, ISR y fallbacks.
- `docs/archivo-posts`: artículos MDX históricos.
