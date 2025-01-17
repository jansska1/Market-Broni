'use client'
import { createContext, useContext, useTransition } from 'react'
import { useRouter } from 'next/navigation'

const UserAdsContext = createContext({
	handleActive: () => {},
})

function UserAdsProvider({ children }) {
	const [isPending, startTransition] = useTransition()
	const router = useRouter()

	async function handleActive(id, active) {
		// event.preventDefault()
		// console.log(id, active)
		const response = await fetch('/api/ad-active', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				payload: {
					id: id,
					active: active,
				},
			}),
		})
		if (!response.ok) {
			console.error('Failed to activate ad', response)
		} else {
			console.log('Ad status changed successful')
			startTransition(() => {
				router.refresh()
			})
		}
	}
	return <UserAdsContext.Provider value={{ isPending, handleActive }}>{children}</UserAdsContext.Provider>
}
export const useUserAds = () => useContext(UserAdsContext)

export default UserAdsProvider
