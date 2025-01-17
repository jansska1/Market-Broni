import Image from 'next/image'
import Link from 'next/link'
import DeleteButton from '@/components/products/button-delete'
import Modal from '@/components/modal'
import LikeButton from '@/components/favorites/button-like'
import ActiveButton from '@/components/products/button-active'
import ExpirationDetails from './expiration'
import { getImagesUrl, getHigherBid } from '@/lib/data'
import { pln, formatDate } from '@/helpers'
import { CircleUserRound } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { Spinner } from '@radix-ui/themes'

export default async function ProductItem({
	id,
	prod_name,
	image,
	slug,
	created_at,
	price,
	userUI = false,
	info,
	user_id,
	is_active,
}) {
	const supabase = createClient()
	const url = await getImagesUrl(image)
	const {
		data: { user },
	} = await supabase.auth.getUser()
	const higherBid = await getHigherBid(id)

	if (!userUI) {
		return (
			<article className='flex flex-col justify-between'>
				<div className='bg-white rounded-md'>
					<Link href={`/ogloszenie/${id}-${slug}`}>
						<div className='relative flex justify-center items-center h-52 w-full bg-gray-200'>
							{url.length > 0 ? (
								<Image
									className='object-cover'
									src={url[0]}
									alt={prod_name}
									sizes='(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw'
									priority
									fill></Image>
							) : (
								<Spinner className='z-10' />
							)}
						</div>
					</Link>
					<div className='flex flex-col p-2 '>
						<h2 className='font-bold truncate'>{prod_name}</h2>
						<div className='flex flex-row items-center justify-between'>
							<p className='font-bold text-sm'>{higherBid ? pln.format(higherBid) : pln.format(price)}</p>
							{user && user_id === user.id ? (
								<p className='p-1'>
									<CircleUserRound size={20} />
								</p>
							) : (
								<LikeButton
									className='flex justify-center p-1'
									id={id}
								/>
							)}
						</div>
						<div className='flex flex-row justify-between text-sm'>
							<p>{info.voivodeship}</p>
							<p>{formatDate(created_at)}</p>
						</div>
					</div>
				</div>
			</article>
		)
	} else {
		return (
			<article className='flex flex-col lg:flex-row lg:justify-self-center'>
				<Link href={`/ogloszenie/${id}-${slug}`}>
					<div className='relative flex items-center justify-center h-52 w-64 lg:w-60 bg-gray-200'>
						{url.length > 0 ? (
							<Image
								className='object-cover rounded-t-md lg:rounded-t-none lg:rounded-tl-md lg:rounded-l-md'
								src={url[0]}
								alt={prod_name}
								sizes='(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw'
								priority
								fill></Image>
						) : (
							<Spinner />
						)}
					</div>
				</Link>
				<div className='flex flex-col rounded-b-md lg:rounded-b-none lg:rounded-r-md p-2 bg-white text-primary-foreground'>
					<div className='flex flex-col gap-1 p-2'>
						<h2 className='font-bold text-black truncate'>{prod_name}</h2>
						<p className='text-black'>{higherBid ? pln.format(higherBid) : pln.format(price)}</p>
						<p className='text-black'>Utworzone: {formatDate(created_at)}</p>
						<ExpirationDetails productId={id} />
					</div>
					<div className='flex grow flex-row justify-between'>
						<div className='flex flex-col gap-2 lg:gap-0'>
							{is_active ? (
								<ActiveButton
									id={id}
									active={false}
								/>
							) : (
								<ActiveButton
									id={id}
									active={true}
								/>
							)}
							<Link
								href={`/edytuj-ogloszenie/${id}-${slug}`}
								className='flex justify-center items-center p-1 mt-auto min-w-16 bg-primary rounded hover:bg-primary/85 hover:duration-300'>
								Edytuj
							</Link>
						</div>
						<Modal
							id={id}
							image={image}
						/>
					</div>
				</div>
			</article>
		)
	}
}
