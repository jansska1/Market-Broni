'use client'
import ErrorComp from '@/components/error'
export default function AuthError({ error }) {
	return (
		<ErrorComp
			error={error}
			className='h-[calc(100vh-4.5rem)]'
		/>
	)
}
