import {AliasNote} from "~/server-types"

export const MASTER_PASSWORD_LENGTH = 4096
export const LOCAL_REGEX = /^[a-zA-Z0-9!#$%&‘*+–/=?^_`.{|}~-]{1,64}$/g
export const URL_REGEX =
	/((http[s]*:\/\/)?[a-z0-9-%\/\&=?\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?)/gi
export const DEFAULT_ALIAS_NOTE: AliasNote = {
	version: "1.0",
	data: {
		createdAt: null,
		personalNotes: "",
		websites: [],
	},
}
