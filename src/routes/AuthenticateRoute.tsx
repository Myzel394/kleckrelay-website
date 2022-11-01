import {ReactElement} from "react"
import {Link as RouterLink, Outlet} from "react-router-dom"
import {MdAdd, MdLogin} from "react-icons/md"
import {useTranslation} from "react-i18next"

import {Box, Button, Grid} from "@mui/material"

export default function AuthenticateRoute(): ReactElement {
	const {t} = useTranslation()

	return (
		<Box
			display="flex"
			flexDirection="column"
			alignItems="center"
			justifyContent="space-between"
			height="100vh"
		>
			<div />
			<Outlet />
			<Grid container spacing={2} justifyContent="center" marginBottom={2}>
				<Grid item>
					<Button
						component={RouterLink}
						to="/auth/signup"
						color="inherit"
						size="small"
						startIcon={<MdAdd />}
					>
						{t("components.AuthenticateRoute.signup")}
					</Button>
				</Grid>
				<Grid item>
					<Button
						component={RouterLink}
						to="/auth/login"
						color="inherit"
						size="small"
						startIcon={<MdLogin />}
					>
						{t("components.AuthenticateRoute.login")}
					</Button>
				</Grid>
			</Grid>
		</Box>
	)
}
