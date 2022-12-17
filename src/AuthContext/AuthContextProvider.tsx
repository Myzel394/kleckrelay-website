import {ReactElement, ReactNode, useCallback} from "react"
import {useLocalStorage} from "react-use"
import fastHashCode from "fast-hash-code"

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
	const [user, setUser] = useLocalStorage<ServerUser | User | null>(
		"_global-context-auth-user",
		null,
	)

	const {
		encryptUsingMasterPassword,
		decryptUsingMasterPassword,
		decryptUsingPrivateKey,
		setDecryptionPassword,
		decryptionPasswordHash,
		_masterPassword,
		logout: logoutMasterPassword,
	} = useMasterPassword(user || null)
	const passwordHash = _masterPassword ? fastHashCode(_masterPassword).toString() : null
	const {sharePassword, closeDialog, showDialog, dispatchPasswordStatus} = useExtensionHandler(
		_masterPassword!,
		user as User,
	)
	const logout = useCallback(() => {
		logoutMasterPassword()
		setUser(null)
	}, [logoutMasterPassword])

	const contextValue = useContextValue({
		_decryptUsingPrivateKey: decryptUsingPrivateKey,
		_encryptUsingMasterPassword: encryptUsingMasterPassword,
		_decryptUsingMasterPassword: decryptUsingMasterPassword,
		_setDecryptionPassword: setDecryptionPassword,
		decryptionPasswordHash,
		logout,
		login: setUser,
		user: user || null,
	})

	useUser({
		logout,
		decryptUsingMasterPassword,
		user: user || null,
		updateUser: setUser,
		masterPasswordHash: passwordHash,
	})

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
