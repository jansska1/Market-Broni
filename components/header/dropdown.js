'use client'
import Link from 'next/link'
import SignoutForm from '../auth/signout-form'
import { User, ChevronDown, ChevronUp } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const userItems = [
	{ title: 'Profil', href: '/profil' },
	{ title: 'Ogłoszenia', href: '/moje-ogloszenia' },
]

const noUserItems = [
	{ title: 'Zaloguj się', href: '/logowanie' },
	{ title: 'Załóż konto', href: '/rejestracja' },
]

export default function DropdownMenu({ user = false }) {
	const [open, setOpen] = useState(false)
	const dropdownRef = useRef(null)

	const handleToggle = () => {
		setOpen(prev => !prev)
	}

	const handleClickOutside = event => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setOpen(false)
		}
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const items = user ? userItems : noUserItems

	return (
		<div
			className='relative'
			ref={dropdownRef}>
			<button
				type='button'
				aria-expanded={open}
				onClick={handleToggle}
				className='relative inline-flex items-center justify-center text-standard font-bold text-white h-10 p-2 hover:duration-300 hover:text-gray-300'>
				<User />
				{user ? user.email.split('@')[0] : 'Konto'}
				<span className='ml-2'>{open ? <ChevronUp /> : <ChevronDown />}</span>
			</button>
			{open && (
				<div className='absolute left-1/2 -translate-x-1/2 top-12 z-50'>
					<ul
						role='menu'
						className='w-40 h-auto shadow-md rounded-md p-1 border bg-white'>
						{items.map(({ title, href }) => (
							<li key={title}>
								<Link
									href={href}
									role='menuitem'
									className={`relative flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 rounded-md cursor-pointer`}>
									{title}
								</Link>
							</li>
						))}

						{user && <SignoutForm />}
					</ul>
				</div>
			)}
		</div>
	)
}
