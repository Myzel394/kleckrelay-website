import {ReactElement, useContext} from "react"
import {AxiosError} from "axios"
import {useTranslation} from "react-i18next"

import {Switch} from "@mui/material"
import {useMutation} from "@tanstack/react-query"

import {Alias, DecryptedAlias} from "~/server-types"
import {UpdateAliasData, updateAlias} from "~/apis"
import {useErrorSuccessSnacks, useUIState} from "~/hooks"
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
	const {t} = useTranslation()
	const {showError, showSuccess} = useErrorSuccessSnacks()
	const {_decryptUsingMasterPassword, encryptionStatus} = useContext(AuthContext)

	const [isActiveUIState, setIsActiveUIState] = useUIState<boolean>(isActive)

	const {mutateAsync, isLoading} = useMutation<Alias, AxiosError, UpdateAliasData>(
		values => updateAlias(id, values),
		{
			onSuccess: newAlias => {
				if (encryptionStatus === EncryptionStatus.Available) {
					;(newAlias as any as DecryptedAlias).notes = decryptAliasNotes(
						newAlias.encryptedNotes,
						_decryptUsingMasterPassword,
					)
				}

				onChanged(newAlias)
			},
			onError: showError,
		},
	)

	return (
		<Switch
			checked={isActiveUIState}
			disabled={isActiveUIState === null || isLoading}
			onChange={async () => {
				setIsActiveUIState(!isActiveUIState)

				try {
					await mutateAsync({
						isActive: !isActiveUIState,
					})

					showSuccess(
						isActiveUIState
							? t("relations.alias.mutations.success.aliasChangedToDisabled")
							: t("relations.alias.mutations.success.aliasChangedToEnabled"),
					)
				} catch {}
			}}
		/>
	)
}
