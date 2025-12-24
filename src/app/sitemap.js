import { getAllPostsMetadata } from '@/lib/mdx'
import { PROJECTS } from '@/helpers/projects'

export default function sitemap() {
    const baseUrl = 'https://jaimetr.dev'

    // Get all posts
    const posts = getAllPostsMetadata()
    const postUrls = posts.map((post) => ({
        url: `${baseUrl}/posts/${post.slug}`,
        lastModified: post.date || new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.8,
    }))

    // Get all projects
    const projectUrls = PROJECTS.map((project) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: project.date || new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.8,
    }))

    // Static pages
    const routes = ['', '/posts', '/projects'].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1.0 : 0.9,
    }))

    return [...routes, ...postUrls, ...projectUrls]
}
