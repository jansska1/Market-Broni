import MenuList from './menu-list'
import { getCategoryAndSubcategory } from '../../lib/data'

export default async function DropdownMenu() {
	const categories = await getCategoryAndSubcategory()

	return (
		<div>
			<MenuList categories={categories} />
		</div>
	)
}
