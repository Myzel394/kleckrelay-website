import {ReactElement} from "react"
import {useTranslation} from "react-i18next"

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

export default function SelectField({
	label,
	formik,
	icon,
	name,
	valueTextMap: parentValueTextMap,
}: SelectFieldProps): ReactElement {
	const user = useUser()
	const {t} = useTranslation()
	const BOOLEAN_SELECT_TEXT_MAP: Record<string, string> = {
		true: "general.booleanSelection.true",
		false: "general.booleanSelection.false",
	}
	const valueTextMap = parentValueTextMap ?? BOOLEAN_SELECT_TEXT_MAP

	const labelId = `${name}-label`
	const preferenceName = `alias${name.charAt(0).toUpperCase() + name.slice(1)}`
	const value = user.preferences[preferenceName as keyof User["preferences"]]
	const defaultValueText = t(valueTextMap[value.toString()])

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
					icon ? <InputAdornment position="start">{icon}</InputAdornment> : undefined
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
				disabled={formik.sSubmitting}
				error={Boolean(formik.touched[name] && formik.errors[name])}
				renderValue={value =>
					value === "null" ? (
						<i>
							{t("general.defaultValueSelectionRaw", {
								value: defaultValueText,
							})}
						</i>
					) : (
						t(valueTextMap[value.toString()])
					)
				}
			>
				<MenuItem value="null">
					<i>
						{t("general.defaultValueSelection", {
							value: defaultValueText,
						})}
					</i>
				</MenuItem>
				{valueTextMap &&
					Object.entries(valueTextMap).map(([value, translationString]) => (
						<MenuItem key={value} value={value}>
							{t(translationString)}
						</MenuItem>
					))}
			</Select>
			<FormHelperText error={Boolean(formik.touched[name] && formik.errors[name])}>
				{formik.touched[name] && formik.errors[name]}
			</FormHelperText>
		</FormControl>
	)
}
