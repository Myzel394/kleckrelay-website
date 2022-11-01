import {usePrevious} from "react-use"
import React, {ReactElement, useEffect, useState} from "react"

import {Alert, Snackbar} from "@mui/material"

export interface ErrorSnackProps {
	message?: string | null | false
	onClose?: () => void
}

export default function ErrorSnack({message, onClose}: ErrorSnackProps): ReactElement {
	const previousMessage = usePrevious(message)
	const [open, setOpen] = useState<boolean>(true)

	useEffect(() => {
		setOpen(false)
		setOpen(Boolean(message))
	}, [message])

	return (
		<Snackbar
			open={open}
			autoHideDuration={5000}
			onClose={() => {
				setOpen(false)
				onClose?.()
			}}
		>
			<Alert severity="error" variant="filled">
				{message || previousMessage}
			</Alert>
		</Snackbar>
	)
}
