'use client'
import { useEffect, useRef } from 'react'
import { gsap, reducirMovimiento } from '@/components/fx/gsap'

/** Entrada del primer pantallazo: las lineas de titulo suben desde una mascara y el resto aparece escalonado. */
export default function Entrada({ children, className }) {
    const raiz = useRef(null)

    useEffect(() => {
        if (reducirMovimiento()) return
        const ctx = gsap.context(() => {
            gsap.from('.v1-linea > span', { yPercent: 115, duration: 1.1, ease: 'expo.out', stagger: 0.12, delay: 0.1 })
            gsap.from('.v1-entra', { opacity: 0, y: 24, duration: 0.9, ease: 'power3.out', stagger: 0.1, delay: 0.5 })
        }, raiz)
        return () => ctx.revert()
    }, [])

    return (
        <div ref={raiz} className={className}>
            {children}
        </div>
    )
}
