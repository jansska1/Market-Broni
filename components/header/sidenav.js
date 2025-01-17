import DropdownMenu from '../products/dropdown-menu'
export default function SideNav() {
	return (
		<div className='flex h-full flex-col px-3 pt-14 md:py-0 md:px-2'>
			<div className='space-x-2 md:space-x-0 md:space-y-2'>
				<DropdownMenu />
				<div className='hidden h-auto w-full grow rounded-md bg-fifth lg:block'></div>
			</div>
		</div>
	)
}
