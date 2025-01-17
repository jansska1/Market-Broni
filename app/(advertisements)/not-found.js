import NotFoundComp from '@/components/ui/not-found'
export const metadata = {
	title: 'Strona nie znaleziona',
}
export default function AdvertisementNotFound() {
	return <NotFoundComp className='h-screen lg:h-[calc(100vh-4.5rem)]' />
}
