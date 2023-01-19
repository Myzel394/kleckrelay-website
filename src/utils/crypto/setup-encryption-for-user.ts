import {ServerSettings, ServerUser, Theme, User, UserNote} from "~/server-types"
import {encryptUserNote} from "~/utils/encrypt-user-note"

import encryptString from "./encrypt-string"
import generateEncryptionPassword from "./generate-encryption-password"
import generateKeys from "./generate-keys"
import getEncryptionPassword from "./get-encryption-password"
import getUserSalt from "./get-user-salt"

export interface SetupEncryptionForUserData {
	password: string
	user: ServerUser | User
	serverSettings: ServerSettings
	theme: Theme
}

export interface SetupEncryptionForUserResult {
	encryptedPassword: string
	encryptedNotes: string
	encryptionPassword: string
	publicKey: string
}

export default async function setupEncryptionForUser({
	user,
	serverSettings,
	password,
	theme,
}: SetupEncryptionForUserData): Promise<SetupEncryptionForUserResult> {
	const keyPair = await generateKeys()
	const masterPassword = generateEncryptionPassword()

	const salt = getUserSalt(user, serverSettings)
	const encryptionKey = await getEncryptionPassword(user.email.address, password, salt)

	const encryptedMasterPassword = encryptString(masterPassword, encryptionKey)

	const note: UserNote = {
		theme,
		privateKey: keyPair.privateKey,
	}
	const encryptedNotes = encryptUserNote(note, masterPassword)

	return {
		encryptedPassword: encryptedMasterPassword,
		encryptedNotes,
		encryptionPassword: masterPassword,
		publicKey: keyPair.publicKey,
	}
}
