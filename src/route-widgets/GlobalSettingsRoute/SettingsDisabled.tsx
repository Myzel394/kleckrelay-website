import {RiAlertFill} from "react-icons/ri"
import {ReactElement} from "react"
import {useTranslation} from "react-i18next"

import {Container, Grid, Typography} from "@mui/material"

export default function SettingsDisabled(): ReactElement {
	console.log("asdas")
	const {t} = useTranslation()

	return (
		<Container maxWidth="xs">
			<Grid
				container
				spacing={4}
				direction="column"
				alignItems="center"
				maxWidth="80%"
				alignSelf="center"
				marginX="auto"
			>
				<Grid item>
					<Typography variant="h6" component="h2">
						{t("routes.AdminRoute.settings.disabled.title")}
					</Typography>
				</Grid>
				<Grid item>
					<RiAlertFill size={40} />
				</Grid>
				<Grid item>
					<Typography variant="body1">
						{t("routes.AdminRoute.settings.disabled.description")}
					</Typography>
				</Grid>
			</Grid>
		</Container>
	)
}
