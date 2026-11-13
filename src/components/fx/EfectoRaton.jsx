'use client'
import { useEffect } from 'react'

// Contenedores que se iluminan donde pasa el mouse (ver "Efecto de mouse" en inicio.css).
const BRILLANTES = '.inicio-carta, .inicio-ventana, .inicio-proy__marco, .inicio-banda'

/**
 * Fondo de cuadricula suave para todo el sitio y efecto de mouse:
 * - la cuadricula se ilumina y aparece un resplandor alrededor del puntero;
 * - las tarjetas y ventanas (BRILLANTES) se iluminan en el punto donde esta el puntero.
 * Solo con mouse (no en tactiles) y sin movimiento reducido. Escribe variables CSS, sin re-render de React.
 */
export default function EfectoRaton() {
    useEffect(() => {
        const conMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches
        const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (!conMouse || quieto) return

        const raiz = document.documentElement
        let x = 0
        let y = 0
        let objetivo = null
        let cuadro = 0

        const pinta = () => {
            cuadro = 0
            raiz.style.setProperty('--mx', `${x}px`)
            raiz.style.setProperty('--my', `${y}px`)
            raiz.classList.add('fx-activo')
            if (objetivo) {
                const r = objetivo.getBoundingClientRect()
                objetivo.style.setProperty('--bx', `${x - r.left}px`)
                objetivo.style.setProperty('--by', `${y - r.top}px`)
            }
        }
        const mueve = (e) => {
            x = e.clientX
            y = e.clientY
            objetivo = e.target instanceof Element ? e.target.closest(BRILLANTES) : null
            if (!cuadro) cuadro = requestAnimationFrame(pinta)
        }
        const sale = () => raiz.classList.remove('fx-activo')

        window.addEventListener('pointermove', mueve, { passive: true })
        document.addEventListener('pointerleave', sale)
        return () => {
            window.removeEventListener('pointermove', mueve)
            document.removeEventListener('pointerleave', sale)
            if (cuadro) cancelAnimationFrame(cuadro)
            raiz.classList.remove('fx-activo')
        }
    }, [])

    return <div className="fx-malla" aria-hidden="true" />
}
