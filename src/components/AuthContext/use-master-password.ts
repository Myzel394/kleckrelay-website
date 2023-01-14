import {useLocalStorage} from "react-use"
import {Dispatch, SetStateAction, useCallback} from "react"
import {decrypt, readMessage, readPrivateKey} from "openpgp"
import fastHashCode from "fast-hash-code"

import {decryptString, encryptString} from "~/utils"
import {ServerUser, User} from "~/server-types"

export interface UseMasterPasswordResult {
	encryptUsingMasterPassword: (content: string) => string
	decryptUsingMasterPassword: (content: string) => string
	decryptUsingPrivateKey: (message: string) => Promise<string>

	setEncryptionPassword: Dispatch<SetStateAction<string | null>>
	logout: () => void
	decryptionPasswordHash: string
	// Use this cautiously
	_encryptionPassword: string
}

export default function useMasterPassword(user: User | ServerUser | null): UseMasterPasswordResult {
	const [encryptionPassword, setEncryptionPassword] = useLocalStorage<string | null>(
		"_global-context-auth-encryption-password",
		null,
	)

	const encryptUsingMasterPassword = useCallback(
		(content: string) => {
			if (!encryptionPassword) {
				throw new Error("Master password not set.")
			}

			return encryptString(content, encryptionPassword)
		},
		[encryptionPassword],
	)

	const decryptUsingMasterPassword = useCallback(
		(content: string) => {
			if (!encryptionPassword) {
				throw new Error("Master password not set.")
			}

			return decryptString(content, encryptionPassword)
		},
		[encryptionPassword],
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
		setEncryptionPassword(null)
	}, [])

	return {
		encryptUsingMasterPassword,
		decryptUsingMasterPassword,
		decryptUsingPrivateKey,
		logout,
		setEncryptionPassword,
		_encryptionPassword: encryptionPassword!,
		decryptionPasswordHash: fastHashCode(encryptionPassword || "").toString(),
	}
}
