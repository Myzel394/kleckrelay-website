import {ReactElement} from "react"
import {useTranslation} from "react-i18next"

import {Container, Grid, Typography} from "@mui/material"
import {BsStarFill} from "react-icons/bs"

export default function EmptyStateScreen(): ReactElement {
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
						{t("routes.ReservedAliasesRoute.emptyState.title")}
					</Typography>
				</Grid>
				<Grid item>
					<BsStarFill size={40} />
				</Grid>
				<Grid item>
					<Typography variant="body1">
						{t("routes.ReservedAliasesRoute.emptyState.description")}
					</Typography>
				</Grid>
			</Grid>
		</Container>
	)
}
