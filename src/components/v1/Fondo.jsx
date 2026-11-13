'use client'
import { useEffect, useRef } from 'react'
import { gsap, reducirMovimiento } from '@/components/fx/gsap'

/** Cuadriculado fijo de plano + foco de luz que sigue al cursor + barra de progreso de lectura. */
export default function Fondo() {
    const plano = useRef(null)
    const barra = useRef(null)

    useEffect(() => {
        const tema = plano.current.closest('.theme-v1')
        const fino = window.matchMedia('(pointer: fine)').matches
        let raf = 0
        let px = 0
        let py = 0

        const mover = (e) => {
            px = e.clientX
            py = e.clientY
            plano.current.dataset.activo = 'true'
            if (raf) return
            raf = requestAnimationFrame(() => {
                raf = 0
                tema.style.setProperty('--mx', `${px}px`)
                tema.style.setProperty('--my', `${py}px`)
            })
        }
        const salir = () => {
            plano.current.dataset.activo = 'false'
        }

        if (fino && !reducirMovimiento()) {
            window.addEventListener('pointermove', mover, { passive: true })
            document.addEventListener('pointerleave', salir)
        }

        const ctx = gsap.context(() => {
            if (reducirMovimiento()) {
                gsap.set(barra.current, { scaleX: 0 })
                return
            }
            const disparador = { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: true }
            // La rejilla se desplaza mas despacio que el contenido (paralaje) sin desalinear la capa de luz.
            gsap.to(tema, { '--gy': '-260px', ease: 'none', scrollTrigger: disparador })
            gsap.to(barra.current, { scaleX: 1, ease: 'none', scrollTrigger: disparador })
        })

        return () => {
            ctx.revert()
            window.removeEventListener('pointermove', mover)
            document.removeEventListener('pointerleave', salir)
            if (raf) cancelAnimationFrame(raf)
        }
    }, [])

    return (
        <>
            <div className="v1-progreso" ref={barra} aria-hidden="true" />
            <div className="v1-plano" ref={plano} aria-hidden="true">
                <div className="v1-plano__vineta" />
                <div className="v1-plano__rejilla" />
                <div className="v1-plano__luz" />
            </div>
        </>
    )
}
