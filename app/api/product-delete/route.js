import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function DELETE(request) {
	const supabase = createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()
	if (!user) return

	const { payload } = await request.json()
	const { id, image } = payload
	console.log('id, image', id, image)

	if (!id) {
		return NextResponse.json({ error: 'No ID record' }, { status: 400 })
	}

	const { status, error } = await supabase.from('products').delete().eq('id', id).eq('user_id', user.id).select()
	console.log('status:', status)
	if (status === 200) {
		const { data, error } = await supabase.storage.from('images').remove(image)
		if (data.lenght > 0) console.log('Deleted successful for image from bucket')

		if (error) {
			console.error('Deleted failed for image from bucket', error.message)
			throw new Error('Deleted failed for image from bucket', error.message)
		}
	}

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 400 })
	}
	revalidatePath('/', 'layout')
	return NextResponse.json({ message: 'Rekord usunięty' }, { status: 200 })
}
