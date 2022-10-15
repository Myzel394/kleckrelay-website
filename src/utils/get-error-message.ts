import {AxiosError} from "axios"

import {FastAPIError} from "~/utils/parse-fastapi-error"

export default function getErrorMessage(
	error: AxiosError<FastAPIError>,
): string {
	if (typeof error.response?.data?.detail === "string") {
		return error.response.data.detail
	}

	return "There was an error."
}
