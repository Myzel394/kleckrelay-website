import {createContext} from "react"

import {ServerUser, User} from "~/server-types"

export enum EncryptionStatus {
	Unavailable = "Unavailable",
	PasswordRequired = "PasswordRequired",
	Available = "Available",
}

interface AuthContextTypeBase {
	user: ServerUser | User | null
	isAuthenticated: boolean
	login: (user: ServerUser | User) => void
	logout: () => void
	encryptionStatus: EncryptionStatus
	_decryptUsingMasterPassword: (content: string) => string
	_encryptUsingMasterPassword: (content: string) => string
	_decryptUsingPrivateKey: (message: string) => Promise<string>
	_setDecryptionPassword: (decryptionPassword: string) => boolean
	_updateUser: (user: ServerUser | User) => void
}

interface AuthContextTypeAuthenticated {
	user: ServerUser
	isAuthenticated: true
}

interface AuthContextTypeUnauthenticated {
	user: null
	isAuthenticated: false
}

export type AuthContextType =
	| AuthContextTypeBase
	| (AuthContextTypeAuthenticated & AuthContextTypeUnauthenticated)

const AuthContext = createContext<AuthContextType>({
	user: null,
	isAuthenticated: false,
	encryptionStatus: EncryptionStatus.Unavailable,
	login: () => {
		throw new Error("login() not implemented")
	},
	logout: () => {
		throw new Error("logout() not implemented")
	},
	_decryptUsingMasterPassword: () => {
		throw new Error("_decryptContent() not implemented")
	},
	_encryptUsingMasterPassword: () => {
		throw new Error("_encryptContent() not implemented")
	},
	_decryptUsingPrivateKey: () => {
		throw new Error("_decryptUsingPrivateKey() not implemented")
	},
	_setDecryptionPassword: () => {
		throw new Error("_setMasterDecryptionPassword() not implemented")
	},
	_updateUser: () => {
		throw new Error("_updateUser() not implemented")
	},
})

export default AuthContext
