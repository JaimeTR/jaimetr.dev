'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { FiMail } from 'react-icons/fi'
import { gsap, reducirMovimiento } from '@/components/fx/gsap'
import { duracion } from '@/components/fx/datos'

/**
 * Composicion de ventanas flotantes del primer pantallazo, con datos reales: barras de duracion por empresa,
 * el stack y una tarjeta de contacto. En escritorio flotan, se inclinan en 3D y siguen al cursor.
 */
export default function Escena({ items, habilidades, correo, foto, es, lang }) {
    const raiz = useRef(null)
    const plano = useRef(null)
    const meses = (x) => Math.max(1, Math.round((x.fin - x.inicio) / 2629800000))
    const filas = items.slice(0, 5)
    const maximo = Math.max(1, ...filas.map(meses))
    const desde = items.length ? new Date(Math.min(...items.map((x) => x.inicio))).getUTCFullYear() : null

    useEffect(() => {
        if (reducirMovimiento()) return
        const mm = gsap.matchMedia()
        const ctx = gsap.context(() => {
            gsap.from('.v3-ventana', { opacity: 0, y: 50, duration: 1.1, ease: 'power3.out', stagger: 0.15, delay: 0.2 })
            gsap.from('.v3-barras__barra', { scaleX: 0, duration: 1.2, ease: 'expo.out', stagger: 0.12, delay: 0.7 })
            gsap.fromTo('.v3-stack span', { opacity: 0.35 }, { opacity: 1, duration: 0.7, stagger: { each: 0.18, repeat: -1, yoyo: true }, ease: 'sine.inOut' })

            mm.add('(min-width: 1024px)', () => {
                const v = gsap.utils.toArray('.v3-ventana', raiz.current)
                gsap.set(v[0], { rotateY: -13, rotateX: 6, rotateZ: 1.5 })
                gsap.set(v[1], { rotateY: -10, rotateX: 5, rotateZ: -2 })
                gsap.set(v[2], { rotateY: -8, rotateX: 4, rotateZ: 1 })
                v.forEach((el, i) => gsap.to(el, { y: i % 2 ? 12 : -12, duration: 3.2 + i * 0.7, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: i * 0.4 }))
                if (!window.matchMedia('(pointer: fine)').matches) return
                const rx = gsap.quickTo(plano.current, 'rotationX', { duration: 0.9, ease: 'power3.out' })
                const ry = gsap.quickTo(plano.current, 'rotationY', { duration: 0.9, ease: 'power3.out' })
                const mover = (e) => {
                    const r = raiz.current.getBoundingClientRect()
                    ry(((e.clientX - r.left) / r.width - 0.5) * 12)
                    rx(-((e.clientY - r.top) / r.height - 0.5) * 10)
                }
                const salir = () => {
                    rx(0)
                    ry(0)
                }
                window.addEventListener('pointermove', mover)
                raiz.current.addEventListener('pointerleave', salir)
                return () => {
                    window.removeEventListener('pointermove', mover)
                    raiz.current?.removeEventListener('pointerleave', salir)
                }
            })
        }, raiz)
        return () => {
            mm.revert()
            ctx.revert()
        }
    }, [])

    return (
        <div className="v3-escena" ref={raiz} role="group" aria-label={es ? 'Resumen visual de la trayectoria' : 'Visual summary of the career'}>
            <div className="v3-plano" ref={plano}>
                <div className="v3-ventana v3-ventana--tray">
                    <div className="v3-ventana__barra">
                        <i />
                        <i />
                        <i />
                        <span>{es ? 'Trayectoria' : 'Career'}</span>
                    </div>
                    <div className="v3-barras">
                        {filas.map((x) => (
                            <div key={x.id} className="v3-barras__fila">
                                <span className="v3-barras__txt">{x.empresa[0] || x.cargo[0]}</span>
                                <div className="v3-barras__pista" title={duracion(x.inicio, x.fin, lang)}>
                                    <div className="v3-barras__barra" style={{ width: `${Math.max(8, (meses(x) / maximo) * 100)}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    {desde && (
                        <p className="v3-barras__pie">
                            {items.length} {es ? 'cargos desde' : 'roles since'} {desde}
                        </p>
                    )}
                </div>

                <div className="v3-ventana v3-ventana--stack">
                    <div className="v3-ventana__barra">
                        <i />
                        <i />
                        <i />
                        <span>Stack</span>
                    </div>
                    <div className="v3-stack">
                        {habilidades.slice(0, 9).map((n) => (
                            <span key={n}>{n}</span>
                        ))}
                    </div>
                </div>

                <div className="v3-ventana v3-ventana--chat">
                    <div className="v3-ventana__barra">
                        <i />
                        <i />
                        <i />
                        <span>{es ? 'Disponible' : 'Available'}</span>
                    </div>
                    <div className="v3-chat">
                        <div className="v3-chat__fila">
                            {foto && (
                                <div className="v3-chat__foto">
                                    <Image src={foto} alt="" fill sizes="40px" />
                                </div>
                            )}
                            <p>
                                <strong>Jaime Tarazona</strong>
                                {es ? '¿Hablamos de tu proyecto o tu equipo?' : 'Shall we talk about your project or team?'}
                            </p>
                        </div>
                        {correo && (
                            <>
                                <a href={`mailto:${correo}`} className="v3-chat__correo">
                                    {correo}
                                </a>
                                <a href={`mailto:${correo}`} className="v3-btn v3-btn--pri v3-btn--chico">
                                    <FiMail aria-hidden="true" />
                                    {es ? 'Escribir' : 'Write'}
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
