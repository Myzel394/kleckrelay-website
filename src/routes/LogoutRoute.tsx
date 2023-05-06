import {ReactElement, useContext} from "react"
import {useTranslation} from "react-i18next"

import {useMountEffect} from "@react-hookz/web"
import {Box, CircularProgress, Grid, Paper, Typography} from "@mui/material"

import {useNavigateToNext} from "~/hooks"
import {AuthContext} from "~/components"

export default function LogoutRoute(): ReactElement {
	const {t} = useTranslation("logout")
	const navigateToNext = useNavigateToNext("/auth/login")
	const {logout} = useContext(AuthContext)

	useMountEffect(() => {
		logout()
		navigateToNext()
	})

	return (
		<Paper>
			<Box padding={4}>
				<Grid container spacing={4} direction="column" alignItems="center">
					<Grid item>
						<Typography variant="h6" component="h1">
							{t("title")}
						</Typography>
					</Grid>
					<Grid item>
						<CircularProgress />
					</Grid>
					<Grid item>
						<Typography variant="body1">{t("description")}</Typography>
					</Grid>
				</Grid>
			</Box>
		</Paper>
	)
}
