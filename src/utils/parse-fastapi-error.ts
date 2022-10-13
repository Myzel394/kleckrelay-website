import {AxiosError} from "axios"
import {FormikErrors} from "formik"

export interface FastAPIError {
	detail:
		| string
		| {
				loc: ["body" | "path", string]
				msg: string
				type: string
		  }[]
}

export default function parseFastAPIError(
	rawError: AxiosError,
): FormikErrors<any> {
	if (rawError.isAxiosError) {
		const fastAPIError = rawError.response?.data as FastAPIError

		if (typeof fastAPIError.detail === "string") {
			return {detail: fastAPIError.detail}
		}

		return fastAPIError.detail.reduce((acc, error) => {
			const [location, field] = error.loc

			if (location === "body") {
				acc[field] = error.msg
			}

			return acc
		}, {} as Record<string, string>)
	}

	return {detail: rawError.message}
}
