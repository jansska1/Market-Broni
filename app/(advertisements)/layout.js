import FavoritesProvider from '@/components/providers/favoritesCtx'
import ListProvider from '@/components/providers/listCtx'
import FormProvider from '@/components/providers/formCtx'
import UserAdsProvider from '@/components/providers/user-adsCtx'
import Notification from '@/components/notification'
import BackButton from '@/components/back-button'
import MobileNavbar from '@/components/header/navbar-mobile'
import DesktopNavbar from '@/components/header/navbar-desktop'
import Providers from '@/components/providers'
import { Suspense } from 'react'
import { GeistSans } from 'geist/font/sans'
import { Theme } from '@radix-ui/themes'
import { createClient } from '@/utils/supabase/server'
import { getFavorites } from '@/lib/data'
import { Hammer } from 'lucide-react'
import '@radix-ui/themes/styles.css'
import '../globals.css'

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: 'Ogłoszenia',
	description: 'Tu znajdziesz dodane lub polubione przez ciebie ogłoszenia. Dodasz nowe lub edytujesz istniejące',
}

export default async function AdvLayout({ children }) {
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
			<body className='pb-14 md:pb-0'>
				<Theme className='!bg-forth/90'>
					<FavoritesProvider initialFavorites={favorites}>
						<FormProvider>
							<ListProvider>
								<UserAdsProvider>
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
								</UserAdsProvider>
							</ListProvider>
						</FormProvider>
					</FavoritesProvider>
				</Theme>
			</body>
		</html>
	)
}
