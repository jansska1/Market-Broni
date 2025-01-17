'use client'
import { resetPasswordAction } from '@/app/actions'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { yupResolver } from '@hookform/resolvers/yup'
import { resetSchema } from '@/components/schema'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { navigateWithNotification } from '@/helpers'
import { X } from 'lucide-react'

export default function ResetForm() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, touchedFields },
		reset,
		getValues,
		setError,
	} = useForm({
		resolver: yupResolver(resetSchema),
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
		mode: 'onBlur',
		reValidateMode: 'onBlur',
	})

	const router = useRouter()

	console.log(errors, touchedFields)

	const onSubmit = async data => {
		const formData = new FormData()
		formData.append('password', data.password)
		formData.append('confirmPassword', data.confirmPassword)
		const response = await resetPasswordAction(formData)
		if (response.status === 'success') {
			navigateWithNotification(router, '/reset-hasla', response.status, response.message)
			reset()
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
		<div className='flex flex-col w-full items-center'>
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
				className='flex flex-col w-full max-w-md grow p-10 gap-2 [&>input]:mb-4 bg-secondary-foreground rounded-md'>
				<h1 className='text-2xl font-medium'>Reset hasła</h1>
				<p className='text-sm mb-4'>Wprowadź swoje nowe hasło</p>
				<div className='flex flex-col gap-2'>
					<Label htmlFor='password'>Nowe hasło</Label>

					<Input
						{...register('password')}
						id='password'
						type='password'
						autoComplete='new-password'
						touched={touchedFields.password}
						errors={errors.password}
					/>

					<p className='text-error'>{errors.password?.message}</p>
				</div>
				<div className='flex flex-col gap-2'>
					<Label htmlFor='confirmPassword'>Potwierdź hasło</Label>
					<Input
						{...register('confirmPassword', {
							validate: value => value === getValues('password') || 'Hasła muszą być takie same',
						})}
						id='confirmPassword'
						type='password'
						autoComplete='new-password-confirm'
						touched={touchedFields.confirmPassword}
						errors={errors.confirmPassword}
					/>
					<p className='text-error'>{errors.confirmPassword?.message}</p>
				</div>
				<SubmitButton pending={isSubmitting}>Resetuj hasło</SubmitButton>
			</form>
		</div>
	)
}
