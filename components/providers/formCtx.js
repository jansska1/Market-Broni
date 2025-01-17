'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const FormContext = createContext()

const FormProvider = ({ children }) => {
	const [pickedImages, setPickedImages] = useState([])
	const [imagesToDelete, setImagesToDelete] = useState([])
	const path = usePathname()
	useEffect(() => {
		setPickedImages([])
	}, [path])

	return (
		<FormContext.Provider value={{ pickedImages, setPickedImages, imagesToDelete, setImagesToDelete }}>
			{children}
		</FormContext.Provider>
	)
}

export const useFormUser = () => useContext(FormContext)

export default FormProvider
