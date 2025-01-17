'use client'
import FavoriteItem from '@/components/favorites/favorite'
import { useFavorites } from '@/components/providers/favoritesCtx'
import { notFound } from 'next/navigation'
export default function FavoritesList() {
	const { updatedFavorites } = useFavorites()
	// console.log(updatedFavorites)
	if (!updatedFavorites) notFound()
	return (
		<div className='px-4'>
			{updatedFavorites.length > 0 ? (
				<>
					<ul className='flex-grow grid grid-cols-[repeat(auto-fill,_minmax(15rem,_1fr))] gap-5 my-2 w-9/10 max-w-90'>
						{updatedFavorites?.map(favorite => (
							<li key={favorite.id}>
								<FavoriteItem {...favorite} />
							</li>
						))}
					</ul>
				</>
			) : (
				<p className='text-center my-2'>Tu pojawią się polubione przez ciebie produkty</p>
			)}
		</div>
	)
}
