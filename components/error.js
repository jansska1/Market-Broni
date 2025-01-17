'use client'
import { cn } from '@/utils/cn'
export default function ErrorComp({ error, className }) {
	return (
		<div className={cn('flex flex-col justify-center items-center px-6', className)}>
			<h2 className='text-xl font-semibold'>Przepraszamy wystąpił błąd dotyczący twoich ogłoszeń</h2>
			<p className='text-error'>{error.message}</p>
		</div>
	)
}
