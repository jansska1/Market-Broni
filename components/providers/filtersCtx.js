'use client'
import { createContext, useContext, useState } from 'react'

const FiltersContext = createContext()

const FiltersProvider = ({ children }) => {
	const [filters, setFilters] = useState({})

	return <FiltersContext.Provider value={{ filters, setFilters }}>{children}</FiltersContext.Provider>
}

export const useFilters = () => useContext(FiltersContext)

export default FiltersProvider
