import { useFavorites } from '../hooks/favoritesContext'

interface Props {
    articleId: number
}

export default function FavoriteButton({ articleId }: Props) {
    const { isFavorite, toggleFavorite } = useFavorites()
    const favorite = isFavorite(articleId)

    return (
        <button
            className={`btn btn-sm ${favorite ? 'btn-danger' : 'btn-outline-danger'}`}
            type="button"
            aria-pressed={favorite}
            onClick={() => toggleFavorite(articleId)}
        >
            {favorite ? 'Bỏ lưu' : 'Lưu tin'}
        </button>
    )
}
