'use client'
import Link from 'next/link'
import Captcha from './captcha'
import { yupResolver } from '@hookform/resolvers/yup'
import { navigateWithNotification } from '@/helpers'
import { useForm } from 'react-hook-form'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { signUpAction } from '@/app/actions'
import { useState, useRef } from 'react'
import { X } from 'lucide-react'
import { authSchema } from '../schema'
import { SubmitButton } from '../submit-button'
import { useRouter } from 'next/navigation'
export default function RegisterForm({ id }) {
	const [captchaToken, setCaptchaToken] = useState('')
	const router = useRouter()
	const captchaRegister = useRef()
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, touchedFields },
		reset,
		setError,
	} = useForm({
		resolver: yupResolver(authSchema),
		defaultValues: {
			email: '',
			password: '',
		},
		mode: 'onBlur',
		reValidateMode: 'onBlur',
	})

	const onSubmit = async data => {
		if (!captchaToken) {
			navigateWithNotification(router, '/rejestracja', 'failed', 'Captcha wymagana')
			return
		}
		const response = await signUpAction(data, captchaToken)
		if (response.status === 'success') {
			navigateWithNotification(router, '/', response.status, response.message)
			reset()
			captchaRegister.current.resetCaptcha()
		}
		if (response.status === 'failed') {
			captchaRegister.current.resetCaptcha()
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
				className='flex flex-col min-w-64 whitespace-pre-line bg-secondary-foreground p-10 rounded-md'>
				<h1 className='text-2xl font-medium'>Zarejestruj się</h1>
				<p className='text-sm text text-foreground'>
					Masz już konto?{' '}
					<Link
						className='text-primary font-medium underline'
						href='/logowanie'>
						Logowanie
					</Link>
				</p>

				<div className='flex flex-col gap-2 [&>input]:mb-3 mt-8'>
					<Label htmlFor='email'>Email</Label>
					<Input
						{...register('email')}
						id='email'
						placeholder='przykładowy@email.com'
						autoComplete='email'
						touched={touchedFields.email}
						errors={errors.email}
						required
						className='focus-visible:ring-primary focus:ring-primary'
					/>
					<p className='text-error'>{errors.email?.message}</p>
					<Label htmlFor='password'>Hasło</Label>
					<Input
						{...register('password')}
						id='password'
						type='password'
						placeholder='min. 8 znaków'
						autoComplete='password'
						touched={touchedFields.password}
						errors={errors.password}
						required
						className='focus-visible:ring-primary focus:ring-primary'
					/>
					<p className='text-error'>{errors.password?.message}</p>

					<Captcha
						id={id}
						setCaptchaToken={setCaptchaToken}
						ref={captchaRegister}
					/>

					<SubmitButton
						className='self-center mt-4'
						pending={isSubmitting}
						pendingText='Rejestrowanie...'>
						Zarejestruj
					</SubmitButton>
				</div>
			</form>
		</div>
	)
}
