'use client'

import { ThemeProvider } from 'next-themes'

export function DarkModeProvider({ children }) {
    return <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>{children}</ThemeProvider>
}
