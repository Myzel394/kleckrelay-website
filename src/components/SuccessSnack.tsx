import React, {ReactElement, useEffect, useState} from "react"

import {Alert, Snackbar} from "@mui/material"

export interface SuccessSnackProps {
	message?: string | null | boolean
}

export default function SuccessSnack({
	message,
}: SuccessSnackProps): ReactElement {
	const [open, setOpen] = useState<boolean>(true)

	useEffect(() => {
		setOpen(false)
		setOpen(Boolean(message))
	}, [message])

	return (
		<Snackbar
			open={open}
			autoHideDuration={2000}
			onClose={() => setOpen(false)}
		>
			<Alert severity="success" variant="filled">
				{message}
			</Alert>
		</Snackbar>
	)
}
