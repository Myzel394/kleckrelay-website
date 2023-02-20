import {ReactElement} from "react"
import {useTranslation} from "react-i18next"
import {IoSad} from "react-icons/io5"

import {Grid, Typography} from "@mui/material"

export default function ErrorPage(): ReactElement {
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
				<IoSad size={80} />
			</Grid>
			<Grid item maxWidth="sm">
				<Typography variant="subtitle1">{t("general.appError")}</Typography>
			</Grid>
		</Grid>
	)
}
