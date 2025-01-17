import NotFoundComp from '@/components/ui/not-found'
export const metadata = {
	title: 'Strona nie znaleziona',
}
export default function NotFound() {
	return <NotFoundComp className='h-[calc(100vh-15.5rem)] sm:h-[calc(100vh-6.5rem)]' />
}
