import { Link } from 'react-router-dom'
import type { Article } from '../types/article'
import {getCategoryName} from "../data/categories.ts";

interface Props {
    article: Article
}

export default function FeaturedArticle({ article }: Props) {
    return (
        <Link to={`/article/${article.id}`} className="text-decoration-none">
            <div className="position-relative rounded overflow-hidden shadow-sm">
                <img
                    src={article.image}
                    alt={article.title}
                    className="w-100"
                    style={{ height: 420, objectFit: 'cover' }}
                />
                <div
                    className="position-absolute bottom-0 start-0 end-0 p-4 text-white"
                    style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.85))' }}
                >
                    <span className="badge bg-danger text-uppercase mb-2">{getCategoryName(article.category)}</span>
                    <h2 className="h3 fw-bold mb-1">{article.title}</h2>
                    <p className="mb-0 small">{article.summary}</p>
                </div>
            </div>
        </Link>
    )
}