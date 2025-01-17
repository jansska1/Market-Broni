import NotFoundComp from '@/components/ui/not-found'
export const metadata = {
	title: 'Strona nie znaleziona',
}
export default function MainNotFound() {
	return <NotFoundComp className='h-[calc(100vh-8rem)]' />
}
