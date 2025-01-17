export function FormMessage({ message }) {
	// console.log(message)
	return (
		<div className='flex flex-col gap-2 w-full max-w-md text-sm'>
			{'success' in message && <div className='border-l-2 px-4'>{message.success}</div>}
			{'error' in message && <div className='border-l-2 px-4'>{message.error}</div>}
			{'message' in message && <div className='border-l-2 px-4'>{message.message}</div>}
		</div>
	)
}
