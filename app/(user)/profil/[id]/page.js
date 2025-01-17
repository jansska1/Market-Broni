import { getUserProfile, getUserAdvertisements, getAvailableProfiles } from '@/lib/data'
import { formatDate, pagesCalc } from '@/helpers'
import ProductsList from '@/components/products/products-list'
import { notFound } from 'next/navigation'
export default async function UserPage({ params, searchParams }) {
	const id = params.id
	const avbId = await getAvailableProfiles(id)
	if (!avbId) notFound()
	const page = Number(searchParams?.strona) || 1

	const { username, email, created_at } = await getUserProfile(id)

	const { data: userAdvs, count } = await getUserAdvertisements(page, id)
	const totalPages = pagesCalc(count)

	return (
		<section className='min-h-screen p-6 pb-0 md:p-12'>
			<div className='bg-forth max-w-md p-3'>
				<p className='text-lg font-semibold'>{username ? username : email.split('@')[0]}</p>
				<p>Marketowiec od: {formatDate(created_at)}</p>
			</div>
			<div className='w-full my-2'>
				<h2 className='text-xl'>Aktywne ogłoszenia</h2>
				<ProductsList
					products={userAdvs}
					totalPages={totalPages}
				/>
			</div>
		</section>
	)
}
