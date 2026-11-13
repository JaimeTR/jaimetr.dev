'use client'
import { useEffect, useRef } from 'react'
import { FiArrowRight, FiDownload } from 'react-icons/fi'
import { gsap, reducirMovimiento } from '@/components/fx/gsap'
import Magnetico from './Magnetico'

const letras = (texto) => [...texto].map((l, i) => (
    <span key={`${l}-${i}`} className="v2-letra" aria-hidden="true">
        {l}
    </span>
))

/** Primer pantallazo: el nombre entra letra a letra, un destello sigue al cursor y todo se aleja al hacer scroll. */
export default function Hero({ roles, sub, disponibilidad, correo, cv, cvTxt, es }) {
    const raiz = useRef(null)
    const interior = useRef(null)

    useEffect(() => {
        const el = raiz.current
        const fino = window.matchMedia('(pointer: fine)').matches
        let raf = 0
        const mover = (e) => {
            if (raf) return
            raf = requestAnimationFrame(() => {
                raf = 0
                const r = el.getBoundingClientRect()
                el.style.setProperty('--mx', `${e.clientX - r.left}px`)
                el.style.setProperty('--my', `${e.clientY - r.top}px`)
            })
        }
        if (fino && !reducirMovimiento()) el.addEventListener('pointermove', mover)

        const ctx = gsap.context(() => {
            if (reducirMovimiento()) return
            gsap.from('.v2-letra', { yPercent: 118, rotate: 5, duration: 1.3, ease: 'expo.out', stagger: 0.045, delay: 0.15 })
            gsap.from('.v2-hero-entra', { opacity: 0, y: 28, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 0.75 })
            gsap.from('.v2-scroll', { scaleY: 0, duration: 1.2, ease: 'power3.out', delay: 1.4 })
            gsap.to(interior.current, {
                scale: 0.9,
                opacity: 0.12,
                y: -80,
                ease: 'none',
                scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
            })
        }, el)

        return () => {
            ctx.revert()
            el.removeEventListener('pointermove', mover)
            if (raf) cancelAnimationFrame(raf)
        }
    }, [])

    return (
        <section ref={raiz} className="v2-hero" aria-labelledby="v2-nombre">
            <div className="v2-wrap" style={{ width: '100%' }}>
                <div ref={interior}>
                    <h1 id="v2-nombre" className="v2-display v2-hero__nombre" aria-label="Jaime Tarazona">
                        <span className="v2-fila">{letras('Jaime')}</span>
                        <span className="v2-fila">{letras('Tarazona')}</span>
                    </h1>
                    <div className="v2-hero__fila">
                        <div>
                            {roles.length > 0 && (
                                <p className="v2-hero__roles v2-hero-entra">
                                    {roles.map((r) => (
                                        <span key={r}>{r}</span>
                                    ))}
                                </p>
                            )}
                            {(sub || disponibilidad) && (
                                <p className="v2-hero__sub v2-hero-entra">
                                    {sub} {disponibilidad}
                                </p>
                            )}
                        </div>
                        <div className="v2-acciones v2-hero-entra">
                            {correo && (
                                <Magnetico>
                                    <a href={`mailto:${correo}`} className="v2-btn v2-btn--pri">
                                        {es ? 'Escríbeme' : 'Write to me'}
                                        <FiArrowRight aria-hidden="true" />
                                    </a>
                                </Magnetico>
                            )}
                            {cv && (
                                <Magnetico>
                                    <a href={cv} target="_blank" rel="noopener noreferrer" className="v2-btn v2-btn--vidrio">
                                        {cvTxt}
                                        <FiDownload aria-hidden="true" />
                                    </a>
                                </Magnetico>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <span className="v2-scroll" aria-hidden="true" />
        </section>
    )
}
