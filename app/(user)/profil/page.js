import UserForm from '@/components/auth/user-form'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { getUserProfile } from '@/lib/data'
import { Button } from '@/components/ui/button'

export default async function ProfilePage() {
	const supabase = createClient()

	const {
		data: { user },
	} = await supabase.auth.getUser()
	const profile = await getUserProfile(user.id)

	return (
		<div className='h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-4.5rem)] flex flex-col items-center w-full py-12 px-6 gap-6'>
			<div className='flex flex-col w-full max-w-md bg-forth p-3'>
				<h2 className='self-center font-bold text-2xl mb-4'>Twoje dane</h2>
				<UserForm user={profile} />
			</div>
			<div className='flex flex-col items-center w-full max-w-md p-3 bg-forth '>
				<h2 className='font-bold text-2xl mt-4 mb-4'>Zmiana hasła</h2>
				<Link href='/reset-hasla'>
					<Button className='border'>Zmień hasło</Button>
				</Link>
			</div>
		</div>
	)
}
