'use client'
import clsx from 'clsx'
import RadixMenu from '@/components/new-product/radix-dropdown-menu'
import ImagePicker from '@/components/new-product/image-picker'
import FormSelect from './form-select'
import Switch from './switch'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '../submit-button'
import { useEffect, useState, useCallback, memo, useMemo } from 'react'
import { TimerReset, HandCoins } from 'lucide-react'
import { options } from '@/helpers'
import { advSchema } from '../schema'
import { useFormUser } from '../providers/formCtx'
import { MAX_PRODUCT, MAX_DESCRIPTION } from '@/config'
import { saveAdvertisementAction } from '@/app/actions'
import { useRouter } from 'next/navigation'
import { navigateWithNotification } from '@/helpers'

const initalState = {
	id: undefined,
	categoryName: '',
}

function AdvertisementForm({ mode, categories, searchParams, product, imagesUrl, subcategoryRows, user }) {
	// console.log('render <AdvertisementForm>')
	const [selected, setSelected] = useState(initalState)
	const [error, setError] = useState(null)
	const { setPickedImages, imagesToDelete, setImagesToDelete } = useFormUser()
	const memoOptions = useMemo(() => options, [options])
	const schema = advSchema(subcategoryRows, mode, product)
	const router = useRouter()

	const {
		register,
		control,
		handleSubmit,
		formState: { errors, isSubmitting, touchedFields },
		reset,
		setValue,
		watch,
	} = useForm({
		resolver: yupResolver(schema),
		context: { categoryName: selected.categoryName },
		defaultValues: {
			product: mode === 'edit' ? product?.prod_name : '',
			price: mode === 'edit' ? product?.price : '',
			description: mode === 'edit' ? product?.description : '',
			condition: mode === 'edit' ? product?.condition : null,
			voivodeship: mode === 'edit' ? product?.info.voivodeship : user?.user_metadata.voivodeship,
			caliber: mode === 'edit' ? product?.info.caliber : '',
			producer: mode === 'edit' ? product?.info.producer : '',
			auction: mode === 'edit' ? product?.info.auction : false,
			auctionValue: mode === 'edit' ? product?.auction_value : '',
			renew: mode === 'edit' ? product?.auto_renew : false,
		},
		mode: 'onBlur',
		reValidateMode: 'onBlur',
	})

	const subcategoryId = searchParams?.kat || product?.subcategory_id || ''
	const auction = watch('auction')
	const auctionValue = watch('auctionValue')
	const textLength = watch()

	// console.log(auction, auctionValue, errors)

	useEffect(() => {
		subcategoryId ? setValue('subcategory', subcategoryId, { shouldValidate: true }) : setValue('subcategory', '')
		!auction && setValue('auctionValue', undefined)
		auctionValue ? setValue('price', auctionValue) : null
	}, [subcategoryId, auction, auctionValue])

	const handleSelectedOption = useCallback(value => {
		setSelected(prevState => ({
			...prevState,
			id: value.id,
			categoryName: value.categoryName,
			subcategoryName: value.subcategoryName,
		}))
	}, [])

	function resetOthers() {
		setPickedImages([])
		setSelected(initalState)
	}

	// const watcher = watch('renew')
	// console.log('renew:', watcher)
	// const watcher = watch('image')
	// console.log('images:', watcher)
	// const watchSubcategory = watch('subcategory')
	// console.log(watchSubcategory)
	// const watchCondition = watch('condition')
	// const imageWatch = watch('image')
	// console.log(watchCondition)
	// console.log('image:', imageWatch)
	// console.log(selected.categoryName)
	// console.log('errors', errors)
	// console.log(selected)
	// console.log(product)
	// console.log('selected: ', selected)
	// console.log('images to delete:', imagesToDelete)
	// console.log('Errors:', errors)

	const onSubmit = async data => {
		let response
		try {
			// console.log('1:', data)
			const formData = new FormData()
			formData.append('product', data.product)
			formData.append('price', data.price)
			formData.append('subcategory', data.subcategory)
			formData.append('condition', data.condition)
			formData.append('description', data.description)
			data.image.forEach(image => {
				if (!(image instanceof File)) formData.append(`image`, image.id)
				else formData.append(`image`, image)
			})
			formData.append('voivodeship', data.voivodeship)
			formData.append('producer', data.producer)
			formData.append('caliber', data.caliber)
			formData.append('renew', data.renew)
			formData.append('auction', data.auction)
			formData.append('auctionValue', data.auctionValue)

			if (!mode) {
				response = await saveAdvertisementAction(formData)
			}
			if (mode === 'edit') {
				response = await saveAdvertisementAction(formData, mode, product.id, imagesToDelete)
				setImagesToDelete([])
			}
			// console.log('response:', response)
			if (response.status === 'success') {
				reset()
				resetOthers()
				navigateWithNotification(router, '/', response.status, response.message)
			}
			if (response.status === 'failed') {
				navigateWithNotification(router, '/', response.status, response.message)
			}
		} catch (error) {
			console.error('Error in onSubmit:', error)
			setError(error)
		}
	}

	return (
		<>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='flex flex-col items-center flex-grow min-w-64 py-12 px-6'>
				<h1 className='text-2xl font-medium'>{mode ? 'Edytuj ogłoszenia' : 'Nowe ogłoszenie'}</h1>
				<div className='flex flex-col gap-2 [&>input]:mb-3 mt-8'>
					<div className='flex flex-col gap-2 max-w-md'>
						<Label htmlFor='product'>Nazwa produktu</Label>
						<Input
							id='product'
							{...register('product')}
							placeholder='Glock 17'
							touched={touchedFields.product}
							errors={errors.product}
						/>
						<div className='flex justify-between'>
							<p className='text-error'>{errors.product?.message}</p>
							<p className='text-sm'>
								{textLength.product?.length || 0}/{MAX_PRODUCT}
							</p>
						</div>
					</div>

					<div className='flex flex-col gap-2 '>
						<Label>Kategoria</Label>
						<RadixMenu
							product={product}
							mode={mode}
							selected={selected}
							handleSelectedOption={handleSelectedOption}
							categories={categories}
						/>
						<Input
							{...register('subcategory', { value: subcategoryId ?? '' })}
							type='hidden'
							className='hidden'
						/>
						<p className='text-error'>{errors.subcategory?.message}</p>
					</div>

					<div className='flex flex-col gap-2 max-w-44'>
						<Label htmlFor='price'>Cena</Label>
						<Input
							id='price'
							{...register('price')}
							type='text'
							disabled={auction}
							placeholder='np. 2000'
							touched={touchedFields.price}
							errors={errors.price}
						/>
						<p className='text-error'>{errors.price?.message}</p>
					</div>
					<div className='flex flex-col my-2 max-w-44'>
						<div className='flex gap-4'>
							<Label className='flex flex-row items-center gap-1 text-md'>
								<HandCoins size={20} />
								Licytacja
							</Label>
							<span className='mx-4'>
								<Switch
									name='auction'
									control={control}
									product={product?.auction}
									setValue={setValue}
								/>
							</span>
						</div>

						{auction && (
							<Input
								id='auctionValue'
								{...register('auctionValue')}
								placeholder='Kwota od której zacznie się licytacja'
								className='my-2'
							/>
						)}
						<p className='text-error'>{errors.auctionValue?.message}</p>
					</div>

					<ImagePicker
						name='image'
						mode={mode}
						imagesUrl={imagesUrl}
						product={product}
						setValue={setValue}
						watch={watch}
						control={control}
						label='Zdjęcia'
					/>
					<p className='text-error'>{errors.image?.message}</p>

					<div className='flex flex-col gap-2'>
						<Label htmlFor='description'>Pełny opis</Label>

						<textarea
							id='description'
							{...register('description')}
							className={clsx(
								'resize-none h-60 leading-5 rounded-md p-2 focus:outline-none focus:ring-secondary focus:ring-2 focus-visible:ring-secondary focus-visible:ring-2',
								{
									'!border-b-2 !border-error': errors.description,
									'!border-b-2 !border-green-500': touchedFields.description && !errors.description,
								}
							)}
							type='text'
						/>
						<div className='flex justify-between'>
							<p className='text-error'>{errors.description?.message}</p>
							<p className='text-sm'>
								{textLength.description?.length || 0}/{MAX_DESCRIPTION}
							</p>
						</div>
					</div>

					<div className='flex flex-col my-2 max-w-xs'>
						<div className='flex gap-4'>
							<Label className='flex flex-row items-center gap-1 text-md'>
								<TimerReset size={20} />
								Auto przedłużenie
							</Label>
							<span className='mx-4'>
								<Switch
									name='renew'
									control={control}
									product={product?.auto_renew}
									setValue={setValue}
								/>
							</span>
						</div>

						<p className='text-sm'>Domyślnie ogłoszenie wygasa po 30 dniach</p>
					</div>

					<div className='flex flex-col gap-2'>
						<Label>Stan</Label>
						<ConditionButtonsGroup
							product={product}
							control={control}
							name='condition'
							options={['Używany', 'Nowy', 'Uszkodzony']}
						/>
						<p className='text-error'>{errors.condition?.message}</p>
					</div>

					<div className='flex flex-col gap-2 max-w-sm'>
						<Label>Województwo</Label>
						<FormSelect
							name='voivodeship'
							control={control}
							payload={memoOptions.VOIVODESHIPS}
						/>
						<p className='text-error'>{errors.voivodeship?.message}</p>
						<AdditionalOptions
							mode={mode}
							selected={selected}
							control={control}
							memoOptions={memoOptions}
							errors={errors}
						/>
					</div>
					<SubmitButton
						className='mx-auto my-6'
						pending={isSubmitting}
						pendingText={!mode ? 'Dodawanie...' : 'Zapisywanie...'}>
						{mode === 'edit' ? 'Zapisz zmiany' : 'Dodaj Ogłoszenie'}
					</SubmitButton>
					{error && <p className='text-error text-center'>{error.message}</p>}
				</div>
			</form>
		</>
	)
}

function ConditionButtonsGroup({ options, name, control, product }) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field }) => {
				const handleClick = useCallback(
					option => {
						field.onChange(option)
					},
					[field]
				)
				return (
					<div className='flex gap-3'>
						{options.map(option => (
							<ConditionButton
								key={option}
								handleClick={() => handleClick(option)}
								isActive={field.value === option}>
								{option || product?.condition}
							</ConditionButton>
						))}
					</div>
				)
			}}
		/>
	)
}

const ConditionButton = memo(function ConditionButton({ handleClick, isActive, children }) {
	// console.log('render <ConditionButton>')
	return (
		<button
			type='button'
			className={clsx('p-2 rounded bg-sixth text-primary-foreground hover:scale-110 transition-all duration-200', {
				'!bg-secondary-foreground': isActive,
			})}
			onClick={handleClick}>
			{children}
		</button>
	)
})

const AdditionalOptions = memo(({ selected, control, memoOptions, errors }) => {
	const validCategories = new Set(['Broń długa', 'Broń krótka'])
	if (validCategories.has(selected.categoryName)) {
		return (
			<>
				<Label>Kaliber</Label>
				<FormSelect
					name='caliber'
					control={control}
					payload={memoOptions.CALIBERS}
				/>
				<p className='text-error'>{errors.caliber?.message}</p>
				<Label>Producent</Label>
				<FormSelect
					name='producer'
					control={control}
					payload={memoOptions.PRODUCERS}
				/>
				<p className='text-error'>{errors.producer?.message}</p>
			</>
		)
	}
	return null
})

export default AdvertisementForm
