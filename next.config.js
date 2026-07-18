const withMDX = require('@next/mdx')()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://epmdauwektgtwujsisdh.supabase.co'
const supabaseHostname = supabaseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')

/** @type {import('next').NextConfig} */
const nextConfig = {
    outputFileTracingRoot: __dirname,
    pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
    compress: true,
    poweredByHeader: false,
    images: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: supabaseHostname,
                port: '',
                pathname: '/storage/**',
            },
        ],
    },
    async headers() {
        return [
            {
                source: '/images/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
                ],
            },
            {
                source: '/_next/static/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
                ],
            },
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin'
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https://${supabaseHostname} https://www.google-analytics.com; media-src 'self' blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' data: blob: https://${supabaseHostname} https://api.groq.com https://generativelanguage.googleapis.com https://api.openai.com https://www.google-analytics.com https://*.vercel-insights.com; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self';`
                    },
                ],
            },
        ]
    },
}

module.exports = withMDX(nextConfig)
