import {ReactElement} from "react"
import {useTranslation} from "react-i18next"

import {Grid, Typography} from "@mui/material"

import {SimplePage} from "~/components"

export default function OverviewRoute(): ReactElement {
	const {t} = useTranslation()

	return (
		<SimplePage title={t("routes.OverviewRoute.title")}>
			<Grid container>
				<Grid item>
					<Typography variant="body1">{t("routes.OverviewRoute.description")}</Typography>
				</Grid>
			</Grid>
		</SimplePage>
	)
}
