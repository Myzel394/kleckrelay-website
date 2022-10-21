import {ReactElement} from "react"
import {Outlet} from "react-router-dom"

import {
	Box,
	Container,
	Grid,
	List,
	ListItem,
	Paper,
	useTheme,
} from "@mui/material"

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
					<Grid
						container
						justifyContent="space-between"
						alignItems="center"
					>
						<Grid item xs={12} sm={4}>
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
						<Grid item xs={12} sm={8}>
							<Paper>
								<Box
									padding={4}
									maxHeight="60vh"
									overflow="scroll"
								>
									<Outlet />
								</Box>
							</Paper>
						</Grid>
					</Grid>
				</Container>
			</Box>
		</Box>
	)
}
