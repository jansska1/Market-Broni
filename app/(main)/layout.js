import MobileNavbar from '@/components/header/navbar-mobile'
import DesktopNavbar from '@/components/header/navbar-desktop'
import SideNav from '@/components/header/sidenav'
import FavoritesProvider from '@/components/providers/favoritesCtx'
import Notification from '@/components/notification'
import Providers from '@/components/providers'
import { Suspense } from 'react'
import { GeistSans } from 'geist/font/sans'
import { getFavorites } from '@/lib/data'
import { createClient } from '@/utils/supabase/server'
import { Hammer } from 'lucide-react'
import '../globals.css'

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: 'Market Broni',
	description: 'Miejsce do kupna i sprzedaży broni',
}

export default async function MainLayout({ children }) {
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
			<body className='bg-forth pt-14 md:p-0'>
				<FavoritesProvider initialFavorites={favorites}>
					<main className='flex flex-col'>
						<div className='block md:hidden'>
							<MobileNavbar search={true} />
						</div>
						<div className='hidden md:block'>
							<DesktopNavbar search={true} />
						</div>
						<div className='flex flex-col lg:flex-row'>
							<div className='w-full flex-none lg:w-64 bg-fifth'>
								<SideNav />
							</div>

							<div className='grow min-h-screen py-12 px-6 bg-forth'>
								<Suspense>
									<Notification />
								</Suspense>
								<Providers>{children}</Providers>
							</div>
						</div>

						<footer className='w-full flex items-center justify-center mx-auto text-center text-xs gap-8 py-16 border-t bg-fifth border-secondary-foreground'>
							<p className='flex'>
								<span>
									<Hammer size={16} />
								</span>
								W budowie...
							</p>
						</footer>
					</main>
				</FavoritesProvider>
			</body>
		</html>
	)
}
