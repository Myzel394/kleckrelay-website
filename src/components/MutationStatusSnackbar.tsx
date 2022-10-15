import {AxiosError} from "axios"
import {ReactElement, useEffect, useState} from "react"

import {UseMutationResult} from "@tanstack/react-query"
import {Alert, Snackbar} from "@mui/material"

import {FastAPIError} from "~/utils"
import getErrorMessage from "~/utils/get-error-message"

export interface MutationStatusSnackbarProps<
	TData = unknown,
	TError = unknown,
	TVariables = unknown,
	TContext = unknown,
> {
	mutation: UseMutationResult<TData, TError, TVariables, TContext>

	successMessage?: string
	errorMessage?: string
}

export default function MutationStatusSnackbar<
	TData extends {data: {detail?: string}} = {data: {detail?: string}},
	TError extends AxiosError = AxiosError<FastAPIError>,
	TVariables = unknown,
	TContext = unknown,
>({
	mutation,
	successMessage,
	errorMessage,
}: MutationStatusSnackbarProps<
	TData,
	TError,
	TVariables,
	TContext
>): ReactElement {
	const [open, setOpen] = useState<boolean>(false)

	const severity = (() => {
		if (mutation.isError) {
			return "error"
		}

		if (mutation.isSuccess) {
			return "success"
		}

		return "info"
	})()
	const message = (() => {
		if (mutation.isError) {
			// @ts-ignore
			return errorMessage ?? getErrorMessage(mutation.error)
		}

		if (mutation.isSuccess) {
			return successMessage ?? mutation.data?.data?.detail ?? "Success!"
		}
	})()

	useEffect(() => {
		if (mutation.isSuccess || mutation.isError) {
			setOpen(true)
		}
	}, [mutation.isSuccess, mutation.isError])

	return (
		<Snackbar
			open={open}
			onClose={() => setOpen(false)}
			autoHideDuration={5000}
		>
			<Alert severity={severity} variant="filled">
				{message}
			</Alert>
		</Snackbar>
	)
}
