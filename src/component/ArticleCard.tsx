import { Link } from 'react-router-dom'
import type { Article } from '../types/article'

interface Props {
    article: Article
}

export default function ArticleCard({ article }: Props) {
    const date = new Date(article.publishedAt).toLocaleDateString('vi-VN')

    return (
        <div className="card h-100 shadow-sm">
            <Link to={`/article/${article.id}`}>
                <img
                    src={article.image}
                    alt={article.title}
                    className="card-img-top"
                    style={{ height: 180, objectFit: 'cover' }}
                />
            </Link>
            <div className="card-body d-flex flex-column">
                <Link
                    to={`/category/${article.category}`}
                    className="small fw-bold text-uppercase text-danger text-decoration-none"
                >
                    {article.category}
                </Link>
                <h5 className="card-title mt-1">
                    <Link to={`/article/${article.id}`} className="text-dark text-decoration-none">
                        {article.title}
                    </Link>
                </h5>
                <p className="card-text text-muted small">{article.summary}</p>
                <small className="text-muted mt-auto">
                    {article.author} • {date}
                </small>
            </div>
        </div>
    )
}