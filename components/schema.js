import * as yup from 'yup'
import {
	MIN_PRODUCT,
	MAX_PRODUCT,
	MAX_PRICE,
	MIN_DESCRIPTION,
	MAX_DESCRIPTION,
	MIN_IMAGE,
	MAX_IMAGE,
	EMAIL_REGEX,
	MIN_PASS,
	MAX_PASS,
	MIN_NAME,
	MAX_NAME,
	NUMBER_REGEX,
} from '@/config'

export const authSchema = yup.object().shape({
	email: yup.string().required('Email jest wymagany').lowercase().matches(EMAIL_REGEX, 'Podaj poprawny email'),
	password: yup
		.string()
		.trim()
		.min(MIN_PASS, `Hasło musi mieć co najmniej ${MIN_PASS} znaków`)
		.max(MAX_PASS, `Hasło może mieć maksymalnie ${MAX_PASS} znaków`)
		.required('Hasło jest wymagane'),
})

export const advSchema = (subcategoryRows, mode, product) => {
	return yup.object().shape({
		product: yup
			.string()
			.trim()
			.required('Napisz nazwę produktu')
			.min(MIN_PRODUCT, `Min. długość: ${MIN_PRODUCT}`)
			.max(MAX_PRODUCT, `Max. długość: ${MAX_PRODUCT}`)
			.default(mode === 'edit' ? product?.prod_name : ''),
		price: yup
			.number()
			.typeError('Napisz cenę')
			.required('Napisz cenę')
			.max(MAX_PRICE, `Maksymalna cena to ${MAX_PRICE}`)
			.positive('Cena nie może być ujemna lub równa 0 :)')
			.default(mode === 'edit' ? product?.price : ''),
		description: yup
			.string()
			.trim()
			.required('Napisz opis')
			.min(MIN_DESCRIPTION, `Min. długość: ${MIN_DESCRIPTION}`)
			.max(MAX_DESCRIPTION, `Max. długość: ${MAX_DESCRIPTION}`)
			.default(mode === 'edit' ? product?.description : ''),
		condition: yup
			.string()
			.required('Wybierz stan')
			.default(mode === 'edit' ? product?.condition : null),
		voivodeship: yup
			.string()
			.required('Wybierz województwo')
			.default(mode === 'edit' ? product?.info.voivodeship : ''),
		caliber: yup
			.string()
			.when('$categoryName', (categoryName, schema) =>
				String(categoryName).startsWith('Broń') ? schema.required(`Wybierz z dostępnych`) : schema.notRequired()
			)
			.default(mode === 'edit' ? product?.info.caliber : ''),
		producer: yup
			.string()
			.when('$categoryName', (categoryName, schema) =>
				String(categoryName).startsWith('Broń') ? schema.required(`Wybierz z dostępnych`) : schema.notRequired()
			)
			.default(mode === 'edit' ? product?.info.producer : ''),
		subcategory: yup
			.number()
			.required('Wybierz kategorię')
			.min(subcategoryRows.first, 'Wybierz kategorię dostępną w menu')
			.max(subcategoryRows.last, 'Wybierz kategorię dostępną w menu')
			.typeError('Wybierz kategorię z rozwijanego menu')
			.default(mode === 'edit' ? product?.info.subcategory_id : ''),
		image: yup
			.array()
			.required(`Dodaj przynajmniej ${MIN_IMAGE} zdjęcie`)
			.min(MIN_IMAGE, `Dodaj przynajmniej ${MIN_IMAGE} zdjęcie, nie więcej niż ${MAX_IMAGE}`)
			.max(MAX_IMAGE, `Maksymalnie ${MAX_IMAGE} zdjęć`)
			.default(mode === 'edit' ? product?.image : false),
		auctionValue: yup
			.number('')
			.notRequired()
			.max(MAX_PRICE, `Maksymalna cena to ${MAX_PRICE}`)
			.positive('Cena nie może być ujemna lub równa 0 :)')
			.typeError('Napisz początkową wartość licytacji')
			.default(mode === 'edit' ? product?.auction_value : null),
		renew: yup
			.boolean()
			.notRequired()
			.default(mode === 'edit' ? product?.info.auto_renew : false),
		auction: yup
			.boolean()
			.notRequired()
			.default(mode === 'edit' ? product?.auction : false),
	})
}

export const auctionSchema = yup.object().shape({
	bid: yup
		.number()
		.required('Jeśli chcesz licytować musisz określić stawkę')
		.typeError('Jeśli chcesz licytować musisz określić stawkę')
		.max(MAX_PRICE, `Maksymalna cena to ${MAX_PRICE}`)
		.positive('Cena nie może być ujemna lub równa 0 :)'),
})

export const resetSchema = yup.object().shape({
	password: yup
		.string()
		.trim()
		.min(MIN_PASS, `Hasło musi mieć co najmniej ${MIN_PASS} znaków`)
		.max(MAX_PASS, `Hasło może mieć maksymalnie ${MAX_PASS} znaków`)
		.required('Hasło jest wymagane'),
	confirmPassword: yup
		.string()
		.trim()
		.oneOf([yup.ref('password'), null], 'Hasła muszą być takie same')
		.required('Potwierdzenie hasła jest wymagane'),
})

export const emailSchema = yup.object().shape({
	email: yup.string().trim().required('Email jest wymagany').lowercase().matches(EMAIL_REGEX, 'Podaj poprawny email'),
})

export const userDetailsSchema = yup.object().shape({
	email: yup
		.string()
		.trim()
		.transform((curr, orig) => (orig === '' ? null : curr))
		.lowercase()
		.matches(EMAIL_REGEX, 'Podaj poprawny email')
		.notRequired(),
	phone: yup
		.string()
		.trim()
		.transform((curr, orig) => (orig === '' ? null : curr))
		.matches(NUMBER_REGEX, 'Numer telefonu musi być w formacie xxxxxxxxx')
		.notRequired(),
	username: yup
		.string()
		.trim()
		.transform((curr, orig) => (orig === '' ? null : curr))
		.min(MIN_NAME, `Nazwa użytkownika musi mieć min ${MIN_NAME} znaków`)
		.max(MAX_NAME, `Nazwa użytkownika może mieć max ${MAX_NAME} znaków`)
		.notRequired(),
})

export const testSchema = yup.object().shape({
	// email: yup.string().lowercase().matches(EMAIL_REGEX, 'Podaj poprawny email').notRequired(),
	email: yup.string().lowercase().notRequired(),
})
