export default function SuspenseSpinner() {
	return (
		<div className='flex flex-col items-center justify-center'>
			<div className='w-10 h-10 border-4 border-secondary border-t-secondary-foreground rounded-full animate-spin'></div>
			<p className='mt-4 text-gray-700'>Ładowanie...</p>
		</div>
	)
}
