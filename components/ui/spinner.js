export default function LoadingSpinner() {
	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
			<div className='bg-white p-8 rounded-lg shadow-md'>
				<div className='flex flex-col items-center'>
					<div className='w-10 h-10 border-4 border-secondary border-t-secondary-foreground  rounded-full animate-spin'></div>
					<p className='mt-4 text-gray-700'>Ładowanie...</p>
				</div>
			</div>
		</div>
	)
}
