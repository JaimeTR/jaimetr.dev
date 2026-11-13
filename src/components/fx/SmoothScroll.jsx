'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap, ScrollTrigger, reducirMovimiento } from './gsap'

/**
 * Scroll suave (Lenis) sincronizado con GSAP ScrollTrigger. Se monta una vez por pagina.
 * Con "reducir movimiento" no hace nada: el scroll queda nativo y las animaciones deben mostrar el estado final.
 */
export default function SmoothScroll() {
    useEffect(() => {
        if (reducirMovimiento()) return
        const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
        lenis.on('scroll', ScrollTrigger.update)
        const tick = (t) => lenis.raf(t * 1000)
        gsap.ticker.add(tick)
        gsap.ticker.lagSmoothing(0)
        window.__lenis = lenis
        return () => {
            gsap.ticker.remove(tick)
            lenis.destroy()
            delete window.__lenis
        }
    }, [])
    return null
}
