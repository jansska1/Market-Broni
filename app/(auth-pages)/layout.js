import BackButton from '@/components/back-button'
import Notification from '@/components/notification'
import Providers from '@/components/providers'
import MobileNavbar from '@/components/header/navbar-mobile'
import { Suspense } from 'react'
import { GeistSans } from 'geist/font/sans'
import '../globals.css'

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'

export const metadata = {
	metadataBase: new URL(defaultUrl),
}

export default async function Layout({ children }) {
	return (
		<html
			lang='pl'
			className={`${GeistSans.variable}`}
			suppressHydrationWarning>
			<body className='bg-forth/90'>
				<div className='block md:hidden'>
					<MobileNavbar />
				</div>
				<div className='w-full'>
					<div className='h-full relative '>
						<BackButton className='absolute top-3 left-3 bg-secondary-foreground p-1 rounded-md' />
					</div>
					<div className='h-screen flex items-center justify-center bg-multicam bg-no-repeat bg-cover'>
						<Suspense>
							<Notification />
						</Suspense>
						<Providers>{children}</Providers>
					</div>
				</div>
			</body>
		</html>
	)
}
