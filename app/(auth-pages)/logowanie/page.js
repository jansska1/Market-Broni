import LoginForm from '@/components/auth/login-form'

export const metadata = {
	title: 'Logowanie',
	description: 'Na tej stronie zalogujesz się do Marketu',
}

export default async function Login() {
	return <LoginForm id='login' />
}
