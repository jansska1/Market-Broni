'use client'
import Image from 'next/image'
import Dropzone from 'react-dropzone'
import { useCallback, memo } from 'react'
import { Controller } from 'react-hook-form'
import { useEffect } from 'react'
import { nanoid } from 'nanoid'
import { Camera, Upload, ImagePlus } from 'lucide-react'
import { Label } from '../ui/label'
import { useFormUser } from '../providers/formCtx'

const ImagePicker = memo(function ImagePicker({
	name,
	mode,
	product,
	imagesUrl,
	watch,
	control,
	maxImages = 8,
	setValue,
	label,
}) {
	// console.log('render <ImagePicker>')
	const { pickedImages, setPickedImages, setImagesToDelete } = useFormUser()

	const onDrop = useCallback(acceptedFiles => {
		const newImages = acceptedFiles.slice(0, maxImages - pickedImages.length)
		setPickedImages(prevImages => {
			newImages.map(file =>
				Object.assign(file, {
					id: nanoid(),
					preview: URL.createObjectURL(file),
				})
			)
			return [...prevImages, ...newImages].slice(0, maxImages)
		})
	}, [])

	useEffect(() => {
		if (pickedImages.length === 0) setValue(name, [])
		else setValue(name, pickedImages, { shouldValidate: true })
	}, [pickedImages, setValue])

	useEffect(() => {
		// Make sure to revoke the data uris to avoid memory leaks, will run on unmount
		return () => pickedImages.forEach(file => URL.revokeObjectURL(file.preview))
	}, [])

	useEffect(() => {
		if (mode === 'edit' && product?.image?.length > 0 && imagesUrl?.length > 0) {
			setPickedImages(
				product.image.map((img, i) => {
					return {
						id: img.split('/').slice(1).join(),
						preview: imagesUrl[i],
					}
				})
			)
			return
		}
	}, [mode, product, imagesUrl])

	const handleDeleteImage = useCallback(image => {
		const newImages = pickedImages.filter(img => img.id !== image.id)
		if (mode === 'edit') setImagesToDelete(prevImage => [...prevImage, image])
		setPickedImages(newImages)
		setValue(name, newImages, { shouldValidate: true })
	})

	// console.log('pickedImages:', pickedImages)

	return (
		<div className=''>
			<Controller
				control={control}
				name={name}
				render={() => (
					<>
						<Dropzone
							onDrop={acceptedFiles => {
								onDrop(acceptedFiles)
							}}
							accept={{ 'image/jpeg': [], 'image/png': [], 'image/webp': [] }}
							maxFiles={maxImages}>
							{({ getRootProps, getInputProps, isDragActive }) => (
								<>
									<Label htmlFor={name}>{label}</Label>

									<ImagePreview
										maxImages={maxImages}
										handleDeleteImage={handleDeleteImage}
										pickedImages={pickedImages}
									/>
									<div
										className='rounded-md bg-secondary-foreground text-primary-foreground my-5'
										{...getRootProps()}>
										<input
											{...getInputProps({
												id: name,
											})}
										/>
										{isDragActive ? (
											<p className='flex justify-center cursor-pointer uppercase bg-secondary-foreground font-bold p-5 rounded-md'>
												<Upload />
											</p>
										) : (
											<div className='flex items-center justify-center p-4 cursor-pointer gap-1'>
												<p className='uppercase'>Wybierz lub przeciągnij zdjęcie</p>
												<ImagePlus size={20} />
											</div>
										)}
									</div>
								</>
							)}
						</Dropzone>
					</>
				)}
			/>
		</div>
	)
})

const ImagePreview = memo(function ImagePreview({ maxImages, pickedImages, handleDeleteImage }) {
	return (
		// {/* <label htmlFor={name}>{label}</label> */}
		<div className='grid grid-cols-subgrid justify-center gap-4 mb-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
			{Array.from({ length: maxImages }).map((_, index) => (
				<div
					key={index}
					className='w-52 h-36 rounded-md bg-gray-100 relative flex items-center justify-center'>
					{pickedImages[index] ? (
						<div className='relative group w-full h-full border-1 overflow-hidden'>
							<Image
								className='object-cover absolute inset-0 transition-all duration-300 group-hover:shadow-lg'
								src={pickedImages[index].preview}
								alt={`Selected image ${pickedImages[index].id}`}
								priority
								sizes='(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw'
								fill
							/>
							<button
								type='button'
								onClick={() => handleDeleteImage(pickedImages[index])}
								className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
								Usuń
							</button>
						</div>
					) : (
						<p className='text-black text-center uppercase'>{index === 0 ? 'Zdjęcie podglądowe' : <Camera />}</p>
					)}
				</div>
			))}
		</div>
	)
})
{
	/* <>
			<label htmlFor={name}>{label}</label>
			<div className='flex flex-wrap gap-4 mb-4'>
				{Array.from({ length: maxImages }).map((_, index) => (
					<div
						key={index}
						className='w-52 h-36 border-2 relative flex items-center justify-center'>
						{pickedImages[index] ? (
							<div className='relative group w-full h-full border-1 overflow-hidden'>
								<Image
									className='object-cover absolute inset-0 transition-all duration-300 group-hover:shadow-lg'
									src={pickedImages[index].preview}
									alt={`Selected image ${pickedImages[index].id}`}
									priority
									sizes='(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw'
									fill
								/>
								<button
									type='button'
									onClick={() => handleDeleteImage(pickedImages[index])}
									className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
									Usuń
								</button>
							</div>
						) : (
							<p className='text-gray-600 text-center'>{index === 0 ? 'Zdjęcie podglądowe' : <Camera />}</p>
						)}
					</div>
				))}
			</div>
		</> */
}
export default ImagePicker
