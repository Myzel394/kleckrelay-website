import {ReactElement} from "react"
import {useTranslation} from "react-i18next"
import {FaQuestion} from "react-icons/fa"

import {Grid, Typography} from "@mui/material"

export default function NoSearchResults(): ReactElement {
	const {t} = useTranslation()

	return (
		<Grid container spacing={4} direction="column" alignItems="center">
			<Grid item>
				<Typography variant="h6">{t("components.NoSearchResults.title")}</Typography>
			</Grid>
			<Grid item>
				<FaQuestion size={40} />
			</Grid>
			<Grid item>
				<Typography variant="body1">
					{t("components.NoSearchResults.description")}
				</Typography>
			</Grid>
		</Grid>
	)
}
