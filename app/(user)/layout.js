import MobileNavbar from '@/components/header/navbar-mobile'
import DesktopNavbar from '@/components/header/navbar-desktop'
import BackButton from '@/components/back-button'
import Notification from '@/components/notification'
import Providers from '@/components/providers'
import FavoritesProvider from '@/components/providers/favoritesCtx'
import { Suspense } from 'react'
import { GeistSans } from 'geist/font/sans'
import { createClient } from '@/utils/supabase/server'
import { getFavorites } from '@/lib/data'
import '../globals.css'

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: 'Profil',
	description: 'Informacje na temat twojego konta',
}

export default async function ProfileLayout({ children }) {
	const supabase = createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	const favorites = user ? await getFavorites(user.id) : []
	return (
		<html
			lang='pl'
			className={`${GeistSans.variable}`}
			suppressHydrationWarning>
			<body className='bg-forth/90'>
				<FavoritesProvider initialFavorites={favorites}>
					<main>
						<div className='block md:hidden'>
							<MobileNavbar />
						</div>
						<div className='hidden md:block'>
							<DesktopNavbar />
						</div>
						<div className='max-w-[1300px] mx-auto w-full bg-fifth'>
							<div className='h-full relative'>
								<BackButton className='absolute top-3 left-3' />
							</div>
							<Suspense>
								<Notification />
							</Suspense>

							<Providers>{children}</Providers>
						</div>
					</main>
				</FavoritesProvider>
			</body>
		</html>
	)
}
