'use client'
import { useEffect, useRef } from 'react'
import { gsap, reducirMovimiento } from '@/components/fx/gsap'

/** Un parrafo de presentacion que se "enciende" palabra por palabra mientras la seccion esta fija. */
export default function Intro({ texto }) {
    const raiz = useRef(null)
    const palabras = texto.split(/\s+/).filter(Boolean)

    useEffect(() => {
        if (reducirMovimiento()) return
        const mm = gsap.matchMedia()
        const ctx = gsap.context(() => {
            mm.add('(min-width: 768px)', () => {
                const ps = gsap.utils.toArray('.v2-palabra', raiz.current)
                gsap.set(ps, { opacity: 0.16 })
                gsap.to(ps, {
                    opacity: 1,
                    ease: 'none',
                    stagger: 0.5,
                    scrollTrigger: { trigger: raiz.current, start: 'top top', end: () => `+=${Math.max(80, ps.length * 2.6)}%`, pin: true, scrub: 0.5, anticipatePin: 1 },
                })
            })
            mm.add('(max-width: 767px)', () => {
                const ps = gsap.utils.toArray('.v2-palabra', raiz.current)
                gsap.set(ps, { opacity: 0.2 })
                gsap.to(ps, {
                    opacity: 1,
                    ease: 'none',
                    stagger: 0.5,
                    scrollTrigger: { trigger: raiz.current, start: 'top 70%', end: 'bottom 45%', scrub: 0.4 },
                })
            })
        }, raiz)
        return () => {
            mm.revert()
            ctx.revert()
        }
    }, [texto])

    if (!palabras.length) return null

    return (
        <section ref={raiz} className="v2-intro" aria-label={texto}>
            <div className="v2-wrap">
                <p aria-hidden="true">
                    {palabras.map((p, i) => (
                        <span key={`${p}-${i}`} className="v2-palabra">
                            {p}
                        </span>
                    ))}
                </p>
            </div>
        </section>
    )
}
