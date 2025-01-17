'use client'
import Link from 'next/link'
import Captcha from './captcha'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { SubmitButton } from '../submit-button'
import { signInAction } from '@/app/actions'
import { useState, useRef, useEffect } from 'react'
import { authSchema } from '../schema'
import { useRouter } from 'next/navigation'
import { navigateWithNotification } from '@/helpers'
import { X } from 'lucide-react'

export default function LoginForm({ id }) {
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
	const [captchaToken, setCaptchaToken] = useState()

	const router = useRouter()
	const captchaLogin = useRef()

	const onSubmit = async data => {
		if (!captchaToken) {
			navigateWithNotification(router, '/logowanie', 'failed', 'Captcha wymagana')
			return
		}
		const response = await signInAction(data, captchaToken)
		console.log('response:', response)
		if (response.status === 'success') {
			navigateWithNotification(router, '/', response.status, response.message)
			reset()
			captchaLogin.current.resetCaptcha()
		}
		if (response.status === 'failed') {
			captchaLogin.current.resetCaptcha()
			Object.entries(response?.issues).forEach(([key, value]) => {
				setError(key, {
					type: 'server',
					message: value,
				})
			})
		}
	}

	return (
		<div className='min-w-64'>
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
				className='p-10 rounded-md bg-secondary-foreground '>
				<h1 className='text-2xl font-medium'>Zaloguj się</h1>
				<div className='flex flex-col items-center tracking-wide'>
					<p>Jeszcze nie masz konta?</p>
					<Link
						className='text-primary hover:text-third hover:duration-300 focus:text-third'
						href='/rejestracja'>
						Zarejestruj się
					</Link>
				</div>
				<div className='flex flex-col gap-2 [&>input]:mb-3 mt-8'>
					<Label htmlFor='email'>Email</Label>
					<Input
						{...register('email')}
						id='email'
						autoComplete='email'
						placeholder='przykładowy@email.com'
						touched={touchedFields.email}
						errors={errors.email}
						className='focus-visible:ring-primary focus:ring-primary'
					/>
					<p className='text-error'>{errors.email?.message}</p>
					<div className='flex justify-between items-center'>
						<Label htmlFor='password'>Hasło</Label>
						<Link
							className='text-xs text-primary underline hover:text-third hover:duration-300 focus:text-third'
							href='/zapomnialem-hasla'>
							Zapomniałeś hasła?
						</Link>
					</div>
					<Input
						{...register('password')}
						id='password'
						autoComplete='current-password'
						type='password'
						placeholder='Hasło'
						touched={touchedFields.password}
						errors={errors.password}
						className='focus-visible:ring-primary focus:ring-primary'
					/>
					<p className='text-error'>{errors.password?.message}</p>
					<Captcha
						id={id}
						setCaptchaToken={setCaptchaToken}
						ref={captchaLogin}
					/>
					<SubmitButton
						className='self-center mt-4'
						pending={isSubmitting}
						pendingText='Logowanie...'>
						Zaloguj
					</SubmitButton>
				</div>
			</form>
		</div>
	)
}
