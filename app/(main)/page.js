import ProductsList from '@/components/products/products-list'
import { getMainPageAds } from '@/lib/data'
export default async function Index() {
	const ads = await getMainPageAds()
	return (
		<main className='h-full flex flex-col gap-6 px-4 w-full'>
			<h1 className='font-semibold text-2xl mb-4 text-secondary-foreground'>
				Market Broni - tutaj kupisz lub sprzedaż broń i akcesoria strzeleckie
			</h1>
			<ProductsList products={ads} />
		</main>
	)
}
