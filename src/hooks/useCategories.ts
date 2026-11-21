import { useEffect, useState } from 'react'
import { getCategories } from '../services/articleService'
import type { Category } from '../types/category'

interface UseCategoriesResult {
    categories: Category[]
    isLoading: boolean
    error: string | null
}

export function useCategories(): UseCategoriesResult {
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isActive = true

        getCategories()
            .then((loadedCategories) => {
                if (isActive) setCategories(loadedCategories)
            })
            .catch((loadError: unknown) => {
                if (isActive) {
                    setError(
                        loadError instanceof Error
                            ? loadError.message
                            : 'Không thể tải danh mục.',
                    )
                }
            })
            .finally(() => {
                if (isActive) setIsLoading(false)
            })

        return () => {
            isActive = false
        }
    }, [])

    return { categories, isLoading, error }
}
