import {ReactElement, useContext, useState} from "react"
import {useTranslation} from "react-i18next"

import {Grid, Paper, Typography} from "@mui/material"

import {AuthContext, EncryptionStatus, MultiStepForm} from "~/components"
import {useNavigateToNext} from "~/hooks"
import GenerateEmailReportsForm from "~/route-widgets/CompleteAccountRoute/GenerateEmailReportsForm"
import PasswordForm from "~/route-widgets/CompleteAccountRoute/PasswordForm"

export default function CompleteAccountRoute(): ReactElement {
	const {t} = useTranslation("complete-account")
	const {encryptionStatus} = useContext(AuthContext)
	const navigateToNext = useNavigateToNext()

	// If query `setup` is `true`, skip directly to the setup
	const [showGenerationReportForm, setShowGenerationReportForm] = useState(() => {
		const searchParams = new URLSearchParams(location.search)
		return searchParams.get("setup") === "true"
	})

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
						onDone={() => setTimeout(navigateToNext, 0)}
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
						{t("alreadyCompleted.title")}
					</Typography>
				</Grid>
				<Grid item>
					<Typography variant="body1">{t("alreadyCompleted.description")}</Typography>
				</Grid>
			</Grid>
		</Paper>
	)
}
