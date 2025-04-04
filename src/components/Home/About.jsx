import { AiOutlineFileProtect } from 'react-icons/ai'
import { Container } from '../Container'
import { SectionTitle } from '../SectionTitle'
import Link from 'next/link'

export const About = () => {
    return (
        <Container id="sobre-mi">
            <SectionTitle>Sobre mí</SectionTitle>
            <div className="pt-12 md:pt-2">
                <div className="w-full">
                    <img
                        src="/images/Jaime_tarazona.webp"
                        alt="Jaime Tarazona - Foto de perfil de ingeniero y fullstack"
                        className=" object-cover rounded-full size-72 shadow-lg shadow-dark-900/20 dark:shadow-dark-50/10  mx-auto"
                        loading="lazy"
                    />

                    <p className="mt-8 text-dark-700 dark:text-dark-200 md:w-11/12 text-pretty text-base">
                        Hola 👋, soy Jaime Tarazona,{' '}
                        <span className="font-bold text-primary-700 dark:text-primary-400">Ingeniero de Sistemas, Desarrollador Full-Stack</span>{' '}
                        y{' '}
                        <span className="font-bold text-primary-700 dark:text-primary-400">
                        Web Developer
                        </span>{' '}
                        con más de <b> 4 años de experiencia </b>  en el desarrollo de aplicaciones y páginas web. Actualmente, trabajo creando sitios web en WordPress, {' '}
                        <span className=" text-crusta-800 dark:text-crusta-300 font-bold">
                        desarrollando desde páginas informativas y tiendas eCommerce hasta plataformas administrables, 
                        </span>{' '}
                        garantizando soluciones optimizadas y eficientes para distintos sectores y clientes.
                    </p>
                    <p className="mt-4 text-dark-700 dark:text-dark-200 md:w-11/12 text-pretty text-base">
                    Uno de mis principales proyectos es {' '}
                        <span className="text-crusta-800 dark:text-crusta-300 font-bold">
                        <a
                                href="https://asistente-inoia-tbuk.vercel.app/"
                                rel="noopener noreferrer"
                                target="_blank"
                                className="underline"
                            >
                                InoIA,
                            </a> un asistente virtual con inteligencia artificial diseñado para mejorar la satisfacción de los pacientes. {' '}
                            
                        </span>{' '}
                        Ofrece chat a través de texto, voz y lectura de imágenes, permitiendo una interacción fluida y accesible. Todo el sistema está diseñado para brindar información clara, recomendaciones personalizadas y asistencia en cada etapa de la atención médica, optimizando la comunicación entre pacientes y profesionales de la salud con una experiencia intuitiva y eficiente.
                    </p>
                    <p className="mt-4 text-dark-700 dark:text-dark-200 md:w-11/12 text-pretty text-base">
                        Tambien como proyecto personal comparto{' '}
                        <Link href={'/posts'} className="text-crusta-800 dark:text-crusta-300 font-bold underline">
                            artículos sobre temas de programacion, Inteligencia Artificial, desarrollo web y mucho más.
                        </Link>
                        Cuando compartes tu conocimiento es cuando más aprendes y mi objetivo además de seguir
                        mejorando mis habilidades es ayudar a otros con mis experiencias y guias.
                    </p>
                    <p className="mt-4 text-dark-700 dark:text-dark-200 md:w-11/12 text-pretty text-base">
                        Por último, comparto mi hoja de vida actualizada, donde de manera más detallada específico mi
                        experiencia laboral, logros y formación académica.
                    </p>
                </div>
            </div>
            <div className="flex justify-center w-full mt-8">
                <a
                    className="flex items-center gap-2 px-6 py-2 font-bold relative z-10 overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:h-full before:w-0 before:rounded-full before:bg-primary-600 before:-z-10 before:transition-all before:duration-300 before:hover:w-full text-dark-100 bg-dark-800 rounded-full hover:bg-dark-600 hover:shadow-md hover:shadow-primary-500/50 ease duration-500"
                    href="https://www.canva.com/design/DAGgrk_oQPk/IhasfT6xFthdmFESPVhaGA/view?utm_content=DAGgrk_oQPk&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h5c32fd6fe8"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    VER CURRÍCULUM <AiOutlineFileProtect />
                </a>
            </div>
        </Container>
    )
}
