'use client'
import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, reducirMovimiento } from '@/components/fx/gsap'

/** Envuelve la pagina: todo elemento con la clase `inicio-rev` aparece con un fade-up escalonado al entrar. */
export default function Revela({ children }) {
    const raiz = useRef(null)

    useEffect(() => {
        if (reducirMovimiento()) return
        const ctx = gsap.context(() => {
            ScrollTrigger.batch('.inicio-rev', {
                start: 'top 90%',
                once: true,
                onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out' }),
            })
            gsap.from('.inicio-grupo__chips span', {
                opacity: 0,
                y: 14,
                duration: 0.5,
                ease: 'power2.out',
                stagger: { each: 0.025 },
                scrollTrigger: { trigger: '.inicio-grupos', start: 'top 85%', once: true },
            })
        }, raiz)
        return () => ctx.revert()
    }, [])

    return <div ref={raiz}>{children}</div>
}
