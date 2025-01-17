import { PRODUCTS_PER_PAGE } from './config'

export function handleErrorsMessage(error) {
	const captchaError = error.message.includes('captcha')
	if (captchaError) return 'Błędna autoryzacja captchy'
	const messages = {
		'Invalid login credentials': 'Podano nieprawidłowe dane logowania.',
		'Email already registered': 'Ten adres email jest już zarejestrowany.',
		'User already registered': 'Konto już istnieje',
		'New password should be different from the old password': 'Nowe hasło powinno się różnić od starego',
		'A user with this email address has already been registered': 'Użytkownik z podanym adresem email już istnieje',
		'New password should be different from the old password.': 'Nowe hasło powinno różnić się od poprzedniego',
	}
	return messages[error.message] || 'Wystąpił nieoczekiwany błąd.'
}

export function formatDate(createdAt) {
	const nowDate = new Date(createdAt)
	const day = `${nowDate.getDate()}`.padStart(2, 0)
	const month = `${nowDate.getMonth() + 1}`.padStart(2, 0)
	const year = nowDate.getFullYear()
	const hour = `${nowDate.getHours()}`.padStart(2, 0)
	const minutes = `${nowDate.getMinutes()}`.padStart(2, 0)
	// return `${day}/${month}/${year}, ${hour}:${minutes}`
	return `${day}.${month}.${year}`
}

export const pln = Intl.NumberFormat('pl-PL', {
	style: 'currency',
	currency: 'pln',
	minimumFractionDigits: 0,
	maximumFractionDigits: 0,
})
export const idFromSlug = slug => slug.filter((_, i) => i <= 4).join('-')

export const pagesCalc = count => Math.ceil(count / PRODUCTS_PER_PAGE)

/**
 *
 * @param {function} router - const router = useRouter()
 * @param {string} path - eg. /logowanie
 * @param {string} status - success or failed
 * @param {string} message - eg. Pomyślne logowanie
 */

export const navigateWithNotification = (router, path, status, message) =>
	router.replace(`${path}?status=${status}&message=${encodeURIComponent(message)}`)

export const mapKeyToLabel = key => {
	const labelMap = {
		voivodeship: 'Województwo',
		producer: 'Producent',
		caliber: 'Kaliber',
	}

	return labelMap[key]
}

const excludedKeys = ['query', 'strona', 's']
export const createFilters = searchParams => {
	const filters = {}
	Object.entries(searchParams).forEach(([key, value]) => {
		if (!excludedKeys.includes(key)) {
			filters[key] = value.split(';')
		}
	})
	return filters
}

export const TAB_LINKS = ['aktywne', 'nieaktywne']

export const USER_SITES = [
	'/dodaj-ogloszenie',
	'/edytuj-ogloszenie',
	'/moje-ogloszenia',
	'/polubione',
	'/profil',
	'/reset-hasla',
	'/menu',
]

export const options = {
	VOIVODESHIPS: [
		{ value: 'dolnoslaskie', label: 'Dolnośląskie' },
		{ value: 'kujawsko-pomorskie', label: 'Kujawsko-Pomorskie' },
		{ value: 'lubelskie', label: 'Lubelskie' },
		{ value: 'lubuskie', label: 'Lubuskie' },
		{ value: 'lodzkie', label: 'Łódzkie' },
		{ value: 'malopolskie', label: 'Małopolskie' },
		{ value: 'mazowieckie', label: 'Mazowieckie' },
		{ value: 'opolskie', label: 'Opolskie' },
		{ value: 'podkarpackie', label: 'Podkarpackie' },
		{ value: 'podlaskie', label: 'Podlaskie' },
		{ value: 'pomorskie', label: 'Pomorskie' },
		{ value: 'slaskie', label: 'Śląskie' },
		{ value: 'swietokrzyskie', label: 'Świętokrzyskie' },
		{ value: 'warminsko-mazurskie', label: 'Warmińsko-Mazurskie' },
		{ value: 'wielkopolskie', label: 'Wielkopolskie' },
		{ value: 'zachodniopomorskie', label: 'Zachodniopomorskie' },
	],
	CALIBERS: [
		{ value: '.22 short', label: '.22 short' },
		{ value: '.22 LR', label: '.22 LR' },
		{ value: '.222 Rem', label: '.222 Rem' },
		{ value: '.223 Rem / 5,56', label: '.223 Rem / 5,56' },
		{ value: '6.5 Creedm', label: '6.5 Creedm' },
		{ value: '7x64', label: '7x64' },
		{ value: '7.62x25', label: '7.62x25' },
		{ value: '7.62x39', label: '7.62x39' },
		{ value: '7,62x54R', label: '7,62x54R' },
		{ value: '7,65 Brown.', label: '7,65 Brown.' },
		{ value: '8x57', label: '8x57' },
		{ value: '.30-06', label: '.30-06' },
		{ value: '.300', label: '.300' },
		{ value: '.308 Win', label: '.308 Win' },
		{ value: '9x19', label: '9x19' },
		{ value: '9x18 Mak.', label: '9x18 Mak.' },
		{ value: '.38', label: '.38' },
		{ value: '.357', label: '.357' },
		{ value: '.44 Mag.', label: '.44 Mag.' },
		{ value: '.45', label: '.45' },
		{ value: '12/70, 67, 76', label: '12/70, 67, 76' },
		{ value: '.50 BMG', label: '.50 BMG' },
		{ value: 'inny', label: 'inny' },
	],
	PRODUCERS: [
		{ value: 'aksa', label: 'AKSA' },
		{ value: 'aero-precision', label: 'Aero Precision' },
		{ value: 'anschutz', label: 'Anschütz' },
		{ value: 'bcm', label: 'BCM' },
		{ value: 'benelli', label: 'Benelli' },
		{ value: 'beretta', label: 'Beretta' },
		{ value: 'bergara', label: 'Bergara' },
		{ value: 'breda', label: 'Breda' },
		{ value: 'brno', label: 'Brno' },
		{ value: 'browning', label: 'Browning' },
		{ value: 'cz', label: 'Česká Zbrojovka' },
		{ value: 'canik', label: 'Canik' },
		{ value: 'colt', label: 'Colt' },
		{ value: 'daniel-defense', label: 'Daniel Defense' },
		{ value: 'diamondback', label: 'Diamondback' },
		{ value: 'doruk', label: 'Doruk' },
		{ value: 'fb-radom', label: 'FB Radom' },
		{ value: 'gsg', label: 'GSG' },
		{ value: 'glock', label: 'Glock' },
		{ value: 'h&k', label: 'H&K' },
		{ value: 'haenel', label: 'Haenel' },
		{ value: 'hammerli', label: 'Hämmerli' },
		{ value: 'howa', label: 'Howa' },
		{ value: 'iwi', label: 'IWI' },
		{ value: 'jp', label: 'JP' },
		{ value: 'kriss', label: 'KRISS' },
		{ value: 'keltec', label: 'KelTec' },
		{ value: 'laugo', label: 'Laugo' },
		{ value: 'mauser', label: 'Mauser' },
		{ value: 'milicon', label: 'Milicon' },
		{ value: 'mossberg', label: 'Mossberg' },
		{ value: 'svrn', label: 'SVRN' },
		{ value: 'pof-usa', label: 'POF USA' },
		{ value: 'remington', label: 'Remington' },
		{ value: 'ruger', label: 'Ruger' },
		{ value: 's&w', label: 'S&W' },
		{ value: 'sog', label: 'SOG' },
		{ value: 'sabatti', label: 'Sabatti' },
		{ value: 'saiga', label: 'Saiga' },
		{ value: 'sako', label: 'Sako' },
		{ value: 'savage-arms', label: 'Savage Arms' },
		{ value: 'sig-sauer', label: 'Sig Sauer' },
		{ value: 'springfield', label: 'Springfield' },
		{ value: 'stag', label: 'Stag' },
		{ value: 'steyr', label: 'Steyr' },
		{ value: 'stoeger', label: 'Stoeger' },
		{ value: 'toz', label: 'TOZ' },
		{ value: 'tanfoglio', label: 'Tanfoglio' },
		{ value: 'taurus', label: 'Taurus' },
		{ value: 'tikka', label: 'Tikka' },
		{ value: 'tippmann', label: 'Tippmann' },
		{ value: 'walther', label: 'Walther' },
		{ value: 'winchester', label: 'Winchester' },
		{ value: 'bron-kolekcjonerska', label: 'Broń kolekcjonerska' },
		{ value: 'inne', label: 'Inne' },
	],
}

export const VOIVODESHIPS = [
	{ value: 'dolnoslaskie', label: 'Dolnośląskie' },
	{ value: 'kujawsko-pomorskie', label: 'Kujawsko-Pomorskie' },
	{ value: 'lubelskie', label: 'Lubelskie' },
	{ value: 'lubuskie', label: 'Lubuskie' },
	{ value: 'lodzkie', label: 'Łódzkie' },
	{ value: 'malopolskie', label: 'Małopolskie' },
	{ value: 'mazowieckie', label: 'Mazowieckie' },
	{ value: 'opolskie', label: 'Opolskie' },
	{ value: 'podkarpackie', label: 'Podkarpackie' },
	{ value: 'podlaskie', label: 'Podlaskie' },
	{ value: 'pomorskie', label: 'Pomorskie' },
	{ value: 'slaskie', label: 'Śląskie' },
	{ value: 'swietokrzyskie', label: 'Świętokrzyskie' },
	{ value: 'warminsko-mazurskie', label: 'Warmińsko-Mazurskie' },
	{ value: 'wielkopolskie', label: 'Wielkopolskie' },
	{ value: 'zachodniopomorskie', label: 'Zachodniopomorskie' },
]

export const CALIBERS = [
	{ value: '.22 short', label: '.22 short' },
	{ value: '.22 LR', label: '.22 LR' },
	{ value: '.222 Rem', label: '.222 Rem' },
	{ value: '.223 Rem / 5,56', label: '.223 Rem / 5,56' },
	{ value: '6.5 Creedm', label: '6.5 Creedm' },
	{ value: '7x64', label: '7x64' },
	{ value: '7.62x25', label: '7.62x25' },
	{ value: '7.62x39', label: '7.62x39' },
	{ value: '7,62x54R', label: '7,62x54R' },
	{ value: '7,65 Brown.', label: '7,65 Brown.' },
	{ value: '8x57', label: '8x57' },
	{ value: '.30-06', label: '.30-06' },
	{ value: '.300', label: '.300' },
	{ value: '.308 Win', label: '.308 Win' },
	{ value: '9x19', label: '9x19' },
	{ value: '9x18 Mak.', label: '9x18 Mak.' },
	{ value: '.38', label: '.38' },
	{ value: '.357', label: '.357' },
	{ value: '.44 Mag.', label: '.44 Mag.' },
	{ value: '.45', label: '.45' },
	{ value: '12/70, 67, 76', label: '12/70, 67, 76' },
	{ value: '.50 BMG', label: '.50 BMG' },
	{ value: 'inny', label: 'inny' },
]

export const PRODUCERS = [
	{ value: 'aksa', label: 'AKSA' },
	{ value: 'aero-precision', label: 'Aero Precision' },
	{ value: 'anschutz', label: 'Anschütz' },
	{ value: 'bcm', label: 'BCM' },
	{ value: 'benelli', label: 'Benelli' },
	{ value: 'beretta', label: 'Beretta' },
	{ value: 'bergara', label: 'Bergara' },
	{ value: 'breda', label: 'Breda' },
	{ value: 'brno', label: 'Brno' },
	{ value: 'browning', label: 'Browning' },
	{ value: 'cz', label: 'Česká Zbrojovka' },
	{ value: 'canik', label: 'Canik' },
	{ value: 'colt', label: 'Colt' },
	{ value: 'daniel-defense', label: 'Daniel Defense' },
	{ value: 'diamondback', label: 'Diamondback' },
	{ value: 'doruk', label: 'Doruk' },
	{ value: 'fb-radom', label: 'FB Radom' },
	{ value: 'gsg', label: 'GSG' },
	{ value: 'glock', label: 'Glock' },
	{ value: 'h&k', label: 'H&K' },
	{ value: 'haenel', label: 'Haenel' },
	{ value: 'hammerli', label: 'Hämmerli' },
	{ value: 'howa', label: 'Howa' },
	{ value: 'iwi', label: 'IWI' },
	{ value: 'jp', label: 'JP' },
	{ value: 'kriss', label: 'KRISS' },
	{ value: 'keltec', label: 'KelTec' },
	{ value: 'laugo', label: 'Laugo' },
	{ value: 'mauser', label: 'Mauser' },
	{ value: 'milicon', label: 'Milicon' },
	{ value: 'mossberg', label: 'Mossberg' },
	{ value: 'svrn', label: 'SVRN' },
	{ value: 'pof-usa', label: 'POF USA' },
	{ value: 'remington', label: 'Remington' },
	{ value: 'ruger', label: 'Ruger' },
	{ value: 's&w', label: 'S&W' },
	{ value: 'sog', label: 'SOG' },
	{ value: 'sabatti', label: 'Sabatti' },
	{ value: 'saiga', label: 'Saiga' },
	{ value: 'sako', label: 'Sako' },
	{ value: 'savage-arms', label: 'Savage Arms' },
	{ value: 'sig-sauer', label: 'Sig Sauer' },
	{ value: 'springfield', label: 'Springfield' },
	{ value: 'stag', label: 'Stag' },
	{ value: 'steyr', label: 'Steyr' },
	{ value: 'stoeger', label: 'Stoeger' },
	{ value: 'toz', label: 'TOZ' },
	{ value: 'tanfoglio', label: 'Tanfoglio' },
	{ value: 'taurus', label: 'Taurus' },
	{ value: 'tikka', label: 'Tikka' },
	{ value: 'tippmann', label: 'Tippmann' },
	{ value: 'walther', label: 'Walther' },
	{ value: 'winchester', label: 'Winchester' },
	{ value: 'bron-kolekcjonerska', label: 'Broń kolekcjonerska' },
	{ value: 'inne', label: 'Inne' },
]
