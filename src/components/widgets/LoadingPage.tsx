import {ReactElement} from "react"
import {useTranslation} from "react-i18next"

import {Grid, Typography} from "@mui/material"

import {ReactComponent as Logo} from "~/assets/logo.svg"

export default function LoadingPage(): ReactElement {
	const {t} = useTranslation()

	return (
		<Grid
			container
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
			height="100vh"
			spacing={2}
		>
			<Grid item>
				<Logo width={250} height={250} />
			</Grid>
			<Grid item maxWidth="sm">
				<Typography variant="subtitle1">{t("general.loading")}</Typography>
			</Grid>
		</Grid>
	)
}
