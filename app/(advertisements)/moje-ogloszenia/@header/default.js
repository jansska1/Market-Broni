import Tab from '@/components/products/tab'
import { TimerReset, TriangleAlert } from 'lucide-react'

export default async function UserAdvertisementPage() {
	return (
		<div className='py-12 px-6'>
			<h2 className='text-lg text-center font-bold p-4 text-secondary-foreground'>Dodane przez ciebie ogłoszenia: </h2>
			<div className='flex flex-col gap-2 text-md justify-center bg-forth pt-3 px-3'>
				<p>Możesz swobodnie przełączać auto przedłużenie ogłoszenia:</p>
				<p className='flex text-sm'>
					<span>
						<TimerReset color='#31813a' />
					</span>
					- auto przedłużanie aktywne
				</p>
				<p className='flex text-sm'>
					<span>
						<TimerReset color='#ff4000' />
					</span>
					- auto przedłużanie nieaktywne, pozostało więcej niż 3 dni do wygaśnięcia
				</p>
				<p className='flex text-sm'>
					<span>
						<TriangleAlert color='#ff4000' />
					</span>
					- auto przedłużanie nieaktywne, pozostało więcej niż 3 dni do wygaśnięcia
				</p>
				<Tab />
			</div>
		</div>
	)
}
