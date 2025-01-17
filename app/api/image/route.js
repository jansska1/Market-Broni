import { getImagesUrl } from '@/lib/data'
import { NextResponse } from 'next/server'
export async function GET(req) {
	const { searchParams } = new URL(req.url)
	const image = searchParams.getAll('image')

	if (!image) {
		return NextResponse.json({ error: 'Brakuje id użytkownika lub produktu' }, { status: 400 })
	}
	try {
		const picture = await getImagesUrl(image)

		return NextResponse.json({ picture })
	} catch (error) {
		return NextResponse.json({ error: 'Nie udało się pobrać wyświetleń' }, { status: 500 })
	}
}
