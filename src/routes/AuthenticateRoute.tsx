import {ReactElement} from "react"
import {Link as RouterLink, Outlet} from "react-router-dom"
import {MdAdd, MdLogin} from "react-icons/md"
import {useTranslation} from "react-i18next"

import {Box, Button, Grid} from "@mui/material"

import {LanguageButton} from "~/components"

export default function AuthenticateRoute(): ReactElement {
	const {t} = useTranslation("common")

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
			<Grid
				container
				spacing={2}
				justifyContent="center"
				alignItems="center"
				marginBottom={2}
			>
				<Grid item>
					<Button
						component={RouterLink}
						to="/auth/signup"
						color="inherit"
						size="small"
						startIcon={<MdAdd />}
					>
						{t("routes.signup")}
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
						{t("routes.login")}
					</Button>
				</Grid>
				<Grid item>
					<LanguageButton />
				</Grid>
			</Grid>
		</Box>
	)
}
