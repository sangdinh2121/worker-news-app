import { Link } from 'react-router-dom'
import type { Article } from '../types/article'
import {getCategoryName} from "../data/categories.ts";
import FavoriteButton from './FavoriteButton'

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
                    to={`/category/${getCategoryName(article.category)}`}
                    className="small fw-bold text-uppercase text-danger text-decoration-none"
                >
                    {getCategoryName(article.category)}
                </Link>
                <h5 className="card-title mt-1">
                    <Link to={`/article/${article.id}`} className="text-dark text-decoration-none">
                        {article.title}
                    </Link>
                </h5>
                <p className="card-text text-muted small">{article.summary}</p>
                <div className="mb-3">
                    <FavoriteButton articleId={article.id} />
                </div>
                <small className="text-muted mt-auto">
                    {article.author} • {date}
                </small>
            </div>
        </div>
    )
}