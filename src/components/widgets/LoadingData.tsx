import {ReactElement} from "react"
import {useTranslation} from "react-i18next"

import {CircularProgress, Grid, Typography} from "@mui/material"

export default function LoadingData(): ReactElement {
	const {t} = useTranslation("common")

	return (
		<Grid container spacing={2} direction="column" alignItems="center">
			<Grid item>
				<CircularProgress />
			</Grid>
			<Grid item>
				<Typography variant="caption">{t("general.loading")}</Typography>
			</Grid>
		</Grid>
	)
}
