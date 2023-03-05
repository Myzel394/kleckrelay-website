import {AxiosError} from "axios"
import {useRef} from "react"
import {SnackbarKey, useSnackbar} from "notistack"
import {useTranslation} from "react-i18next"

import {ERROR_SNACKBAR_SHOW_DURATION, SUCCESS_SNACKBAR_SHOW_DURATION} from "~/constants/values"
import {parseFastAPIError} from "~/utils"

export interface UseErrorSuccessSnacksResult {
	showSuccess: (message: string) => void
	showError: (error: Error | string) => void
}

export default function useErrorSuccessSnacks(): UseErrorSuccessSnacksResult {
	const {t} = useTranslation("common")
	const {enqueueSnackbar, closeSnackbar} = useSnackbar()
	const $errorSnackbarKey = useRef<SnackbarKey | null>(null)

	const showSuccess = (message: string) => {
		if ($errorSnackbarKey.current) {
			closeSnackbar($errorSnackbarKey.current)
			$errorSnackbarKey.current = null
		}

		enqueueSnackbar(message, {
			variant: "success",
			autoHideDuration: SUCCESS_SNACKBAR_SHOW_DURATION,
		})
	}
	const showError = (error: Error | string) => {
		let message: string | undefined

		if (typeof error === "string") {
			message = error
		} else {
			try {
				const parsedError = parseFastAPIError(error as AxiosError)

				message = parsedError.detail
			} catch (e) {}
		}

		$errorSnackbarKey.current = enqueueSnackbar(message || t("messages.errors.unknown"), {
			variant: "error",
			autoHideDuration: ERROR_SNACKBAR_SHOW_DURATION,
		})
	}

	return {
		showSuccess,
		showError,
	}
}
