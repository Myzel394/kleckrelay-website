import {ReactElement, ReactNode} from "react"

import {
	FormControl,
	FormHelperText,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
} from "@mui/material"

export interface SelectFieldProps {
	label: string
	formik: any
	name: string

	icon?: ReactElement
	children?: ReactNode
}

export default function SelectField({
	label,
	formik,
	icon,
	name,
	children,
}: SelectFieldProps): ReactElement {
	const labelId = `${name}-label`

	return (
		<FormControl fullWidth>
			<InputLabel id={labelId}>{label}</InputLabel>
			<Select
				fullWidth
				name={name}
				id={name}
				label={label}
				labelId={labelId}
				startAdornment={
					icon ? (
						<InputAdornment position="start">{icon}</InputAdornment>
					) : undefined
				}
				value={(formik.values[name] ?? "null").toString()}
				onChange={event => {
					const value = (() => {
						switch (event.target.value) {
							case "true":
								return true
							case "false":
								return false
							case "null":
								return null
							default:
								return event.target.value
						}
					})()

					formik.setFieldValue(name, value)
				}}
				disabled={formik.isSubmitting}
				error={Boolean(formik.touched[name] && formik.errors[name])}
			>
				<MenuItem value="null">
					<i>{"<Default>"}</i>
				</MenuItem>
				{!children && <MenuItem value="true">Yes</MenuItem>}
				{!children && <MenuItem value="false">No</MenuItem>}
				{children}
			</Select>
			<FormHelperText
				error={Boolean(formik.touched[name] && formik.errors[name])}
			>
				{formik.touched[name] && formik.errors[name]}
			</FormHelperText>
		</FormControl>
	)
}
