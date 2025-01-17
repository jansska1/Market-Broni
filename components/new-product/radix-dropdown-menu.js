'use client'
import { Button, DropdownMenu } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, memo } from 'react'

const RadixDropdown = memo(function RadixDropdown({ mode, product, categories, selected, handleSelectedOption }) {
	// console.log('render <RadixDropdown>')
	// console.log('query:', query)
	// console.log('fromProduct: ', categoryFromProduct)
	// console.log(subcategoryFromProduct.sub_name)
	// console.log(selected)
	// console.log(product)
	// console.log(categories)
	const router = useRouter()
	const query = !selected.id ? product?.subcategory_id : selected.id
	const path = usePathname()

	let categoryFromProduct
	let subcategoryFromProduct

	if (mode === 'edit') categoryFromProduct = categories?.find(category => category.id === product?.category_id)

	if (mode === 'edit')
		subcategoryFromProduct = categories
			?.flatMap(category => category.subcategories)
			.find(subcategory => subcategory.id === product?.subcategory_id)

	useEffect(() => {
		if (product && categoryFromProduct && subcategoryFromProduct && !selected.id) {
			handleSelectedOption({
				id: product.subcategory_id,
				categoryName: categoryFromProduct.cat_name,
				subcategoryName: subcategoryFromProduct.sub_name,
			})
		}
	}, [product, categoryFromProduct, selected])

	useEffect(() => {
		const targetPath =
			mode !== 'edit'
				? !query
					? '/dodaj-ogloszenie'
					: `/dodaj-ogloszenie?kat=${query}`
				: !query
					? '/edytuj-ogloszenie/${product.id}-${product.slug}'
					: `/edytuj-ogloszenie/${product.id}-${product.slug}?kat=${query}`
		if (path !== targetPath) {
			router.replace(targetPath)
		}
	}, [query, mode, router, path])

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger className='!max-w-48'>
				<Button
					variant='soft'
					size='3'
					className='!cursor-pointer'>
					{selected.categoryName ? (
						`${selected.categoryName} > ${selected.subcategoryName}`
					) : (
						<>
							Wybierz Kategorie
							<DropdownMenu.TriggerIcon />
						</>
					)}
				</Button>
			</DropdownMenu.Trigger>

			<DropdownMenu.Content>
				{categories.map(category => (
					<DropdownMenu.Sub key={category.id}>
						<DropdownMenu.SubTrigger>{category.cat_name}</DropdownMenu.SubTrigger>
						<DropdownMenu.SubContent size='2'>
							{category.subcategories.map(subcategory => (
								<DropdownMenu.Item
									className='!cursor-pointer'
									key={subcategory.id}
									onSelect={() =>
										handleSelectedOption({
											id: subcategory.id,
											categoryName: category.cat_name,
											subcategoryName: subcategory.sub_name,
										})
									}>
									{subcategory.sub_name}
								</DropdownMenu.Item>
							))}
						</DropdownMenu.SubContent>
					</DropdownMenu.Sub>
				))}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	)
})

export default RadixDropdown
