import {ReactElement} from "react"
import {AxiosError} from "axios"
import {useTranslation} from "react-i18next"
import update from "immutability-helper"

import {useMutation} from "@tanstack/react-query"
import {Switch} from "@mui/material"

import {useErrorSuccessSnacks} from "~/hooks"
import {ReservedAlias} from "~/server-types"
import {updateReservedAlias} from "~/apis"
import {queryClient} from "~/constants/react-query"

export interface AliasActivationSwitch {
	id: string
	isActive: boolean
	queryKey: readonly string[]
}

export default function AliasActivationSwitch({
	id,
	isActive,
	queryKey,
}: AliasActivationSwitch): ReactElement {
	const {t} = useTranslation("common")
	const {showError, showSuccess} = useErrorSuccessSnacks()
	const {isLoading, mutateAsync} = useMutation<
		ReservedAlias,
		AxiosError,
		boolean,
		{previousAlias: ReservedAlias | undefined}
	>(
		activeNow =>
			updateReservedAlias(id, {
				isActive: activeNow,
			}),
		{
			onMutate: async activeNow => {
				await queryClient.cancelQueries(queryKey)

				const previousAlias = queryClient.getQueryData<ReservedAlias>(queryKey)

				queryClient.setQueryData<ReservedAlias>(queryKey, old =>
					update(old, {
						isActive: {
							$set: activeNow!,
						},
					}),
				)

				return {previousAlias}
			},
			onSuccess: newAlias => {
				queryClient.setQueryData<ReservedAlias>(queryKey, newAlias)
			},
			onError: (error, values, context) => {
				showError(error)

				if (context?.previousAlias) {
					queryClient.setQueryData<ReservedAlias>(queryKey, context.previousAlias)
				}
			},
		},
	)

	return (
		<Switch
			checked={isActive}
			onChange={async () => {
				if (isLoading) {
					return
				}

				try {
					await mutateAsync(!isActive)

					showSuccess(
						isActive
							? t("messages.alias.changedToDisabled")
							: t("messages.alias.changedToEnabled"),
					)
				} catch {}
			}}
		/>
	)
}
