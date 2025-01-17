'use client'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { generatePagination } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ totalPages, className }) {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const currentPage = Number(searchParams.get('strona')) || 1
	const createPageURL = pageNumber => {
		const params = new URLSearchParams(searchParams)
		params.set('strona', pageNumber.toString())
		return `${pathname}?${params.toString()}`
	}
	const allPages = generatePagination(currentPage, totalPages)

	return (
		<div className={className + ' flex justify-center md:justify-end'}>
			<PaginationArrow
				direction='left'
				href={createPageURL(currentPage - 1)}
				isDisabled={currentPage <= 1}
			/>

			<div className='flex -space-x-px'>
				{allPages.map((page, index) => {
					let position

					if (index === 0) position = 'first'
					if (index === allPages.length - 1) position = 'last'
					if (allPages.length === 1) position = 'single'
					if (page === '...') position = 'middle'

					return (
						<PaginationNumber
							key={`${page}-${index}`}
							href={createPageURL(page)}
							page={page}
							position={position}
							isActive={currentPage === page}
						/>
					)
				})}
			</div>

			<PaginationArrow
				direction='right'
				href={createPageURL(currentPage + 1)}
				isDisabled={currentPage >= totalPages}
			/>
		</div>
	)
}

function PaginationNumber({ page, href, isActive, position }) {
	const className = clsx('flex h-10 w-10 items-center bg-secondary-foreground justify-center text-sm border', {
		'rounded-l-md': position === 'first' || position === 'single',
		'rounded-r-md': position === 'last' || position === 'single',
		'text-white': isActive,
		'hover:bg-secondary-foreground/80': !isActive && position !== 'middle',
		'text-gray-300': position === 'middle',
	})

	return isActive || position === 'middle' ? (
		<div className={className}>{page}</div>
	) : (
		<Link
			href={href}
			className={className}>
			{page}
		</Link>
	)
}

function PaginationArrow({ href, direction, isDisabled }) {
	const className = clsx('flex h-10 w-10 items-center justify-center rounded-md', {
		'pointer-events-none text-gray-400': isDisabled,
		'hover:bg-secondary/40 text-secondary-foreground': !isDisabled,
		'mr-2 md:mr-4': direction === 'left',
		'ml-2 md:ml-4': direction === 'right',
	})

	const icon = direction === 'left' ? <ChevronLeft /> : <ChevronRight />

	return isDisabled ? (
		<div className={className}>{icon}</div>
	) : (
		<Link
			className={className}
			href={href}>
			{icon}
		</Link>
	)
}
