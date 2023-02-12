import {useLoaderData} from "react-router-dom"
import {ReactElement, useCallback, useState} from "react"
import {useUpdateEffect} from "react-use"
import {BiRefresh} from "react-icons/bi"
import {useTranslation} from "react-i18next"

import {Alert, FormHelperText, Grid, IconButton, Typography, useTheme} from "@mui/material"

import {ServerSettings} from "~/server-types"

export interface RandomAliasGeneratorProps {
	characters: string
	length: number
}

export default function RandomAliasGenerator({
	characters,
	length,
}: RandomAliasGeneratorProps): ReactElement {
	const serverSettings = useLoaderData() as ServerSettings
	const {t} = useTranslation()
	const theme = useTheme()

	const generateLocal = useCallback(
		() =>
			Array.from({length}, () =>
				characters.charAt(Math.floor(Math.random() * characters.length)),
			).join(""),
		[characters, length],
	)
	const [local, setLocal] = useState<string>(generateLocal)

	const email = `${local}@${serverSettings.mailDomain}`

	useUpdateEffect(() => {
		setLocal(generateLocal())
	}, [generateLocal])

	return (
		<Alert severity="info" variant="standard">
			<Typography variant="subtitle1" component="h5">
				{t("routes.AdminRoute.settings.randomAliasesPreview.title")}
			</Typography>
			<Grid container spacing={2} direction="row" alignItems="center">
				<Grid item>
					<Typography variant="body2">{email}</Typography>
				</Grid>
				<Grid item>
					<IconButton size="small" onClick={() => setLocal(generateLocal())}>
						<BiRefresh />
					</IconButton>
				</Grid>
			</Grid>
			<FormHelperText>
				{t("routes.AdminRoute.settings.randomAliasesPreview.helperText")}
			</FormHelperText>
		</Alert>
	)
}
