import '@fontsource-variable/onest';
import { Navbar } from '@/components/Navbar'
import { DarkModeProvider } from '@/app/providers/DarkModeProvider'
import { LanguageProvider } from '@/app/providers/LanguageProvider'
import '@/app/globals.css'
import { Footer } from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import { Analytics } from '@vercel/analytics/react'
import ChatbotWrapper from '@/components/Chatbot/ChatbotWrapper'

export async function generateMetadata({ params }) {
    const { lang } = await params;
    
    return {
        metadataBase: new URL('https://jaimetr.dev'),
        title: lang === 'es' ? 'Jaime Tarazona Rodriguez | Full-Stack Developer & Ingeniero de Sistemas' : 'Jaime Tarazona Rodriguez | Full-Stack Developer & Systems Engineer',
        description: lang === 'es' ? 'Portafolio profesional de Jaime Tarazona. Desarrollo Full-Stack con React, Next.js, WordPress e IA. +5 años de experiencia creando soluciones web.' : 'Professional portfolio of Jaime Tarazona. Full-Stack development with React, Next.js, WordPress & AI. 5+ years building web solutions.',
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
            title: lang === 'es' ? 'Jaime Tarazona Rodriguez | Full-Stack Developer & Ingeniero de Sistemas' : 'Jaime Tarazona Rodriguez | Full-Stack Developer & Systems Engineer',
            description: lang === 'es' ? 'Portafolio profesional. Desarrollo web Full-Stack con React, Next.js, WordPress e Inteligencia Artificial. +5 años de experiencia.' : 'Professional portfolio. Full-Stack web development with React, Next.js, WordPress & AI. 5+ years of experience.',
            images: [{ url: '/images/og.webp', width: 1200, height: 630, alt: 'Jaime Tarazona - Full-Stack Developer' }],
            siteName: 'jaimetr.dev',
            type: 'website',
            locale: lang === 'es' ? 'es_ES' : 'en_US',
            url: `https://jaimetr.dev/${lang}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Jaime Tarazona | Full-Stack Developer',
            description: 'React, Next.js, WordPress & AI. +5 años de experiencia.',
            images: [{ url: '/images/og.webp', width: 1200, height: 630, alt: 'Jaime Tarazona - Full-Stack Developer' }],
            creator: '@jaimetrdev',
        },
        verification: {
            google: 'MlMRSjHtnqT7cbCEXeYCLPb8xbd-9Jsmf4VG7rl-94s',
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
            icon: '/images/jaimetrdev.webp',
            apple: '/images/jaimetrdev.webp',
        },
    }
}

export default async function RootLayout({ children, params }) {
    const { lang } = await params;
    
    return (
        <html suppressHydrationWarning lang={lang} className="scroll-smooth">
            <head>
                <meta name="google-site-verification" content="MlMRSjHtnqT7cbCEXeYCLPb8xbd-9Jsmf4VG7rl-94s" />
                <link rel="icon" type="image/webp" href="/images/jaimetrdev.webp" />
                <link rel="apple-touch-icon" sizes="180x180" href="/images/jaimetrdev.webp" />
                <link rel="preconnect" href="https://epmdauwektgtwujsisdh.supabase.co" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://api.groq.com" crossOrigin="anonymous" />
            </head>
            <body className="bg-dark-50 dark:bg-dark-950">
                <JsonLd />
                <LanguageProvider initialLang={lang}>
                    <DarkModeProvider>
                        <Navbar />
                        {children}
                        <ChatbotWrapper />
                        <Footer />
                        <Analytics />
                    </DarkModeProvider>
                </LanguageProvider>
            </body>
        </html>
    )
}
