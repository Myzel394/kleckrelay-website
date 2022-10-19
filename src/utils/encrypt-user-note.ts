import * as yup from "yup"

import {Theme, UserNote} from "~/server-types"

import decryptString from "./decrypt-string"
import encryptString from "./encrypt-string"

export const USER_NOTE_SCHEMA = yup.object().shape({
	privateKey: yup.string().required(),
	theme: yup.string().oneOf(Object.values(Theme)).required(),
})

export function decryptUserNote(
	encryptedUserNote: string,
	password: string,
): UserNote {
	const data = decryptString(encryptedUserNote, password)
	const userNote = JSON.parse(data)

	USER_NOTE_SCHEMA.validateSync(userNote)

	return userNote
}

export function encryptUserNote(userNote: UserNote, password: string): string {
	const data = JSON.stringify({
		...userNote,
		encryptionDate: new Date(),
	})

	return encryptString(data, password)
}
