'use client'
import DeleteButton from '@/components/products/button-delete'
import { Button } from './ui/button'
import { useState } from 'react'

export default function Modal({ id, image }) {
	const [isOpen, setIsOpen] = useState(false)
	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className='flex justify-center items-center min-w-[5.4rem] mt-auto p-1 rounded bg-red-500 hover:bg-red-400 hover:duration-300'>
				Usuń
			</button>
			{isOpen && (
				<div className='fixed inset-0 bg-gray-600 bg-opacity-30 overflow-y-auto h-full w-full flex items-center justify-center z-50'>
					<div className='p-8 border w-96 shadow-lg rounded-md bg-white'>
						<div className='text-center'>
							<h3 className='text-2xl font-bold text-gray-900'>Czy napewno chcesz usunąć ogłoszenie?</h3>
							<div className='mt-2 px-7 py-3'>
								<p className='text-lg text-gray-500'>Usuniętego ogłoszenia nie można przywrócić</p>
							</div>
							<div className='flex justify-center gap-3 mt-4'>
								<Button
									onClick={() => setIsOpen(false)}
									className='py-2 px-4 w-[5.4rem] rounded'>
									Anuluj
								</Button>
								<DeleteButton
									className=' bg-red-500 mt-auto hover:bg-red-400 hover:duration-300 py-2 px-4 rounded'
									id={id}
									image={image}>
									Usuń
								</DeleteButton>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
