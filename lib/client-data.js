import { createClient } from '@/utils/supabase/client'
import { PRODUCTS_PER_PAGE } from '@/config'

export async function getImagesUrl(paths) {
	const supabase = createClient()

	console.log('paths:', paths)
	if (!Array.isArray(paths)) {
		throw new Error('The path should be an array')
	}
	const urls = []
	for (let path of paths) {
		const { data, error } = supabase.storage.from('images').getPublicUrl(path)
		// console.log('data', data)
		if (error) {
			console.error('Error fetching public URL for path:', path, error.message)
			urls.push(null)
		} else {
			urls.push(data.publicUrl)
		}
	}
	return urls
}

export async function getUserAdvertisements(page) {
	const supabase = createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()
	if (!user) return
	const offset = (page - 1) * PRODUCTS_PER_PAGE

	const { data, count, error } = await supabase
		.from('products')
		.select(
			'id, slug, image, prod_name, price, description, condition, created_at, subcategory_id, category_id, info',
			{ count: 'exact' }
		)
		.eq('user_id', user.id)
		.range(offset, offset + PRODUCTS_PER_PAGE - 1)
	if (error) {
		console.error('Failed to fetch user advertisements', error.message)
		throw new error('Nie udało się pobrać ogłoszeń użytkownika.')
	}
	return { data, count }
}
