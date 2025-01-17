'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

const AuctionContext = createContext()

const AuctionProvider = ({ children, bids }) => {
	const [newBid, setNewBid] = useState(bids || [])

	const supabase = createClient()

	useEffect(() => {
		const channel = supabase
			.channel('realtime:auction')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'auction' }, async payload => {
				// console.log('Zmiana w Realtime:', payload)

				if (payload.eventType === 'UPDATE') {
					const { data, error } = await supabase
						.from('auction')
						.select('*')
						.eq('product_id', payload.new.product_id)
						.eq('user_id', payload.new.user_id)
						.select()

					setNewBid(prev => [...prev, ...data])
					if (error) {
						console.error('Failed to update auction', error.message)
						throw new Error('Failed to update auction', error.message)
					}
				}

				if (payload.eventType === 'DELETE') {
					// setUpdatedFavorites(prev => prev.filter(product => product.id !== payload.old.product_id))
				}
			})
			.subscribe()

		return () => {
			supabase.removeChannel(channel)
		}
	}, [])

	return <AuctionContext.Provider value={{ newBid }}>{children}</AuctionContext.Provider>
}

export const useAuction = () => useContext(AuctionContext)

export default AuctionProvider
