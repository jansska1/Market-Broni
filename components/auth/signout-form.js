'use client'
import { signOutAction } from '@/app/actions'
import { USER_SITES } from '@/helpers'
import { useRouter, usePathname } from 'next/navigation'
import { navigateWithNotification } from '@/helpers'

export default function SignoutForm() {
	const router = useRouter()
	const path = usePathname()
	let newPath

	const onSubmit = async event => {
		event.preventDefault()
		const response = await signOutAction()
		// console.log('response', response)
		USER_SITES.includes(path) ? (newPath = '/') : (newPath = path)
		if (response.status === 'success') {
			navigateWithNotification(router, newPath, response.status, response.message)
		}
		if (response.status === 'failed') {
			navigateWithNotification(router, newPath, response.status, response.message)
		}
	}

	return (
		<form>
			<button
				className='text-sm border-t border-secondary-foreground px-4 py-2 w-full h-full hover:duration-300 hover:bg-gray-100'
				onClick={onSubmit}
				type='button'
				variant={'outline'}>
				Wyloguj
			</button>
		</form>
	)
}
