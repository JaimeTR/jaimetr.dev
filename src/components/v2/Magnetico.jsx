'use client'
import { useEffect, useRef } from 'react'
import { gsap, reducirMovimiento } from '@/components/fx/gsap'

/** Envuelve un enlace o boton: con puntero fino se atrae hacia el cursor unos pocos pixeles. */
export default function Magnetico({ children, fuerza = 0.3, className = '' }) {
    const ref = useRef(null)

    useEffect(() => {
        const el = ref.current
        if (!el || reducirMovimiento() || !window.matchMedia('(pointer: fine)').matches) return
        const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
        const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })
        const mover = (e) => {
            const r = el.getBoundingClientRect()
            x((e.clientX - (r.left + r.width / 2)) * fuerza)
            y((e.clientY - (r.top + r.height / 2)) * fuerza)
        }
        const salir = () => {
            x(0)
            y(0)
        }
        el.addEventListener('pointermove', mover)
        el.addEventListener('pointerleave', salir)
        return () => {
            el.removeEventListener('pointermove', mover)
            el.removeEventListener('pointerleave', salir)
        }
    }, [fuerza])

    return (
        <span ref={ref} className={className} style={{ display: 'inline-block' }}>
            {children}
        </span>
    )
}
