'use client'
import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, reducirMovimiento } from '@/components/fx/gsap'

/** Cuatro grupos de habilidades como celdas de borde fino que se encienden en cascada al entrar. */
export default function Habilidades({ grupos, lang }) {
    const es = lang === 'es'
    const raiz = useRef(null)

    useEffect(() => {
        if (reducirMovimiento()) return
        const ctx = gsap.context(() => {
            gsap.utils.toArray('.v1-celdas', raiz.current).forEach((fila) => {
                gsap.from(fila.querySelectorAll('.v1-celda'), {
                    opacity: 0,
                    y: 14,
                    duration: 0.6,
                    ease: 'power3.out',
                    stagger: { each: 0.035, from: 'start' },
                    scrollTrigger: { trigger: fila, start: 'top 88%', once: true },
                })
            })
            ScrollTrigger.refresh()
        }, raiz)
        return () => ctx.revert()
    }, [])

    if (!grupos.length) return null

    return (
        <section id="habilidades" ref={raiz} className="v1-seccion" aria-labelledby="hab-titulo">
            <div className="v1-wrap">
                <div className="v1-seccion__cab">
                    <h2 id="hab-titulo" className="v1-display v1-h2">
                        {es ? 'Habilidades' : 'Skills'}
                    </h2>
                </div>
                <div className="v1-grupos">
                    {grupos.map((g) => (
                        <div key={g.categoria} className="v1-grupo">
                            <h3 className="v1-display">{g.etiqueta}</h3>
                            <ul className="v1-celdas">
                                {g.nombres.map((n) => (
                                    <li key={n} className="v1-celda">
                                        {n}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
