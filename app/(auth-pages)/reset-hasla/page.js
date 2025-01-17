import ResetForm from '@/components/auth/reset-form'

export const metadata = {
	title: 'Reset hasła',
	description: 'Na tej stronie zarejestrujesz hasło do swojego konta w Markecie',
}

export default async function ResetPassword({ searchParams }) {
	return <ResetForm searchParams={searchParams} />
}
