import {useFavorites} from '../hooks/favoritesContext'

interface Props {
    articleId: number
}

export default function FavoriteButton({articleId}: Props) {
    const {isFavorite, toggleFavorite} = useFavorites()
    const favorite = isFavorite(articleId)

    return (
        <button
            className={`btn btn-sm rounded-pill px-3 ${favorite ? 'btn-danger' : 'btn-outline-danger'}`}
            type="button"
            aria-pressed={favorite}
            aria-label={favorite ? 'Bỏ lưu bài viết' : 'Lưu bài viết'}
            onClick={() => toggleFavorite(articleId)}
        >
            {favorite ? 'Bỏ lưu' : 'Lưu tin'}
        </button>
    )
}
