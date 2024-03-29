import {ReactElement} from "react"
import {Link as RouterLink, Outlet} from "react-router-dom"
import {useTranslation} from "react-i18next"
import {MdLogout} from "react-icons/md"

import {Box, Button, Grid, List, ListItem, Paper, useTheme} from "@mui/material"

import {useUser} from "~/hooks"
import {LanguageButton, LockNavigationContextProvider} from "~/components"
import NavigationButton, {
	NavigationSection,
} from "~/route-widgets/AuthenticateRoute/NavigationButton"

export default function AuthenticatedRoute(): ReactElement {
	const {t} = useTranslation("common")
	const theme = useTheme()
	const user = useUser()

	const sections = [
		NavigationSection.Aliases,
		NavigationSection.Reports,
		NavigationSection.Settings,
		user?.isAdmin && NavigationSection.Admin,
	].filter(value => value !== false) as NavigationSection[]

	return (
		<LockNavigationContextProvider>
			<Box
				display="flex"
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
				height="100vh"
			>
				<Box
					display="flex"
					maxWidth="90vw"
					width="100%"
					height="100%"
					justifyContent="center"
					alignItems="center"
				>
					<Grid
						maxWidth="md"
						container
						height="100%"
						justifyContent="space-between"
						alignItems="center"
					>
						<Grid item xs={12} md={3}>
							<Box bgcolor={theme.palette.background.paper}>
								<List component="nav">
									{sections.map(key => (
										<ListItem key={key}>
											<NavigationButton section={key} />
										</ListItem>
									))}
								</List>
							</Box>
						</Grid>
						<Grid item xs={12} md={9} height="100%">
							<Grid
								container
								direction="column"
								height="100%"
								justifyContent="space-between"
							>
								<Grid item></Grid>
								<Grid item>
									<Paper>
										<Box maxHeight="80vh" sx={{overflowY: "auto"}} padding={4}>
											<Outlet />
										</Box>
									</Paper>
								</Grid>
								<Grid item>
									<Grid
										container
										spacing={2}
										justifyContent="center"
										alignItems="center"
										direction="row"
										marginBottom={2}
									>
										<Grid item>
											<Button
												component={RouterLink}
												color="inherit"
												size="small"
												to="/auth/logout"
												startIcon={<MdLogout />}
											>
												{t("routes.logout")}
											</Button>
										</Grid>
										<Grid item>
											<LanguageButton />
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</LockNavigationContextProvider>
	)
}
