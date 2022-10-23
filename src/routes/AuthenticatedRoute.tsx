import {ReactElement} from "react"
import {Outlet} from "react-router-dom"

import {Box, Grid, List, ListItem, Paper, useTheme} from "@mui/material"

import {useUser} from "~/hooks"
import NavigationButton, {
	NavigationSection,
} from "~/route-widgets/AuthenticateRoute/NavigationButton"

const sections = (
	Object.keys(NavigationSection) as Array<keyof typeof NavigationSection>
).filter(value => isNaN(Number(value)))

export default function AuthenticatedRoute(): ReactElement {
	const theme = useTheme()

	useUser()

	return (
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
				justifyContent="center"
				alignItems="center"
			>
				<Grid
					maxWidth="md"
					container
					justifyContent="space-between"
					alignItems="center"
				>
					<Grid item xs={12} sm={4} md={2}>
						<Box
							bgcolor={theme.palette.background.paper}
							component="nav"
						>
							<List>
								{sections.map(key => (
									<ListItem key={key}>
										<NavigationButton
											section={NavigationSection[key]}
										/>
									</ListItem>
								))}
							</List>
						</Box>
					</Grid>
					<Grid item xs={12} sm={8} md={10}>
						<Paper>
							<Box padding={4}>
								<Outlet />
							</Box>
						</Paper>
					</Grid>
				</Grid>
			</Box>
		</Box>
	)
}
