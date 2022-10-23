import {ReactElement} from "react"
import {Link as RouterLink} from "react-router-dom"
import {MdLock} from "react-icons/md"

import {Button, Grid, Typography} from "@mui/material"

import {useUser} from "~/hooks"

export default function WithEncryptionRequired(
	Component: any,
): (props: any) => ReactElement {
	return (props: any): ReactElement => {
		const user = useUser()

		if (!user.encryptedPassword) {
			return (
				<Grid container spacing={4}>
					<Grid item>
						<Typography variant="h6" component="h2">
							Encryption required
						</Typography>
					</Grid>
					<Grid item>
						<Typography>
							To continue, you need to enable encryption.
						</Typography>
					</Grid>
					<Grid item>
						<Button
							component={RouterLink}
							to="/complete-account?setup=true"
							startIcon={<MdLock />}
						>
							Setup encryption
						</Button>
					</Grid>
				</Grid>
			)
		}

		if (!user.isDecrypted) {
			return (
				<Grid
					container
					spacing={4}
					direction="column"
					alignItems="center"
				>
					<Grid item>
						<Typography variant="h6" component="h2">
							Encryption required
						</Typography>
					</Grid>
					<Grid item>
						<Typography>
							To continue, please enter your password to decrypt
							your data.
						</Typography>
					</Grid>
					<Grid item>
						<Button
							variant="contained"
							component={RouterLink}
							to="/enter-password"
							startIcon={<MdLock />}
						>
							Enter Password
						</Button>
					</Grid>
				</Grid>
			)
		}

		return <Component {...props} />
	}
}
