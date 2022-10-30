import {ReactElement, useContext, useEffect, useState} from "react"
import {AxiosError} from "axios"

import {Switch} from "@mui/material"
import {useMutation} from "@tanstack/react-query"

import {Alias, DecryptedAlias} from "~/server-types"
import {UpdateAliasData, updateAlias} from "~/apis"
import {parseFastAPIError} from "~/utils"
import {ErrorSnack, SuccessSnack} from "~/components"
import AuthContext, {EncryptionStatus} from "~/AuthContext/AuthContext"
import decryptAliasNotes from "~/apis/helpers/decrypt-alias-notes"

export interface ChangeAliasActivationStatusSwitchProps {
	id: string
	isActive: boolean

	onChanged: (alias: Alias | DecryptedAlias) => void
}

export default function ChangeAliasActivationStatusSwitch({
	id,
	isActive,
	onChanged,
}: ChangeAliasActivationStatusSwitchProps): ReactElement {
	const {_decryptUsingMasterPassword, encryptionStatus} =
		useContext(AuthContext)

	const [isActiveUIState, setIsActiveUIState] = useState<boolean>(true)

	const [successMessage, setSuccessMessage] = useState<string>("")
	const [errorMessage, setErrorMessage] = useState<string>("")

	const {mutateAsync, isLoading} = useMutation<
		Alias,
		AxiosError,
		UpdateAliasData
	>(values => updateAlias(id, values), {
		onSuccess: newAlias => {
			if (encryptionStatus === EncryptionStatus.Available) {
				;(newAlias as any as DecryptedAlias).notes = decryptAliasNotes(
					newAlias.encryptedNotes,
					_decryptUsingMasterPassword,
				)
			}

			onChanged(newAlias)
		},
		onError: error =>
			setErrorMessage(parseFastAPIError(error).detail as string),
	})

	useEffect(() => {
		setIsActiveUIState(isActive)
	}, [isActive])

	return (
		<>
			<Switch
				checked={isActiveUIState}
				disabled={isActiveUIState === null || isLoading}
				onChange={async () => {
					setIsActiveUIState(!isActiveUIState)

					try {
						await mutateAsync({
							isActive: !isActiveUIState,
						})

						if (!isActiveUIState) {
							setSuccessMessage("Alias activated successfully!")
						} else {
							setSuccessMessage("Alias deactivated successfully!")
						}
					} catch {}
				}}
			/>
			<SuccessSnack message={successMessage} />
			<ErrorSnack message={errorMessage} />
		</>
	)
}
