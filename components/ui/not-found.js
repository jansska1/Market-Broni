import Link from 'next/link'
import { cn } from '@/utils/cn'
export default function NotFoundComp({ className }) {
	return (
		<div className={cn('flex flex-col justify-center items-center px-6', className)}>
			<h1 className='text-3xl font-bold'>
				<span className='text-error'>404</span> - Strona nie znaleziona
			</h1>
			<p className='mt-4'>Strona której szukasz, nie istnieje.</p>
			<Link
				href='/'
				className='mt-6 text-secondary-foreground underline'>
				Wróć na stronę główną
			</Link>
		</div>
	)
}
