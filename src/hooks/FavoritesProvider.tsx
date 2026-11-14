import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { FavoritesContext } from './favoritesContext'

const STORAGE_KEY = 'worker-news-favorite-articles'

interface FavoritesState {
    ids: number[]
    error: string | null
}

function readFavorites(): FavoritesState {
    try {
        const storedValue = localStorage.getItem(STORAGE_KEY)
        if (!storedValue) {
            return { ids: [], error: null }
        }

        const parsedValue: unknown = JSON.parse(storedValue)
        if (
            !Array.isArray(parsedValue) ||
            !parsedValue.every((id) => Number.isSafeInteger(id) && id > 0)
        ) {
            return { ids: [], error: 'Dữ liệu tin yêu thích đã lưu không hợp lệ.' }
        }

        return { ids: parsedValue, error: null }
    } catch {
        return { ids: [], error: 'Không thể đọc danh sách tin yêu thích đã lưu.' }
    }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const [favorites, setFavorites] = useState(readFavorites)

    const toggleFavorite = useCallback((articleId: number) => {
        const nextIds = favorites.ids.includes(articleId)
            ? favorites.ids.filter((id) => id !== articleId)
            : [...favorites.ids, articleId]

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds))
            setFavorites({ ids: nextIds, error: null })
        } catch {
            setFavorites((current) => ({
                ...current,
                error: 'Không thể lưu thay đổi tin yêu thích vào bộ nhớ trình duyệt.',
            }))
        }
    }, [favorites])

    const isFavorite = useCallback(
        (articleId: number) => favorites.ids.includes(articleId),
        [favorites.ids],
    )

    const value = useMemo(
        () => ({
            favoriteIds: favorites.ids,
            error: favorites.error,
            toggleFavorite,
            isFavorite,
        }),
        [favorites, isFavorite, toggleFavorite],
    )

    return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}
