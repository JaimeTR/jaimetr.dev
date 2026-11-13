// Utilidades de datos para las versiones del inicio. Funciones puras: se pueden usar en servidor y en cliente.
// Nada aqui lee la hora actual; el servidor pasa `ahora` (ms) para que servidor y cliente pinten lo mismo.

const DIA = 86400000

/** El perfil separa cargos y empresas con "|": cada parte va por separado. */
export const partes = (texto) => String(texto || '').split('|').map((p) => p.trim()).filter(Boolean)

const aMs = (iso) => (iso ? new Date(`${iso}T12:00:00Z`).getTime() : null)

/** Experiencias del ERP -> objetos listos para pintar, en el idioma pedido. `ahora` cierra las que siguen en curso. */
export function normalizarExperiencia(lista = [], lang, ahora) {
    const es = lang === 'es'
    return lista.map((e, i) => {
        const inicio = aMs(e.inicio)
        const enCurso = Boolean(e.actual) || Boolean(inicio && !e.fin)
        return {
            id: `exp-${i}`,
            cargo: partes(es ? e.cargo : e.cargoEn || e.cargo),
            empresa: partes(es ? e.empresaNombre : e.empresaNombreEn || e.empresaNombre),
            periodo: es ? e.periodo : e.periodoEn || e.periodo,
            descripcion: (es ? e.descripcion : e.descripcionEn || e.descripcion) || '',
            inicio,
            fin: inicio ? (e.fin ? aMs(e.fin) : ahora) : null,
            enCurso,
        }
    })
}

export const conFechas = (xs) => xs.filter((x) => x.inicio)
export const sinFechas = (xs) => xs.filter((x) => !x.inicio)
export const masNuevoPrimero = (xs) => [...xs].sort((a, b) => (b.inicio ?? 0) - (a.inicio ?? 0))
export const masAntiguoPrimero = (xs) => [...xs].sort((a, b) => (a.inicio ?? Infinity) - (b.inicio ?? Infinity))

/** Anos completos entre una fecha y `ahora`. */
export const aniosDesde = (ms, ahora) => Math.floor((ahora - ms) / (365.25 * DIA))

/** "2 años 3 meses" a partir de dos fechas. */
export function duracion(inicio, fin, lang) {
    if (!inicio || !fin) return ''
    const meses = Math.max(1, Math.round((fin - inicio) / (30.44 * DIA)))
    const a = Math.floor(meses / 12)
    const m = meses % 12
    const es = lang === 'es'
    const partesTxt = []
    if (a) partesTxt.push(es ? `${a} ${a === 1 ? 'año' : 'años'}` : `${a} ${a === 1 ? 'year' : 'years'}`)
    if (m) partesTxt.push(es ? `${m} ${m === 1 ? 'mes' : 'meses'}` : `${m} ${m === 1 ? 'month' : 'months'}`)
    return partesTxt.join(es ? ' y ' : ' and ')
}

/** Reparte las experiencias con fechas en carriles que no se pisan (para la linea de tiempo). */
export function carriles(xs) {
    const orden = masAntiguoPrimero(xs)
    const finales = []
    return orden.map((x) => {
        let c = finales.findIndex((f) => f <= x.inicio)
        if (c === -1) c = finales.length
        finales[c] = x.fin
        return { ...x, carril: c }
    })
}

const ETIQUETAS = {
    frontend: { es: 'Frontend', en: 'Frontend' },
    backend: { es: 'Backend', en: 'Backend' },
    learning: { es: 'Aprendiendo', en: 'Learning' },
    tools: { es: 'Herramientas', en: 'Tools' },
}

export function agruparHabilidades(habilidades = [], lang) {
    return ['frontend', 'backend', 'learning', 'tools']
        .map((cat) => ({
            categoria: cat,
            etiqueta: ETIQUETAS[cat][lang === 'es' ? 'es' : 'en'],
            nombres: habilidades.filter((h) => h.categoria === cat).sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)).map((h) => h.nombre),
        }))
        .filter((g) => g.nombres.length)
}

export const rutaProyectos = (lang) => `/${lang}/${lang === 'es' ? 'proyectos' : 'projects'}`
export const rutaArticulos = (lang) => `/${lang}/${lang === 'es' ? 'articulos' : 'posts'}`

/** Redes visibles del perfil, ya filtradas. */
export function redesDe(p = {}) {
    return [
        p.is_linkedin_visible !== false && p.linkedin_url && { nombre: 'LinkedIn', url: p.linkedin_url },
        p.is_github_visible !== false && p.github_url && { nombre: 'GitHub', url: p.github_url },
        p.is_tiktok_visible !== false && p.tiktok_url && { nombre: 'TikTok', url: p.tiktok_url },
    ].filter(Boolean)
}

/** "DESCARGAR CV" -> "Descargar CV". */
export function oracion(texto, lang) {
    const bajo = String(texto || '').toLocaleLowerCase(lang).replace(/\bcv\b/g, 'CV')
    return bajo.charAt(0).toLocaleUpperCase(lang) + bajo.slice(1)
}
