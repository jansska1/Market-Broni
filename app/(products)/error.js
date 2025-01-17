'use client'
import ErrorComp from '@/components/error'
export default function ProductsError({ error }) {
	return (
		<ErrorComp
			error={error}
			className='h-[calc(100vh-15.5rem)] sm:h-[calc(100vh-6.5rem)]'
		/>
	)
}
