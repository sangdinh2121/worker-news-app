import { articles } from '../data/sampleArticles'
import FeaturedArticle from '../component/FeaturedArticle'
import ArticleCard from '../component/ArticleCard'
import ArticleList from '../component/ArticleList'

export default function HomePage() {
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