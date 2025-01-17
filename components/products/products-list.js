import ProductItem from './product'
import Pagination from './pagination'
import Link from 'next/link'
import SuspenseSpinner from '@/components/ui/spinner-suspense'
import { PRODUCTS_PER_PAGE } from '@/config'
import { cva } from 'class-variance-authority'
import { cn } from '@/utils/cn'
import { Suspense } from 'react'

const listVariants = cva('list-none p-0', {
	variants: {
		size: {
			default: 'w-9/10 max-w-90',
			// user: 'w-9/10 max-w-90',
			// user: 'w-full',
		},
		variant: {
			default: 'grid grid-cols-[repeat(auto-fill,_minmax(15rem,_1fr))] gap-5 my-4',
			user: 'flex flex-col justify-center items-center lg:grid lg:grid-cols-2 gap-5 my-4',
			// user: 'flex-grow grid grid-cols-[repeat(auto-fill,_minmax(28rem,_1fr))] gap-5 my-2',
		},
	},
	defaultVariants: {
		size: 'default',
		variant: 'default',
	},
})

export default function ProductsList({ products, variant, size, className, userUI, totalPages }) {
	let list

	if (userUI && products?.length < 1) {
		return (
			<>
				<div>
					<p>Jescze nie masz żadnego ogłoszenia</p>
					<button>
						<Link href='/dodaj-ogloszenie'>Dodaj Ogłoszenie</Link>
					</button>
				</div>
			</>
		)
	}

	if (userUI && products?.length > 0) {
		list = (
			<ul className={cn(listVariants({ variant, size, className }))}>
				{products.map(product => (
					<li key={product.id}>
						<ProductItem
							{...product}
							userUI={userUI}
						/>
					</li>
				))}
			</ul>
		)
	}

	if (!userUI && products?.length > 0) {
		list = (
			<ul className={cn(listVariants({ variant, size, className }))}>
				{products.map(product => (
					<li key={product.id}>
						<ProductItem {...product} />
					</li>
				))}
			</ul>
		)
	}

	return (
		<div className='min-h-screen flex flex-col grow py-6'>
			{totalPages > 1 && <Pagination totalPages={totalPages} />}
			<Suspense fallback={<SuspenseSpinner />}>{list}</Suspense>
			{totalPages > 1 && products?.length > PRODUCTS_PER_PAGE / 2 && (
				<Pagination
					className='mt-auto'
					totalPages={totalPages}
				/>
			)}
		</div>
	)
}
