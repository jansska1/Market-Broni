'use client'

import { Button } from '@/components/ui/button'
import clsx from 'clsx'

export function SubmitButton({ children, pendingText = 'Potwierdzanie...', pending, className, ...props }) {
	return (
		<Button
			className={clsx(className, { ' bg-green-600': pending })}
			type='submit'
			aria-disabled={pending}
			{...props}>
			{pending ? pendingText : children}
		</Button>
	)
}
