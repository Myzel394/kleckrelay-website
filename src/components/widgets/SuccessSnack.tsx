import React, {ReactElement, useEffect, useState} from "react"

import {usePrevious} from "@react-hookz/web"
import {Alert, Snackbar} from "@mui/material"

export interface SuccessSnackProps {
	message?: string | null | boolean
	onClose?: () => void
}

export default function SuccessSnack({message, onClose}: SuccessSnackProps): ReactElement {
	const previousMessage = usePrevious(message)
	const [open, setOpen] = useState<boolean>(true)

	useEffect(() => {
		setOpen(false)
		setOpen(Boolean(message))
	}, [message])

	return (
		<Snackbar
			open={open}
			autoHideDuration={2000}
			onClose={() => {
				setOpen(false)
				onClose?.()
			}}
		>
			<Alert severity="success" variant="filled">
				{message || previousMessage}
			</Alert>
		</Snackbar>
	)
}
