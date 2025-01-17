'use client'
import ErrorComp from '@/components/error'
export default function ProfileError({ error }) {
	return (
		<ErrorComp
			error={error}
			className='h-screen lg:h-[calc(100vh-4.5rem)]'
		/>
	)
}
