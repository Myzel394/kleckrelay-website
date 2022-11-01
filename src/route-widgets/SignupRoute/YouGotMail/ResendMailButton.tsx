import {AxiosError} from "axios"
import {useLoaderData} from "react-router-dom"
import {MdMail} from "react-icons/md"
import {useTranslation} from "react-i18next"
import React, {ReactElement} from "react"

import {useMutation} from "@tanstack/react-query"

import {resendEmailVerificationCode} from "~/apis"
import {MutationStatusSnackbar, TimedButton} from "~/components"
import {ServerSettings, SimpleDetailResponse} from "~/server-types"

export interface ResendMailButtonProps {
	email: string
}

export default function ResendMailButton({email}: ResendMailButtonProps): ReactElement {
	const {t} = useTranslation()
	const settings = useLoaderData() as ServerSettings

	const mutation = useMutation<SimpleDetailResponse, AxiosError, void>(() =>
		resendEmailVerificationCode(email),
	)
	const {mutate} = mutation

	return (
		<>
			<TimedButton
				interval={settings.emailResendWaitTime}
				startIcon={<MdMail />}
				onClick={() => mutate()}
			>
				{t("components.ResendMailButton.label")}
			</TimedButton>
			<MutationStatusSnackbar mutation={mutation} />
		</>
	)
}
