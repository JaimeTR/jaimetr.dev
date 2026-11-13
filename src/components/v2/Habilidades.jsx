'use client'
import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, reducirMovimiento } from '@/components/fx/gsap'

/** Tres filas que corren en sentidos opuestos y aceleran con la velocidad del scroll. La lista real queda para lectores. */
export default function Habilidades({ nombres, es }) {
    const raiz = useRef(null)
    // Reparte los nombres en tres filas y duplica cada una para el bucle continuo.
    const filas = [0, 1, 2].map((r) => nombres.filter((_, i) => i % 3 === r))

    useEffect(() => {
        if (reducirMovimiento()) return
        const ctx = gsap.context(() => {
            const tweens = gsap.utils.toArray('.v2-fila-corre', raiz.current).map((fila, i) => {
                const hacia = i % 2 === 0 ? -50 : 0
                const desde = i % 2 === 0 ? 0 : -50
                return gsap.fromTo(fila, { xPercent: desde }, { xPercent: hacia, ease: 'none', duration: 34 - i * 4, repeat: -1 })
            })
            ScrollTrigger.create({
                trigger: raiz.current,
                start: 'top bottom',
                end: 'bottom top',
                onUpdate: (self) => {
                    const impulso = gsap.utils.clamp(0, 5, Math.abs(self.getVelocity()) / 380)
                    tweens.forEach((t) => gsap.to(t, { timeScale: 1 + impulso, duration: 0.25, overwrite: true, onComplete: () => gsap.to(t, { timeScale: 1, duration: 1.4 }) }))
                },
            })
        }, raiz)
        return () => ctx.revert()
    }, [])

    if (!nombres.length) return null

    return (
        <section id="habilidades" ref={raiz} className="v2-hab" aria-labelledby="hab2-titulo">
            <div className="v2-wrap">
                <h2 id="hab2-titulo" className="v2-display v2-hab__titulo">
                    {es ? 'Con qué trabajo' : 'What I work with'}
                </h2>
            </div>
            <ul className="v2-lista-hab">
                {nombres.map((n) => (
                    <li key={n}>{n}</li>
                ))}
            </ul>
            <div aria-hidden="true">
                {filas.map((fila, r) => (
                    <div key={r} className="v2-fila-corre">
                        {[...fila, ...fila, ...fila, ...fila].map((n, i) => (
                            <span key={`${n}-${i}`} className="v2-chip">
                                {n}
                            </span>
                        ))}
                    </div>
                ))}
            </div>
        </section>
    )
}
