import {initReactI18next} from "react-i18next"
import {de} from "yup-locales"
import {setLocale} from "yup"
// @ts-ignore
// eslint-disable-next-line ordered-imports/ordered-imports
import Cache from "i18next-localstorage-cache"
import HttpApi from "i18next-http-backend"
import LanguageDetector from "i18next-browser-languagedetector"
import i18n from "i18next"

import {isDev} from "~/constants/development"

i18n.use(HttpApi)
	.use(LanguageDetector)
	.use(Cache)
	.use(initReactI18next)
	.init({
		debug: isDev,
		fallbackLng: "en",
		load: "languageOnly",
		backend: {
			loadPath: "/locales/{{lng}}/{{ns}}.json",
		},

		interpolation: {
			escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
		},
	})

setLocale(de)
