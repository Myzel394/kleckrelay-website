import React, {ReactElement, useEffect, useState} from "react"

import {Alert, Snackbar} from "@mui/material"

export interface ErrorSnackProps {
	message?: string | null | false
}

export default function ErrorSnack({message}: ErrorSnackProps): ReactElement {
	const [open, setOpen] = useState<boolean>(true)

	useEffect(() => {
		setOpen(false)
		setOpen(Boolean(message))
	}, [message])

	return (
		<Snackbar
			open={open}
			autoHideDuration={5000}
			onClose={() => setOpen(false)}
		>
			<Alert severity="error" variant="filled">
				{message}
			</Alert>
		</Snackbar>
	)
}
