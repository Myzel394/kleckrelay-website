import {ReactElement, useContext, useState} from "react"

import {Grid, Paper, Typography} from "@mui/material"

import {MultiStepForm} from "~/components"
import {useNavigateToNext} from "~/hooks"
import AuthContext, {EncryptionStatus} from "~/AuthContext/AuthContext"
import GenerateEmailReportsForm from "~/route-widgets/CompleteAccountRoute/GenerateEmailReportsForm"
import PasswordForm from "~/route-widgets/CompleteAccountRoute/PasswordForm"

export default function CompleteAccountRoute(): ReactElement {
	const {encryptionStatus} = useContext(AuthContext)
	const navigateToNext = useNavigateToNext()

	// If query `setup` is `true`, skip directly to the setup
	const [showGenerationReportForm, setShowGenerationReportForm] = useState(
		() => {
			const searchParams = new URLSearchParams(location.search)
			return searchParams.get("setup") === "true"
		},
	)

	if (encryptionStatus === EncryptionStatus.Unavailable) {
		return (
			<MultiStepForm
				steps={[
					<GenerateEmailReportsForm
						key="generate_email_reports"
						onYes={() => setShowGenerationReportForm(true)}
						onNo={navigateToNext}
					/>,
					<PasswordForm
						onDone={navigateToNext}
						key="password_form"
					/>,
				]}
				index={showGenerationReportForm ? 1 : 0}
			/>
		)
	}

	return (
		<Paper>
			<Grid
				container
				spacing={4}
				padding={4}
				alignItems="center"
				justifyContent="center"
				flexDirection="column"
			>
				<Grid item>
					<Typography variant="h6" component="h1" align="center">
						Encryption already enabled
					</Typography>
				</Grid>
				<Grid item>
					<Typography variant="body1">
						You already have encryption enabled. Changing passwords
						is currently not supported.
					</Typography>
				</Grid>
			</Grid>
		</Paper>
	)
}
