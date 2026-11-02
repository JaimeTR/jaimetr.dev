'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { SectionTitle } from '../SectionTitle'
import { Container } from '../Container'
import { useLanguage } from '@/app/providers/LanguageProvider'
import ProjectGallery from '@/components/portfolio/ProjectGallery'

export const Projects = () => {
    const [mounted, setMounted] = useState(false)
    const { language } = useLanguage()
    
    useEffect(() => {
        setMounted(true)
    }, [])
    
    if (!mounted) return null
    
    return (
        <Container id="projects" className="lg:max-w-[1200px]">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
            >
                <SectionTitle>{language === 'es' ? 'Proyectos' : 'Projects'}</SectionTitle>
                <p className="mt-6 text-justify text-dark-700 dark:text-dark-200">
                    {language === 'es'
                        ? 'Mis proyectos más emocionantes y creativos. Cada proyecto es el resultado de mi dedicación y pasión por la programación, y estoy encantado de compartirlos contigo. Descubre cómo transformo ideas en realidades digitales. ¡Explora, inspira y crea con mis proyectos de software!'
                        : 'My most exciting and creative projects. Each project is the result of my dedication and passion for programming, and I\'m delighted to share them with you. Discover how I transform ideas into digital realities. Explore, inspire and create with my software projects!'}
                </p>
                <div className="mt-8">
                    <ProjectGallery isEmbedded={true} />
                </div>
            </motion.div>
        </Container>
    )
}
