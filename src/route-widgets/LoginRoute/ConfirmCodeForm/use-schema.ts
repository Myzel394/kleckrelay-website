import * as yup from "yup"
import {useLoaderData} from "react-router-dom"

import {ServerSettings} from "~/server-types"

export default function useSchema(): yup.ObjectSchema<any> {
	const settings = useLoaderData() as ServerSettings

	return yup.object().shape({
		code: yup
			.string()
			.required()
			.min(settings.emailLoginTokenLength)
			.max(settings.emailLoginTokenLength)
			.test("chars", "This code is not valid.", code => {
				if (!code) {
					return false
				}

				const chars = settings.emailLoginTokenChars.split("")

				return code.split("").every(char => chars.includes(char))
			}),
	})
}
