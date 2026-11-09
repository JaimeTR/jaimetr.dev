// Proyectos del portafolio: salen del ERP DEVMARK (sitio "jaimetr-dev"). La firma nunca llega al navegador.
// Si el ERP no responde, las paginas usan estructuras vacias seguras.
const ETIQUETA = {
  webs: 'Webs',
  ecommerce: 'Ecommerce',
  software: 'Software a Medida',
  ia: 'Inteligencia Artificial',
  automatizacion: 'Automatizaciones',
  landing: 'Landing Pages',
  otros: 'Otros',
}

export async function erpGet(path) {
  const url = process.env.ERP_API_URL?.replace(/\/$/, '')
  const firma = process.env.SITIO_SIGNING_SECRET
  const slug = process.env.SITIO_SLUG || 'jaimetr-dev'
  if (!url || !firma) return null
  try {
    const res = await fetch(`${url}/api/v1/publico/sitios/${slug}/${path}`, { headers: { 'x-sitio-signature': firma }, next: { revalidate: 600 }, signal: AbortSignal.timeout(5000) })
    if (!res.ok) return null
    return await res.json()
  } catch { return null }
}
export async function datosPersonalesDelErp() { return (await erpGet('personal')) || { perfil: {}, experiencia: [], habilidades: [] } }
export async function articulosDelErp(lang = 'es') { return (await erpGet(`articulos?idioma=${lang}`))?.articulos || [] }
export async function articuloDelErp(slug) { return erpGet(`articulos/${encodeURIComponent(slug)}`) }
export async function proyectosDelErp() {
  const data = await erpGet('portafolio')
  if (!data) return null
  try {
    const { proyectos = [] } = data
    return proyectos.map((p, i) => ({ id: p.id ?? i + 1, slug: p.slug, title: p.titulo, titleEn: p.tituloEn, description: p.descripcion, descriptionEn: p.descripcionEn, image_url: p.portada || p.imagen || '', category: ETIQUETA[p.categoria] ?? 'Otros', rubro: p.rubro ?? undefined, technologies: p.tecnologias ?? [], link_url: p.enlace ?? '', github_url: p.github ?? '', is_featured: p.destacado, is_visible: true, sort_order: p.orden }))
  } catch { return null }
}
