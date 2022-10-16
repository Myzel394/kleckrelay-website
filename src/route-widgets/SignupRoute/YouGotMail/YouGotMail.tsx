import {MdCancel, MdEdit} from "react-icons/md"
import React, {ReactElement, useState} from "react"

import {
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

export default function YouGotMail({
	email,
	onGoBack,
}: YouGotMailProps): ReactElement {
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
							You got mail!
						</Typography>
					</Grid>
					<Grid item>
						<Typography variant="subtitle1" component="p">
							We sent you an email with a link to confirm your
							email address. Please check your inbox and click on
							the link to continue.
						</Typography>
					</Grid>
					<Grid item>
						<Grid
							container
							alignItems="center"
							direction="row"
							spacing={2}
						>
							<Grid item>
								<code>{email}</code>
							</Grid>
							<Grid item>
								<IconButton
									onClick={() => setAskToEditEmail(true)}
								>
									<MdEdit />
								</IconButton>
							</Grid>
						</Grid>
					</Grid>
					<Grid item>
						<OpenMailButton domain={domain} />
					</Grid>
					<Grid item>
						<ResendMailButton email={email} />
					</Grid>
				</Grid>
			</MultiStepFormElement>
			<Dialog open={askToEditEmail}>
				<DialogTitle>Edit email address?</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Would you like to return to the previous step and edit
						your email address?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						startIcon={<MdCancel />}
						onClick={() => setAskToEditEmail(false)}
					>
						Cancel
					</Button>
					<Button onClick={onGoBack}>Yes, edit email</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}
