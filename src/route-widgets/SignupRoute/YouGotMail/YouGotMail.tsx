import {MdCancel, MdEdit} from "react-icons/md"
import {useTranslation} from "react-i18next"
import React, {ReactElement, useState} from "react"

import {
	Alert,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Grid,
	IconButton,
	Typography,
} from "@mui/material"

import {MultiStepFormElement, OpenMailButton} from "~/components"
import ResendMailButton from "~/route-widgets/SignupRoute/YouGotMail/ResendMailButton"

export interface YouGotMailProps {
	email: string
	onGoBack: () => void
}

export default function YouGotMail({email, onGoBack}: YouGotMailProps): ReactElement {
	const {t} = useTranslation(["signup", "common"])

	const [askToEditEmail, setAskToEditEmail] = useState<boolean>(false)

	const domain = email.split("@")[1]

	return (
		<>
			<MultiStepFormElement>
				<Grid
					container
					direction="column"
					spacing={4}
					paddingX={2}
					paddingY={4}
					alignItems="center"
					justifyContent="center"
				>
					<Grid item>
						<Typography variant="h6" component="h2" align="center">
							{t("forms.mailVerification.title")}
						</Typography>
					</Grid>
					<Grid item>
						<Typography variant="subtitle1" component="p">
							{t("forms.mailVerification.description")}
						</Typography>
					</Grid>
					<Grid item>
						<Alert severity="info">{t("forms.mailVerification.markAsNotSpam")}</Alert>
					</Grid>
					<Grid item>
						<Grid container alignItems="center" direction="row" spacing={2}>
							<Grid item>
								<code>{email}</code>
							</Grid>
							<Grid item>
								<IconButton onClick={() => setAskToEditEmail(true)}>
									<MdEdit />
								</IconButton>
							</Grid>
						</Grid>
					</Grid>
					<Grid item>
						<OpenMailButton domain={domain} />
					</Grid>
					<Grid item>
						<ResendMailButton email={email} onEmailAlreadyVerified={onGoBack} />
					</Grid>
				</Grid>
			</MultiStepFormElement>
			<Dialog open={askToEditEmail}>
				<DialogTitle>{t("forms.mailVerification.editEmail.title")}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{t("forms.mailVerification.editEmail.description")}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button startIcon={<MdCancel />} onClick={() => setAskToEditEmail(false)}>
						{t("general.cancelLabel", {ns: "common"})}
					</Button>
					<Button onClick={onGoBack}>
						{t("forms.mailVerification.editEmail.continueActionLabel")}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}
