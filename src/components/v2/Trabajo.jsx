'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import { gsap, ScrollTrigger, reducirMovimiento } from '@/components/fx/gsap'
import { rutaProyectos } from '@/components/fx/datos'

/** Trabajo reciente: seis capturas que se destapan con una cortina al entrar. */
export default function Trabajo({ proyectos, lang }) {
    const es = lang === 'es'
    const raiz = useRef(null)

    useEffect(() => {
        if (reducirMovimiento()) return
        const ctx = gsap.context(() => {
            ScrollTrigger.batch('.v2-proy', {
                start: 'top 90%',
                once: true,
                onEnter: (els) => {
                    gsap.fromTo(els.map((e) => e.querySelector('.v2-proy__img')), { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'expo.out', stagger: 0.12 })
                    gsap.fromTo(els.map((e) => e.querySelector('img')), { scale: 1.25 }, { scale: 1, duration: 1.4, ease: 'expo.out', stagger: 0.12 })
                    gsap.fromTo(els.map((e) => e.querySelectorAll('h3, p')), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.3, stagger: 0.12 })
                },
            })
        }, raiz)
        return () => ctx.revert()
    }, [])

    if (!proyectos.length) return null
    const base = rutaProyectos(lang)

    return (
        <section id="trabajo" ref={raiz} className="v2-trabajo" aria-labelledby="trab2-titulo">
            <div className="v2-wrap">
                <div className="v2-trabajo__cab">
                    <h2 id="trab2-titulo" className="v2-display v2-trabajo__titulo">
                        {es ? 'Trabajo reciente' : 'Recent work'}
                    </h2>
                    <Link href={base} className="v2-btn v2-btn--vidrio v2-btn--chico">
                        {es ? 'Ver todos' : 'See all'}
                        <FiArrowRight aria-hidden="true" />
                    </Link>
                </div>
                <ul className="v2-trabajo__rejilla">
                    {proyectos.map((p) => (
                        <li key={p.slug} className="v2-proy">
                            <Link href={`${base}/${p.slug}`} style={{ display: 'block' }}>
                                <div className="v2-proy__img">{p.image_url && <Image src={p.image_url} alt="" fill sizes="(max-width: 900px) 50vw, 33vw" />}</div>
                                <h3 className="v2-display">{es ? p.title : p.titleEn || p.title}</h3>
                                <p>{p.rubro || p.category}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}
