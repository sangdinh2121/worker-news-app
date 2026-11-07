import {Link, useParams} from "react-router-dom";
import {useArticles} from "../hooks/useArticles.ts";
import {categories} from "../data/categories.ts";
import ArticleList from "../component/ArticleList.tsx";

export default function CategoryPage() {
    const {slug} = useParams();
    const { articles, isLoading, error } = useArticles()
    const category = categories.find((c) => c.slug === slug)

    if (!category) {
        return (
            <div className="text-center py-5">
                <h3>Không tìm thấy danh mục</h3>
                <Link to="/" className="btn btn-danger mt-3">Về trang chủ</Link>
            </div>
        )
    }
    if (isLoading) {
        return <p className="text-center text-muted" role="status">Đang tải tin tức...</p>
    }

    if (error) {
        return <p className="alert alert-danger" role="alert">{error}</p>
    }
    const list = articles
        .filter((a) => a.category === category.slug)
        .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

    return (
        <>
            <h3 className="border-start border-danger border-4 ps-3 mb-4">
                {category.name}
            </h3>
            <ArticleList articles={list} />
        </>
    )
}