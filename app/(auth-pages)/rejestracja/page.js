import RegisterForm from '@/components/auth/register-form'

export const metadata = {
	title: 'Rejestracja',
	description: 'Na tej stronie zarejestrujesz się w Markecie',
}

export default async function Signup() {
	return <RegisterForm id='register' />
}
