import { NextResponse } from 'next/server'
import { incrementProductView, getProductViews } from '@/lib/data'

export async function POST(req) {
	const { productId } = await req.json()
	if (!productId) {
		return NextResponse.json({ error: 'Brakuje id użytkownika lub produktu' }, { status: 400 })
	}

	try {
		// await incrementProductView(productId, userId)
		await incrementProductView(productId)

		const views = await getProductViews(productId)

		return NextResponse.json({ views })
	} catch (error) {
		console.error(error)
		return NextResponse.json({ error: 'Nie udało się uaktualnić wyświetleń' }, { status: 500 })
	}
}

export async function GET(req) {
	const { searchParams } = new URL(req.url)
	const productId = searchParams.get('productId')
	if (!productId) {
		return NextResponse.json({ error: 'Brakuje id użytkownika lub produktu' }, { status: 400 })
	}
	try {
		const views = await getProductViews(productId)

		return NextResponse.json({ views })
	} catch (error) {
		return NextResponse.json({ error: 'Nie udało się pobrać wyświetleń' }, { status: 500 })
	}
}
