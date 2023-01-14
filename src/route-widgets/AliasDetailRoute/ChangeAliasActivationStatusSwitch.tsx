import {ReactElement, useContext} from "react"
import {AxiosError} from "axios"
import {useTranslation} from "react-i18next"
import update from "immutability-helper"

import {Switch} from "@mui/material"
import {QueryKey, useMutation} from "@tanstack/react-query"

import {Alias, DecryptedAlias} from "~/server-types"
import {UpdateAliasData, updateAlias} from "~/apis"
import {useErrorSuccessSnacks} from "~/hooks"
import {queryClient} from "~/constants/react-query"
import {AuthContext, EncryptionStatus} from "~/components"
import decryptAliasNotes from "~/apis/helpers/decrypt-alias-notes"

export interface ChangeAliasActivationStatusSwitchProps {
	id: string
	isActive: boolean
	queryKey: QueryKey
}

export default function ChangeAliasActivationStatusSwitch({
	id,
	isActive,
	queryKey,
}: ChangeAliasActivationStatusSwitchProps): ReactElement {
	const {t} = useTranslation()
	const {showError, showSuccess} = useErrorSuccessSnacks()
	const {_decryptUsingMasterPassword, encryptionStatus} = useContext(AuthContext)

	const {mutateAsync, isLoading} = useMutation<
		Alias,
		AxiosError,
		UpdateAliasData,
		{previousAlias: DecryptedAlias | Alias | undefined}
	>(values => updateAlias(id, values), {
		onMutate: async values => {
			await queryClient.cancelQueries(queryKey)

			const previousAlias = queryClient.getQueryData<DecryptedAlias | Alias>(queryKey)

			queryClient.setQueryData<DecryptedAlias | Alias>(queryKey, old =>
				update(old, {
					isActive: {
						$set: values.isActive!,
					},
				}),
			)

			return {previousAlias}
		},
		onSuccess: newAlias => {
			if (encryptionStatus === EncryptionStatus.Available) {
				;(newAlias as any as DecryptedAlias).notes = decryptAliasNotes(
					newAlias.encryptedNotes,
					_decryptUsingMasterPassword,
				)
			}

			queryClient.setQueryData<DecryptedAlias | Alias>(queryKey, newAlias)
		},
		onError: (error, values, context) => {
			showError(error)

			if (context?.previousAlias) {
				queryClient.setQueryData<DecryptedAlias | Alias>(queryKey, context.previousAlias)
			}
		},
	})

	return (
		<Switch
			checked={isActive}
			onChange={async () => {
				if (isLoading) {
					return
				}

				try {
					await mutateAsync({
						isActive: !isActive,
					})

					showSuccess(
						isActive
							? t("relations.alias.mutations.success.aliasChangedToDisabled")
							: t("relations.alias.mutations.success.aliasChangedToEnabled"),
					)
				} catch {}
			}}
		/>
	)
}
