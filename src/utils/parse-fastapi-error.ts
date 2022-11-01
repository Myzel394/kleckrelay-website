import {AxiosError} from "axios"
import {FormikErrors} from "formik"
import {SimpleDetailResponse} from "~/server-types"

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
): FormikErrors<SimpleDetailResponse> {
	if (rawError.isAxiosError) {
		const error = rawError.response?.data as FastAPIError

		if (typeof error === "undefined") {
			return {
				detail: undefined,
			}
		}

		if (typeof error.detail === "string") {
			return {detail: error.detail}
		}

		return error.detail.reduce((acc, error) => {
			const [location, field] = error.loc

			if (location === "body") {
				acc[field] = error.msg
			}

			return acc
		}, {} as Record<string, string>)
	}

	return {detail: rawError.message}
}
