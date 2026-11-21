import { useEffect, useState } from 'react'
import { getArticleById } from '../services/articleService'
import type { Article } from '../types/article'

interface UseArticleResult {
    article: Article | undefined
    isLoading: boolean
    error: string | null
}

export function useArticle(id: string | undefined): UseArticleResult {
    const [article, setArticle] = useState<Article>()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isActive = true
        const articleId = Number(id)

        setArticle(undefined)
        setError(null)
        if (!id || !Number.isSafeInteger(articleId) || articleId < 1) {
            setIsLoading(false)
            return () => {
                isActive = false
            }
        }

        setIsLoading(true)
        getArticleById(articleId)
            .then((loadedArticle) => {
                if (isActive) setArticle(loadedArticle)
            })
            .catch((loadError: unknown) => {
                if (isActive) {
                    setError(
                        loadError instanceof Error
                            ? loadError.message
                            : 'Không thể tải bài viết.',
                    )
                }
            })
            .finally(() => {
                if (isActive) setIsLoading(false)
            })

        return () => {
            isActive = false
        }
    }, [id])

    return { article, isLoading, error }
}
