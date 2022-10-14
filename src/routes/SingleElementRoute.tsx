import {ReactElement} from "react"
import {Link as RouterLink, Outlet} from "react-router-dom"
import {MdAdd, MdLogin} from "react-icons/md"

import {Box, Button, Grid} from "@mui/material"

export default function SingleElementRoute(): ReactElement {
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
				marginBottom={2}
			>
				<Grid item>
					<Button
						component={RouterLink}
						to="/signup"
						color="inherit"
						size="small"
						startIcon={<MdAdd />}
					>
						Sign Up
					</Button>
				</Grid>
				<Grid item>
					<Button
						component={RouterLink}
						to="/login"
						color="inherit"
						size="small"
						startIcon={<MdLogin />}
					>
						Login
					</Button>
				</Grid>
			</Grid>
		</Box>
	)
}
