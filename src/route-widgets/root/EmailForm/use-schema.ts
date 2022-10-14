import * as yup from "yup"
import {checkIsDomainDisposable} from "~/apis"
import {ServerSettings} from "~/types";

export interface Form {
	email: string
	detail?: string
}

export default function useSchema(
	serverSettings: ServerSettings,
): yup.BaseSchema {
	return yup.object().shape({
		email: yup
			.string()
			.email()
			.required()
			.test(
				"notDisposable",
				"Disposable email addresses are not allowed",
				async (value, context) => {
					if (serverSettings.disposable_emails_enabled) {
						return true
					}

					try {
						await yup.string().email().validate(value, {
							strict: true,
						})
						const isDisposable = await checkIsDomainDisposable(
							value!.split("@")[1],
						)

						return !isDisposable
					} catch ({message}) {
						// @ts-ignore
						context.createError({message})
						return false
					}
				},
			),
	})
}
