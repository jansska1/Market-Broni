import MobileNavbar from '@/components/header/navbar-mobile'
import DesktopNavbar from '@/components/header/navbar-desktop'
import AuctionProvider from '@/components/providers/auctionCtx'
import FavoritesProvider from '@/components/providers/favoritesCtx'
import Notification from '@/components/notification'
import Providers from '@/components/providers'
import BackButton from '@/components/back-button'
import { Suspense } from 'react'
import { GeistSans } from 'geist/font/sans'
import { getFavorites, getBids } from '@/lib/data'
import { createClient } from '@/utils/supabase/server'
import { Hammer } from 'lucide-react'
import '../globals.css'

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: 'Market Broni',
	description: 'Miejsce do kupna i sprzedaży broni',
}

export default async function RootLayout({ children }) {
	const supabase = createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	const favorites = user ? await getFavorites(user.id) : []
	const bids = await getBids()
	return (
		<html
			lang='pl'
			className={`${GeistSans.variable}`}
			suppressHydrationWarning>
			<body className='bg-forth/90'>
				<FavoritesProvider initialFavorites={favorites}>
					<AuctionProvider bids={bids}>
						<main className='flex flex-col'>
							<div className='block md:hidden'>
								<MobileNavbar />
							</div>
							<div className='hidden md:block'>
								<DesktopNavbar />
							</div>
							<div className='max-w-[1300px] mx-auto w-full'>
								<div className='h-full relative z-10'>
									<BackButton className='absolute top-3 left-3' />
								</div>
								<Suspense>
									<Notification />
								</Suspense>
								<Providers>{children}</Providers>
							</div>
						</main>
					</AuctionProvider>
				</FavoritesProvider>
			</body>
		</html>
	)
}
