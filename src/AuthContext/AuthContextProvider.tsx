import {ReactElement, ReactNode, useCallback, useMemo} from "react"
import {AxiosError} from "axios"
import {useLocalStorage} from "react-use"

import {useMutation} from "@tanstack/react-query"

import {User} from "~/server-types"
import {RefreshTokenResult, logout as logoutUser, refreshToken} from "~/apis"

import AuthContext, {AuthContextType} from "./AuthContext"

export interface AuthContextProviderProps {
	children: ReactNode
}

export default function AuthContextProvider({
	children,
}: AuthContextProviderProps): ReactElement {
	const [user, setUser] = useLocalStorage<User | null>(
		"_global-context-auth-user",
		null,
	)

	const logout = useCallback(async (forceLogout = true) => {
		setUser(null)

		if (forceLogout) {
			await logoutUser()
		}
	}, [])

	const login = useCallback(async (user: User) => {
		setUser(user)
	}, [])

	const {mutateAsync: refresh} = useMutation<
		RefreshTokenResult,
		AxiosError,
		void
	>(refreshToken, {
		onError: () => logout(false),
	})

	const value = useMemo<AuthContextType>(
		() => ({
			user: user ?? null,
			login,
			logout,
			isAuthenticated: user !== null,
		}),
		[refresh, login, logout],
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
