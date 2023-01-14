import {ServerSettings, ServerUser, User} from "~/server-types"

import decryptString from "./decrypt-string"
import getEncryptionPassword from "./get-encryption-password"
import getUserSalt from "./get-user-salt"

export default async function getMasterPassword(
	user: User | ServerUser,
	serverSettings: ServerSettings,
	password: string,
): Promise<string> {
	const salt = getUserSalt(user, serverSettings)
	const encryptionKey = await getEncryptionPassword(user.email.address, password, salt)

	return decryptString(user.encryptedPassword, encryptionKey)
}
