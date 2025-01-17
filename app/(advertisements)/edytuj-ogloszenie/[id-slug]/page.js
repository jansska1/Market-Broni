import AdvertisementForm from '@/components/new-product/form'
import { getCategoryAndSubcategory, getFirstAndLastRowsOfSubcategories, getImagesUrl, getProduct } from '@/lib/data'
import { idFromSlug } from '@/helpers'
// import { notFound } from 'next/navigation'
export default async function EditAdvertisement({ searchParams, params }) {
	const productsSlug = params['id-slug'].split('-')
	const productId = idFromSlug(productsSlug)
	const [categories, subcategoryRows, productAndUrls] = await Promise.all([
		getCategoryAndSubcategory(),
		getFirstAndLastRowsOfSubcategories(),
		getProduct(productId),
	])
	const { product, urls } = productAndUrls

	// console.log(prodName)

	return (
		<>
			<AdvertisementForm
				mode='edit'
				product={product}
				id={productId}
				imagesUrl={urls}
				categories={categories}
				searchParams={searchParams}
				subcategoryRows={subcategoryRows}
			/>
		</>
	)
}
