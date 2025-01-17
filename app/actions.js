'use server'
import * as yup from 'yup'
import { encodedRedirect } from '@/utils/utils'
import { createClient } from '@/utils/supabase/server'
import { saveAdvertisement, saveBid, getFirstAndLastRowsOfSubcategories } from '@/lib/data'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { handleErrorsMessage } from '@/helpers'
import { authSchema, advSchema, auctionSchema, userDetailsSchema, resetSchema } from '@/components/schema'

export const signUpAction = async (data, captchaToken) => {
	try {
		const supabase = createClient()
		const parsed = await authSchema.validate(data, { abortEarly: false })
		const email = parsed.email
		const password = parsed.password

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: { captchaToken },
		})

		if (error) {
			console.error(error.message)
			return {
				status: 'failed',
				issues: { server: handleErrorsMessage(error) },
			}
		}

		return {
			message: 'Rejestracja udana, dziękujemy',
			status: 'success',
		}
	} catch (error) {
		if (error instanceof yup.ValidationError) {
			const fieldErrors = error.inner.reduce((acc, err) => {
				acc[err.path] = err.message
				return acc
			}, {})
			return {
				message: 'Niepoprawne dane',
				status: 'failed',
				issues: fieldErrors,
			}
		}
	}
}

export const signInAction = async (data, captchaToken) => {
	const supabase = createClient()
	try {
		const parsed = await authSchema.validate(data, { abortEarly: false })
		const email = parsed.email
		const password = parsed.password

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
			options: { captchaToken },
		})

		if (error) {
			console.error(error.message)
			return {
				status: 'failed',
				issues: { server: handleErrorsMessage(error) },
			}
		}
		return {
			message: 'Pomyślnie zalogowano',
			status: 'success',
		}
	} catch (error) {
		if (error instanceof yup.ValidationError) {
			const fieldErrors = error.inner.reduce((acc, err) => {
				acc[err.path] = err.message
				return acc
			}, {})
			return {
				message: 'Niepoprawne dane',
				status: 'failed',
				issues: fieldErrors,
			}
		}
	}
}

export const forgotPasswordAction = async (formData, captchaToken) => {
	console.log('formData:', formData)
	console.log('captchaToken:', captchaToken)
	const email = formData.get('email')?.toString()
	const supabase = createClient()
	const origin = (await headers()).get('origin')
	const callbackUrl = formData.get('callbackUrl')?.toString()

	if (!email) {
		return encodedRedirect('error', '/zapomnialem-hasla', 'Email is required')
	}

	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: `${origin}/auth/callback?redirect_to=/reset-hasla`,
		options: { captchaToken },
	})

	if (error) {
		console.error(error)
		return encodedRedirect('error', '/zapomnialem-hasla', 'Could not reset password')
	}

	if (callbackUrl) {
		return redirect(callbackUrl)
	}

	return encodedRedirect('success', '/zapomnialem-hasla', 'Check your email for a link to reset your password.')
}

export const resetPasswordAction = async data => {
	const supabase = createClient()
	try {
		const formData = Object.fromEntries(data)
		const parsed = await resetSchema.validate(formData, { abortEarly: false })
		const password = parsed.password
		const confirmPassword = parsed.confirmPassword

		const { error } = await supabase.auth.updateUser({
			password: password,
		})

		if (error) {
			console.error(error.message)
			return {
				status: 'failed',
				issues: { server: handleErrorsMessage(error) },
			}
		}

		return {
			message: 'Pomyślnie zresetowano hasło',
			status: 'success',
		}
	} catch (error) {
		if (error instanceof yup.ValidationError) {
			const fieldErrors = error.inner.reduce((acc, err) => {
				acc[err.path] = err.message
				return acc
			}, {})
			return {
				message: 'Niepoprawne dane',
				status: 'failed',
				issues: fieldErrors,
			}
		}
	}

	encodedRedirect('success', '/reset-hasla', 'Hasło zaaktualizowane')
}

export const signOutAction = async () => {
	try {
		const supabase = createClient()
		await supabase.auth.signOut()
		return { message: 'Pomyślnie wylogowano', status: 'success' }
	} catch (error) {
		return { message: 'Błąd wylogowania', status: 'failed' }
	}
}

export const updateUserInfoAction = async (data, userId) => {
	const formData = Object.fromEntries(data)
	try {
		console.log('formData:', formData)
		const supabase = createClient()
		const parsed = await userDetailsSchema.validate(formData, { abortEarly: false })
		console.log('parsed:', parsed)
		const { username = null, phone = null, email = null, voivodeshipUser = null, avatarUrl = null } = parsed
		console.log('username', username)
		const { data, error } = await supabase
			.from('profiles')
			.update({ username, phone, email, voivodeship: voivodeshipUser, avatar_url: avatarUrl })
			.eq('id', userId)
			.select()

		console.log('updateUserInfoAction:', data)

		if (error) {
			console.error(error)
			return {
				status: 'failed',
				issues: { server: handleErrorsMessage(error) },
			}
		}

		return {
			data,
			message: 'Pomyślnie zmieniono dane',
			status: 'success',
		}
	} catch (error) {
		if (error instanceof yup.ValidationError) {
			const fieldErrors = error.inner.reduce((acc, err) => {
				acc[err.path] = err.message
				return acc
			}, {})
			return {
				message: 'Niepoprawne dane',
				status: 'failed',
				issues: fieldErrors,
			}
		}
	}
	revalidatePath('/profil', 'page')
}

export const saveAdvertisementAction = async (formData, mode = '', productId, imagesToDelete) => {
	try {
		const subcategoryRows = await getFirstAndLastRowsOfSubcategories()
		const schema = advSchema(subcategoryRows)

		const obj = {}
		formData.forEach((value, key) => {
			if (key === 'image') {
				obj[key] = obj[key] ? [...obj[key], value] : [value]
			} else {
				obj[key] = value
			}
			if (key === 'auctionValue' && value === 'null') obj['auctionValue'] = null
		})
		const parsed = await schema.validate(obj, { abortEarly: false })

		const advertisement = {
			prod_name: parsed?.product,
			price: parsed?.price,
			subcategory_id: parsed?.subcategory,
			condition: parsed?.condition,
			description: parsed?.description,
			image: parsed?.image,
			voivodeship: parsed?.voivodeship,
			producer: parsed?.producer,
			caliber: parsed?.caliber,
			renew: parsed?.renew,
			auction: parsed?.auction,
			auctionValue: parsed?.auctionValue,
		}

		await saveAdvertisement(advertisement, mode, productId, imagesToDelete)
		return {
			message: 'Pomyślnie dodano ogłoszenie',
			status: 'success',
		}
	} catch (error) {
		if (error instanceof yup.ValidationError) {
			const fieldErrors = error.inner.reduce((acc, err) => {
				acc[err.path] = err.message
				return acc
			}, {})
			return {
				message: 'Niepoprawne dane',
				status: 'failed',
				issues: fieldErrors,
			}
		} else {
			throw error
		}
	}
	revalidatePath('/products/kategoria/[[...segments]]', 'page')
}

export const bidAction = async (data, productId) => {
	const parsed = await auctionSchema.validate(data, { abortEarly: false })
	const bid = { value: parsed.bid, id: productId }
	await saveBid(bid)
	revalidatePath('/kategoria')
}
