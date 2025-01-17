'use client'
// import useSWR from 'swr'
// import { fetcher } from '@/lib/fetcher'
// import { createClient } from '@/utils/supabase/client'
// import { v4 as uuidv4 } from 'uuid'
import { EyeOff, Eye } from 'lucide-react'
import { useEffect, useState } from 'react'

const ViewCounter = ({ productId }) => {
	const [viewsCount, setViewsCount] = useState(0)
	useEffect(() => {
		{
			const updateViews = async () => {
				// if (!schouldCounter) return
				try {
					// console.log('1')
					// let userId

					// const {
					// 	data: { user },
					// } = await supabase.auth.getUser()
					// if (user) {
					// 	console.log('user')
					// 	userId = user.id
					// }
					// if (!user) {
					// 	console.log('2')
					// 	userId = localStorage.getItem('user_id')
					// }
					// if (!userId) {
					// 	console.log('3')
					// 	userId = uuidv4()
					// 	localStorage.setItem('user_id', userId)
					// }
					// console.log('4')
					// const viewedKey = `viewed_${productId}_${userId}`
					// if (localStorage.getItem(viewedKey)) {
					// 	return
					// }
					const viewedProduct = sessionStorage.getItem(`viewed_${productId}`)
					let views
					if (!viewedProduct) {
						const response = await fetch('/api/views', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({ productId }),
						})

						if (!response.ok) {
							throw new Error('Błąd podczas aktualizacji wyświetleń')
						}
						console.log('!viewed')
						views = await response.json()
						sessionStorage.setItem(`viewed_${productId}`, 'true')
					}
					if (viewedProduct) {
						const response = await fetch(`/api/views?productId=${encodeURIComponent(productId)}`)
						if (!response.ok) {
							throw new Error('Błąd podczas pobierania wyświetleń')
						}
						views = await response.json()
					}
					setViewsCount(views.views)
				} catch (error) {
					console.error(error.message)
				}
			}
			updateViews()
		}
	}, [productId])

	return (
		<p className='flex items-center gap-1 text-xs'>
			{viewsCount > 0 ? (
				<>
					<Eye size={16} /> <span>{viewsCount}</span>
				</>
			) : (
				<EyeOff size={16} />
			)}
			{/* <Eye size={16} />
			{viewsCount > 0 ? viewsCount.toLocaleString() : '–––'} */}
		</p>
	)
}
export default ViewCounter
