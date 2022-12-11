import {useLocalStorage} from "react-use"
import {useCallback, useMemo} from "react"

import {decryptString, encryptString} from "~/utils"

export interface UseMasterPasswordResult {
	encryptUsingMasterPassword: (content: string) => string
	decryptUsingMasterPassword: (content: string) => string

	setDecryptionPassword: (password: string) => void
	logout: () => void
	// Use this cautiously
	_masterPassword: string
}

export default function useMasterPassword(
	encryptedPassword: string | null,
): UseMasterPasswordResult {
	const [decryptionPassword, setDecryptionPassword] = useLocalStorage<string | null>(
		"_global-context-auth-decryption-password",
		null,
	)

	const masterPassword = useMemo<string | null>(() => {
		if (decryptionPassword === null || !encryptedPassword) {
			return null
		}

		return decryptString(encryptedPassword, decryptionPassword!)
	}, [decryptionPassword, encryptedPassword])

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

	const logout = useCallback(() => {
		setDecryptionPassword(null)
	}, [])

	return {
		encryptUsingMasterPassword,
		decryptUsingMasterPassword,
		setDecryptionPassword,
		logout,
		_masterPassword: masterPassword!,
	}
}
