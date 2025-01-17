'use client'
import { Heart } from 'lucide-react'
import { useFavorites } from '@/components/providers/favoritesCtx'

export default function LikeButton({ id, className }) {
	const { isFavorite, toggleFavorite } = useFavorites()
	const isLiked = isFavorite(id)

	const handleLike = async e => {
		e.preventDefault()
		await toggleFavorite(id)
	}

	return (
		<button
			className={className}
			onClick={handleLike}>
			{isLiked ? (
				<Heart
					size={20}
					color='#ca1616'
					fill='#ca1616'
				/>
			) : (
				<Heart size={20} />
			)}
		</button>
	)
}
