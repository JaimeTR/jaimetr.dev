import '@fontsource-variable/onest';
import { Navbar } from '@/components/Navbar'
import { DarkModeProvider } from './providers/DarkModeProvider'
import './globals.css'
import { Footer } from '@/components/Footer'
import JsonLd from '@/components/JsonLd'

export const metadata = {
    metadataBase: new URL('https://jaimetr.dev'),
    title: 'Jaime Tarazona Rodriguez 👨‍💻 | Ingeniero de Sistemas | Desarrollador Full-Stack | Web Developer',
    description:
        'Hola 👋, soy Jaime Tarazona, Ingeniero en Sistemas y Desarrollador FullStack con más de 4 años de experiencia en TI, creando soluciones web desde páginas web informativas hasta aplicaciones web para uso de empresas resolviendo problemas de rendimiento y ayudando en el arduo proceso de digitalización. Echa un vistazo al timeline donde resumo mi experiencia y encuentra al final mi curriculum actualizado.',
    keywords: ['Jaime Tarazona', 'Desarrollador Full-Stack', 'Ingeniero de Sistemas', 'Web Developer', 'React', 'Next.js', 'JavaScript', 'WordPress', 'Inteligencia Artificial', 'Portafolio'],
    authors: [{ name: 'Jaime Tarazona', url: 'https://jaimetr.dev' }],
    creator: 'Jaime Tarazona',
    publisher: 'Jaime Tarazona',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    alternates: {
        canonical: 'https://jaimetr.dev',
        languages: {
            'es-ES': 'https://jaimetr.dev',
        },
    },
    openGraph: {
        title: 'Jaime Tarazona Dev 👨‍💻 | Ingeniero de Sistemas | Desarrollador Full-Stack | Web Developer',
        description:
            'Hola 👋, soy Jaime Tarazona, Ingeniero de Sistemas y Desarrollador FullStack con más de 4 años de experiencia. Este es mi portafolio personal, te invito a que conozcas un poco sobre mi trabajo.',
        images: ['/images/og.png'],
        siteName: 'jaimetr.dev',
        type: 'website',
        locale: 'es_ES',
        url: 'https://jaimetr.dev',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Jaime Tarazona Dev 👨‍💻 | Ingeniero de Sistemas | Desarrollador Full-Stack',
        description: 'Ingeniero de Sistemas y Desarrollador FullStack con más de 4 años de experiencia',
        images: ['/images/og.png'],
    },
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'Jaime Tarazona Dev',
    },
    formatDetection: {
        telephone: false,
    },
    verification: {
        // Puedes agregar códigos de verificación aquí cuando los tengas
        // google: 'tu-codigo-de-verificacion',
    },
}

export default function RootLayout({ children }) {
    return (
        <html suppressHydrationWarning lang="es" className="scroll-smooth">
            <body className="bg-dark-50 dark:bg-dark-950 ">
                <JsonLd />
                <DarkModeProvider>
                    <Navbar />
                    {children}
                    <Footer />
                </DarkModeProvider>
            </body>
        </html>
    )
}
