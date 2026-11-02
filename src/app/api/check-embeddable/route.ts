import { NextRequest, NextResponse } from 'next/server'

// Checks whether a URL's response headers allow being iframed, so ProjectViewer
// can skip straight to "open in a new tab" for sites that will never load
// (most commonly WordPress installs sending X-Frame-Options/CSP frame-ancestors)
// instead of making the visitor wait out a timeout on a blank iframe.
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 })
  }

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return NextResponse.json({ embeddable: false, reason: 'invalid-url' })
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return NextResponse.json({ embeddable: false, reason: 'invalid-protocol' })
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 4000)

  try {
    let response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
    })
    // Some servers don't implement HEAD correctly (405/501) — retry with GET
    // but don't wait for the body, we only need headers.
    if (!response.ok && (response.status === 405 || response.status === 501)) {
      response = await fetch(url, { method: 'GET', redirect: 'follow', signal: controller.signal })
    }

    const xfo = (response.headers.get('x-frame-options') || '').toLowerCase()
    const csp = (response.headers.get('content-security-policy') || '').toLowerCase()

    const blocksFraming =
      xfo.includes('deny') ||
      xfo.includes('sameorigin') ||
      (csp.includes('frame-ancestors') && !csp.includes("frame-ancestors *"))

    return NextResponse.json({ embeddable: !blocksFraming })
  } catch {
    // Network error, timeout, or CORS-adjacent failure server-side (rare, but
    // some hosts reject HEAD from unfamiliar UAs) — don't block the preview on
    // an inconclusive check; let the iframe attempt happen as it did before.
    return NextResponse.json({ embeddable: true, reason: 'check-failed' })
  } finally {
    clearTimeout(timeout)
  }
}
