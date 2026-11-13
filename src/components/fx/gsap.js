'use client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

/** true si la persona pidio menos movimiento: las versiones deben mostrar todo el contenido sin animar. */
export const reducirMovimiento = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export { gsap, ScrollTrigger }
