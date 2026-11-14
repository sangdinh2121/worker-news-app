import { createContext, useContext } from 'react'

export interface FavoritesContextValue {
    favoriteIds: number[]
    error: string | null
    toggleFavorite: (articleId: number) => void
    isFavorite: (articleId: number) => boolean
}

export const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function useFavorites() {
    const context = useContext(FavoritesContext)
    if (!context) {
        throw new Error('useFavorites phải được dùng bên trong FavoritesProvider.')
    }
    return context
}
