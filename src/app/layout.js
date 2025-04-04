import '@fontsource-variable/onest';
import { Navbar } from '@/components/Navbar'
import { DarkModeProvider } from './providers/DarkModeProvider'
import './globals.css'
import { Footer } from '@/components/Footer'

export const metadata = {
    metadataBase: new URL('https://jaimetr.dev'),
    title: 'Jaime Tarazona Rodriguez 👨‍💻 | Ingeniero de Sistemas | Desarrollador Full-Stack | Web Developer',
    description:
        'Hola 👋, soy Jaime Tarazona, Ingeniero en Sistemas y Desarrollador FullStack con más de 4 años de experiencia en TI, creando soluciones web desde páginas web informativas hasta aplicaciones web para uso de empresas resolviendo problemas de rendimiento y ayudando en el arduo proceso de digitalización. Echa un vistazo al timeline donde resumo mi experiencia y encuentra al final mi curriculum actualizado.',
    openGraph: {
        title: 'Jaime Tarazona Dev 👨‍💻 | Ingeniero de Sistemas | Desarrollador Full-Stack | Web Developer',
        description:
            'Hola 👋, soy Jaime Tarazona, Ingeniero de Sistemas y Desarrollador FullStack con más de 4 años de experiencia. Este es mi portafolio personal, te invito a que conozcas un poco sobre mi trabajo.',
        images: ['/images/og.png'],
        siteName: 'jaimetr.dev',
        type: 'website',
        locale: 'es_ES',
        url: 'https://jaimetr.dev',
        author: 'jaimetrdev',
    },
}

export default function RootLayout({ children }) {
    return (
        <html suppressHydrationWarning lang="en" className="scroll-smooth">
            <body className="bg-dark-50 dark:bg-dark-950 ">
                <DarkModeProvider>
                    <Navbar />
                    {children}
                    <Footer />
                </DarkModeProvider>
            </body>
        </html>
    )
}
