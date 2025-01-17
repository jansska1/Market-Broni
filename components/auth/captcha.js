import HCaptcha from '@hcaptcha/react-hcaptcha'
import { useState, forwardRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
const Captcha = forwardRef(function Captcha({ setCaptchaToken, id }, ref) {
	const [isLoaded, setIsLoaded] = useState(false)
	const path = usePathname()
	console.log(isLoaded)
	console.log(id)

	useEffect(() => {
		setIsLoaded(true)
	}, [path])

	return (
		<>
			{!isLoaded && (
				<div className='flex items-center justify-center w-[300px] h-[74px] rounded bg-third'>
					<p className=''>Ładowanie captchy...</p>
				</div>
			)}
			<div className='min-w-64'>
				<HCaptcha
					id={id}
					ref={ref}
					sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY}
					onVerify={token => {
						setCaptchaToken(token)
					}}
				/>
			</div>
		</>
	)
})

export default Captcha
