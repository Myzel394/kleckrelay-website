import {ReactElement} from "react"
import {useTranslation} from "react-i18next"
import {MdTextSnippet} from "react-icons/md"

import {Container, Grid, Typography} from "@mui/material"

export default function EmptyStateScreen(): ReactElement {
	const {t} = useTranslation("reports")

	return (
		<Container maxWidth="xs">
			<Grid container spacing={4} direction="column" alignItems="center" alignSelf="center">
				<Grid item>
					<Typography variant="h6" component="h2">
						{t("emptyState.title")}
					</Typography>
				</Grid>
				<Grid item>
					<MdTextSnippet size={64} />
				</Grid>
				<Grid item>
					<Typography variant="body1">{t("emptyState.description")}</Typography>
				</Grid>
			</Grid>
		</Container>
	)
}
