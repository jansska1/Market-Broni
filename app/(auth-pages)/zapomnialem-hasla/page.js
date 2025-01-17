import ForgotPasswordForm from '@/components/auth/forgot-form'

export const metadata = {
	title: 'Zapomniałem hasła?',
	description: 'Na tej stronie wyślesz email z linkiem do resetu hasła',
}

export default function ForgotPassword({ searchParams }) {
	return <ForgotPasswordForm searchParams={searchParams} />
}
