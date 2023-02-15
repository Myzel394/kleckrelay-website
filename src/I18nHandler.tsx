import * as yup from "yup"
import {useTranslation} from "react-i18next"
import {useEffect} from "react"
import {de} from "yup-locales"
import en from "yup/lib/locale"

const YUP_LOCALE_LANGUAGE_MAP: Record<string, unknown> = {
	"en-US": en,
	"de-DE": de,
}

export default function I18nHandler(): null {
	const {i18n} = useTranslation()

	useEffect(() => {
		i18n.on("languageChanged", newLanguage => {
			// Update yup locale
			const yupLocale = YUP_LOCALE_LANGUAGE_MAP[newLanguage]

			if (yupLocale) {
				yup.setLocale(yupLocale)
			}
		})
	}, [i18n])

	return null
}
