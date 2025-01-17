import ProductSlider from '@/components/products/product-slider'
import ViewCounter from '@/app/ViewCounter'
import AuctionForm from '@/components/auction/form'
import Price from '@/components/auction/price'
import Link from 'next/link'
import { getProduct, getImagesUrl, getHigherBid, getUserProfile } from '@/lib/data'
import { notFound } from 'next/navigation'
import { idFromSlug, pln, mapKeyToLabel } from '@/helpers'
import { createClient } from '@/utils/supabase/server'
import { Send, Phone } from 'lucide-react'

export default async function productDetailsPage({ params }) {
	const supabase = createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()
	const productsSlug = params['id-slug'].split('-')
	const id = idFromSlug(productsSlug)
	const { product, urls } = await getProduct(id)

	if (!product) {
		notFound()
	}

	const higherBid = await getHigherBid(id)
	const userProfile = await getUserProfile(product.user_id)

	return (
		<section className='h-screen lg:h-[calc(100vh-4.5rem)] py-12 px-6 bg-fifth'>
			<div className='flex justify-end mb-4'>
				<ViewCounter productId={product.id} />
			</div>

			<div className='lg:grid lg:grid-cols-[minmax(680px,_2fr)_1fr] gap-2'>
				<ProductSlider
					product={product}
					url={urls}
				/>
				<div className='flex flex-col justify-between w-full gap-3 md:h-[520px] md:gap-0'>
					<div className='flex flex-col items-center w-full text-lg text-center px-2 py-4 bg-forth'>
						<div className='flex items-center justify-around w-full'>
							<h2 className='text-lg py-4'>{product.prod_name}</h2>
							{higherBid ? (
								<Price productId={product.id} />
							) : (
								<h3 className='text-lg font-bold'>{pln.format(product.price)}</h3>
							)}
						</div>
						<div className='flex lg:flex-col gap-2 w-full'>
							<Link
								className='flex justify-center items-center w-full gap-2 px-2 py-4  text-standard text-forth font-semibold uppercase bg-secondary-foreground hover:bg-secondary-foreground/85  focus:bg-secondary-foreground/85 hover:duration-300'
								href={`mailto:${product.creator_email}`}>
								<span className=''>
									<Send />
								</span>
								wyślij email
							</Link>
							{userProfile.phone && (
								<Link
									className='flex justify-center items-center w-full gap-2 px-2 py-4 text-standard text-forth font-semibold uppercase bg-secondary-foreground hover:bg-secondary-foreground/85  focus:bg-secondary-foreground/85 hover:duration-300'
									href={`tel:${userProfile.phone}`}>
									<span className=''>
										<Phone />
									</span>
									Zadzwoń
								</Link>
							)}
						</div>
					</div>
					<div className='flex flex-col items-start w-full text-lg px-2 py-4 bg-forth'>
						<h3 className='self-center text-lg font-bold uppercase my-2'>informacje o produkcie</h3>
						{Object.entries(product.info).map(([key, value]) => (
							<p
								key={key}
								className='text-standard'>
								<span className='font-semibold'>{mapKeyToLabel(key)}:</span> {value}
							</p>
						))}
					</div>
					<div className='flex flex-col items-start w-full py-4 px-2 text-lg bg-forth'>
						<h3 className='self-center text-lg font-bold uppercase my-2'>informacje o sprzedawcy</h3>
						<div className='text-standard w-full '>
							<p className='font-semibold '>
								Sprzedawca:{' '}
								<span className='font-normal'>
									{userProfile.username ? userProfile.username : userProfile.email.split('@')[0]}
									<Link
										href={`/profil/${product.user_id}`}
										className='underline underline-offset-2 hover:text-secondary-foreground hover:duration-300 focus:text-secondary-foreground'>
										(zobacz profil)
									</Link>
								</span>
							</p>
						</div>
						<p className='text-standard'>
							<span className='font-semibold'>Województwo:</span> {product.info.voivodeship}
						</p>
					</div>
				</div>
			</div>
			<div className='flex flex-col gap-4 mt-4'>
				{product.auction && (
					<AuctionForm
						productId={product.id}
						userId={product.user_id}
						user={user}
					/>
				)}
				<div className='mt-6 w-1/2'>
					<p className='uppercase font-bold text-lg'>Opis</p>
					<pre className='bg-forth p-4 whitespace-pre-line'>{product.description}</pre>
				</div>
			</div>
		</section>
	)
}
