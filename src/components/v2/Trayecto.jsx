'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap, reducirMovimiento } from '@/components/fx/gsap'
import { duracion } from '@/components/fx/datos'

const FECHA = (ms, lang) => new Intl.DateTimeFormat(lang, { month: 'short', year: 'numeric' }).format(ms)

/**
 * Trayecto profesional, del primer cargo al actual. En escritorio la seccion se fija y la pista avanza de lado
 * con el scroll mientras una linea de luz se dibuja; el ano de cada capitulo se mueve con otra velocidad.
 * En movil es una lista vertical.
 */
export default function Trayecto({ items, lang }) {
    const es = lang === 'es'
    const raiz = useRef(null)
    const pista = useRef(null)
    const relleno = useRef(null)
    const punto = useRef(null)
    const [actual, setActual] = useState(1)
    const ref = useRef(1)

    useEffect(() => {
        if (reducirMovimiento() || items.length < 2) return
        const mm = gsap.matchMedia()
        const ctx = gsap.context(() => {
            mm.add('(min-width: 900px)', () => {
                const n = items.length
                const recorrido = () => pista.current.scrollWidth - window.innerWidth
                const tl = gsap.timeline({
                    defaults: { ease: 'none' },
                    scrollTrigger: { trigger: raiz.current, start: 'top top', end: () => `+=${recorrido() * 0.55}`, pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true },
                })
                tl.to(pista.current, { x: () => -recorrido(), duration: 1 }, 0)
                tl.to(relleno.current, { scaleX: 1, duration: 1 }, 0)
                tl.to(punto.current, { left: '100%', duration: 1 }, 0)
                tl.fromTo('.v2-cap__ano', { x: 180 }, { x: -180, duration: 1 }, 0)
                tl.eventCallback('onUpdate', () => {
                    const i = Math.min(n, Math.round(tl.progress() * (n - 1)) + 1)
                    if (ref.current !== i) {
                        ref.current = i
                        setActual(i)
                    }
                })
                gsap.from('.v2-cap__cuerpo > *', { opacity: 0, y: 30, duration: 0.8, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: raiz.current, start: 'top 60%', once: true } })
            })
            mm.add('(max-width: 899px)', () => {
                gsap.utils.toArray('.v2-cap', raiz.current).forEach((cap) => {
                    gsap.from(cap.querySelectorAll('.v2-cap__cuerpo > *'), { opacity: 0, y: 26, duration: 0.8, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: cap, start: 'top 82%', once: true } })
                })
            })
        }, raiz)
        return () => {
            mm.revert()
            ctx.revert()
        }
    }, [items])

    if (!items.length) return null

    return (
        <section id="trayecto" ref={raiz} className="v2-tray" aria-labelledby="tray-titulo">
            <div className="v2-tray__marco">
                <div className="v2-wrap">
                    <h2 id="tray-titulo" className="v2-display v2-tray__titulo">
                        {es ? 'Mi trayecto' : 'My path'}
                    </h2>
                </div>
                <div ref={pista} className="v2-tray__pista">
                    {items.map((x) => (
                        <article key={x.id} className="v2-cap" aria-label={x.cargo[0]}>
                            <span className="v2-cap__ano" aria-hidden="true">
                                {x.inicio ? new Date(x.inicio).getUTCFullYear() : '+'}
                            </span>
                            <div className="v2-cap__cuerpo">
                                {x.periodo && <p className="v2-cap__periodo">{x.periodo}</p>}
                                <h3 className="v2-display v2-cap__cargo">
                                    {x.cargo.map((c) => (
                                        <span key={c} style={{ display: 'block' }}>
                                            {c}
                                        </span>
                                    ))}
                                </h3>
                                {x.empresa.length > 0 && (
                                    <p className="v2-cap__empresa">
                                        {x.empresa.map((c) => (
                                            <span key={c} style={{ display: 'block' }}>
                                                {c}
                                            </span>
                                        ))}
                                    </p>
                                )}
                                {x.descripcion && <p className="v2-cap__desc">{x.descripcion}</p>}
                                {x.inicio && (
                                    <p className="v2-cap__dur">
                                        {FECHA(x.inicio, lang)} – {x.enCurso ? (es ? 'hoy' : 'present') : FECHA(x.fin, lang)} · {duracion(x.inicio, x.fin, lang)}
                                    </p>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
                <div className="v2-via" aria-hidden="true">
                    <div className="v2-via__fill" ref={relleno} />
                    <div className="v2-via__punto" ref={punto} />
                </div>
                <div className="v2-contador" aria-hidden="true">
                    <span>
                        <strong>{String(actual).padStart(2, '0')}</strong> / {String(items.length).padStart(2, '0')}
                    </span>
                    <span>{es ? 'del primer cargo a hoy' : 'from the first role to today'}</span>
                </div>
            </div>
        </section>
    )
}
