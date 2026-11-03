import type { Article } from '../types/article'
import ArticleCard from './ArticleCard'

interface Props {
    articles: Article[]
}

export default function ArticleList({ articles }: Props) {
    if (articles.length === 0) {
        return <p className="text-muted">Chưa có bài viết nào.</p>
    }

    return (
        <div className="row g-4">
            {articles.map((article) => (
                <div className="col-12 col-md-6 col-lg-4" key={article.id}>
                    <ArticleCard article={article} />
                </div>
            ))}
        </div>
    )
}