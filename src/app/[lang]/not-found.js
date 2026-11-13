import Link from 'next/link'

export default async function NotFound({ params }) {
  const lang = (await params)?.lang === 'en' ? 'en' : 'es'
  return <main className="wrap flex min-h-[65vh] flex-col justify-center py-20" aria-labelledby="not-found-heading">
    <h1 id="not-found-heading" className="display display-l">{lang === 'es' ? 'Página no encontrada' : 'Page not found'}</h1>
    <p className="mt-6 max-w-[60ch] text-xl text-ink-2">{lang === 'es' ? 'La dirección no corresponde a una página disponible.' : 'This address does not match an available page.'}</p>
    <Link href={`/${lang}`} className="link-line mt-8 w-fit">{lang === 'es' ? 'Volver al inicio' : 'Back to home'}</Link>
  </main>
}
