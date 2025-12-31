import { ArticleCard } from '../ArticleCard'
import { Container } from '../Container'
import { getAllPostsMetadata } from '@/lib/mdx'
import ArticlesHeader from '@/components/Articles/ArticlesHeader'

export const Articles = async () => {
    const posts = getAllPostsMetadata()
    const articles = posts
        .sort((a, b) => {
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
        <Container id="articles">
            <ArticlesHeader />
            {articles.map((item) => (
                <ArticleCard key={item.slug} article={item} />
            ))}
        </Container>
    )
}
