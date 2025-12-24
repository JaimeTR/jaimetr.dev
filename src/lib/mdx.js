import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const root = process.cwd()
export const getPosts = () => {
    return fs.readdirSync(path.join(root, 'src/posts'))
}

export const getPostBySlug = async (slug) => {
    const mdxSource = fs.readFileSync(path.join(root, 'src/posts', `${slug}.mdx`), 'utf-8')
    const { data, content } = matter(mdxSource)
    return {
        content,
        frontmatter: {
            slug,
            ...data,
        },
    }
}

export const getAllPostsMetadata = () => {
    const files = getPosts()

    return files.reduce((allPosts, postSlug) => {
        const mdxSource = fs.readFileSync(path.join(root, 'src/posts', postSlug), 'utf-8')

        const { data } = matter(mdxSource)
        return [{ ...data, slug: postSlug.replace('.mdx', '') }, ...allPosts]
    }, [])
}
