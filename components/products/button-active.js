'use client'
import { cn } from '@/utils/cn'
import { useUserAds } from '../providers/user-adsCtx'
import { Spinner } from '@radix-ui/themes'
export default function ActiveButton({ id, active, className }) {
	const { isPending, handleActive } = useUserAds()
	return (
		<button
			type='button'
			className={cn(
				'flex justify-center items-center min-w-[5.4rem] p-1 rounded bg-primary/80 text-sm hover:bg-primary/70 hover:duration-300',
				className
			)}
			onClick={() => handleActive(id, active)}
			disabled={isPending}>
			{isPending ? (
				<span className='py-1'>
					<Spinner />
				</span>
			) : active ? (
				'Aktywuj'
			) : (
				'Zakończ'
			)}
		</button>
	)
}
