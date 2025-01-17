'use client'
import ErrorComp from '@/components/error'
export default function MainError({ error }) {
	return (
		<ErrorComp
			error={error}
			className='h-[calc(100vh-8rem)]'
		/>
	)
}
