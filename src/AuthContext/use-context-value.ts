import {AuthContextType, EncryptionStatus} from "~/AuthContext/AuthContext"
import {ServerUser, User} from "~/server-types"

export interface UseContextValueData {
	user: User | ServerUser | null
	login: (user: User | ServerUser) => void
	logout: () => void
	encryptUsingMasterPassword: (content: string) => string
	decryptUsingMasterPassword: (content: string) => string
	decryptUsingPrivateKey: (message: string) => Promise<string>
	setDecryptionPassword: (password: string) => boolean
}

export default function useContextValue({
	user,
	login,
	logout,
	encryptUsingMasterPassword,
	decryptUsingMasterPassword,
	setDecryptionPassword,
	decryptUsingPrivateKey,
}: UseContextValueData): AuthContextType {
	return {
		user,
		login,
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
		_setDecryptionPassword: setDecryptionPassword,
		_encryptUsingMasterPassword: encryptUsingMasterPassword,
		_decryptUsingMasterPassword: decryptUsingMasterPassword,
		_decryptUsingPrivateKey: decryptUsingPrivateKey,
	}
}
