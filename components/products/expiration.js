'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { TriangleAlert, TimerReset } from 'lucide-react'
export default function ExpirationDetails({ productId }) {
	const [product, setProduct] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const supabase = createClient()

	const fetchProduct = async () => {
		setLoading(true)
		const { data, error } = await supabase.from('products').select('*').eq('id', productId).single()
		setError(null)
		if (error) setError(error.message)
		setProduct(data)
		setLoading(false)
	}

	useEffect(() => {
		fetchProduct()
		const interval = setInterval(fetchProduct, 12 * 60 * 60 * 1000)
		return () => clearInterval(interval)
	}, [productId])

	if (loading) return <p className='text-black'>Pobieranie...</p>
	if (error)
		return (
			<p className='text-black'>
				Wygasa: <span className='text-error'>Błąd</span>
			</p>
		)

	const now = new Date()
	const expiresAt = new Date(product.expires_at)
	const threeDaysBeforeExpiration = new Date(expiresAt.getTime() - 3 * 24 * 60 * 60 * 1000)
	const isThreeDaysBeforeExpiration = now >= threeDaysBeforeExpiration && now < expiresAt

	async function toggleRenew() {
		const {
			data: { user },
		} = await supabase.auth.getUser()

		setProduct(prev => ({
			...prev,
			auto_renew: !prev.auto_renew,
		}))

		const { error } = await supabase
			.from('products')
			.update({ auto_renew: !product.auto_renew })
			.eq('id', productId)
			.eq('user_id', user.id)

		if (error) {
			console.error('Failed to toggle auto renewation:', error)
			setProduct(prev => ({
				...prev,
				auto_renew: !prev.auto_renew,
			}))
		}
	}
	let Icon

	if (isThreeDaysBeforeExpiration && !product.auto_renew)
		Icon = () => (
			<button
				className=''
				onClick={toggleRenew}>
				<TriangleAlert color='#ff4000' />
			</button>
		)
	if (!isThreeDaysBeforeExpiration && !product.auto_renew)
		Icon = () => (
			<button onClick={toggleRenew}>
				<TimerReset color='#ff4000' />
			</button>
		)
	if (product.auto_renew)
		Icon = () => (
			<button onClick={toggleRenew}>
				<TimerReset color='#31813a' />
			</button>
		)

	return (
		<div>
			<p className='text-black flex gap-1'>
				<Icon />
				Wygasa: {expiresAt.toLocaleDateString()}
			</p>
		</div>
	)
}
