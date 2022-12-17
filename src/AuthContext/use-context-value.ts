import {useMemo, useRef} from "react"
import {useUpdateEffect} from "react-use"

import {AuthContextType, EncryptionStatus} from "~/AuthContext/AuthContext"
import {ServerUser, User} from "~/server-types"

export type UseContextValueData = Pick<
	AuthContextType,
	| "user"
	| "logout"
	| "_encryptUsingMasterPassword"
	| "_decryptUsingMasterPassword"
	| "_decryptUsingPrivateKey"
> & {
	decryptionPasswordHash: string
	_setDecryptionPassword: (password: string) => boolean
	login: (user: User | ServerUser) => void
}

export default function useContextValue({
	user,
	login,
	logout,
	_encryptUsingMasterPassword,
	_decryptUsingMasterPassword,
	_setDecryptionPassword,
	_decryptUsingPrivateKey,
	decryptionPasswordHash,
}: UseContextValueData): AuthContextType {
	const $decryptionPasswordChangeCallback = useRef<(() => void) | null>(null)
	const $userChangeCallback = useRef<(() => void) | null>(null)

	useUpdateEffect(() => {
		$decryptionPasswordChangeCallback.current?.()
	}, [decryptionPasswordHash, user])

	return useMemo(
		() => ({
			user,
			login: (user, callback) => {
				if (callback) {
					$userChangeCallback.current = callback
				}

				return login(user)
			},
			logout,
			isAuthenticated: Boolean(user),
			encryptionStatus: (() => {
				if (!user) {
					return EncryptionStatus.Unavailable
				}

				if (!user.encryptedPassword) {
					return EncryptionStatus.Unavailable
				}

				if (user.isDecrypted) {
					return EncryptionStatus.Available
				}

				return EncryptionStatus.PasswordRequired
			})(),
			_updateUser: login,
			_setDecryptionPassword: (password, callback) => {
				if (callback) {
					$decryptionPasswordChangeCallback.current = callback
				}

				return _setDecryptionPassword(password)
			},
			_encryptUsingMasterPassword,
			_decryptUsingMasterPassword,
			_decryptUsingPrivateKey,
		}),
		[
			user,
			login,
			logout,
			_setDecryptionPassword,
			_encryptUsingMasterPassword,
			_decryptUsingMasterPassword,
			_decryptUsingPrivateKey,
		],
	)
}
