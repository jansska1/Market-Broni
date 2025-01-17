'use client'
import { Switch } from '@radix-ui/themes'
import { Controller } from 'react-hook-form'
import { useEffect } from 'react'
export default function RenewSwitch({ name, control, product, setValue }) {
	useEffect(() => {
		if (product) {
			setValue(name, product)
		}
	}, [product, name, setValue])

	return (
		<Controller
			name={name}
			control={control}
			render={({ field }) => (
				<Switch
					size='3'
					checked={field.value}
					onCheckedChange={checked => {
						field.onChange(checked)
					}}
				/>
			)}
		/>
	)
}
