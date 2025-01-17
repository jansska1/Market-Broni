'use client'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'
import { Toaster } from 'react-hot-toast'

export default function Providers({ children }) {
	return (
		<>
			{children}
			<ProgressBar
				height='4px'
				color='hsl(30, 53%, 64%)'
				options={{ showSpinner: false }}
				shallowRouting
			/>
			<Toaster />
		</>
	)
}
