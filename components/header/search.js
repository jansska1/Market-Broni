'use client'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { cn } from '@/utils/cn'
import { Search } from 'lucide-react'

export default function SearchInput({ className }) {
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const { replace } = useRouter()
	const query = searchParams?.query || ''
	// This function will wrap the contents of handleSearch, and only run the code after a specific time once the user has stopped typing (300ms).
	const handleSearch = useDebouncedCallback(event => {
		const params = new URLSearchParams(searchParams)
		if (event) {
			params.set('query', event)
			params.set('strona', '1')
		} else {
			// params.delete('query')
			params.delete('strona')
		}
		replace(`/oferta?${params.toString()}`)
	}, 300)

	return (
		<div className={cn('flex justify-center py-2', className)}>
			<div className='relative mx-2 grow max-w-sm md:max-w-2xl md:mx-0'>
				<input
					name='search'
					className='w-full rounded-md outline-none border border-secondary-foreground py-[9px] pl-10 text-sm placeholder:text-gray-500'
					placeholder='Wyszukaj'
					onChange={e => handleSearch(e.target.value)}
					defaultValue={searchParams.get('query')?.toString()}
				/>
				<span className='absolute left-3 top-1/2 transform -translate-y-1/2'>
					<Search className='text-gray-500' />
				</span>
			</div>
		</div>
	)
}
