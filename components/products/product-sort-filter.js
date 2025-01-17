'use client'
import Select from 'react-select'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { mapKeyToLabel } from '@/helpers'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useFilters } from '@/components/providers/filtersCtx'
export default function FiltersForm({ payload }) {
	const [sortBy, setSortBy] = useState('default')
	const { filters, setFilters } = useFilters() || { filters: {}, setFilters: () => {} }
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const { replace } = useRouter()
	const query = searchParams?.get('query') || ''

	console.log('filters', filters)

	const obj = { x: 1, y: 2, z: 3 }

	useEffect(() => {
		const params = new URLSearchParams(searchParams)
		const hasActiveFilters = Object.values(filters).some(value => value.length > 0)

		if (sortBy && sortBy !== 'default') {
			params.set('s', sortBy)
		} else {
			params.delete('s')
		}
		if (!hasActiveFilters) {
			params.delete('producer')
			params.delete('caliber')
			params.delete('voivodeship')
		}
		const timeout = setTimeout(() => {
			replace(`${pathname}?${params.toString()}`)
		}, 300)

		return () => clearTimeout(timeout)
	}, [sortBy, filters])

	function reset() {
		setFilters({})
		setSortBy('default')
	}

	return (
		<div className='pb-4 w-full'>
			<label>Sortuj wg: </label>
			<select
				className='p-1 rounded'
				name='sort'
				value={sortBy}
				onChange={e => setSortBy(e.target.value)}>
				<option value='default'>Domyślnie</option>
				<option value='price-desc'>Cena malejąco</option>
				<option value='price-asc'>Cena rosnąco</option>
				<option value='newest'>Od najnowszych</option>
				<option value='oldest'>Od najstarszych</option>
			</select>

			<div className='flex flex-col w-full my-4 gap-4 sm:flex-row sm:justify-between'>
				{Object.entries(payload).map(([key, value]) =>
					value.length > 1 ? (
						<div
							key={key}
							className='md:max-w-xs grow'>
							<label>{mapKeyToLabel(key)}:</label>
							<SearchFilter
								name={key}
								payload={value}
								placeholder='Wszystkie'
							/>
						</div>
					) : null
				)}
			</div>
			<div className='w-full flex justify-center items-center gap-4 mt-6 '>
				<Link
					className='px-5 py-2 border-2 rounded-md border-secondary-foreground hover:bg-secondary-foreground hover:duration-300 '
					href={{
						pathname: pathname,
						query: { ...(query ? { query } : {}), ...filters },
					}}>
					Pokaż wyniki
				</Link>
				<button
					className='text-sm hover:duration-300 hover:underline hover:underline-offset-2'
					onClick={reset}>
					Wyczyść
				</button>
			</div>
		</div>
	)
}

function SearchFilter({ name, payload, placeholder }) {
	const { filters, setFilters } = useFilters()
	return (
		<Select
			instanceId={name}
			name={name}
			isMulti
			options={payload}
			placeholder={placeholder}
			noOptionsMessage={() => 'Brak dostępnych opcji'}
			onChange={selectedOptions =>
				setFilters(prevFilters => {
					const updatedFilters = { ...prevFilters }
					if (!selectedOptions.length) {
						delete updatedFilters[name]
					} else {
						updatedFilters[name] = selectedOptions.map(option => option.value).join(';')
					}
					return updatedFilters
				})
			}
			value={payload.filter(option => filters[name]?.includes(option.value))}
		/>
	)
}
