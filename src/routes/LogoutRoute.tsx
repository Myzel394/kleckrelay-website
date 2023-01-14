import {ReactElement, useContext} from "react"
import {useTranslation} from "react-i18next"
import {useEffectOnce} from "react-use"

import {Box, CircularProgress, Grid, Paper, Typography} from "@mui/material"

import {useNavigateToNext} from "~/hooks"
import {AuthContext} from "~/components"

export default function LogoutRoute(): ReactElement {
	const {t} = useTranslation()
	const navigateToNext = useNavigateToNext("/auth/login")
	const {logout} = useContext(AuthContext)

	useEffectOnce(() => {
		logout()
		navigateToNext()
	})

	return (
		<Paper>
			<Box padding={4}>
				<Grid container spacing={4} direction="column" alignItems="center">
					<Grid item>
						<Typography variant="h6" component="h1">
							{t("routes.LogoutRoute.title")}
						</Typography>
					</Grid>
					<Grid item>
						<CircularProgress />
					</Grid>
					<Grid item>
						<Typography variant="body1">
							{t("routes.LogoutRoute.description")}
						</Typography>
					</Grid>
				</Grid>
			</Box>
		</Paper>
	)
}
