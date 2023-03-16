import {ReactElement} from "react"
import {Link} from "react-router-dom"
import {useTranslation} from "react-i18next"

import {Box, Button, Grid, Paper, Typography} from "@mui/material"

export default function RegistrationsDisabled(): ReactElement {
	const {t} = useTranslation("signup")

	return (
		<Paper>
			<Box maxWidth="sm">
				<Grid
					container
					spacing={4}
					padding={4}
					alignItems="center"
					justifyContent="center"
					flexDirection="column"
				>
					<Grid item>
						<Typography variant="h4" align="center">
							{t("registrationsDisabled.title")}
						</Typography>
					</Grid>
					<Grid item>
						<Typography variant="body1" align="center">
							{t("registrationsDisabled.description")}
						</Typography>
					</Grid>
					<Grid item>
						<Button component={Link} to="/auth/login" variant="contained">
							{t("registrationsDisabled.login")}
						</Button>
					</Grid>
				</Grid>
			</Box>
		</Paper>
	)
}
