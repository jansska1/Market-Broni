'use client'
import FormSelect from '../new-product/form-select'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { SubmitButton } from '../submit-button'
import { updateUserInfoAction } from '@/app/actions'
import { userDetailsSchema } from '../schema'
import { useRouter } from 'next/navigation'
import { navigateWithNotification } from '@/helpers'
import { X } from 'lucide-react'
import { VOIVODESHIPS } from '@/helpers'
export default function UserForm({ user }) {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isDirty },
		reset,
		control,
		setError,
	} = useForm({
		resolver: yupResolver(userDetailsSchema),
		defaultValues: {
			username: user?.username,
			phone: user?.phone,
			email: user?.email,
			avatarUrl: user?.avatar_url,
			voivodeshipUser: user?.voivodeship,
		},
		mode: 'onBlur',
	})
	const router = useRouter()
	console.log(user)
	const onSubmit = async data => {
		const formData = new FormData()
		Object.entries(data).forEach(([key, value]) => {
			if (value) formData.append(key, value)
		})
		const response = await updateUserInfoAction(formData, user.id)
		console.log('response:', response)
		if (response.status === 'success') {
			navigateWithNotification(router, '/profil', response.status, response.message)
			reset({
				username: response.data.username,
				phone: response.data.phone,
				email: response.data.email,
				voivodeshipUser: response.data.voivodeship,
			})
		}
		if (response.status === 'failed') {
			Object.entries(response?.issues).forEach(([key, value]) => {
				setError(key, {
					type: 'server',
					message: value,
				})
			})
		}
	}

	return (
		<div>
			{errors.server && (
				<div className='my-2 bg-red-400 rounded-md p-4'>
					<p className='flex gap-1 text-black '>
						<X color='red' />
						{errors.server?.message}
					</p>
				</div>
			)}
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='flex flex-col p-4 gap-4 [&>input]:mb-4'>
				<div>
					<Label htmlFor='username'>Nazwa użytkownika</Label>
					<Input
						{...register('username')}
						id='username'
						className='focus-visible:ring-primary focus:ring-primary'
					/>
					<p className='text-error text-sm '>{errors.username?.message}</p>
				</div>
				<div>
					<Label htmlFor='phone'>Telefon</Label>
					<Input
						{...register('phone')}
						id='phone'
						type='tel'
						placeholder='xxxxxxxxx'
						className='focus-visible:ring-primary focus:ring-primary'
					/>
					<p className='text-error text-sm '>{errors.phone?.message}</p>
				</div>
				<div>
					<Label htmlFor='email'>Email</Label>
					<Input
						{...register('email')}
						id='email'
						placeholder='twój@email.com'
						className='focus-visible:ring-primary focus:ring-primary'
					/>
					<p className='text-error'>{errors.email?.message}</p>
				</div>
				<div>
					<Label htmlFor='voivodeshipUser'>Województwo</Label>
					<FormSelect
						name='voivodeshipUser'
						control={control}
						payload={VOIVODESHIPS}
					/>
					<p className='text-error'>{errors.voivodeshipUser?.message}</p>
				</div>

				<SubmitButton
					className='self-center mt-4'
					pending={isSubmitting}
					disabled={!isDirty}
					pendingText='Zapisywanie...'>
					Zapisz zmiany
				</SubmitButton>
			</form>
		</div>
	)
}
