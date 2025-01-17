'use client'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { SubmitButton } from '../submit-button'
import { Input } from '@/components/ui/input'
import { yupResolver } from '@hookform/resolvers/yup'
import { bidAction } from '@/app/actions'
import { useAuction } from '../providers/auctionCtx'
import { pln } from '@/helpers'
import { auctionSchema } from '../schema'
export default function AuctionForm({ productId, userId, user }) {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm({
		resolver: yupResolver(auctionSchema),
		defaultValues: {
			bid: '',
		},
		mode: 'onBlur',
	})
	const { newBid } = useAuction()
	const bid = newBid.filter(bid => bid.product_id === productId)
	const owner = user.id === userId

	const onSubmit = async data => {
		if (owner) return
		const wasBided = bid.some(b => b.value === data.bid)
		const isBiggerThanPrev = bid.every(b => data.bid > b.value)
		// console.log('wasBided:', wasBided)
		// console.log('isBiggerThanPrev:', isBiggerThanPrev)
		if (wasBided && isBiggerThanPrev) {
			toast.error('Ktoś już zalicytował za tą kwotę')
			return
		}

		if (!isBiggerThanPrev && wasBided) {
			toast.error('Twoja kwota musi być wyższa niż poprzednie')
			return
		}
		await bidAction(data, productId)
		reset()
	}

	return (
		<div className='w-1/2'>
			<p className='uppercase font-bold text-lg'>Licytacja!</p>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='bg-forth p-4 flex items-center'>
				<div className='flex gap-4 items-center'>
					<Input
						id='bid'
						{...register('bid')}
						className='w-[10rem] rounded-none'
						placeholder='stawka'
					/>
					<SubmitButton
						className='w-[5rem] rounded-none bg-secondary-foreground'
						pending={isSubmitting}
						disabled={owner}
						pendingText='Licytowanie...'>
						Licytuj
					</SubmitButton>
				</div>
				<p className='text-error mt-2'>{errors.bid?.message}</p>
			</form>
			<div>
				<p>Aktualna cena: {pln.format(Math.max(...bid.map(val => val.value)))}</p>
			</div>
		</div>
	)
}
