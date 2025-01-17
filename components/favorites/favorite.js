'use client'
import LikeButton from './button-like'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { pln } from '@/helpers'
import { formatDate } from '@/helpers'
import { Spinner } from '@radix-ui/themes'

export default function FavortieItem({ id, prod_name, image, created_at, price, info, slug }) {
	const [url, setUrl] = useState([])

	useEffect(() => {
		const fetchImages = async () => {
			try {
				const queryParams = image.map(img => `image=${encodeURIComponent(img)}`).join('&')
				const response = await fetch(`/api/image?${queryParams}`)
				if (!response.ok) {
					throw new Error('Failed to load images', response)
				}
				const picture = await response.json()
				setUrl(picture)
			} catch (error) {
				console.error(error.message)
			}
		}
		fetchImages()
	}, [image])
	// console.log('url:', url)

	return (
		<div className='bg-white rounded-md'>
			<Link href={`/ogloszenie/${id}-${slug}`}>
				<div className='relative flex items-center justify-center h-56 w-full bg-gray-200'>
					{url?.picture?.length > 0 ? (
						<Image
							className='object-cover'
							src={url.picture[0]}
							alt={prod_name}
							sizes='(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw'
							priority
							fill></Image>
					) : (
						<Spinner />
					)}
				</div>
			</Link>
			<div className='flex flex-col p-2'>
				<h2 className='font-bold'>{prod_name}</h2>
				<div className='flex flex-row items-center justify-between'>
					<p className='font-bold text-sm'>{pln.format(price)}</p>
					<LikeButton
						className='flex justify-center p-1'
						id={id}
					/>
				</div>
				<div className='flex flex-row justify-between text-sm'>
					<p>{info.voivodeship}</p>
					<p>{formatDate(created_at)}</p>
				</div>
			</div>
		</div>
	)
}
