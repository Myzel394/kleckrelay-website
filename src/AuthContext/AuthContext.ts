import {createContext} from "react"

import {User} from "~/server-types"

interface AuthContextTypeBase {
	user: User | null
	isAuthenticated: boolean
	login: (user: User, callback: () => void) => Promise<void>
	logout: () => void
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
})

export default AuthContext
