'use client'
import { pln } from '@/helpers'
import { useAuction } from '../providers/auctionCtx'

export default function Price({ higherBid, productId }) {
	const { newBid } = useAuction()
	const bid = newBid.filter(bid => bid.product_id === productId)
	const price = pln.format(Math.max(...bid.map(val => val.value)))
	return <h3 className='text-lg font-bold'>{price}</h3>
}
