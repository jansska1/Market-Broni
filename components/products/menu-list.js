'use client'
import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
export default function MenuList({ categories }) {
	const [activeCategory, setActiveCategory] = useState(null)

	return (
		<ul className='list-none flex justify-between flex-col sm:flex-row lg:flex-col'>
			{categories.map(category => (
				<li key={category.id}>
					<div className='flex items-center justify-between h-[48px] w-full'>
						<Link
							className='block w-full bg-fifth p-3
							 text-sm font-medium hover:bg-forth hover:text-secondary-foreground lg:justify-start lg:p-2 lg:px-3'
							href={`/kategoria/${category.slug}`}>
							{category.cat_name}
						</Link>
						<button
							className='p-3'
							onClick={() => setActiveCategory(prev => (prev === category.cat_name ? null : category.cat_name))}>
							{activeCategory === category.cat_name ? <ChevronUp /> : <ChevronDown />}
						</button>
					</div>

					{activeCategory === category.cat_name && (
						<ul className='list-none'>
							{category.subcategories.map(subcategory => (
								<li
									className='border-b border-secondary-foreground'
									key={subcategory.id}>
									<Link
										className='p-3 text-sm block w-full hover:bg-forth hover:text-secondary-foreground lg:flex-none lg:justify-start lg:p-2 lg:px-3'
										href={`/kategoria/${category.slug}/${subcategory.slug}`}>
										{subcategory.sub_name}
									</Link>
								</li>
							))}
						</ul>
					)}
				</li>
			))}
		</ul>
	)
}
