import {Dispatch, SetStateAction, useMemo, useRef} from "react"
import {useUpdateEffect} from "react-use"

import {ServerUser, User} from "~/server-types"
import {AuthContextType, EncryptionStatus} from "~/components"

export type UseContextValueData = Pick<
	AuthContextType,
	| "user"
	| "logout"
	| "_encryptUsingMasterPassword"
	| "_decryptUsingMasterPassword"
	| "_decryptUsingPrivateKey"
> & {
	decryptionPasswordHash: string
	setEncryptionPassword: Dispatch<SetStateAction<string | null>>
	login: (user: User | ServerUser) => void
}

export default function useContextValue({
	user,
	login,
	logout,
	setEncryptionPassword,
	_encryptUsingMasterPassword,
	_decryptUsingMasterPassword,
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
			_setEncryptionPassword: setEncryptionPassword,
			_encryptUsingMasterPassword,
			_decryptUsingMasterPassword,
			_decryptUsingPrivateKey,
		}),
		[
			user,
			login,
			logout,
			setEncryptionPassword,
			_encryptUsingMasterPassword,
			_decryptUsingMasterPassword,
			_decryptUsingPrivateKey,
		],
	)
}
