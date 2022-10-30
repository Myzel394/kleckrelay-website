import {ReactElement, useContext} from "react"
import {MdLock} from "react-icons/md"
import {Link as RouterLink} from "react-router-dom"

import {Alert, Button, Grid} from "@mui/material"

import LockNavigationContext from "~/LockNavigationContext/LockNavigationContext"

export default function DecryptionPasswordMissingAlert(): ReactElement {
	const {handleAnchorClick} = useContext(LockNavigationContext)

	return (
		<Grid container spacing={2} direction="column" alignItems="center">
			<Grid item>
				<Alert severity="warning">
					Your decryption password is required to view this section.
				</Alert>
			</Grid>
			<Grid item>
				<Button
					startIcon={<MdLock />}
					component={RouterLink}
					to="/enter-password"
					onClick={handleAnchorClick}
				>
					Enter password
				</Button>
			</Grid>
		</Grid>
	)
}
