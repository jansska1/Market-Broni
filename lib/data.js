import supabase from '@/utils/supabase/supabaseClient'
import slugify from 'slugify'
import xss from 'xss'
import { PRODUCTS_PER_PAGE, FETCHING_LIMIT, MAIN_PAGE_ADS } from '@/config'
import { createClient } from '@/utils/supabase/server'
import { nanoid } from 'nanoid'

export async function getAllCategories() {
	const { data, error } = await supabase.from('categories').select('id, cat_name, slug')

	if (error) {
		console.error('Failed to fetch all categories:', error)
		return []
	}
	return data
}

export async function getCategory(slug) {
	const { data, error } = await supabase.from('categories').select('cat_name, slug').eq('slug', slug)

	if (error) {
		console.error('Failed to fetch category:', error)
		return []
	}
	return data
}

export async function getSubcategory(slug) {
	const { data, error } = await supabase
		.from('subcategories')
		.select('sub_name, slug')
		.eq('slug', slug)
		.limit(FETCHING_LIMIT)

	if (error) {
		console.error('Failed to fetch subcategory:', error)
		return []
	}
	return data
}

export async function getCategoryAndSubcategory() {
	const { data, error } = await supabase.from('categories').select('*, subcategories (id, slug, sub_name)')

	if (error) {
		console.error('Failed to fetch category and subcategory:', error)
		return []
	}
	return data
}

export async function getProducts(page, filters, sort, categorySlug, subcategorySlug) {
	const categoryId = await getCategoryId(categorySlug)
	if (!categoryId) {
		console.error('Category ID not found for the specified categorySlug.')
		return []
	}
	let subcategoryId
	if (subcategorySlug) {
		subcategoryId = await getSubcategoryId(categoryId, subcategorySlug)
		if (!subcategoryId) {
			console.error('Subcategory ID not found for the specified subcategorySlug.')
			return []
		}
	}

	const offset = (page - 1) * PRODUCTS_PER_PAGE
	let query = supabase
		.from('products')
		.select('*', { count: 'exact' })
		.eq('category_id', categoryId)
		.eq('is_active', true)
		.range(offset, offset + PRODUCTS_PER_PAGE - 1)

	if (subcategoryId) query = query.eq('subcategory_id', subcategoryId)

	Object.entries(filters).forEach(([key, value]) => {
		if (value.length > 1) {
			const orFilters = value.map(val => `info->>${key}.ilike.%${val}%`).join(',')
			query = query.or(orFilters)
		} else {
			query = query.ilike(`info->>${key}`, `%${value}%`)
		}
	})

	switch (sort.sortBy) {
		case 'price-desc':
			query = query.order('price', { ascending: false })
			break
		case 'price-asc':
			query = query.order('price', { ascending: true })
			break
		case 'newest':
			query = query.order('created_at', { ascending: false })
			break
		case 'oldest':
			query = query.order('created_at', { ascending: true })
			break
		default:
			query = query.order('price', { ascending: false }).order('created_at', { ascending: false })
	}
	const { data, count, error } = await query
	if (error) {
		console.error('Error fetching guns by category:', error)
		return { data: [], count: 0 }
	}

	return { data, count }
}

async function getCategoryId(categorySlug) {
	const { data, error } = await supabase.from('categories').select('id').eq('slug', categorySlug).single() // single() zwróci dokładnie jeden wynik

	if (error) {
		console.error('Error fetching category ID:', error)
		return null
	}

	return data?.id || null
}

async function getSubcategoryId(categoryId, subcategorySlug) {
	const { data, error } = await supabase
		.from('subcategories')
		.select('id')
		.eq('category_id', categoryId)
		.eq('slug', subcategorySlug)
		.single()

	if (error) {
		console.error('Failed to fetch subcategory ID:', error)
		return null
	}

	return data?.id || null
}

export async function searchForProducts(query, page, selectedFilters = {}, sort) {
	if (!query) {
		return { data: [], count: 0 }
	}
	// console.log('selectedFilters:', selectedFilters)
	const offset = (page - 1) * PRODUCTS_PER_PAGE
	let filterQuery = supabase
		.from('products')
		.select('*', { count: 'exact' })
		.textSearch('prod_name', query, { type: 'websearch', config: 'english' })
		.eq('is_active', true)
		.range(offset, offset + PRODUCTS_PER_PAGE - 1)

	Object.entries(selectedFilters).forEach(([key, value]) => {
		if (value.length > 1) {
			const orFilters = value.map(val => `info->>${key}.ilike.%${val}%`).join(',')
			filterQuery = filterQuery.or(orFilters)
		} else {
			filterQuery = filterQuery.ilike(`info->>${key}`, `%${value}%`)
		}
	})

	switch (sort || {}) {
		case 'price-desc':
			filterQuery = filterQuery.order('price', { ascending: false })
			break
		case 'price-asc':
			filterQuery = filterQuery.order('price', { ascending: true })
			break
		case 'newest':
			filterQuery = filterQuery.order('created_at', { ascending: false })
			break
		case 'oldest':
			filterQuery = filterQuery.order('created_at', { ascending: true })
			break
		default:
			filterQuery = filterQuery.order('price', { ascending: true }).order('created_at', { ascending: false })
	}

	const { data, count, error } = await filterQuery
	// console.log('searchForProducts:', query)
	if (error) {
		console.error('Error during ads search', error)
		throw new Error('Błąd podczas wyszukiwania produktu')
	}
	const filters = {}
	data.forEach(prod => {
		const info = prod.info || {}
		Object.keys(info).forEach(key => {
			if (!filters[key]) {
				filters[key] = new Set()
			}
			filters[key].add(info[key])
		})
	})

	const formattedFilters = Object.entries(filters).reduce((acc, [key, values]) => {
		acc[key] = Array.from(values).map(val => ({ value: val.toLowerCase(), label: val }))
		return acc
	}, {})

	return { data, count, filters: formattedFilters }
}

export async function getProduct(id) {
	const { status, data: product, error } = await supabase.from('products').select('*').eq('id', id).single()
	if (error) {
		console.error('Failed to fetch product', error)
		return {}
		// throw new Error('Nie udało się pobrac ogłoszenia')
	}

	const urls = []
	if (status === 200) {
		for (let path of product.image) {
			const { data, error } = await supabase.storage.from('images').getPublicUrl(path)
			// console.log('data', data)
			if (error) {
				console.error('Error fetching public URL for path:', path, error.message)
				urls.push(null)
			} else {
				urls.push(data.publicUrl)
			}
		}
	}

	return { product, urls }
}

/**
 *
 * @param {number} page - 1 || searchParams
 * @param {uuid} userProfleId - if list are for user profile ads
 * @param {boolean} status - if list are for user tab to check active and inactive
 * @returns
 */

export async function getUserAdvertisements(page, userProfleId = undefined, status = undefined) {
	const supabase = createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()
	if (!user) return
	const offset = (page - 1) * PRODUCTS_PER_PAGE

	// console.log('status:', status)

	let query = supabase
		.from('products')
		.select('*', { count: 'exact' })
		.range(offset, offset + PRODUCTS_PER_PAGE - 1)

	if (user && !userProfleId) query = query.eq('user_id', user.id)
	if (userProfleId) query = query.eq('user_id', userProfleId)
	if ((typeof status === 'boolean' && status === false) || (typeof status === 'boolean' && status === true))
		query = query.eq('is_active', status)

	const { data, count, error } = await query

	// console.log('getUserAdvertisements:', data)

	if (error) {
		console.error('Failed to fetch user advertisements', error.message)
		throw new error('Nie udało się pobrać ogłoszeń użytkownika.')
	}
	return { data, count }
}

export async function getFirstAndLastRowsOfSubcategories() {
	const { data, error } = await supabase.rpc('getfirstandlastrows')

	if (error) {
		console.error('Error fetching rows:', error.message, error.code)
		return []
	}
	const rows = { first: data[0].id, last: data[1].id }
	return rows
}

export async function getImagesUrl(paths) {
	// console.log('paths:', paths)
	if (!Array.isArray(paths)) {
		console.error('The path should be an array')
		return
	}
	const urls = []
	for (let path of paths) {
		const { data, error } = await supabase.storage.from('images').getPublicUrl(path)
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

export async function saveAdvertisement(adv, mode, productId, imagesToDelete) {
	const supabase = createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()
	if (!user) return

	adv.slug = slugify(adv.prod_name, { lower: true })
	adv.prod_name = xss(adv.prod_name)
	adv.price = xss(adv.price)
	adv.subcategory_id = xss(adv.subcategory_id)
	adv.condition = xss(adv.condition)
	adv.description = xss(adv.description)
	adv.voivodeship = xss(adv.voivodeship)
	adv.producer = xss(adv.producer)
	adv.caliber = xss(adv.caliber)
	adv.renew = adv.renew ?? xss(adv.renew)
	adv.auction = adv.auction ?? xss(adv.auction)
	adv.auctionValue = adv.auctionValue ? xss(adv.auctionValue) : null

	const info = Object.assign(
		{},
		adv.voivodeship && { voivodeship: adv.voivodeship },
		adv.caliber && { caliber: adv.caliber },
		adv.producer && { producer: adv.producer }
	)

	// console.log('adv', adv)

	const imageFiles = adv.image.filter(img => img instanceof File)
	// const imageNames = adv.image.map(() => `${user.id}/${nanoid()}`)
	const newImages = []
	const imagesPath = adv.image.map(img => {
		if (typeof img === 'string') {
			return `${user.id}/${img}`
		}
		const imageStr = `${user.id}/${nanoid()}`
		newImages.push(imageStr)
		return imageStr
	})
	// console.log('imageFiles: ', imageFiles)
	// console.log('image names: ', imagesPath)
	// console.log('newImages: ', newImages)

	const { data: adLogs, error: logsError } = await supabase
		.from('ad_logs')
		.select('id')
		.eq('user_id', user.id)
		.gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())

	if (logsError) {
		console.error(logsError)
		throw new Error('Error fetching ad logs.')
	}

	if (adLogs.length >= 4) {
		throw new Error('Możesz dodać 4 ogłoszenia w ciągu godziny')
	}

	if (!mode) {
		const { status, error: insertError } = await supabase
			.from('products')
			.insert({
				subcategory_id: adv.subcategory_id,
				user_id: user.id,
				prod_name: adv.prod_name,
				slug: adv.slug,
				price: adv.price,
				image: imagesPath,
				description: adv.description,
				condition: adv.condition,
				creator_email: user.email,
				info: info,
				auto_renew: adv.renew,
				auction: adv.auction,
				auction_value: adv.auctionValue,
			})
			.select()

		if (insertError) {
			console.error('Failed to insert new product', insertError.message, insertError.code)
			throw new Error('Nie udało się dodać produktu')
		}

		console.log('product insert status:', status)

		const { error: logError } = await supabase.from('ad_logs').insert([{ user_id: user.id }])

		if (logError) {
			console.error('Error logging ad.', logError)
			// throw new Error('Error logging ad.')
		}

		if (status === 201) {
			await uploadFiles(imageFiles, newImages)
		}
	}
	if (mode === 'edit') {
		const { status, error: updateError } = await supabase
			.from('products')
			.update({
				subcategory_id: adv.subcategory_id,
				user_id: user.id,
				prod_name: adv.prod_name,
				slug: adv.slug,
				price: adv.price,
				image: imagesPath,
				description: adv.description,
				condition: adv.condition,
				creator_email: user.email,
				info: info,
				auto_renew: adv.renew,
				auction: adv.auction,
				auction_value: adv.auctionValue,
			})
			.eq('user_id', user.id)
			.eq('id', productId)

		if (updateError) {
			console.error('Failed to update product', updateError, updateError.code)
			throw new Error('Nie udało się zaaktualizować ogłoszenia')
		}
		// console.log('data: ', data)
		console.log('update product status:', status)

		if (status === 204) {
			await uploadFiles(imageFiles, newImages)

			if (imagesToDelete.length >= 1) {
				removeImageFromBucket(user, imagesToDelete)
			}
		}
	}
}

async function uploadFiles(imageFiles, newImages) {
	const supabase = createClient()
	for (let i = 0; i < imageFiles.length; i++) {
		const imageName = newImages[i]
		const imageFile = imageFiles[i]
		// console.log('imageName:', newImages[i])
		// console.log('imageFile:', imageFiles[i])

		const { error: storageError } = await supabase.storage.from('images').upload(imageName, imageFile, {
			cacheControl: '3600',
			upsert: false,
		})

		if (storageError) {
			console.error(`Upload error for ${imageName}:`, storageError.message)
			throw new Error('Nie udało się zapisać obrazka / ów')
		} else {
			console.log(`Upload successful for ${imageName}`)
		}
	}
}

async function removeImageFromBucket(user, imagesToDelete) {
	const supabase = createClient()

	const { data, error } = await supabase.storage.from('images').list(user.id)
	if (error) console.error(error.message)

	const imagesToRemoveIds = new Set(imagesToDelete.map(img => img.id))

	const imagesToRemove = data.filter(img => imagesToRemoveIds.has(img.name))

	const pathsToRemove = imagesToRemove.map(img => `${user.id}/${img.name}`)
	// console.log('imagesToRemove: ', imagesToRemove)
	// console.log('imagesToDeleteIds', imagesToDeleteIds)
	// console.log('imagesToRemove:', imagesToRemove)
	// const bucketImages = data.map(el => el.name)
	// console.log('bucketImages', bucketImages)
	// console.log('pathsToRemove', pathsToRemove)
	const { error: deleteImageError } = await supabase.storage.from('images').remove(pathsToRemove)

	if (deleteImageError) {
		console.error('Failed to delete image from bucket', deleteImageError)
	}
}

export async function incrementProductView(productId, userId) {
	const { data, error } = await supabase
		.from('views')
		.select('id, count')
		.eq('id', productId)
		// .eq('user_id', userId)
		.single()
	// console.log('increment check', data)
	if (error && error.details.includes(`0 rows`)) {
		// if (!data) {
		console.error('Error fetching views data:', error)
		// const { data, error: erError } = await supabase.from('views').insert({ id: productId, user_id: userId })
		const { error: insertError } = await supabase.from('views').insert({ id: productId, count: 1 })
		// console.log('1add:', data)
		console.error('view counter insert error', insertError)
	}
	if (data) {
		const { error } = await supabase
			.from('views')
			.update({ count: data.count + 1 })
			.eq('id', data.id)
		// .eq('user_id', userId)
		// console.log('dData', dData)
		if (error) console.error('view counter update error', error)
	}
}

export async function getProductViews(productId) {
	const { data, error } = await supabase.from('views').select('count').eq('id', productId).single()

	if (error) {
		console.error('Error fetching views data:', error)
		return 0
	}

	return data ? data.count : 0
}

export async function saveLikedProduct(productId, userId) {
	const supabase = createClient()
	// console.log('productId', productId)
	// console.log('userId', userId)
	const { data, error } = await supabase.from('favorites').insert({ product_id: productId, user_id: userId }).select()
	// console.log('saveLikedProduct data:', data)
	if (error) {
		console.error('failed to save like on product', error)
		throw new Error('Nie udało się zapisać polubienia produktu')
	}
}

export async function removeLike(productId, userId) {
	const supabase = createClient()

	const { status, data, error } = await supabase
		.from('favorites')
		.delete()
		.eq('product_id', productId)
		.eq('user_id', userId)
		.select()
	// console.log('removeLike data:', data, status)
	if (error) {
		console.error(error)
		throw new Error(error.message)
	}
}

export async function getFavorites(userId) {
	const supabase = createClient()

	const { data, error } = await supabase.from('favorites').select('product_id, products (*)').eq('user_id', userId)
	if (error) {
		console.error('Failed to fetch favorites', error.message)
		throw new Error('Nie udało się pobrać polubionych ogłoszeń:')
	}
	return data
}

export async function getInfo(categorySlug, subcategorySlug) {
	const categoryId = await getCategoryId(categorySlug)

	if (!categoryId) {
		console.error('Category ID not found for the specified categorySlug.')
		return []
	}

	let subcategoryId

	if (subcategorySlug) {
		subcategoryId = await getSubcategoryId(categoryId, subcategorySlug)
		if (!subcategoryId) {
			console.error('Subcategory ID not found for the specified subcategorySlug.')
			return []
		}
	}

	let query = supabase.from('products').select('info').eq('category_id', categoryId)

	if (subcategoryId) query = query.eq('subcategory_id', subcategoryId)

	const { data, error } = await query

	// console.log('getInfo', data)

	if (error) {
		console.error('Failed to fetch products info', error.message)
		throw new Error('Nie udało się szczegółów produktu:')
	}
	const filters = {}
	data.forEach(prod => {
		const info = prod.info || {}
		Object.keys(info).forEach(key => {
			if (!filters[key]) {
				filters[key] = new Set()
			}
			filters[key].add(info[key])
		})
	})

	// console.log('filters:', filters)

	const formattedFilters = Object.entries(filters).reduce((acc, [key, values]) => {
		acc[key] = Array.from(values).map(val => ({ value: val?.toLowerCase(), label: val }))
		return acc
	}, {})

	// console.log('formattedFilters:', formattedFilters)
	return formattedFilters
}

export async function saveBid(bid) {
	const supabase = createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()
	bid.value = xss(bid.value)

	const { data, error } = await supabase
		.from('auction')
		.upsert({ product_id: bid.id, value: bid.value })
		.eq('user_id', user.id)
		.eq('product_id', bid.id)
		.select()
	// console.log('saveBid:', data)
	if (error) console.log(error)
}

export async function getBids() {
	const { data, error } = await supabase.from('auction').select('*')
	if (error) {
		console.error('Failed to fetch auction', error.message)
		throw new Error('Nie udało się pobrać aukcji')
	}
	// console.log('getBids:', data)
	return data
}

export async function getHigherBid(id) {
	const { data, error } = await supabase
		.from('auction')
		.select('value')
		.eq('product_id', id)
		.order('value', { ascending: false })
		.limit(1)

	if (error) {
		console.error('Error fetching getHigherBid:', error)
		throw new Error('Błąd podczas pobierania najwyższej licytacji')
	}

	return data?.[0]?.value || null
}

export async function getUserProfile(id) {
	const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()
	if (error) {
		console.error('Failed to get user profile:', error)
		throw new Error('Nie udało się pobrać profilu')
	}
	// console.log('getUserProfile:', data)
	return data
}

export async function getMainPageAds() {
	const { data, error } = await supabase.from('products').select('*').range(0, MAIN_PAGE_ADS).eq('is_active', true)
	if (error) {
		console.error('Failed to fetch main page ads.', error)
		throw new Error('Nie udało się pobrać ogłoszeń')
	}
	return data
}

export async function getAvailableProfiles(id) {
	const { data, error } = await supabase.from('profiles').select('id').eq('id', id).single()
	if (error) {
		console.error('Failed to fetch available profiles')
		return null
	}
	return data
}
