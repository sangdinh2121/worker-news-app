import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useArticles } from '../hooks/useArticles'
import ArticleList from '../component/ArticleList'

const PAGE_SIZE = 9

export default function SearchPage() {
    const [searchParams] = useSearchParams()
    const q = (searchParams.get('q') ?? '').trim()
    const { articles, isLoading, error } = useArticles()
    const [pagination, setPagination] = useState({ query: q, page: 1 })
    const currentPage = pagination.query === q ? pagination.page : 1

    if (isLoading) {
        return <p className="text-center text-muted" role="status">Đang tìm kiếm...</p>
    }

    if (error) {
        return <p className="alert alert-danger" role="alert">{error}</p>
    }

    if (!q) {
        return <p className="text-muted">Hãy nhập từ khóa để tìm kiếm.</p>
    }

    const keyword = q.toLowerCase()
    const results = articles.filter(
        (article) =>
            article.title.toLowerCase().includes(keyword) ||
            article.summary.toLowerCase().includes(keyword),
    )
    const totalPages = Math.ceil(results.length / PAGE_SIZE)
    const pageArticles = results.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
    )

    return (
        <>
            <h3 className="border-start border-danger border-4 ps-3 mb-2">
                Kết quả cho "{q}"
            </h3>
            <p className="text-muted mb-4">Tìm thấy {results.length} bài viết.</p>

            <ArticleList articles={pageArticles} />

            {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                    <button
                        className="btn btn-outline-danger"
                        type="button"
                        onClick={() => setPagination({ query: q, page: currentPage - 1 })}
                        disabled={currentPage === 1}
                    >
                        Trước
                    </button>
                    <span>Trang {currentPage} / {totalPages}</span>
                    <button
                        className="btn btn-outline-danger"
                        type="button"
                        onClick={() => setPagination({ query: q, page: currentPage + 1 })}
                        disabled={currentPage === totalPages}
                    >
                        Sau
                    </button>
                </div>
            )}
        </>
    )
}