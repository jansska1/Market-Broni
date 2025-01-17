import AdvertisementForm from '@/components/new-product/form'
import { getCategoryAndSubcategory, getFirstAndLastRowsOfSubcategories } from '@/lib/data'
import { createClient } from '@/utils/supabase/server'

export default async function AddNewAdvertisement({ searchParams }) {
	const supabase = createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()
	const [categories, subcategoryRows] = await Promise.all([
		getCategoryAndSubcategory(),
		getFirstAndLastRowsOfSubcategories(),
	])

	return (
		<>
			<AdvertisementForm
				user={user}
				categories={categories}
				searchParams={searchParams}
				subcategoryRows={subcategoryRows}
			/>
		</>
	)
}
