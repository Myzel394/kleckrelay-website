import {ReactElement} from "react"
import {useTranslation} from "react-i18next"

import {Container, Grid, Typography} from "@mui/material"
import {mdiTextBoxMultiple} from "@mdi/js/commonjs/mdi"
import Icon from "@mdi/react"

export default function EmptyStateScreen(): ReactElement {
	const {t} = useTranslation()

	return (
		<Container maxWidth="xs">
			<Grid container spacing={4} direction="column" alignItems="center" alignSelf="center">
				<Grid item>
					<Typography variant="h6" component="h2">
						{t("routes.ReportsRoute.emptyState.title")}
					</Typography>
				</Grid>
				<Grid item>
					<Icon path={mdiTextBoxMultiple} size={2.5} />
				</Grid>
				<Grid item>
					<Typography variant="body1">
						{t("routes.ReportsRoute.emptyState.description")}
					</Typography>
				</Grid>
			</Grid>
		</Container>
	)
}
