# jaimetr.dev — contexto del proyecto

Portafolio y blog de Jaime Tarazona Rodriguez. Next.js 15 App Router. El ERP DEVMARK es la única fuente de datos; no hay conexión a Supabase ni panel de administración propio.

## Arquitectura

- No existe `src/app/layout.js`. `src/app/[lang]/layout.js` define `<html>` y `<body>`.
- El middleware aplica los prefijos `/es` y `/en`; `/es/articulos` reescribe al listado de posts y `/en/posts` conserva la ruta inglesa.
- Proyectos, perfil, experiencia, habilidades y artículos se obtienen desde `src/lib/erp.js`. Todas las llamadas son del servidor, firmadas con `x-sitio-signature`, cacheadas por 600 s y devuelven estructuras vacías seguras si no hay ERP.
- El ERP comparte artículos entre sitios cuando corresponde. `mostrarEn` y `sitioDuenoSlug` son datos de contrato y no afectan el render del sitio.
- Los artículos son HTML limpio del ERP. Los `.mdx` en `docs/archivo-posts/` son solo archivo histórico. El contenido se mantiene en `admin.devmarkpe.com`, vista JaimeTR.
- Contacto pasa por `/api/contact`; el secreto de firma nunca se expone al navegador. El chat arma su contexto con el endpoint de datos personales del ERP.
- La galería ya usa `/api/projects`. Los detalles `/[lang]/projects/[slug]` se generan solo para proyectos con slug.
- La tipografía Onest se carga localmente desde `@fontsource-variable/onest` para que el build no dependa de Google Fonts.

## Variables de entorno

- `ERP_API_URL`: URL base de la API ERP.
- `SITIO_SIGNING_SECRET`: firma privada del sitio; solo servidor.
- `SITIO_SLUG`: slug del sitio; por defecto `jaimetr-dev`.
- `SUPABASE_URL_ERP_IMAGENES`: hostname solamente para imágenes del Storage del ERP.
- IA opcional: `GROQ_API_KEY`, `GEMINI_API_KEY`, `OPENAI_API_KEY`, `AI_PROVIDER`, `AI_GEMINI_MODEL`.

Consulta `README.md` para comandos y configuración.
