import ProductsList from '@/components/products/products-list'
import FiltersForm from '@/components/products/product-sort-filter'
import Spinner from '@/components/ui/spinner'
import { searchForProducts } from '@/lib/data'
import { PRODUCTS_PER_PAGE } from '@/config'
import { createFilters } from '@/helpers'
import { SearchX } from 'lucide-react'
import { Suspense } from 'react'

export default async function SearchPage({ searchParams }) {
	const { query, s: sort } = searchParams
	const page = Number(searchParams?.strona) || 1
	const filters = createFilters(searchParams)

	const {
		data: searchResult,
		count: searchCount,
		filters: searchFilters,
	} = await searchForProducts(query, page, filters, sort)

	const pagesCalc = count => Math.ceil(count / PRODUCTS_PER_PAGE)
	const totalSearchPages = pagesCalc(searchCount)

	if (searchResult && searchResult.length < 1) {
		return (
			<div className='h-[calc(100vh-15.5rem)] md:h-[calc(100vh-6.5rem)] lg:md:h-[calc(100vh-6.5rem)] flex justify-center py-12 px-6'>
				<h2 className='flex items-center font-semibold gap-1 text-lg'>
					<span className='text-error'>
						<SearchX size={64} />
					</span>
					Wygląda na to, że nie posiadamy szukanego produktu
				</h2>
			</div>
		)
	}
	return (
		<div className='py-12 px-6'>
			<FiltersForm payload={searchFilters} />
			<Suspense
				fallback={
					<div className='h-full w-full flex justify-center items-center'>
						<Spinner />
					</div>
				}>
				<ProductsList
					products={searchResult}
					totalPages={totalSearchPages}
				/>
			</Suspense>
		</div>
	)
}
