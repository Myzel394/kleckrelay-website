import {useContext} from "react"
import {MdLock} from "react-icons/md"
import {Link as RouterLink} from "react-router-dom"
import {useTranslation} from "react-i18next"

import {Button, Grid, Typography, useTheme} from "@mui/material"

import {LockNavigationContext} from "../LockNavigation"
import {AuthContext, EncryptionStatus} from "../AuthContext"

export interface WithEncryptionRequiredProps {
	children?: JSX.Element
}

export default function DecryptionPasswordMissingAlert({
	children = <></>,
}: WithEncryptionRequiredProps): JSX.Element {
	const {t} = useTranslation("decryption")
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
							{t("actions.passwordMissing.unavailable.title")}
						</Typography>
					</Grid>
					<Grid item>
						<Typography>
							{t("actions.passwordMissing.unavailable.description")}
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
							{t("actions.passwordMissing.unavailable.continueActionLabel")}
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
							{t("actions.passwordMissing.passwordRequired.title")}
						</Typography>
					</Grid>
					<Grid item>
						<Typography>
							{t("actions.passwordMissing.passwordRequired.description")}
						</Typography>
					</Grid>
					<Grid item>
						<Button
							component={RouterLink}
							to={`/enter-password?next=${window.location.pathname}`}
							startIcon={<MdLock />}
							onClick={handleAnchorClick}
						>
							{t("actions.passwordMissing.passwordRequired.continueActionLabel")}
						</Button>
					</Grid>
				</Grid>
			)
		}

		default:
			return children
	}
}
