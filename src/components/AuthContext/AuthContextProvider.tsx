import {ReactElement, ReactNode, useCallback} from "react"
import fastHashCode from "fast-hash-code"

import {useLocalStorageValue} from "@react-hookz/web"

import {ServerUser, User} from "~/server-types"

import AuthContext from "./AuthContext"
import PasswordShareConfirmationDialog from "./PasswordShareConfirmationDialog"
import useContextValue from "./use-context-value"
import useExtensionHandler from "./use-extension-handler"
import useMasterPassword from "./use-master-password"
import useUser from "./use-user"

export interface AuthContextProviderProps {
	children: ReactNode
}

export default function AuthContextProvider({children}: AuthContextProviderProps): ReactElement {
	const {
		value: user,
		set: setUser,
		remove: removeUser,
	} = useLocalStorageValue<ServerUser | User | null>("_global-context-auth-user", {
		defaultValue: null,
	})
	const {
		encryptUsingMasterPassword,
		decryptUsingMasterPassword,
		decryptUsingPrivateKey,
		decryptionPasswordHash,
		_encryptionPassword,
		setEncryptionPassword,
		logout: logoutMasterPassword,
	} = useMasterPassword(user || null)
	const passwordHash = _encryptionPassword ? fastHashCode(_encryptionPassword).toString() : null
	const {sharePassword, closeDialog, showDialog, dispatchPasswordStatus} = useExtensionHandler(
		_encryptionPassword!,
		user as User,
	)
	const logout = useCallback(() => {
		localStorage.removeItem("signup-form-state-email")
		logoutMasterPassword()
		removeUser()
	}, [logoutMasterPassword, removeUser])

	const contextValue = useContextValue({
		_decryptUsingPrivateKey: decryptUsingPrivateKey,
		_encryptUsingMasterPassword: encryptUsingMasterPassword,
		_decryptUsingMasterPassword: decryptUsingMasterPassword,
		setEncryptionPassword,
		decryptionPasswordHash,
		logout,
		login: setUser,
		user: user || null,
	})

	useUser({
		logout,
		decryptUsingMasterPassword,
		user: user || null,
		// @ts-ignore: `undefined` should not be passed
		updateUser: setUser,
		masterPasswordHash: passwordHash,
	})

	return (
		<>
			<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
			<PasswordShareConfirmationDialog
				open={Boolean(_encryptionPassword && showDialog)}
				onShare={sharePassword}
				onClose={doNotAskAgain => {
					closeDialog(doNotAskAgain)
					dispatchPasswordStatus()
				}}
			/>
		</>
	)
}
