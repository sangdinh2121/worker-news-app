import { useEffect, useState } from 'react'
import { getArticles } from '../services/articleService'
import type { Article } from '../types/article'
import FeaturedArticle from '../component/FeaturedArticle'
import ArticleCard from '../component/ArticleCard'
import ArticleList from '../component/ArticleList'

export default function HomePage() {
    const [articles, setArticles] = useState<Article[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isActive = true

        getArticles()
            .then((loadedArticles) => {
                if (isActive) {
                    setArticles(loadedArticles)
                }
            })
            .catch((loadError: unknown) => {
                if (isActive) {
                    setError(
                        loadError instanceof Error
                            ? loadError.message
                            : 'Không thể tải danh sách bài viết.',
                    )
                }
            })
            .finally(() => {
                if (isActive) {
                    setIsLoading(false)
                }
            })

        return () => {
            isActive = false
        }
    }, [])

    if (isLoading) {
        return (
            <p className="text-center text-muted" role="status">
                <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                Đang tải tin tức...
            </p>
        )
    }

    if (error) {
        return <p className="alert alert-danger" role="alert">{error}</p>
    }

    if (articles.length === 0) {
        return <p className="text-center text-muted">Hiện chưa có bài viết nào.</p>
    }

    const featured = articles.filter((a) => a.featured)
    const [mainArticle, ...sideArticles] = featured

    const latest = [...articles].sort((a, b) =>
        b.publishedAt.localeCompare(a.publishedAt)
    )

    return (
        <>
            <section className="mb-5">
                <div className="row g-4">
                    <div className="col-lg-8">
                        {mainArticle && <FeaturedArticle article={mainArticle} />}
                    </div>
                    <div className="col-lg-4 d-flex flex-column gap-4">
                        {sideArticles.slice(0, 2).map((a) => (
                            <ArticleCard key={a.id} article={a} />
                        ))}
                    </div>
                </div>
            </section>

            <section>
                <h3 className="border-start border-danger border-4 ps-3 mb-4">Tin mới nhất</h3>
                <ArticleList articles={latest} />
            </section>
        </>
    )
}