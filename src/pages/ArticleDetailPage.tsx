import {useParams, Link} from 'react-router-dom'
import {useArticles} from '../hooks/useArticles'
import {useArticle} from '../hooks/useArticle'
import {getCategoryName} from '../data/categories'
import ArticleList from '../component/ArticleList'
import FavoriteButton from '../component/FavoriteButton'
import CommentsSection from '../component/CommentsSection'

export default function ArticleDetailPage() {
    const {id} = useParams()
    const {article, isLoading, error} = useArticle(id)
    const {articles, isLoading: relatedLoading, error: relatedError} = useArticles()

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
            <article className="article-detail mx-auto">
                <Link
                    to={`/category/${article.category}`}
                    className="badge text-bg-danger text-uppercase text-decoration-none mb-3"
                >
                    {getCategoryName(article.category)}
                </Link>
                <h1 className="article-detail__title fw-bold mb-3">{article.title}</h1>
                <div className="d-flex flex-wrap align-items-center gap-2 text-muted small mb-3">
                    <span className="fw-semibold text-dark">{article.author}</span>
                    <span aria-hidden="true">•</span>
                    <time dateTime={article.publishedAt}>
                        {new Date(article.publishedAt).toLocaleDateString('vi-VN')}
                    </time>
                </div>
                <div className="mb-4">
                    <FavoriteButton articleId={article.id}/>
                </div>
                <img
                    src={article.image}
                    alt={article.title}
                    className="article-detail__image img-fluid rounded-3 mb-4"
                />
                <p className="article-detail__summary lead bg-light border-start border-danger border-4 rounded-end p-3 p-md-4 mb-4">
                    {article.summary}
                </p>
                <div className="article-detail__content">
                    {article.content ?? ''}
                </div>
            </article>

            <CommentsSection key={article.id} articleId={article.id}/>

            {relatedError && (
                <p className="alert alert-warning mt-4" role="alert">
                    Không thể tải tin liên quan: {relatedError}
                </p>
            )}

            {related.length > 0 && (
                <section className="mt-5">
                    <h4 className="border-start border-danger border-4 ps-3 mb-4">Tin liên quan</h4>
                    <ArticleList articles={related}/>
                </section>
            )}
        </>
    )
}