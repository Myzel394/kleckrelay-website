import {useContext} from "react"
import {MdLock} from "react-icons/md"
import {Link as RouterLink} from "react-router-dom"

import {Button, Grid, Typography} from "@mui/material"

import AuthContext, {EncryptionStatus} from "~/AuthContext/AuthContext"
import LockNavigationContext from "~/LockNavigationContext/LockNavigationContext"

export interface WithEncryptionRequiredProps {
	children?: JSX.Element
}

export default function DecryptionPasswordMissingAlert({
	children = <></>,
}: WithEncryptionRequiredProps): JSX.Element {
	const {handleAnchorClick} = useContext(LockNavigationContext)
	const {encryptionStatus} = useContext(AuthContext)

	switch (encryptionStatus) {
		case EncryptionStatus.Unavailable: {
			return (
				<Grid container spacing={4}>
					<Grid item>
						<Typography variant="h6" component="h2">
							Encryption required
						</Typography>
					</Grid>
					<Grid item>
						<Typography>
							You need to set up encryption to use this feature.
						</Typography>
					</Grid>
					<Grid item>
						<Button
							variant="contained"
							component={RouterLink}
							to="/complete-account?setup=true"
							startIcon={<MdLock />}
							onClick={handleAnchorClick}
						>
							Setup encryption
						</Button>
					</Grid>
				</Grid>
			)
		}

		case EncryptionStatus.PasswordRequired: {
			return (
				<Grid
					container
					spacing={4}
					direction="column"
					alignItems="center"
				>
					<Grid item>
						<Typography variant="h6" component="h2">
							Password required
						</Typography>
					</Grid>
					<Grid item>
						<Typography>
							Your decryption password is required to view this
							section.
						</Typography>
					</Grid>
					<Grid item>
						<Button
							component={RouterLink}
							to={`/enter-password?next=${window.location.pathname}`}
							startIcon={<MdLock />}
							onClick={handleAnchorClick}
						>
							Enter Password
						</Button>
					</Grid>
				</Grid>
			)
		}

		default:
			return children
	}
}
