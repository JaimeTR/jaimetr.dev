'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function Error({ reset }) {
  const { lang } = useParams()
  const isSpanish = lang === 'es'
  return <main className="wrap flex min-h-[65vh] flex-col justify-center py-20" aria-labelledby="error-heading">
    <h1 id="error-heading" className="display display-l">{isSpanish ? 'Algo salió mal' : 'Something went wrong'}</h1>
    <p className="mt-6 max-w-[60ch] text-xl text-ink-2">{isSpanish ? 'No pudimos cargar esta página. Inténtalo de nuevo.' : 'We could not load this page. Please try again.'}</p>
    <div className="mt-8 flex gap-6"><button onClick={reset} className="link-line">{isSpanish ? 'Reintentar' : 'Try again'}</button><Link href={`/${lang}`} className="link-line">{isSpanish ? 'Volver al inicio' : 'Back to home'}</Link></div>
  </main>
}
