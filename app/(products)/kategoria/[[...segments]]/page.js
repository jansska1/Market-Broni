import Link from 'next/link'
import ProductsList from '@/components/products/products-list'
import FiltersForm from '@/components/products/product-sort-filter'
import { getProducts, getCategory, getSubcategory, getAllCategories, getInfo } from '@/lib/data'
import { notFound } from 'next/navigation'
import { SearchX } from 'lucide-react'
import { pagesCalc, createFilters } from '@/helpers'

export default async function CategoryPage({ params, searchParams }) {
	const { segments } = params || []
	const category = segments?.[0]
	const subcategory = segments?.[1]
	const page = Number(searchParams?.strona) || 1
	const allCategories = await getAllCategories()
	const { s: sortBy } = searchParams
	const filters = createFilters(searchParams)

	const sort = {
		sortBy: sortBy || '',
	}

	const hasActiveFilters = Object.values(filters).some(value => value.length > 0)

	// console.log('filters, sort:', { filters, sort })

	let productsResponse
	let filteredProductsResponse
	let availableCategory = []
	let availableSubcategory = []

	if (!segments) {
		return (
			<div className='text-center'>
				<h1>Wszystkie kategorie</h1>
				<ul>
					{allCategories.map(category => (
						<li key={category.id}>
							<Link href={`/kategoria/${category.slug}`}>{category.cat_name}</Link>
						</li>
					))}
				</ul>
			</div>
		)
	}

	if (category && !subcategory) {
		availableCategory = await getCategory(category)
	}
	if (category && subcategory) {
		availableCategory = await getCategory(category)
		availableSubcategory = await getSubcategory(subcategory)
	}

	if (subcategory) {
		// category + subcategory
		productsResponse = await getProducts(page, filters, sort, category, subcategory)
		filteredProductsResponse = await getInfo(category, subcategory)
	} else {
		// category
		productsResponse = await getProducts(page, filters, sort, category)
		filteredProductsResponse = await getInfo(category)
	}

	if (
		(category && availableCategory[0]?.slug !== category) ||
		(subcategory && availableSubcategory[0]?.slug !== subcategory) ||
		segments.length > 2
	)
		throw new Error('Niepoprawna ścieżka')

	if ((!productsResponse || productsResponse.data.length === 0) && !hasActiveFilters) return notFound()

	const { data: products, count } = productsResponse
	const formattedFilters = filteredProductsResponse
	const totalPages = pagesCalc(count)
	// console.log(formattedFilters)

	if (hasActiveFilters && products && products.length < 1) {
		return (
			<div className='h-full flex flex-col py-12 px-6'>
				<FiltersForm payload={formattedFilters} />

				<div className='h-[calc(100vh-15.5rem)] md:h-[calc(100vh-6.5rem)] lg:md:h-[calc(100vh-6.5rem)] flex justify-center py-12 px-6'>
					<h2 className='flex items-center font-semibold gap-1 text-lg'>
						<span className='text-error'>
							<SearchX size={64} />
						</span>
						Wygląda na to, że żaden z produktów nie spełnia podanych filtrów.
					</h2>
				</div>
			</div>
		)
	}

	if (products) {
		return (
			<div className='h-full flex flex-col py-12 px-6'>
				<FiltersForm payload={formattedFilters} />
				<div>
					<h1 className='text-center font-bold text-lg text-secondary-foreground'>
						Kategoria: {availableCategory[0]?.cat_name}
					</h1>
					{subcategory && (
						<h2 className='text-center font-bold text-lg text-secondary-foreground'>
							Subkategoria: {availableSubcategory[0]?.sub_name}
						</h2>
					)}
				</div>

				<ProductsList
					products={products}
					totalPages={totalPages}
				/>
			</div>
		)
	}
}
