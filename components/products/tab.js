'use client'
import Link from 'next/link'
import clsx from 'clsx'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
export default function Tab({}) {
	const [selectedLink, setSelectedLink] = useState()
	const path = usePathname()
	useEffect(() => {
		const linkMapping = {
			'/moje-ogloszenia': 'active',
			'/moje-ogloszenia/aktywne': 'active',
			'/moje-ogloszenia/nieaktywne': 'inactive',
		}
		setSelectedLink(linkMapping[path] || null)
	}, [path])
	function handleActive(selectedLink) {
		setSelectedLink(selectedLink)
	}
	return (
		<menu className='flex flex-col justify-between'>
			<div className='flex self-start '>
				<NavLink
					onSelect={() => handleActive('active')}
					isActive={selectedLink === 'active'}
					href='/moje-ogloszenia/aktywne'>
					Aktywne
				</NavLink>
				<NavLink
					onSelect={() => handleActive('inactive')}
					isActive={selectedLink === 'inactive'}
					href='/moje-ogloszenia/nieaktywne'>
					Nieaktywne
				</NavLink>
			</div>
		</menu>
	)
}

export function NavLink({ href, className, isActive, onSelect, children }) {
	return (
		<Link
			href={href}
			onClick={onSelect}
			className={clsx(
				'p-3 h-full hover:text-secondary-foreground hover:duration-300 focus:text-secondary-foreground',
				className,
				{
					'font-semibold': isActive,
				}
			)}>
			{children}
		</Link>
	)
}
