import { ArticleCard } from '../ArticleCard'
import { Container } from '../Container'
import { getAllPostsMetadata } from '@/lib/mdx'
import ArticlesHeader from '@/components/Articles/ArticlesHeader'
import ArticlesFooterLink from '@/components/Articles/ArticlesFooterLink'

export const Articles = async () => {
    const allPosts = getAllPostsMetadata()
    
    // Filtrar los ocultos
    const posts = allPosts.filter(post => !post.is_hidden)

    // Primero, obtener los destacados
    let articles = posts.filter(post => post.is_featured)
    
    // Si no hay suficientes destacados, rellenar con los más recientes
    if (articles.length < 3) {
        const nonFeatured = posts.filter(post => !post.is_featured)
        articles = [...articles, ...nonFeatured]
    }

    articles = articles
        .sort((a, b) => {
            // Si ambos son destacados, ordenar por featured_order
            if (a.is_featured && b.is_featured) {
                const orderA = a.featured_order !== undefined ? a.featured_order : 999;
                const orderB = b.featured_order !== undefined ? b.featured_order : 999;
                if (orderA !== orderB) return orderA - orderB;
            }
            
            // Si no (o si tienen el mismo orden), ordenar por fecha
            if (a.date < b.date) {
                return 1
            }
            if (a.date > b.date) {
                return -1
            }
            // a must be equal to b
            return 0
        })
        .slice(0, 3)

    return (
        <Container id="articles" className="lg:max-w-[900px]">
            <ArticlesHeader />
            {articles.map((item) => (
                <ArticleCard key={item.slug} article={item} />
            ))}
            
            <ArticlesFooterLink />
        </Container>
    )
}
