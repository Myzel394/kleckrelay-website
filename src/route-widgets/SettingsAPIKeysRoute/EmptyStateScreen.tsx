import {ReactElement} from "react"
import {useTranslation} from "react-i18next"

import {Container, Grid, Typography} from "@mui/material"
import {MdVpnKey} from "react-icons/md"

export default function EmptyStateScreen(): ReactElement {
	const {t} = useTranslation("settings-api-keys")

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
						{t("emptyState.title")}
					</Typography>
				</Grid>
				<Grid item>
					<MdVpnKey size={40} />
				</Grid>
				<Grid item>
					<Typography variant="body1">{t("emptyState.description")}</Typography>
				</Grid>
			</Grid>
		</Container>
	)
}
