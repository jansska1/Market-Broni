'use client'
import ErrorComp from '@/components/error'
export default function AdvertisementsError({ error }) {
	return (
		<ErrorComp
			error={error}
			className='h-screen lg:h-[calc(100vh-4.5rem)]'
		/>
	)
}
