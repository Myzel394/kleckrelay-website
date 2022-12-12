import {useLocalStorage} from "react-use"
import {useCallback, useMemo} from "react"
import {decrypt, readMessage, readPrivateKey} from "openpgp";

import {decryptString, encryptString} from "~/utils"
import {ServerUser, User} from "~/server-types";

export interface UseMasterPasswordResult {
	encryptUsingMasterPassword: (content: string) => string
	decryptUsingMasterPassword: (content: string) => string
	decryptUsingPrivateKey: (message: string) => Promise<string>

	setDecryptionPassword: (password: string) => void
	logout: () => void
	// Use this cautiously
	_masterPassword: string
}

export default function useMasterPassword(
	user: User | ServerUser | null,
): UseMasterPasswordResult {
	const [decryptionPassword, setDecryptionPassword] = useLocalStorage<string | null>(
		"_global-context-auth-decryption-password",
		null,
	)

	const masterPassword = useMemo<string | null>(() => {
		if (decryptionPassword === null || !user?.encryptedPassword) {
			return null
		}

		return decryptString(user.encryptedPassword, decryptionPassword!)
	}, [decryptionPassword, user?.encryptedPassword])

	const encryptUsingMasterPassword = useCallback(
		(content: string) => {
			if (!masterPassword) {
				throw new Error("Master password not set.")
			}

			return encryptString(content, masterPassword)
		},
		[masterPassword],
	)

	const decryptUsingMasterPassword = useCallback(
		(content: string) => {
			if (!masterPassword) {
				throw new Error("Master password not set.")
			}

			return decryptString(content, masterPassword)
		},
		[masterPassword],
	)

	const decryptUsingPrivateKey = useCallback(
		async (message: string): Promise<string> => {
			if (!user) {
				throw new Error("User not set.")
			}

			if (!user.isDecrypted) {
				throw new Error("User is not decrypted.")
			}

			return (
				await decrypt({
					message: await readMessage({
						armoredMessage: message,
					}),
					decryptionKeys: await readPrivateKey({
						armoredKey: user.notes.privateKey,
					}),
				})
			).data.toString()
		},
		[user],
	)

	const logout = useCallback(() => {
		setDecryptionPassword(null)
	}, [])

	return {
		encryptUsingMasterPassword,
		decryptUsingMasterPassword,
		decryptUsingPrivateKey,
		setDecryptionPassword,
		logout,
		_masterPassword: masterPassword!,
	}
}
