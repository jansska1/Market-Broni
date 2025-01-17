'use client'
import Select from 'react-select'
import { Controller } from 'react-hook-form'
import { memo } from 'react'

const FormSelect = memo(function FormSelect({ name, control, payload }) {
	// console.log('render <FormSelect> ')
	return (
		<>
			<Controller
				name={name}
				control={control}
				render={({ field }) => (
					<Select
						instanceId={name}
						options={payload}
						isClearable
						placeholder={'Wybierz...'}
						value={payload.find(option => option.label === field.value)}
						onChange={val => field.onChange(val ? val.label : null)}
					/>
				)}
			/>
		</>
	)
})

export default FormSelect
