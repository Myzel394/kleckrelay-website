import React, {ReactElement} from "react"

import {Alert, Button, Grid} from "@mui/material"

export interface ErrorLoadingDataMessageProps {
	message: string
	onRetry: () => void
}

export default function ErrorLoadingDataMessage({
	message,
	onRetry,
}: ErrorLoadingDataMessageProps): ReactElement {
	return (
		<Grid container spacing={2} flexDirection="column" alignItems="center">
			<Grid item>
				<Alert severity="error">{message}</Alert>
			</Grid>
			<Grid item>
				<Button onClick={onRetry}>Try Again</Button>
			</Grid>
		</Grid>
	)
}
