import {useLoaderData} from "react-router-dom"
import {ReactElement, useCallback, useState} from "react"
import {BiRefresh} from "react-icons/bi"
import {useTranslation} from "react-i18next"

import {useUpdateEffect} from "@react-hookz/web"
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
	const {t} = useTranslation("admin-global-settings")
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
				{t("randomAliasesPreview.title")}
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
			<FormHelperText>{t("randomAliasesPreview.helperText")}</FormHelperText>
		</Alert>
	)
}
