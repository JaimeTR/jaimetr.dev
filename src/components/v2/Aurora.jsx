'use client'
import { useEffect, useRef } from 'react'
import { gsap, reducirMovimiento } from '@/components/fx/gsap'

/** Aurora fija (cuatro manchas de luz que derivan) + barra de progreso de lectura. */
export default function Aurora() {
    const raiz = useRef(null)
    const barra = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (reducirMovimiento()) return
            raiz.current.querySelectorAll('i').forEach((mancha, i) => {
                const deriva = () =>
                    gsap.to(mancha, {
                        x: gsap.utils.random(-18, 18) + 'vmax',
                        y: gsap.utils.random(-14, 14) + 'vmax',
                        scale: gsap.utils.random(0.85, 1.25),
                        duration: gsap.utils.random(9, 15),
                        ease: 'sine.inOut',
                        onComplete: deriva,
                    })
                gsap.delayedCall(i * 0.4, deriva)
            })
            gsap.to(barra.current, {
                scaleX: 1,
                ease: 'none',
                scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: true },
            })
        })
        return () => ctx.revert()
    }, [])

    return (
        <>
            <div className="v2-progreso" ref={barra} aria-hidden="true" />
            <div className="v2-aurora" ref={raiz} aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
            </div>
        </>
    )
}
