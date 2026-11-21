import { useParams, Link } from 'react-router-dom'
import { useArticles } from '../hooks/useArticles'
import { useArticle } from '../hooks/useArticle'
import { getCategoryName } from '../data/categories'
import ArticleList from '../component/ArticleList'
import FavoriteButton from '../component/FavoriteButton'

export default function ArticleDetailPage() {
    const { id } = useParams()
    const { article, isLoading, error } = useArticle(id)
    const { articles, isLoading: relatedLoading, error: relatedError } = useArticles()

    if (isLoading) {
        return <p className="text-center text-muted" role="status">Đang tải bài viết...</p>
    }

    if (error) {
        return <p className="alert alert-danger" role="alert">{error}</p>
    }

    if (!article) {
        return (
            <div className="text-center py-5">
                <h3>Không tìm thấy bài viết</h3>
                <Link to="/" className="btn btn-danger mt-3">Về trang chủ</Link>
            </div>
        )
    }

    const related = relatedLoading || relatedError
        ? []
        : articles
            .filter((a) => a.category === article.category && a.id !== article.id)
            .slice(0, 3)

    return (
        <>
            <article className="mx-auto" style={{ maxWidth: 800 }}>
                <Link
                    to={`/category/${article.category}`}
                    className="text-danger text-uppercase fw-bold small text-decoration-none"
                >
                    {getCategoryName(article.category)}
                </Link>
                <h1 className="fw-bold mt-2">{article.title}</h1>
                <p className="text-muted">
                    {article.author} • {new Date(article.publishedAt).toLocaleDateString('vi-VN')}
                </p>
                <div className="mb-3">
                    <FavoriteButton articleId={article.id} />
                </div>
                <img src={article.image} alt={article.title} className="img-fluid rounded mb-4" />
                <p className="lead">{article.summary}</p>
                <div style={{ whiteSpace: 'pre-line' }}>
                    {article.content ?? ''}
                </div>
            </article>

            {relatedError && (
                <p className="alert alert-warning mt-4" role="alert">
                    Không thể tải tin liên quan: {relatedError}
                </p>
            )}

            {related.length > 0 && (
                <section className="mt-5">
                    <h4 className="border-start border-danger border-4 ps-3 mb-4">Tin liên quan</h4>
                    <ArticleList articles={related} />
                </section>
            )}
        </>
    )
}