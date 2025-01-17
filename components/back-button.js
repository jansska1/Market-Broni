'use client'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/utils/cn'

export default function BackButton({ className }) {
	const router = useRouter()
	return (
		<button
			onClick={router.back}
			className={cn(className)}>
			<span className={'flex items-center text-sm'}>
				<ChevronLeft size={14} />
				cofnij
			</span>
		</button>
	)
}
