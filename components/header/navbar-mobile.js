import Link from 'next/link'
import SearchInput from './search'
import { Heart, CirclePlus, ScrollText, User, Search } from 'lucide-react'

export default function MobileNavbar({ search = false }) {
	return (
		<>
			{search && <SearchInput className='fixed top-0 left-0 w-full bg-secondary-foreground/70 h-14 z-50' />}
			<header className='fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50'>
				<div className='flex justify-between items-center px-4 py-3 w-full'>
					<nav className='grid grid-cols-5 text-xs w-full sm:p-0'>
						<Link
							href='/'
							className='flex flex-col items-center'>
							<div className='flex flex-col items-center'>
								<Search size={16} />
								<span>Szukaj</span>
							</div>
						</Link>
						<Link
							href='/polubione'
							className='flex flex-col items-center'>
							<div className='flex flex-col items-center'>
								<Heart size={16} />
								<span>Polubione</span>
							</div>
						</Link>
						<Link
							href='/dodaj-ogloszenie'
							className='flex flex-col items-center'>
							<div className='flex flex-col items-center'>
								<CirclePlus size={16} />
								<span>Dodaj</span>
							</div>
						</Link>
						<Link
							href='/moje-ogloszenia'
							className='flex flex-col items-center'>
							<div className='flex flex-col items-center'>
								<ScrollText size={16} />
								<span>Utworzone</span>
							</div>
						</Link>
						<Link
							href='/menu'
							className='flex flex-col items-center'>
							<div className='flex flex-col items-center'>
								<User size={16} />
								<span>Konto</span>
							</div>
						</Link>
					</nav>
				</div>
			</header>
		</>
	)
}
