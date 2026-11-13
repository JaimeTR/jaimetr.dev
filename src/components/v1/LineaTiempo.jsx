'use client'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { gsap, reducirMovimiento } from '@/components/fx/gsap'
import { carriles, duracion } from '@/components/fx/datos'

const W = 1200
const PAD = 28
const CABECERA = 44
const CARRIL = 52
const ALTO_BARRA = 34
const CHAFLAN = 9

const FECHA = (ms, lang) => new Intl.DateTimeFormat(lang, { month: 'short', year: 'numeric' }).format(ms)

/** Plano de la trayectoria: una barra por experiencia, colocada por sus fechas reales. Se dibuja al entrar en pantalla. */
export default function LineaTiempo({ items, ahora, lang }) {
    const es = lang === 'es'
    const idBase = useId().replace(/:/g, '')
    const raiz = useRef(null)
    const dibujo = useMemo(() => {
        const lista = carriles(items)
        if (!lista.length) return null
        const anoMin = new Date(Math.min(...lista.map((x) => x.inicio))).getUTCFullYear()
        const anoHoy = new Date(ahora).getUTCFullYear()
        const d0 = Date.UTC(anoMin, 0, 1)
        const d1 = Date.UTC(anoHoy + 1, 0, 1)
        const x = (t) => PAD + ((t - d0) / (d1 - d0)) * (W - PAD * 2)
        const nCarriles = Math.max(...lista.map((l) => l.carril)) + 1
        const alto = CABECERA + nCarriles * CARRIL + 18
        const anos = Array.from({ length: anoHoy + 1 - anoMin + 1 }, (_, i) => anoMin + i)
        return { lista, x, alto, anos, d0, d1, xHoy: x(ahora) }
    }, [items, ahora])

    const recientes = useMemo(() => (dibujo ? [...dibujo.lista].sort((a, b) => b.fin - a.fin)[0] : null), [dibujo])
    const [activaId, setActivaId] = useState(null)
    const activa = dibujo?.lista.find((l) => l.id === activaId) || recientes

    useEffect(() => {
        if (!dibujo || reducirMovimiento()) return
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ scrollTrigger: { trigger: raiz.current, start: 'top 85%', once: true } })
            tl.from('.v1-t-eje', { opacity: 0, duration: 0.6, stagger: 0.04 })
                .from('.v1-t-linea', { scaleY: 0, transformOrigin: '50% 0', duration: 0.8, stagger: 0.04, ease: 'power3.out' }, 0)
                .from('.v1-barra', { opacity: 0, duration: 0.01, stagger: 0.14 }, 0.3)
                .from('.v1-barra path', { scaleX: 0, transformBox: 'fill-box', transformOrigin: '0 50%', duration: 1.1, stagger: 0.14, ease: 'expo.out' }, 0.3)
                .from('.v1-barra text', { opacity: 0, x: -10, duration: 0.6, stagger: 0.14, ease: 'power2.out' }, 0.9)
                .from('.v1-t-hoy', { opacity: 0, duration: 0.6 }, 1.2)
            gsap.to('.v1-t-pulso', { attr: { r: 11 }, opacity: 0, duration: 1.8, repeat: -1, ease: 'power1.out' })
        }, raiz)
        return () => ctx.revert()
    }, [dibujo])

    if (!dibujo) return null
    const { lista, x, alto, anos, xHoy } = dibujo

    const irAExperiencia = (id) => window.dispatchEvent(new CustomEvent('v1:ir', { detail: id }))

    return (
        <div className="v1-tiempo" ref={raiz}>
            <div className="v1-wrap" style={{ paddingBlock: '1.25rem 0.5rem' }}>
                <svg viewBox={`0 0 ${W} ${alto}`} role="group" aria-label={es ? 'Trayectoria profesional por fechas' : 'Career timeline by date'}>
                    {anos.map((a) => {
                        const xa = x(Date.UTC(a, 0, 1))
                        return (
                            <g key={a}>
                                <line className="v1-t-linea" x1={xa} x2={xa} y1={CABECERA - 12} y2={alto - 10} stroke="rgba(0,168,232,0.22)" />
                                <text className="v1-t-eje" x={xa + 6} y={CABECERA - 20} fill="#7f9bb8" fontSize="14" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                    {a}
                                </text>
                            </g>
                        )
                    })}
                    <line className="v1-t-eje" x1={PAD} x2={W - PAD} y1={CABECERA - 12} y2={CABECERA - 12} stroke="rgba(0,168,232,0.5)" />

                    {lista.map((e) => {
                        const x0 = x(e.inicio)
                        const x1 = x(e.fin)
                        const y = CABECERA + e.carril * CARRIL + (CARRIL - ALTO_BARRA) / 2
                        const ancho = Math.max(x1 - x0, 14)
                        const c = Math.min(CHAFLAN, ancho / 3)
                        const d = `M${x0},${y} H${x0 + ancho - c} L${x0 + ancho},${y + c} V${y + ALTO_BARRA} H${x0 + c} L${x0},${y + ALTO_BARRA - c} Z`
                        const clip = `${idBase}-${e.id}`
                        const etiqueta = `${e.empresa[0] || e.cargo[0]} · ${FECHA(e.inicio, lang)} – ${e.enCurso ? (es ? 'hoy' : 'present') : FECHA(e.fin, lang)}`
                        return (
                            <g
                                key={e.id}
                                className="v1-barra"
                                data-activa={activa?.id === e.id}
                                tabIndex={0}
                                role="button"
                                aria-label={etiqueta}
                                onPointerEnter={() => setActivaId(e.id)}
                                onFocus={() => setActivaId(e.id)}
                                onClick={() => irAExperiencia(e.id)}
                                onKeyDown={(ev) => (ev.key === 'Enter' || ev.key === ' ') && (ev.preventDefault(), irAExperiencia(e.id))}
                            >
                                <clipPath id={clip}>
                                    <rect x={x0} y={y} width={ancho} height={ALTO_BARRA} />
                                </clipPath>
                                <path d={d} />
                                {ancho > 80 && (
                                    <text x={x0 + 14} y={y + ALTO_BARRA / 2 + 5} fill="#e8f4ff" fontSize="14" fontWeight="600" clipPath={`url(#${clip})`}>
                                        {e.empresa[0] || e.cargo[0]}
                                    </text>
                                )}
                            </g>
                        )
                    })}

                    <g className="v1-t-hoy">
                        <line x1={xHoy} x2={xHoy} y1={CABECERA - 12} y2={alto - 10} stroke="#75dbff" strokeDasharray="4 5" />
                        <circle className="v1-t-pulso" cx={xHoy} cy={CABECERA - 12} r="4" fill="none" stroke="#75dbff" />
                        <circle cx={xHoy} cy={CABECERA - 12} r="4" fill="#75dbff" />
                        <text x={xHoy - 8} y={CABECERA - 20} textAnchor="end" fill="#75dbff" fontSize="14" fontWeight="600">
                            {es ? 'Hoy' : 'Today'}
                        </text>
                    </g>
                </svg>
            </div>
            {activa && (
                <div className="v1-wrap" style={{ paddingBlock: '0.85rem 1.1rem' }}>
                    <p aria-live="polite" style={{ color: 'var(--ink-2)', fontSize: '0.95rem', fontVariantNumeric: 'tabular-nums' }}>
                        <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>{activa.cargo[0]}</strong>
                        {activa.empresa[0] ? ` · ${activa.empresa[0]}` : ''} · {FECHA(activa.inicio, lang)} – {activa.enCurso ? (es ? 'hoy' : 'present') : FECHA(activa.fin, lang)}
                        {duracion(activa.inicio, activa.fin, lang) ? ` · ${duracion(activa.inicio, activa.fin, lang)}` : ''}
                    </p>
                </div>
            )}
        </div>
    )
}
