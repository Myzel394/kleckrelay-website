import {createContext} from "react"

import {ServerUser, User} from "~/server-types"

interface AuthContextTypeBase {
	user: ServerUser | User | null
	isAuthenticated: boolean
	login: (user: ServerUser) => Promise<void>
	logout: () => void
	_decryptContent: (content: string) => string
	_encryptContent: (content: string) => string
	_setDecryptionPassword: (decryptionPassword: string) => void
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
	login: () => {
		throw new Error("login() not implemented")
	},
	logout: () => {
		throw new Error("logout() not implemented")
	},
	_decryptContent: () => {
		throw new Error("_decryptContent() not implemented")
	},
	_encryptContent: () => {
		throw new Error("_encryptContent() not implemented")
	},
	_setDecryptionPassword: () => {
		throw new Error("_setMasterDecryptionPassword() not implemented")
	},
	_updateUser: () => {
		throw new Error("_updateUser() not implemented")
	},
})

export default AuthContext
