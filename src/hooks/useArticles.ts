import { useEffect, useState } from 'react'
import { getArticles } from '../services/articleService'
import type { Article } from '../types/article'

interface UseArticlesResult {
    articles: Article[]
    isLoading: boolean
    error: string | null
}

export function useArticles(): UseArticlesResult {
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

    return { articles, isLoading, error }
}
