'use client'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export default function Notification() {
	const [notify, setNotify] = useState({})
	const router = useRouter()
	const params = useSearchParams()
	const path = usePathname()

	useEffect(() => {
		const status = params.get('status')
		const message = params.get('message')
		const refresh = params.get('r')
		setNotify({ status, message, refresh })
	}, [params])

	useEffect(() => {
		if (notify?.status && notify?.message) {
			if (notify.status === 'success') toast.success(notify.message)
			if (notify.status === 'failed') toast.error(notify.message)
			router.replace(`${path}`, { shallow: true })
			setNotify({})
		}
	}, [notify, path])
}
