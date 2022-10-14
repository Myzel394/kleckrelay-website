import React, {ReactElement} from "react"

import {Grid, Typography} from "@mui/material"

import {MultiStepFormElement, OpenMailButton} from "~/components"

export interface YouGotMailProps {
	domain: string
}

export default function YouGotMail({domain}: YouGotMailProps): ReactElement {
	return (
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
						We sent you an email with a link to confirm your email
						address. Please check your inbox and click on the link
						to continue.
					</Typography>
				</Grid>
				<Grid item>
					<OpenMailButton domain={domain} />
				</Grid>
			</Grid>
		</MultiStepFormElement>
	)
}
