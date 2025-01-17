import { InfoIcon } from 'lucide-react'

export default function SmtpMessage() {
	return (
		<div className='bg-muted/50 px-5 py-3 border rounded-md flex gap-4'>
			<InfoIcon
				size={16}
				className='mt-0.5'
			/>
			<div className='flex flex-col gap-1'>
				<small className='text-sm text-secondary-foreground'>
					<strong> Uwaga:</strong> Funckjonalność nie działa.
				</small>
				<div></div>
			</div>
		</div>
	)
}
