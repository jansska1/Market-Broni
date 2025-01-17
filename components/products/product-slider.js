'use client'
import Image from 'next/image'
import { Slide } from 'react-slideshow-image'
import { useState } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { useMediaQuery } from 'react-responsive'
import 'react-slideshow-image/dist/styles.css'

export default function PrductSlider({ product, url }) {
	const [isActive, setIsActive] = useState(0)
	const isSingle = url.length > 1
	const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 })

	const properties = {
		prevArrow: (
			<button
				className='flex items-center justify-center'
				disabled>
				<ChevronLeft
					className='mx-2 bg-slate-50/70 rounded-full'
					strokeWidth={3}
					size={28}
				/>
			</button>
		),
		nextArrow: (
			<button disabled>
				<ChevronRight
					className='mx-2 bg-slate-50/70 rounded-full'
					strokeWidth={3}
					size={28}
				/>
			</button>
		),
	}

	function indicators(index) {
		return (
			<div className='my-2'>
				<button
					className={`border-2 rounded p-1 mx-1 ${
						index === isActive ? 'border-secondary-foreground scale-110' : 'border-gray-300 opacity-50'
					} transition-all duration-300`}>
					<div
						className='relative w-24 h-24 border border-gray-300 rounded'
						key={index}>
						<Image
							className='object-cover'
							src={url[index]}
							alt={product.prod_name}
							sizes='(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw'
							priority={true}
							fill
						/>
					</div>
				</button>
			</div>
		)
	}

	return (
		<div className='w-full'>
			<Slide
				{...properties}
				autoplay={false}
				arrows={isSingle}
				canSwipe={isSingle && isTabletOrMobile}
				transitionDuration={500}
				onChange={(_, newIndex) => setIsActive(newIndex)}
				indicators={url.length > 1 && indicators}>
				{url.map((src, index) => (
					<div
						key={index}
						className='relative flex items-center justify-center h-[380px] md:h-[520px]'>
						<Image
							className='object-cover'
							src={src}
							alt={product.prod_name}
							priority={true}
							sizes='(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 65vw'
							// onLoad={handleImageLoad}
							fill
						/>
					</div>
				))}
			</Slide>
		</div>
	)
}
