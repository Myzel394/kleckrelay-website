import {ReactElement, ReactNode, useCallback, useEffect, useMemo} from "react"
import {useLocalStorage} from "react-use"
import {AxiosError} from "axios"

import {useMutation} from "@tanstack/react-query"

import {ServerUser, User} from "~/server-types"
import {
	REFRESH_TOKEN_URL,
	RefreshTokenResult,
	logout as logoutUser,
	refreshToken,
} from "~/apis"
import {client} from "~/constants/axios-client"
import {decryptString, encryptString} from "~/utils"

import AuthContext, {AuthContextType} from "./AuthContext"

export interface AuthContextProviderProps {
	children: ReactNode
}

export default function AuthContextProvider({
	children,
}: AuthContextProviderProps): ReactElement {
	const [decryptionPassword, setDecryptionPassword] = useLocalStorage<
		string | null
	>("_global-context-auth-decryption-password", null)
	const [user, setUser] = useLocalStorage<ServerUser | User | null>(
		"_global-context-auth-user",
		null,
	)
	const masterPassword = useMemo<string | null>(() => {
		if (decryptionPassword === null || !user?.encryptedPassword) {
			return null
		}

		return decryptString(user!.encryptedPassword, decryptionPassword!)
	}, [user?.encryptedPassword, decryptionPassword])

	const logout = useCallback(async (forceLogout = true) => {
		setUser(null)

		if (forceLogout) {
			await logoutUser()
		}
	}, [])

	const encryptContent = useCallback(
		(content: string) => {
			if (!masterPassword) {
				throw new Error("Master password not set.")
			}

			return encryptString(content, masterPassword)
		},
		[masterPassword],
	)

	const decryptContent = useCallback(
		(content: string) => {
			if (!masterPassword) {
				throw new Error("Master password not set.")
			}

			return decryptString(content, masterPassword)
		},
		[masterPassword],
	)

	const login = useCallback(
		async (user: ServerUser, callback?: () => void) => {
			if (masterPassword !== null && user.encryptedNotes) {
				const note = JSON.parse(decryptContent(user.encryptedNotes))

				const newUser: User = {
					...user,
					notes: note,
					isDecrypted: true,
				}

				setUser(newUser)
			} else {
				setUser(user)
			}

			callback?.()
		},
		[masterPassword, decryptContent],
	)

	const updateUser = useCallback(
		async (newUser: ServerUser | User) => {
			if (user === null) {
				throw new Error("Can't update user when user is null.")
			}

			setUser(newUser)
		},
		[user],
	)

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
			_encryptContent: encryptContent,
			_decryptContent: decryptContent,
			_setDecryptionPassword: setDecryptionPassword,
			_updateUser: updateUser,
		}),
		[refresh, login, logout],
	)

	useEffect(() => {
		const interceptor = client.interceptors.response.use(
			response => response,
			async (error: AxiosError) => {
				if (error.isAxiosError) {
					if (error.response?.status === 401) {
						// Check if error comes from refreshing the token.
						// If yes, the user has been logged out completely.
						const request: XMLHttpRequest = error.request

						if (request.responseURL === REFRESH_TOKEN_URL) {
							await logout(false)
						} else {
							await refresh()
						}
					}
				}

				throw error
			},
		)

		return () => client.interceptors.response.eject(interceptor)
	}, [logout, refresh])

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
