const withMDX = require('@next/mdx')()
/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'jaimetr.dev',
                port: '',
                pathname: '/storage/projects/**',
            },
            {
                protocol: 'http',
                hostname: 'jaimetr.dev',
                port: '',
                pathname: '/storage/projects/**',
            },
            {
                protocol: 'https',
                hostname: 'jaimetr.dev',
                port: '',
                pathname: '/storage/projects/**',
            },
            {
                protocol: 'https',
                hostname: 'jaimetr.dev',
                port: '',
                pathname: '/storage/posts/**',
            },
        ],
    },
}

module.exports = withMDX(nextConfig)
