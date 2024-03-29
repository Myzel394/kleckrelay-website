import {APIKeyScope, AliasNote} from "~/server-types"

export const LOCAL_REGEX = /^[a-zA-Z0-9!#$%&‘*+–/=?^_`.{|}~-]{1,64}$/g
export const URL_REGEX =
	/((http[s]*:\/\/)?[a-z0-9-%\/\&=?\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?)/gi
export const DEFAULT_ALIAS_NOTE: AliasNote = {
	version: "1.0",
	data: {
		createdOn: "/aliases",
		createdAt: null,
		creationContext: "web",
		personalNotes: "",
		websites: [],
	},
}
export const ERROR_SNACKBAR_SHOW_DURATION = 5000
export const SUCCESS_SNACKBAR_SHOW_DURATION = 2000
export const AUTHENTICATION_PATHS = ["/auth/login", "/auth/signup", "/auth/complete-account"]
export const API_KEY_SCOPES: APIKeyScope[] = [
	"read:profile",
	"update:profile",

	"read:preferences",
	"update:preferences",

	"read:alias",
	"create:alias",
	"update:alias",
	"delete:alias",

	"read:report",
	"delete:report",
]
export const ADMIN_API_KEY_SCOPES: APIKeyScope[] = [
	"read:admin_cron_report",
	"read:admin_settings",
	"update:admin_settings",

	"read:admin_reserved_alias",
	"create:admin_reserved_alias",
	"update:admin_reserved_alias",
	"delete:admin_reserved_alias",
]
