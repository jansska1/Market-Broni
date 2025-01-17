import Link from 'next/link'
export const metadata = {
	title: 'Strona nie znaleziona',
}
export default function AuthNotFound() {
	return (
		<div className='h-[calc(100vh-4.5rem)] flex flex-col justify-center items-center px-6'>
			<div className='flex flex-col items-center justify-center p-6 bg-secondary-foreground rounded'>
				<h1 className='text-3xl font-bold'>
					<span className='text-error'>404</span> - Strona nie znaleziona
				</h1>
				<p className='mt-4'>Strona której szukasz, nie istnieje.</p>
				<Link
					href='/'
					className='mt-6 text-primary underline'>
					Wróć na stronę główną
				</Link>
			</div>
		</div>
	)
}
