import {useTranslation} from "react-i18next"
import {MdAdd} from "react-icons/md"
import React, {ReactElement, useLayoutEffect, useMemo, useState} from "react"

import {
	Box,
	Checkbox,
	Chip,
	FormControl,
	FormHelperText,
	InputLabel,
	ListItemIcon,
	ListItemText,
	MenuItem,
	Select,
	SelectProps,
} from "@mui/material"

import AddNewDialog from "./AddNewDialog"

export interface StringPoolFieldProps
	extends Omit<SelectProps<string[]>, "onChange" | "value" | "multiple" | "labelId" | "label"> {
	pools: Record<string, string>
	label: string
	value: string
	onChange: SelectProps<string>["onChange"]
	id: string

	allowCustom?: boolean
	helperText?: string | string[]
	error?: boolean
}

export function createPool(pools: Record<string, string>): Record<string, string> {
	return Object.fromEntries(
		Object.entries(pools).map(([key, value]) => [key.split("").sort().join(""), value]),
	)
}

export default function StringPoolField({
	pools,
	value,
	helperText,
	id,
	error,
	label,
	onChange,
	onOpen,
	allowCustom,
	name,
	fullWidth,
	...props
}: StringPoolFieldProps): ReactElement {
	const {t} = useTranslation("components")

	const reversedPoolsMap = useMemo(
		() => Object.fromEntries(Object.entries(pools).map(([key, value]) => [value, key])),
		[pools],
	)
	const [isInAddMode, setIsInAddMode] = useState<boolean>(false)
	const [uiRemainingValue, setUiRemainingValue] = useState<string>("")

	const selectedValueMaps = Object.entries(pools)
		.filter(([key]) => value.includes(key))
		.map(([, value]) => value)
	const remainingValue = (() => {
		// List of all characters inside the pools
		const charactersInPools = Object.keys(pools).join("")

		return value
			.split("")
			.filter(char => !charactersInPools.includes(char))
			.join("")
	})()
	const selectValue = [...selectedValueMaps, remainingValue].filter(Boolean)

	useLayoutEffect(() => {
		if (remainingValue) {
			setUiRemainingValue(remainingValue)
		}
	}, [remainingValue])

	return (
		<>
			<FormControl sx={{minWidth: 180}} fullWidth={fullWidth} error={error}>
				<InputLabel id={id} error={error}>
					{label}
				</InputLabel>
				<Select<string[]>
					multiple
					name={name}
					labelId={id}
					renderValue={(selected: string[]) => (
						<Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5}}>
							{selected.map(value => (
								<Chip key={value} label={value} />
							))}
						</Box>
					)}
					value={selectValue}
					label={label}
					onOpen={event => {
						if (!remainingValue) {
							setUiRemainingValue("")
						}

						onOpen?.(event)
					}}
					onChange={(event, child) => {
						if (!Array.isArray(event.target.value)) {
							return
						}

						const value = event.target.value.reduce((acc, value) => {
							if (reversedPoolsMap[value]) {
								return acc + reversedPoolsMap[value]
							}

							return acc + value
						}, "")

						onChange!(
							{
								...event,
								// @ts-ignore
								target: {
									...event.target,
									value: value as string,
								},
							},
							child,
						)
					}}
					{...props}
				>
					{Object.entries(pools).map(([poolValue, label]) => (
						<MenuItem key={poolValue} value={label} title={poolValue}>
							<Checkbox checked={value.includes(poolValue)} />
							<ListItemText primary={label} />
						</MenuItem>
					))}
					{uiRemainingValue && (
						<MenuItem value={uiRemainingValue}>
							<Checkbox checked={uiRemainingValue === remainingValue} />
							<ListItemText primary={uiRemainingValue} />
						</MenuItem>
					)}
					{allowCustom && (
						<MenuItem
							onClick={event => {
								event.preventDefault()
								setIsInAddMode(true)
							}}
						>
							<ListItemIcon>
								<MdAdd />
							</ListItemIcon>
							<ListItemText primary={t("StringPoolField.addCustom.label")} />
						</MenuItem>
					)}
				</Select>
				{helperText ? <FormHelperText error={error}>{helperText}</FormHelperText> : null}
			</FormControl>
			<AddNewDialog
				onCreated={newValue => {
					setIsInAddMode(false)

					// @ts-ignore: This is enough for formik.
					onChange({
						target: {
							name,
							value: value + newValue,
						},
					})
				}}
				onClose={() => setIsInAddMode(false)}
				open={isInAddMode}
			/>
		</>
	)
}
