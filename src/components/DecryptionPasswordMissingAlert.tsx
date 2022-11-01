import {useContext} from "react"
import {MdLock} from "react-icons/md"
import {Link as RouterLink} from "react-router-dom"
import {useTranslation} from "react-i18next"

import {Button, Grid, Typography, useTheme} from "@mui/material"

import AuthContext, {EncryptionStatus} from "~/AuthContext/AuthContext"
import LockNavigationContext from "~/LockNavigationContext/LockNavigationContext"

export interface WithEncryptionRequiredProps {
	children?: JSX.Element
}

export default function DecryptionPasswordMissingAlert({
	children = <></>,
}: WithEncryptionRequiredProps): JSX.Element {
	const {t} = useTranslation()
	const {handleAnchorClick} = useContext(LockNavigationContext)
	const {encryptionStatus} = useContext(AuthContext)
	const theme = useTheme()

	switch (encryptionStatus) {
		case EncryptionStatus.Unavailable: {
			return (
				<Grid
					padding={4}
					bgcolor={theme.palette.background.default}
					container
					gap={2}
					direction="column"
					alignItems="center"
				>
					<Grid item>
						<Typography variant="h6" component="h2">
							{t("components.DecryptionPasswordMissingAlert.unavailable.title")}
						</Typography>
					</Grid>
					<Grid item>
						<Typography>
							{t("components.DecryptionPasswordMissingAlert.unavailable.description")}
						</Typography>
					</Grid>
					<Grid item>
						<Button
							variant="contained"
							component={RouterLink}
							to={`/auth/complete-account?setup=true&next=${window.location.pathname}`}
							startIcon={<MdLock />}
							onClick={handleAnchorClick}
						>
							{t(
								"components.DecryptionPasswordMissingAlert.unavailable.continueAction",
							)}
						</Button>
					</Grid>
				</Grid>
			)
		}

		case EncryptionStatus.PasswordRequired: {
			return (
				<Grid
					padding={4}
					bgcolor={theme.palette.background.default}
					container
					gap={2}
					direction="column"
					alignItems="center"
				>
					<Grid item>
						<Typography variant="h6" component="h2">
							{t("components.DecryptionPasswordMissingAlert.passwordRequired.title")}
						</Typography>
					</Grid>
					<Grid item>
						<Typography>
							{t(
								"components.DecryptionPasswordMissingAlert.passwordRequired.description",
							)}
						</Typography>
					</Grid>
					<Grid item>
						<Button
							component={RouterLink}
							to={`/enter-password?next=${window.location.pathname}`}
							startIcon={<MdLock />}
							onClick={handleAnchorClick}
						>
							{t(
								"components.DecryptionPasswordMissingAlert.passwordRequired.continueAction",
							)}
						</Button>
					</Grid>
				</Grid>
			)
		}

		default:
			return children
	}
}
