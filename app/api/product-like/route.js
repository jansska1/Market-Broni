import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/dist/server/api-utils'
import { saveLikedProduct, removeLike } from '@/lib/data'
import { NextResponse } from 'next/server'

export async function POST(request) {
	try {
		const supabase = createClient()
		const {
			data: { user },
		} = await supabase.auth.getUser()
		// if (!user) redirect('/logowanie')
		const { id } = await request.json()
		console.log('id:', id)
		console.log('user', user.id)
		if (!id || !user.id) {
			return NextResponse.json({ error: 'Niepoprawne dane' }, { status: 400 })
		}
		await saveLikedProduct(id, user.id)
		return NextResponse.json({ message: 'Ogłoszenie polubione' }, { status: 200 })
	} catch (error) {
		console.error(error)
		return NextResponse.json({ error: 'Nie udało się zapisać polubienia ogłoszenia' }, { status: 500 })
	}
}

export async function DELETE(req) {
	try {
		const supabase = createClient()
		const {
			data: { user },
		} = await supabase.auth.getUser()
		const { id } = await req.json()

		if (!id || !user.id) {
			return NextResponse.json({ error: 'Niepoprawne dane' }, { status: 400 })
		}

		await removeLike(id, user.id)
		return NextResponse.json({ message: 'Ogłoszenie odlubione' }, { status: 200 })
	} catch (error) {
		console.error(error)
		return NextResponse.json({ error: 'Nie udało się usunąć polubienia ogłoszenia' }, { status: 500 })
	}
}
