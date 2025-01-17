'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

const FavoritesContext = createContext({
	updatedFavorites: () => {},
})

const FavoritesProvider = ({ children, initialFavorites }) => {
	const [updatedFavorites, setUpdatedFavorites] = useState([])
	const supabase = createClient()
	// console.log('initialFavorites:', initialFavorites)

	useEffect(() => {
		setUpdatedFavorites(initialFavorites.map(fav => fav.products))
		const channel = supabase
			.channel('realtime:favorites')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'favorites' }, async payload => {
				// console.log('Zmiana w Realtime:', payload)

				if (payload.eventType === 'INSERT') {
					const { data: productData, error } = await supabase
						.from('products')
						.select('*')
						.eq('id', payload.new.product_id)
						.single()

					if (error) {
						console.error('Failed to update favorites', error.message)
						throw new Error('Failed to update favorites', error.message)
					}
					setUpdatedFavorites(prev => [...prev, productData])
					// console.log('początek')
				}

				if (payload.eventType === 'DELETE') {
					setUpdatedFavorites(prev => prev.filter(product => product.id !== payload.old.product_id))
				}
			})
			.subscribe()

		return () => {
			supabase.removeChannel(channel)
		}
	}, [initialFavorites])

	const isFavorite = productId => {
		return updatedFavorites.some(product => product.id === productId)
	}

	const toggleFavorite = async productId => {
		// console.log('1')
		const {
			data: { user },
		} = await supabase.auth.getUser()

		if (!user) {
			alert('Zaloguj się, aby polubić ogłoszenie.')
			return
		}

		const isLiked = isFavorite(productId)
		// console.log('2')
		if (isLiked) {
			const { error } = await supabase.from('favorites').delete().eq('user_id', user.id).eq('product_id', productId)

			if (error) {
				console.error('Error removing favorite:', error.message)
				return
			}

			setUpdatedFavorites(prev => prev.filter(product => product.id !== productId))
			// console.log('3')
		} else {
			const { error: insertError } = await supabase
				.from('favorites')
				.insert({ user_id: user.id, product_id: productId })

			if (insertError) {
				console.error('Error adding favorite:', insertError.message)
				return
			}

			// console.log('4')
		}
	}
	// console.log('updatedFavorites:', updatedFavorites)

	return (
		<FavoritesContext.Provider value={{ updatedFavorites, isFavorite, toggleFavorite }}>
			{children}
		</FavoritesContext.Provider>
	)
}

export const useFavorites = () => useContext(FavoritesContext)

export default FavoritesProvider
