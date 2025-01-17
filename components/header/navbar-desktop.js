import HeaderActions from './header-actions'
import AuthButton from './header-auth'
import Link from 'next/link'
import SearchInput from './search'
import { cn } from '@/utils/cn'
export default function DesktopNavbar({ className, search = false }) {
	return (
		<div className={cn('sticky top-0 left-0 bg-secondary-foreground w-full z-50', className)}>
			<header>
				<nav className='max-w-[1280px] h-nav mx-6 flex justify-between items-center xl:mx-auto'>
					<div className='flex gap-5 items-center font-semibold md:ml-2 xl:ml-8 2xl:ml-0'>
						<Link href={'/'}>Market Broni</Link>
					</div>
					<div className='flex gap-4 md:mr-2 xl:mr-8 2xl:mr-0'>
						<HeaderActions />
						<AuthButton />
					</div>
				</nav>
				{search && <SearchInput className='bg-secondary-foreground' />}
			</header>
		</div>
	)
}
