'use client'
import { cn } from '@/utils/cn'
import { useList } from '../providers/listCtx'
import { Spinner } from '@radix-ui/themes'
export default function DeleteButton({ id, image, className }) {
	const { handleDelete, isPending } = useList()
	console.log(id)
	return (
		<button
			type='button'
			className={cn(
				'flex justify-center items-center min-w-[5.4rem] p-1 rounded bg-red-500 hover:bg-red-400   hover:duration-300',
				className
			)}
			onClick={() => handleDelete(id, image)}
			disabled={isPending}>
			{isPending ? (
				<span className='py-1'>
					<Spinner />
				</span>
			) : (
				'Usuń'
			)}
		</button>
	)
}
