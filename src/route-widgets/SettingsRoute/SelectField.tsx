import {ReactElement} from "react"

import {
	FormControl,
	FormHelperText,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
} from "@mui/material"

import {useUser} from "~/hooks"
import {User} from "~/server-types"

export interface SelectFieldProps {
	label: string
	formik: any
	name: string

	valueTextMap?: Record<string, string>
	icon?: ReactElement
}

const BOOLEAN_SELECT_TEXT_MAP: Record<string, string> = {
	true: "Yes",
	false: "No",
}

export default function SelectField({
	label,
	formik,
	icon,
	name,
	valueTextMap = BOOLEAN_SELECT_TEXT_MAP,
}: SelectFieldProps): ReactElement {
	const user = useUser()

	const labelId = `${name}-label`
	const preferenceName = `alias${
		name.charAt(0).toUpperCase() + name.slice(1)
	}`
	const value = user.preferences[preferenceName as keyof User["preferences"]]
	const defaultValueText = valueTextMap[value.toString()]

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
				renderValue={value =>
					value === "null" ? (
						<i>{`<${defaultValueText}>`}</i>
					) : (
						valueTextMap[value.toString()]
					)
				}
			>
				<MenuItem value="null">
					<i>{`Default <${defaultValueText}>`}</i>
				</MenuItem>
				{valueTextMap &&
					Object.entries(valueTextMap).map(([value, text]) => (
						<MenuItem key={value} value={value}>
							{text}
						</MenuItem>
					))}
			</Select>
			<FormHelperText
				error={Boolean(formik.touched[name] && formik.errors[name])}
			>
				{formik.touched[name] && formik.errors[name]}
			</FormHelperText>
		</FormControl>
	)
}
