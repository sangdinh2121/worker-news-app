import ArticleList from '../component/ArticleList'
import { useFavorites } from '../hooks/favoritesContext'
import { useArticles } from '../hooks/useArticles'

export default function FavoritesPage() {
    const { favoriteIds } = useFavorites()
    const { articles, isLoading, error } = useArticles()

    if (isLoading) {
        return <p className="text-center text-muted" role="status">Đang tải tin đã lưu...</p>
    }

    if (error) {
        return <p className="alert alert-danger" role="alert">{error}</p>
    }

    const favorites = articles.filter((article) => favoriteIds.includes(article.id))

    return (
        <section>
            <h3 className="border-start border-danger border-4 ps-3 mb-4">Tin đã lưu</h3>
            {favorites.length > 0
                ? <ArticleList articles={favorites} />
                : <p className="text-muted">Bạn chưa lưu bài viết nào.</p>}
        </section>
    )
}
