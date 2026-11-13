'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap, reducirMovimiento } from '@/components/fx/gsap'
import { rutaProyectos } from '@/components/fx/datos'
import { FiArrowRight } from 'react-icons/fi'

/** Franja pequena de trabajo reciente: en escritorio avanza de lado ligada al scroll; en movil se desliza con el dedo. */
export default function Trabajo({ proyectos, lang }) {
    const es = lang === 'es'
    const raiz = useRef(null)
    const pista = useRef(null)

    useEffect(() => {
        if (reducirMovimiento() || !proyectos.length) return
        const mm = gsap.matchMedia()
        mm.add('(min-width: 768px)', () => {
            const recorrido = () => Math.max(0, pista.current.scrollWidth - raiz.current.clientWidth)
            if (recorrido() < 40) return
            // La pista avanza de lado mientras la franja cruza la pantalla (sin fijar la pagina).
            gsap.fromTo(
                pista.current,
                { x: 0 },
                {
                    x: () => -recorrido(),
                    ease: 'none',
                    scrollTrigger: { trigger: raiz.current, start: 'top 85%', end: 'bottom 20%', scrub: 0.6, invalidateOnRefresh: true },
                }
            )
        })
        return () => mm.revert()
    }, [proyectos])

    if (!proyectos.length) return null
    const base = rutaProyectos(lang)

    return (
        <section id="trabajo" className="v1-seccion" aria-labelledby="trabajo-titulo">
            <div ref={raiz} className="v1-trabajo" style={{ overflow: 'hidden' }}>
                <div className="v1-wrap">
                    <div className="v1-seccion__cab" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'end', justifyContent: 'space-between', gap: '1.5rem' }}>
                        <h2 id="trabajo-titulo" className="v1-display v1-h2">
                            {es ? 'Trabajo reciente' : 'Recent work'}
                        </h2>
                        <Link href={base} className="v1-btn v1-btn--borde v1-btn--compacto">
                            {es ? 'Ver todos los proyectos' : 'See all projects'}
                            <FiArrowRight aria-hidden="true" />
                        </Link>
                    </div>
                    <ul ref={pista} className="v1-trabajo__pista">
                        {proyectos.map((p) => (
                            <li key={p.slug} className="v1-proy">
                                <Link href={`${base}/${p.slug}`}>
                                    <div className="v1-proy__img">
                                        {p.image_url && <Image src={p.image_url} alt="" fill loading="eager" sizes="(max-width: 768px) 78vw, 360px" />}
                                    </div>
                                    <h3 className="v1-display">{es ? p.title : p.titleEn || p.title}</h3>
                                    <p>{p.rubro || p.category}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}
