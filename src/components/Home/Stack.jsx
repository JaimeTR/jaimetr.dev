'use client'
import { Container } from '../Container'
import { SectionTitle } from '../SectionTitle'
import { SetStack } from '@/components/SetStack'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ICONS_MAP } from '@/helpers/iconsMap'
import { FiCode } from 'react-icons/fi'
import { FaBrain } from 'react-icons/fa'

export const Stack = () => {
    const [mounted, setMounted] = useState(false)
    const [skills, setSkills] = useState({
        frontend: [],
        backend: [],
        learning: [],
        tools: []
    })
    const { language } = useLanguage()
    
    useEffect(() => {
        setMounted(true)
        fetchSkills()
    }, [])

    const fetchSkills = async () => {
        const { data, error } = await supabase
            .from('skills')
            .select('*')
            .order('sort_order', { ascending: true })
        if (!error && data) {
            const grouped = {
                frontend: data.filter(s => s.category === 'frontend'),
                backend: data.filter(s => s.category === 'backend'),
                learning: data.filter(s => s.category === 'learning'),
                tools: data.filter(s => s.category === 'tools')
            }
            setSkills(grouped)
        }
    }
    
    if (!mounted) return null
    
    const renderSkill = (skill) => {
        const Icon = ICONS_MAP[skill.icon_name] || FiCode
        return (
            <li
                key={skill.id}
                className="rounded-2xl group flex flex-col justify-center items-center"
            >
                <Icon className="size-12 mb-2" />
                <span className="text-sm w-full text-center">{skill.name}</span>
            </li>
        )
    }

    return (
        <Container>
            <SectionTitle className="text-center">{language === 'es' ? 'Tecnologías' : 'Technologies'}</SectionTitle>
            <p className="my-8 text-center mx-auto text-pretty md:text-lg max-w-[740px] text-dark-700 dark:text-dark-200">
                {language === 'es'
                    ? <>En mi viaje por el{' '}
                        <span className=" text-daintree-700 dark:text-daintree-300">mundo del desarrollo web</span>, he cultivado{' '}
                        <span className="text-crusta-700 dark:text-crusta-300">experiencia y habilidades</span> en una variedad de
                        tecnologías.{' '}
                        <span className="text-daintree-700 dark:text-daintree-300 font-semibold">Mi stack tecnológico incluye</span>:</>
                    : <>On my journey through the{' '}
                        <span className=" text-daintree-700 dark:text-daintree-300">world of web development</span>, I have cultivated{' '}
                        <span className="text-crusta-700 dark:text-crusta-300">experience and skills</span> in a variety of
                        technologies.{' '}
                        <span className="text-daintree-700 dark:text-daintree-300 font-semibold">My tech stack includes</span>:</>
                }
            </p>
            <section className="grid lg:grid-cols-2 lg:grid-rows-2 gap-6 lg:place-content-center">
                <SetStack>
                    <h3 className="text-center mb-8 text-xl font-bold  lg:text-4xl lg:break-words bg-gradient-to-t from-[#54fbff] to-[#00a4c9] dark:from-[#c9fffe] dark:to-[#00cfef] bg-clip-text text-transparent">
                        Frontend
                    </h3>
                    <ul className="grid grid-cols-3 gap-4 ">
                        {skills.frontend.map(renderSkill)}
                    </ul>
                </SetStack>
                <SetStack reverse={true}>
                    <h3 className="text-center mb-8 text-xl font-bold  lg:text-4xl lg:break-words bg-gradient-to-t from-[#94a3b8] to-[#1e293b] dark:from-[#f1f5f9] dark:to-[#64748b] bg-clip-text text-transparent">
                        Backend
                    </h3>
                    <ul className="grid grid-cols-3 gap-4 ">
                        {skills.backend.map(renderSkill)}
                    </ul>
                </SetStack>

                <SetStack>
                    <h3 className="text-center mb-8 text-xl font-bold lg:text-4xl lg:break-words bg-gradient-to-t from-[#ffb272] to-[#ee4a08] dark:from-[#ffebd4] dark:to-[#fd6412] bg-clip-text text-transparent">
                        Aprendiendo
                    </h3>
                    <ul className="grid grid-cols-3 gap-4 ">
                        {skills.learning.map(renderSkill)}
                    </ul>
                </SetStack>
                <SetStack>
                    <h3 className="text-center mb-8 text-xl font-bold  lg:text-4xl lg:break-words bg-gradient-to-t from-[#75dbff] to-[#0072ab] dark:from-[#def3ff] dark:to-[#00a8e8] bg-clip-text text-transparent">
                        Herramientas
                    </h3>
                    <ul className="grid grid-cols-3 gap-4 ">
                        {skills.tools.map(renderSkill)}
                    </ul>
                </SetStack>
            </section>
            
            <div className="mt-12 md:mt-16 max-w-4xl mx-auto">
                <SetStack>
                    <div className="w-full py-4 md:py-2 flex flex-col md:flex-row items-center justify-center gap-4">
                        <FaBrain className="w-8 h-8 text-primary-500 dark:text-primary-400 shrink-0 animate-pulse" />
                        <p className="inline animate-background-shine bg-[linear-gradient(110deg,#0ea5e9,45%,#0284c7,55%,#0ea5e9)] dark:bg-[linear-gradient(110deg,#7dd3fc,45%,#0284c7,55%,#7dd3fc)] bg-[length:250%_100%] bg-clip-text text-transparent text-sm md:text-base font-medium max-w-[700px] text-center md:text-left text-pretty leading-relaxed">
                            {language === 'es' 
                                ? "Siempre en constante aprendizaje, integrando activamente herramientas de Inteligencia Artificial para optimizar procesos, elevar la calidad del código y agilizar mi flujo de trabajo diario."
                                : "Always in constant learning, actively integrating Artificial Intelligence tools to optimize processes, elevate code quality, and streamline my daily workflow."
                            }
                        </p>
                    </div>
                </SetStack>
            </div>
        </Container>
    )
}
