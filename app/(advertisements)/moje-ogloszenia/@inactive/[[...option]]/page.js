import ProductsList from '@/components/products/products-list'
import { getUserAdvertisements } from '@/lib/data'
import { pagesCalc } from '@/helpers'
import { TAB_LINKS } from '@/helpers'
export default async function InactiveUserAds({ params, searchParams }) {
	const option = params.option
	const selectedOption = option?.[0]
	const page = Number(searchParams?.strona) || 1
	const userUI = true
	let response

	if (!selectedOption || selectedOption === 'aktywne') response = await getUserAdvertisements(page, null, true)
	if (selectedOption === 'nieaktywne') response = await getUserAdvertisements(page, null, false)

	const { data: ads, count } = response

	const totalPages = pagesCalc(count)

	if ((selectedOption && !TAB_LINKS.includes(selectedOption)) || (option && option.length > 1))
		throw new Error('Niepoprawna opcja')

	if (ads.length < 1 && selectedOption === 'nieaktywne') {
		return (
			<div className='h-screen flex justify-center items-center'>
				<h2 className='font-semibold'>Nie masz żadnych nieaktywnych ogłoszeń</h2>
			</div>
		)
	}

	if (ads.length < 1 && selectedOption === 'aktywne') {
		return (
			<div className='h-screen flex justify-center items-center'>
				<p className='font-semibold'>Nie masz żadnych aktywnych ogłoszeń</p>
			</div>
		)
	}

	if (ads && ads.length > 0) {
		return (
			<div className='px-6'>
				<ProductsList
					products={ads}
					variant={'user'}
					size={'user'}
					userUI={userUI}
					totalPages={totalPages}
				/>
			</div>
		)
	}
}
