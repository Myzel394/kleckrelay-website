import {ReactElement, ReactNode, useCallback, useEffect} from "react"
import {AxiosError} from "axios"
import {decrypt, readMessage, readPrivateKey} from "openpgp"

import {useLocalStorage} from "react-use"
import AuthContext from "./AuthContext"
import useExtensionHandler from "~/AuthContext/use-extension-handler"
import useMasterPassword from "~/AuthContext/use-master-password"

import {AuthenticationDetails, ServerUser, User} from "~/server-types"
import {REFRESH_TOKEN_URL, RefreshTokenResult, getMe, refreshToken} from "~/apis"
import {client} from "~/constants/axios-client"
import {useMutation, useQuery} from "@tanstack/react-query"
import PasswordShareConfirmationDialog from "~/AuthContext/PasswordShareConfirmationDialog"
import useContextValue from "~/AuthContext/use-context-value"

export interface AuthContextProviderProps {
	children: ReactNode
}

export default function AuthContextProvider({children}: AuthContextProviderProps): ReactElement {
	const [user, setUser] = useLocalStorage<ServerUser | User | null>(
		"_global-context-auth-user",
		null,
	)
	const {
		encryptUsingMasterPassword,
		decryptUsingMasterPassword,
		setDecryptionPassword,
		_masterPassword,
		logout: logoutMasterPassword,
	} = useMasterPassword(user?.encryptedPassword || null)
	const {sharePassword, closeDialog, showDialog, dispatchPasswordStatus} = useExtensionHandler(
		_masterPassword!,
		user as User,
	)

	const logout = useCallback(() => {
		logoutMasterPassword()
	}, [logoutMasterPassword])
	const {mutateAsync: refresh} = useMutation<RefreshTokenResult, AxiosError, void>(refreshToken, {
		onError: () => logout(),
	})

	const decryptUsingPrivateKey = useCallback(
		async (message: string): Promise<string> => {
			if (!user) {
				throw new Error("User not set.")
			}

			if (!user.isDecrypted) {
				throw new Error("User is not decrypted.")
			}

			return (
				await decrypt({
					message: await readMessage({
						armoredMessage: message,
					}),
					decryptionKeys: await readPrivateKey({
						armoredKey: user.notes.privateKey,
					}),
				})
			).data.toString()
		},
		[user],
	)

	const contextValue = useContextValue({
		decryptUsingPrivateKey,
		encryptUsingMasterPassword,
		decryptUsingMasterPassword,
		setDecryptionPassword,
		logout,
		login: setUser,
		user: user || null,
	})

	useQuery<AuthenticationDetails, AxiosError>(["get_me"], getMe, {
		refetchOnWindowFocus: "always",
		refetchOnReconnect: "always",
		retry: 2,
		enabled: user !== null,
	})

	// Decrypt user notes
	useEffect(() => {
		if (user && !user.isDecrypted && user.encryptedPassword) {
			const note = JSON.parse(decryptUsingMasterPassword(user.encryptedNotes!))

			setUser(
				prevUser =>
					({
						...(prevUser || {}),
						notes: note,
						isDecrypted: true,
					} as User),
			)
		}
	}, [user, decryptUsingMasterPassword])

	// Refresh token and logout user if needed
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
							await logout()
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

	return (
		<>
			<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
			<PasswordShareConfirmationDialog
				open={Boolean(_masterPassword && showDialog)}
				onShare={sharePassword}
				onClose={doNotAskAgain => {
					closeDialog(doNotAskAgain)
					dispatchPasswordStatus()
				}}
			/>
		</>
	)
}
