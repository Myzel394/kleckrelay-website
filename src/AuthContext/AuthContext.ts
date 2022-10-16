import {createContext} from "react"

import {User} from "~/server-types"

interface AuthContextTypeBase {
	user: User | null
	isAuthenticated: boolean
	login: (user: User, callback: () => void) => Promise<void>
	logout: () => void
	_decryptContent: (content: string) => string
	_encryptContent: (content: string) => string
	_setMasterPassword: (masterPassword: string) => void
}

interface AuthContextTypeAuthenticated {
	user: User
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
	_setMasterPassword: () => {
		throw new Error("_setMasterPassword() not implemented")
	},
})

export default AuthContext
