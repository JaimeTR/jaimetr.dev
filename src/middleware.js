import { NextResponse } from 'next/server'

const locales = ['es', 'en']
const defaultLocale = 'es'

function getLocale(request) {
  const acceptLanguage = request.headers.get('accept-language')
  if (!acceptLanguage) return defaultLocale
  
  // El header suele ser "es-ES,es;q=0.9,en;q=0.8"
  // Extraemos el primer idioma de la lista que es la principal preferencia
  const firstPreference = acceptLanguage.split(',')[0].trim().toLowerCase()
  
  if (firstPreference.startsWith('en')) return 'en'
  return 'es'
}

export function middleware(request) {
  const { pathname } = request.nextUrl
  
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/images') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    // Handle localized routes (Rewrites)
    // Spanish
    if (pathname === '/es/proyectos') {
      return NextResponse.rewrite(new URL('/es/projects', request.url))
    }
    if (pathname.startsWith('/es/proyectos/')) {
      const slug = pathname.replace('/es/proyectos/', '')
      return NextResponse.rewrite(new URL(`/es/projects/${slug}`, request.url))
    }
    if (pathname === '/es/articulos') {
      return NextResponse.rewrite(new URL('/es/posts', request.url))
    }
    if (pathname.startsWith('/es/articulos/')) {
      const slug = pathname.replace('/es/articulos/', '')
      return NextResponse.rewrite(new URL(`/es/posts/${slug}`, request.url))
    }

    return NextResponse.next()
  }

  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.rewrite(request.nextUrl)
}

export const config = {
  matcher: [
    '/((?!_next|api|admin|images|.*\\.).*)',
  ],
}
