'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, reducirMovimiento } from '@/components/fx/gsap'
import { duracion } from '@/components/fx/datos'

const FECHA = (ms, lang) => new Intl.DateTimeFormat(lang, { month: 'short', year: 'numeric' }).format(ms)

/**
 * Experiencia en orden del mas reciente al mas antiguo. En escritorio la seccion se fija y cada cargo
 * pasa uno tras otro con el scroll (cortina de clip-path) mientras un riel de luz avanza.
 * Bajo 1024px es una lista normal con aparicion al entrar.
 */
export default function Experiencia({ items, lang }) {
    const es = lang === 'es'
    const raiz = useRef(null)
    const relleno = useRef(null)
    const disparo = useRef(null)
    const [activo, setActivo] = useState(0)
    const activoRef = useRef(0)

    const marcar = useCallback((i) => {
        if (activoRef.current === i) return
        activoRef.current = i
        setActivo(i)
    }, [])

    useEffect(() => {
        if (reducirMovimiento() || !items.length) return
        const mm = gsap.matchMedia()
        const ctx = gsap.context(() => {
            mm.add('(min-width: 1024px)', () => {
                const paneles = gsap.utils.toArray('.v1-exp__panel', raiz.current)
                if (paneles.length < 2) return
                const n = paneles.length
                gsap.set(paneles.slice(1), { autoAlpha: 0, yPercent: 6, clipPath: 'inset(0 0 100% 0)' })
                const tl = gsap.timeline({
                    defaults: { ease: 'none' },
                    scrollTrigger: {
                        trigger: raiz.current,
                        start: 'top top',
                        end: () => `+=${(n - 1) * 85}%`,
                        pin: true,
                        scrub: 0.6,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    },
                })
                disparo.current = tl.scrollTrigger
                // El nodo activo sigue el progreso SUAVIZADO de la animacion, no el scroll crudo: nunca se adelanta al panel.
                tl.eventCallback('onUpdate', () => marcar(Math.min(n - 1, Math.round(tl.progress() * (n - 1)))))
                tl.to(relleno.current, { scaleY: 1, duration: n - 1 }, 0)
                for (let i = 1; i < n; i += 1) {
                    const t = i - 1 + 0.5
                    tl.to(paneles[i - 1], { autoAlpha: 0, yPercent: -6, duration: 0.45 }, t)
                    tl.fromTo(paneles[i], { autoAlpha: 0, yPercent: 6, clipPath: 'inset(0 0 100% 0)' }, { autoAlpha: 1, yPercent: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.5 }, t + 0.05)
                }
                return () => {
                    disparo.current = null
                }
            })
            mm.add('(max-width: 1023px)', () => {
                ScrollTrigger.batch('.v1-exp__panel', {
                    start: 'top 88%',
                    once: true,
                    onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' }),
                })
            })
        }, raiz)
        return () => {
            mm.revert()
            ctx.revert()
        }
    }, [items, marcar])

    // Un clic en una barra de la linea de tiempo lleva a ese cargo.
    useEffect(() => {
        const ir = (ev) => {
            const i = items.findIndex((x) => x.id === ev.detail)
            if (i < 0) return
            const st = disparo.current
            const destino = st ? st.start + (i / Math.max(1, items.length - 1)) * (st.end - st.start) : raiz.current.getBoundingClientRect().top + window.scrollY - 80
            if (window.__lenis) window.__lenis.scrollTo(destino, { duration: 1.4 })
            else window.scrollTo({ top: destino, behavior: 'smooth' })
        }
        window.addEventListener('v1:ir', ir)
        return () => window.removeEventListener('v1:ir', ir)
    }, [items])

    const irA = (i) => {
        const st = disparo.current
        if (!st) {
            document.getElementById(items[i].id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            return
        }
        const destino = st.start + (i / Math.max(1, items.length - 1)) * (st.end - st.start)
        if (window.__lenis) window.__lenis.scrollTo(destino, { duration: 1.4 })
        else window.scrollTo({ top: destino, behavior: 'smooth' })
    }

    if (!items.length) return null

    return (
        <section id="experiencia" ref={raiz} className="v1-exp" aria-labelledby="exp-titulo">
            <div className="v1-wrap v1-exp__marco">
                <div>
                    <h2 id="exp-titulo" className="v1-display v1-h2">
                        {es ? 'Experiencia profesional' : 'Professional experience'}
                    </h2>
                    <div className="v1-riel" aria-label={es ? 'Cargos' : 'Roles'}>
                        <div className="v1-riel__linea" />
                        <div className="v1-riel__relleno" ref={relleno} />
                        <ol>
                            {items.map((x, i) => (
                                <li key={x.id}>
                                    <button type="button" aria-current={activo === i} onClick={() => irA(i)}>
                                        <span>{x.empresa[0] || x.cargo[0]}</span>
                                    </button>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
                <div className="v1-exp__escenario">
                    {items.map((x) => (
                        <article key={x.id} id={x.id} className="v1-exp__panel">
                            {x.periodo && <p className="v1-exp__periodo">{x.periodo}</p>}
                            <h3 className="v1-display v1-exp__cargo">
                                {x.cargo.map((c) => (
                                    <span key={c} style={{ display: 'block' }}>
                                        {c}
                                    </span>
                                ))}
                            </h3>
                            {x.empresa.length > 0 && (
                                <p className="v1-exp__empresa">
                                    {x.empresa.map((c) => (
                                        <span key={c} style={{ display: 'block' }}>
                                            {c}
                                        </span>
                                    ))}
                                </p>
                            )}
                            {x.descripcion && <p className="v1-exp__desc">{x.descripcion}</p>}
                            {x.inicio && (
                                <p className="v1-exp__duracion">
                                    {FECHA(x.inicio, lang)} – {x.enCurso ? (es ? 'hoy' : 'present') : FECHA(x.fin, lang)} · {duracion(x.inicio, x.fin, lang)}
                                </p>
                            )}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
