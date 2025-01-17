'use client'
import Captcha from '@/components/auth/captcha'
import SmtpMessage from '@/app/(auth-pages)/smtp-message'
import { forgotPasswordAction } from '@/app/actions'
import { FormMessage } from '@/components/form-message'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { yupResolver } from '@hookform/resolvers/yup'
import { emailSchema } from '@/components/schema'
import { useForm } from 'react-hook-form'
import { useState, useRef } from 'react'

export default function ForgotPasswordForm({ searchParams }) {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm({
		resolver: yupResolver(emailSchema),
		defaultValues: {
			email: '',
		},
		mode: 'onBlur',
	})

	const [captchaToken, setCaptchaToken] = useState()
	const captcha = useRef()

	const onSubmit = async data => {
		if (!captchaToken) {
			navigateWithNotification(router, '/zapomnialem-hasla', 'failed', 'Captcha wymagana')
			return
		}
		const formData = new FormData()
		formData.append('email', data.email)
		formData.append('callbackUrl', data.callbackUrl || '')
		await forgotPasswordAction(formData, captchaToken)
		reset()
		captcha.current.resetCaptcha()
	}

	return (
		<>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='flex-1 flex flex-col w-full gap-2 text-foreground [&>input]:mb-6 min-w-64 max-w-64 mx-auto'>
				<div>
					<h1 className='text-2xl font-medium'>Zapomniałeś hasła?</h1>
					<p className='text-sm text-secondary-foreground'>Na podany email wyślemy linka do resetu hasła</p>
				</div>
				<div className='flex flex-col gap-2 [&>input]:mb-3 mt-8'>
					<Label htmlFor='email'>Email</Label>
					<Input
						{...register('email')}
						placeholder='twój@email.com'
						required
					/>
					<p className='text-error'>{errors.password?.message}</p>

					<Captcha
						setCaptchaToken={setCaptchaToken}
						ref={captcha}
					/>
					<SmtpMessage />
					<SubmitButton pending={isSubmitting}>Wyślij link</SubmitButton>
					<FormMessage message={searchParams} />
				</div>
			</form>
		</>
	)
}
