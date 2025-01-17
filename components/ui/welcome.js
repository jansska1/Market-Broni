'use client'
import { useState, useEffect } from 'react'
export default function Welcome({ user }) {
	const [timeOfDay, setTimeOfDay] = useState('')
	useEffect(() => {
		const updateTimeOfDay = () => {
			const now = new Date()
			const currentHour = now.getHours()
			setTimeOfDay(currentHour >= 6 && currentHour < 18 ? 'Dzień dobry!' : 'Dobry wieczór!')
		}
		updateTimeOfDay()

		const interval = setInterval(updateTimeOfDay, 60000)

		return () => clearInterval(interval)
	}, [])

	return (
		<div className='flex flex-col items-center'>
			<h2 className='text-4xl font-semibold'>{timeOfDay}</h2>
			<p className='text-3xl font-semibold'>{user.username ? user.username : user.email.split('@')[0]}</p>
		</div>
	)
}
