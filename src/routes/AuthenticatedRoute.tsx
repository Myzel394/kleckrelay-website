import {ReactElement} from "react"
import {Outlet} from "react-router-dom"

import {Box, Container, List, ListItem, Paper, useTheme} from "@mui/material"

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
			<Box maxWidth="90vw" justifyContent="center" alignItems="center">
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
						alignItems="flex-start"
					>
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
