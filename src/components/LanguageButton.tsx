import {ReactElement, useContext} from "react"
import {useTranslation} from "react-i18next"
import ReactCountryFlag from "react-country-flag"
import sortArray from "sort-array"

import {ListItemIcon, ListItemText, MenuItem, Select} from "@mui/material"

import {Language} from "~/server-types"
import AppLoadingScreenContext from "~/AppLoadingScreen/AppLoadingScreenContext"
import LockNavigationContext from "~/LockNavigationContext/LockNavigationContext"

const LANGUAGE_NAME_MAP = {
	[Language.EN_US]: "English",
	[Language.DE_DE]: "Deutsch",
}
const SORTED_ENTRIES = sortArray(Object.entries(LANGUAGE_NAME_MAP), {
	by: "1",
})

export default function LanguageButton(): ReactElement {
	const {setLoadingFunction} = useContext(AppLoadingScreenContext)
	const {isLocked, showDialog} = useContext(LockNavigationContext)
	const {i18n} = useTranslation()

	return (
		<Select
			value={i18n.resolvedLanguage}
			fullWidth
			size="small"
			renderValue={value => LANGUAGE_NAME_MAP[value as Language]}
			onChange={async event => {
				if (isLocked) {
					await showDialog()
					event.preventDefault()
				}

				setLoadingFunction(async () => {
					await i18n.changeLanguage(event.target.value as Language)
				})
			}}
		>
			{SORTED_ENTRIES.map(([language, name]) => (
				<MenuItem key={language} value={language}>
					<ListItemIcon>
						<ReactCountryFlag countryCode={language.split("-")[1]} />
					</ListItemIcon>
					<ListItemText>{name}</ListItemText>
				</MenuItem>
			))}
		</Select>
	)
}
