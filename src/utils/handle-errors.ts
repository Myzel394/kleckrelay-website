import {FormikHelpers} from "formik"
import parseFastAPIError from "./parse-fastapi-error"
import {AxiosError} from "axios"

export default function handleErrors<T = any, Result = any, Values = any>(
	values: T,
	setErrors: FormikHelpers<Values>["setErrors"],
) {
	return async (callback: (values: T) => Promise<Result>) => {
		try {
			const result = await callback(values)
			return result
		} catch (error) {
			setErrors(parseFastAPIError(error as AxiosError))
		}
	}
}
