import { cn } from '@/utils/cn'
import clsx from 'clsx'
import { forwardRef } from 'react'
import { Check } from 'lucide-react'

const Input = forwardRef(function Input({ className, type, touched, errors, ...props }, ref) {
	return (
		<div className='relative'>
			<input
				type={type}
				// className={cn(
				// 	'flex h-10 w-full rounded-md focus:outline-none focus:ring-secondary focus:ring-2 focus-visible:ring-secondary-foreground focus-visible:ring-2 px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50',
				// 	className
				// )}
				className={clsx(
					'flex h-10 w-full border-transparent focus:border-none rounded-md focus:outline-none focus:ring-secondary focus:ring-2 focus-visible:ring-secondary-foreground focus-visible:ring-2 px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50',
					className,
					{
						'!border-b-2 !border-error': errors,
						'!border-b-2 !border-green-500': touched && !errors,
					}
				)}
				ref={ref}
				{...props}
			/>
			{touched && !errors && (
				<span className='absolute right-2 top-2 text-green-500'>
					<Check />
				</span>
			)}
		</div>
	)
})
Input.displayName = 'Input'

export { Input }
