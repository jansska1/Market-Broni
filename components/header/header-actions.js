import Link from 'next/link'
import { Heart } from 'lucide-react'
export default async function HeaderActions() {
	return (
		<div className='w-full max-w-5xl flex gap-4 items-center text-standard text-white'>
			<Link
				href='/dodaj-ogloszenie'
				className='px-4 py-2 border border-transparent rounded-md bg-white text-secondary-foreground hover:duration-300 hover:border hover:border-white hover:text-white hover:bg-secondary-foreground'>
				Dodaj Ogłoszenie
			</Link>
			<Link
				href='/polubione'
				className='hover:duration-300 hover:text-gray-300 p-2'>
				<Heart />
			</Link>
		</div>
	)
}
