// Proyectos del portafolio: salen del ERP DEVMARK (sitio "jaimetr-dev"). La firma nunca llega al navegador.
// Si el ERP no esta configurado o no responde, devuelve null y quien lo usa cae a Supabase.
const ETIQUETA = {
  webs: 'Webs',
  ecommerce: 'Ecommerce',
  software: 'Software a Medida',
  ia: 'Inteligencia Artificial',
  automatizacion: 'Automatizaciones',
  landing: 'Landing Pages',
  otros: 'Otros',
}

export async function proyectosDelErp() {
  const url = process.env.ERP_API_URL?.replace(/\/$/, '')
  const firma = process.env.SITIO_SIGNING_SECRET
  const slug = process.env.SITIO_SLUG || 'jaimetr-dev'
  if (!url || !firma) return null
  try {
    const res = await fetch(`${url}/api/v1/publico/sitios/${slug}/portafolio`, {
      headers: { 'x-sitio-signature': firma },
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(4000),
    })
    if (!res.ok) return null
    const { proyectos } = await res.json()
    return proyectos.map((p, i) => ({
      id: i + 1,
      title: p.titulo,
      description: p.descripcion,
      image_url: p.portada || p.imagen || '',
      category: ETIQUETA[p.categoria] ?? 'Otros',
      rubro: p.rubro ?? undefined,
      technologies: p.tecnologias ?? [],
      link_url: p.enlace ?? '',
      github_url: p.github ?? '',
      is_featured: p.destacado,
      is_visible: true,
      sort_order: p.orden,
    }))
  } catch {
    return null
  }
}
