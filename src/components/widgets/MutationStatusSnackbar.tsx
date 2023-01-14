import {AxiosError} from "axios"
import {ReactElement, useEffect, useLayoutEffect, useRef, useState} from "react"
import {useTranslation} from "react-i18next"

import {UseMutationResult} from "@tanstack/react-query"
import {Alert, AlertProps, Snackbar} from "@mui/material"

import {FastAPIError} from "~/utils"
import {SimpleDetailResponse} from "~/server-types"

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
	TData extends SimpleDetailResponse = SimpleDetailResponse,
	TError extends AxiosError = AxiosError<FastAPIError>,
	TVariables = unknown,
	TContext = unknown,
>({
	mutation,
	successMessage,
	errorMessage,
}: MutationStatusSnackbarProps<TData, TError, TVariables, TContext>): ReactElement {
	const {t} = useTranslation()

	const $severity = useRef<AlertProps["severity"]>()
	const $message = useRef<string>()

	const [open, setOpen] = useState<boolean>(false)

	useLayoutEffect(() => {
		setOpen(false)
	}, [mutation.isSuccess, mutation.isError])

	useEffect(() => {
		if (mutation.isSuccess || mutation.isError) {
			setOpen(true)

			$severity.current = (() => {
				if (mutation.isError) {
					return "error"
				}

				if (mutation.isSuccess) {
					return "success"
				}
			})()
			$message.current = (() => {
				if (mutation.isError) {
					// @ts-ignore
					return (
						errorMessage ||
						(mutation.error.response?.data as any).detail ||
						t("general.defaultError")
					)
				}

				if (mutation.isSuccess) {
					return successMessage ?? mutation.data?.detail ?? t("general.defaultSuccess")
				}
			})()
		}
	}, [mutation.isSuccess, mutation.isError])

	return (
		<Snackbar open={open} onClose={() => setOpen(false)} autoHideDuration={5000}>
			<Alert severity={$severity.current} variant="filled">
				{$message.current}
			</Alert>
		</Snackbar>
	)
}
