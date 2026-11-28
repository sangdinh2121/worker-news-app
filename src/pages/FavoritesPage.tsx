import ArticleList from '../component/ArticleList'
import {useFavorites} from '../hooks/favoritesContext'
import {useArticles} from '../hooks/useArticles'
import {Link} from 'react-router-dom'

export default function FavoritesPage() {
    const {favoriteIds} = useFavorites()
    const {articles, isLoading, error} = useArticles()

    if (isLoading) {
        return (
            <p className="text-center text-muted py-5" role="status">
                <span className="spinner-border spinner-border-sm text-danger me-2" aria-hidden="true"/>
                Đang tải tin đã lưu...
            </p>
        )
    }

    if (error) {
        return <p className="alert alert-danger" role="alert">{error}</p>
    }

    const favorites = articles.filter((article) => favoriteIds.includes(article.id))

    return (
        <section className="favorites-page">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
                <div>
                    <p className="text-danger text-uppercase fw-semibold small mb-1">Dành cho bạn</p>
                    <h2 className="h3 fw-bold mb-0">Tin đã lưu</h2>
                </div>
                <span className="badge rounded-pill text-bg-light border px-3 py-2">
                    {favorites.length} bài viết
                </span>
            </div>
            {favorites.length > 0
                ? <ArticleList articles={favorites}/>
                : (
                    <div className="card border-0 bg-light text-center py-5 px-3">
                        <div className="card-body">
                            <span className="favorites-page__icon text-danger" aria-hidden="true">♡</span>
                            <h3 className="h5 fw-bold mt-3">Chưa có tin nào được lưu</h3>
                            <p className="text-muted mb-4">
                                Lưu những bài viết bạn muốn đọc lại, chúng sẽ xuất hiện ở đây.
                            </p>
                            <Link to="/" className="btn btn-danger">Khám phá tin mới</Link>
                        </div>
                    </div>
                )}
        </section>
    )
}
