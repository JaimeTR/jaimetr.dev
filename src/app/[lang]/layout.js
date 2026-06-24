import '@fontsource-variable/onest';
import { Navbar } from '@/components/Navbar'
import { DarkModeProvider } from '@/app/providers/DarkModeProvider'
import { LanguageProvider } from '@/app/providers/LanguageProvider'
import '@/app/globals.css'
import { Footer } from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import { Analytics } from '@vercel/analytics/react'
import ChatbotUI from '@/components/Chatbot/ChatbotUI'

export async function generateMetadata({ params }) {
    const { lang } = await params;
    
    return {
        metadataBase: new URL('https://jaimetr.dev'),
        title: lang === 'es' ? 'Jaime Tarazona Rodriguez 👨‍💻 | Ingeniero de Sistemas | Desarrollador Full-Stack | Web Developer' : 'Jaime Tarazona Rodriguez 👨‍💻 | Systems Engineer | Full-Stack Developer | Web Developer',
        description: lang === 'es' ? 'Hola 👋, soy Jaime Tarazona, Ingeniero en Sistemas y Desarrollador FullStack con más de 4 años de experiencia en TI.' : 'Hello 👋, I am Jaime Tarazona, Systems Engineer and FullStack Developer with over 4 years of IT experience.',
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
            canonical: `https://jaimetr.dev/${lang}`,
            languages: {
                'es': 'https://jaimetr.dev/es',
                'en': 'https://jaimetr.dev/en',
            },
        },
        openGraph: {
            title: lang === 'es' ? 'Jaime Tarazona Dev 👨‍💻 | Ingeniero de Sistemas | Desarrollador Full-Stack | Web Developer' : 'Jaime Tarazona Dev 👨‍💻 | Systems Engineer | Full-Stack Developer | Web Developer',
            description: lang === 'es' ? 'Hola 👋, soy Jaime Tarazona, Ingeniero de Sistemas y Desarrollador FullStack con más de 4 años de experiencia.' : 'Hello 👋, I am Jaime Tarazona, Systems Engineer and FullStack Developer with over 4 years of experience.',
            images: ['/images/og.png'],
            siteName: 'jaimetr.dev',
            type: 'website',
            locale: lang === 'es' ? 'es_ES' : 'en_US',
            url: `https://jaimetr.dev/${lang}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Jaime Tarazona Dev',
            description: 'Ingeniero de Sistemas y Desarrollador FullStack',
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
        icons: {
            icon: '/favicon.ico',
        },
    }
}

export default async function RootLayout({ children, params }) {
    const { lang } = await params;
    
    return (
        <html suppressHydrationWarning lang={lang} className="scroll-smooth">
            <body className="bg-dark-50 dark:bg-dark-950">
                <JsonLd />
                <LanguageProvider initialLang={lang}>
                    <DarkModeProvider>
                        <Navbar />
                        {children}
                        <ChatbotUI />
                        <Footer />
                        <Analytics />
                    </DarkModeProvider>
                </LanguageProvider>
            </body>
        </html>
    )
}
