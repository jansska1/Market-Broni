import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function PUT(request) {
	const supabase = createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()
	if (!user) return

	const { payload } = await request.json()
	const { id, active } = payload
	// console.log('active', active)

	if (!id) {
		return NextResponse.json({ error: 'No ID record' }, { status: 400 })
	}

	const { status, error } = await supabase
		.from('products')
		.update({ is_active: active })
		.eq('id', id)
		.eq('user_id', user.id)
		.select()
	// console.log('status:', status)

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 400 })
	}
	revalidatePath('/', 'layout')
	return NextResponse.json({ message: active ? 'Ogłoszenie aktywowane' : 'Ogłoszenie dezaktywowane' }, { status: 200 })
}
