import FavoritesList from '@/components/favorites/favorites-list'
export default async function FavoritesSite() {
	return (
		<section className='min-h-screen py-6 bg-fifth'>
			<h2 className='text-center font-bold py-4 text-lg text-secondary-foreground'>Twoje polubione produkty:</h2>
			<FavoritesList />
		</section>
	)
}
