import Link from 'next/link'
import Welcome from '@/components/ui/welcome'
import { createClient } from '@/utils/supabase/server'
import { getUserProfile } from '@/lib/data'
export default async function ProfileMenu() {
	const supabase = createClient()

	const {
		data: { user },
	} = await supabase.auth.getUser()
	const profile = await getUserProfile(user.id)
	return (
		<div className='w-full h-[calc(100vh-3.5rem)] md:hidden flex flex-col items-center md:items-start py-12 px-6 gap-6'>
			<Welcome user={profile} />
			<div className='flex flex-col w-full max-w-md '>
				<div>
					<h2 className='text-xl font-semibold'>Profil</h2>
					<div className='flex flex-col gap-2 py-1 text-lg'>
						<Link
							href='/profil'
							className='border-b border-secondary-foreground'>
							Edytuj profil
						</Link>
					</div>
				</div>
				<div className='py-2'>
					<h2 className='text-xl mt-4 font-semibold'>Ogłoszenia</h2>
					<div className='flex flex-col gap-2 py-1 text-lg'>
						<Link
							href='/moje-ogloszenia/aktywne'
							className='border-b border-secondary-foreground'>
							Aktywne
						</Link>
						<Link
							href='/moje-ogloszenia/nieaktywne'
							className='border-b border-secondary-foreground'>
							Zakończone
						</Link>
						<Link
							href='/polubione'
							className='border-b border-secondary-foreground'>
							Polubione
						</Link>
					</div>
				</div>
			</div>
			<div className='w-full flex justify-center mt-auto border-t border-secondary'>
				<button className='text-md font-semibold p-3'>Wyloguj</button>
			</div>
		</div>
	)
}
