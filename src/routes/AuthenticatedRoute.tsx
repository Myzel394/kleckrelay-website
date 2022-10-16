import {ReactElement} from "react"
import {Outlet, useLocation} from "react-router-dom"

import {Box, Container, List, ListItem, Paper, useTheme} from "@mui/material"

import {useUser} from "~/hooks"
import NavigationButton, {
	NavigationSection,
} from "~/route-widgets/AuthenticateRoute/NavigationButton"

enum Section {
	Overview,
	Aliases,
	Reports,
	Settings,
}

export default function AuthenticatedRoute(): ReactElement {
	const theme = useTheme()
	const route = useLocation()

	const section = (() => {
		switch (route.pathname) {
			case "/":
				return Section.Overview
			case "/aliases":
				return Section.Aliases
			case "/reports":
				return Section.Reports
			case "/settings":
				return Section.Settings
		}
	})()

	useUser()

	return (
		<Box
			display="flex"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			height="100vh"
		>
			<Box width="90vw" justifyContent="center" alignItems="center">
				<Container
					maxWidth="md"
					style={{
						backgroundColor: "transparent",
					}}
				>
					<Box
						display="flex"
						flexDirection="row"
						justifyContent="center"
					>
						<Box
							bgcolor={theme.palette.background.paper}
							component="nav"
						>
							<List>
								{(
									Object.keys(NavigationSection) as Array<
										keyof typeof NavigationSection
									>
								).map(key => (
									<ListItem key={key}>
										<NavigationButton
											section={NavigationSection[key]}
										/>
									</ListItem>
								))}
							</List>
						</Box>
						<Paper>
							<Box padding={4}>
								<Outlet />
							</Box>
						</Paper>
					</Box>
				</Container>
			</Box>
		</Box>
	)
}
