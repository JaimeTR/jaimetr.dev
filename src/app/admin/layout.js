import '@/app/globals.css'
import { Toaster } from 'sonner'

import { DarkModeProvider } from '@/app/providers/DarkModeProvider'

export const metadata = {
    title: 'Admin Dashboard',
    robots: {
        index: false,
        follow: false,
    },
    icons: {
        icon: '/favicon.ico',
    },
}

export default function AdminLayout({ children }) {
    return (
        <html suppressHydrationWarning lang="es">
            <body className="bg-dark-50 dark:bg-dark-950 text-dark-900 dark:text-white transition-colors duration-300">
                <DarkModeProvider>
                    <Toaster richColors position="top-right" />
                    {children}
                </DarkModeProvider>
            </body>
        </html>
    )
}
