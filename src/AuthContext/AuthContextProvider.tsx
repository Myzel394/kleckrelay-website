import {ReactElement, ReactNode, useCallback, useEffect, useMemo, useState} from "react"
import {useEvent, useLocalStorage} from "react-use"
import {AxiosError} from "axios"
import {decrypt, readMessage, readPrivateKey} from "openpgp"

import {useMutation} from "@tanstack/react-query"

import {ServerUser, User} from "~/server-types"
import {REFRESH_TOKEN_URL, RefreshTokenResult, logout as logoutUser, refreshToken} from "~/apis"
import {client} from "~/constants/axios-client"
import {decryptString, encryptString} from "~/utils"
import {ExtensionKleckEvent} from "~/extension-types"
import PasswordShareConfirmationDialog from "~/AuthContext/PasswordShareConfirmationDialog"

import AuthContext, {AuthContextType, EncryptionStatus} from "./AuthContext"

export interface AuthContextProviderProps {
	children: ReactNode
}

export default function AuthContextProvider({children}: AuthContextProviderProps): ReactElement {
	const {mutateAsync: refresh} = useMutation<RefreshTokenResult, AxiosError, void>(refreshToken, {
		onError: () => logout(false),
	})

	const [askForPassword, setAskForPassword] = useState<boolean>(false)
	const [doNotAskForPassword, setDoNotAskForPassword] = useState<boolean>(false)

	const [decryptionPassword, setDecryptionPassword] = useLocalStorage<string | null>(
		"_global-context-auth-decryption-password",
		null,
	)
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
		setDecryptionPassword(null)

		if (forceLogout) {
			await logoutUser()
		}
	}, [])

	const encryptUsingMasterPassword = useCallback(
		(content: string) => {
			if (!masterPassword) {
				throw new Error("Master password not set.")
			}

			return encryptString(content, masterPassword)
		},
		[masterPassword],
	)

	const decryptUsingMasterPassword = useCallback(
		(content: string) => {
			if (!masterPassword) {
				throw new Error("Master password not set.")
			}

			return decryptString(content, masterPassword)
		},
		[masterPassword],
	)

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

	const updateDecryptionPassword = useCallback(
		(password: string): boolean => {
			if (!user) {
				throw new Error("User not set.")
			}

			if (user.isDecrypted) {
				// Password already set
				return true
			}

			try {
				// Check if the password is correct
				const masterPassword = decryptString(user.encryptedPassword, password)
				JSON.parse(decryptString(user.encryptedNotes, masterPassword))
			} catch {
				return false
			}

			setDecryptionPassword(password)
			return true
		},
		[user?.encryptedPassword],
	)

	const value = useMemo<AuthContextType>(
		() => ({
			user: user ?? null,
			login: setUser,
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
			logout,
			isAuthenticated: user !== null,
			_encryptUsingMasterPassword: encryptUsingMasterPassword,
			_decryptUsingMasterPassword: decryptUsingMasterPassword,
			_decryptUsingPrivateKey: decryptUsingPrivateKey,
			_setDecryptionPassword: updateDecryptionPassword,
			_updateUser: setUser,
		}),
		[user, logout, encryptUsingMasterPassword, decryptUsingMasterPassword],
	)

	// Decrypt user notes
	useEffect(() => {
		if (user && !user.isDecrypted && user.encryptedPassword && masterPassword) {
			const note = JSON.parse(decryptUsingMasterPassword(user.encryptedNotes!))

			const newUser: User = {
				...user,
				notes: note,
				isDecrypted: true,
			}

			setUser(newUser)
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

	const dispatchPasswordAvailableEvent = useCallback(() => {
		window.dispatchEvent(
			new CustomEvent("kleckrelay-blob", {
				detail: {
					type: "password-available",
					data: {
						status: (() => {
							if (doNotAskForPassword) {
								return "denied"
							}

							if (masterPassword) {
								return "can-ask"
							}

							return "not-entered"
						})(),
					},
				},
			}),
		)
	}, [doNotAskForPassword, masterPassword])

	// Handle extension password request
	const handleExtensionEvent = useCallback(
		(event: ExtensionKleckEvent) => {
			switch (event.detail.type) {
				case "password-available":
					dispatchPasswordAvailableEvent()
					break
				case "ask-for-password":
					setAskForPassword(true)
					break
				case "get-user":
					window.dispatchEvent(
						new CustomEvent("kleckrelay-blob", {
							detail: {
								type: "get-user",
								data: {
									user: user,
								},
							},
						}),
					)
					break
			}
		},
		[dispatchPasswordAvailableEvent],
	)

	useEvent("kleckrelay-kleck", handleExtensionEvent)

	return (
		<>
			<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
			<PasswordShareConfirmationDialog
				open={Boolean(masterPassword && askForPassword && !doNotAskForPassword)}
				onShare={() => {
					setAskForPassword(false)

					if (doNotAskForPassword) {
						return
					}

					window.dispatchEvent(
						new CustomEvent("kleckrelay-blob", {
							detail: {
								type: "password",
								data: {
									password: masterPassword,
								},
							},
						}),
					)
				}}
				onClose={doNotAskAgain => {
					setDoNotAskForPassword(doNotAskAgain)
					setAskForPassword(false)
					dispatchPasswordAvailableEvent()
				}}
			/>
		</>
	)
}
