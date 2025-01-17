'use client'
import { createContext, useContext, useTransition } from 'react'
import { useRouter } from 'next/navigation'

const ListContext = createContext({
	handleDelete: () => {},
})

const ListProvider = ({ children }) => {
	const [isPending, startTransition] = useTransition()
	const router = useRouter()

	async function handleDelete(id, image) {
		// event.preventDefault()
		const response = await fetch('/api/product-delete', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				payload: {
					id: id,
					image: image,
				},
			}),
		})
		if (!response.ok) {
			console.error('Failed to delete ad', response)
		} else {
			console.log('Rekord usunięty')
			startTransition(() => {
				router.refresh()
			})
		}
	}
	return <ListContext.Provider value={{ handleDelete, isPending }}>{children}</ListContext.Provider>
}

export const useList = () => useContext(ListContext)

export default ListProvider
