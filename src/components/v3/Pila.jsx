'use client'
import { useEffect, useRef } from 'react'
import { gsap, reducirMovimiento } from '@/components/fx/gsap'
import { duracion } from '@/components/fx/datos'

const FECHA = (ms, lang) => new Intl.DateTimeFormat(lang, { month: 'short', year: 'numeric' }).format(ms)

/**
 * Experiencia como pila de tarjetas "sticky": cada cargo se fija arriba y el siguiente lo cubre mientras el anterior
 * se encoge y se apaga. Cada tarjeta lleva su propia barra de duracion sobre el eje de anos.
 */
export default function Pila({ items, ahora, lang }) {
    const es = lang === 'es'
    const raiz = useRef(null)
    const fechadas = items.filter((x) => x.inicio)
    const d0 = fechadas.length ? Date.UTC(new Date(Math.min(...fechadas.map((x) => x.inicio))).getUTCFullYear(), 0, 1) : 0
    const d1 = Date.UTC(new Date(ahora).getUTCFullYear() + 1, 0, 1)
    const a0 = new Date(d0).getUTCFullYear()
    const a1 = new Date(ahora).getUTCFullYear()
    const pct = (t) => ((t - d0) / (d1 - d0)) * 100

    useEffect(() => {
        if (reducirMovimiento()) return
        const mm = gsap.matchMedia()
        const ctx = gsap.context(() => {
            mm.add('(min-width: 900px)', () => {
                const cartas = gsap.utils.toArray('.v3-carta', raiz.current)
                cartas.forEach((carta, i) => {
                    const siguiente = cartas[i + 1]
                    if (!siguiente) return
                    gsap.to(carta, {
                        scale: 0.93,
                        filter: 'brightness(0.55)',
                        ease: 'none',
                        scrollTrigger: { trigger: siguiente, start: 'top 88%', end: 'top 120px', scrub: true },
                    })
                })
            })
            gsap.utils.toArray('.v3-carta', raiz.current).forEach((carta) => {
                gsap.from(carta.querySelectorAll('.v3-mini__barra'), { scaleX: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: carta, start: 'top 80%', once: true } })
            })
        }, raiz)
        return () => {
            mm.revert()
            ctx.revert()
        }
    }, [items])

    if (!items.length) return null

    return (
        <div className="v3-pila" ref={raiz}>
            {items.map((x, i) => (
                <article key={x.id} className="v3-carta" style={{ '--i': i }}>
                    <div className="v3-carta__fila">
                        <div>
                            {x.periodo && <p className="v3-carta__periodo">{x.periodo}</p>}
                            <h3 className="v3-titulo v3-carta__cargo">
                                {x.cargo.map((c) => (
                                    <span key={c} style={{ display: 'block' }}>
                                        {c}
                                    </span>
                                ))}
                            </h3>
                            {x.empresa.length > 0 && (
                                <p className="v3-carta__empresa">
                                    {x.empresa.map((c) => (
                                        <span key={c} style={{ display: 'block' }}>
                                            {c}
                                        </span>
                                    ))}
                                </p>
                            )}
                            {x.descripcion && <p className="v3-carta__desc">{x.descripcion}</p>}
                        </div>
                        {x.inicio && (
                            <div className="v3-mini" aria-hidden="true">
                                <div className="v3-mini__eje">
                                    <div className="v3-mini__barra" style={{ left: `${pct(x.inicio)}%`, width: `${Math.max(2, pct(x.fin) - pct(x.inicio))}%` }} />
                                </div>
                                <div className="v3-mini__anos">
                                    <span>{a0}</span>
                                    <span>{a1}</span>
                                </div>
                                <p className="v3-mini__dur">
                                    {FECHA(x.inicio, lang)} – {x.enCurso ? (es ? 'hoy' : 'present') : FECHA(x.fin, lang)} · {duracion(x.inicio, x.fin, lang)}
                                </p>
                            </div>
                        )}
                    </div>
                </article>
            ))}
        </div>
    )
}
