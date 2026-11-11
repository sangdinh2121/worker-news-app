import {useSearchParams} from "react-router-dom";
import {useArticles} from "../hooks/useArticles.ts";
import ArticleList from "../component/ArticleList.tsx";

export default function SearchPage(){
    const [searchParams] = useSearchParams();
    const q = (searchParams.get("q") ?? '').trim();
    const {articles, isLoading,error} = useArticles();

    if(isLoading){
        return <p className="text-center text-muted" role="status">Đang tìm kiếm...</p>
    }

    if(error){
        return <p className="alert alert-danger" role="alert">{error}</p>
    }

    if(!q) {
        return <p className="text-muted">Hãy nhập từ khóa để tìm kiếm.</p>
    }

    const keyword = q.toLowerCase();
    const results = articles.filter(
        (a) =>
            a.title.toLowerCase().includes(keyword) ||
            a.summary.toLowerCase().includes(keyword)
    )

    return (
        <>
            <h3 className="border-start border-danger border-4 ps-3 mb-2">
                Kết quả cho "{q}"
            </h3>
            <p className="text-muted mb-4">Tìm thấy {results.length} bài viết.</p>
            <ArticleList articles={results} />
        </>
    )
}