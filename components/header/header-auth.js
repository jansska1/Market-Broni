import DropdownMenu from './dropdown'
import { createClient } from '@/utils/supabase/server'

export default async function AuthButton() {
	const supabase = createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	return user ? (
		<div className='flex items-center gap-4'>
			<DropdownMenu user={user} />
		</div>
	) : (
		<div className='flex items-center'>
			<DropdownMenu />
		</div>
	)
}
