import {AxiosError} from "axios"
import {useLoaderData} from "react-router-dom"
import {MdMail} from "react-icons/md"
import {useTranslation} from "react-i18next"
import React, {ReactElement} from "react"

import {useMutation} from "@tanstack/react-query"

import {ResendEmailVerificationCodeResponse, resendEmailVerificationCode} from "~/apis"
import {MutationStatusSnackbar, TimedButton} from "~/components"
import {ServerSettings} from "~/server-types"

export interface ResendMailButtonProps {
	email: string
	onEmailAlreadyVerified: () => void
}

export default function ResendMailButton({
	email,
	onEmailAlreadyVerified,
}: ResendMailButtonProps): ReactElement {
	const {t} = useTranslation("components")
	const settings = useLoaderData() as ServerSettings

	const mutation = useMutation<ResendEmailVerificationCodeResponse, AxiosError, void>(
		() => resendEmailVerificationCode(email),
		{
			onSuccess: ({code}: any) => {
				if (code === "ok:email_already_verified") {
					onEmailAlreadyVerified()
				}
			},
		},
	)
	const {mutate} = mutation

	return (
		<>
			<TimedButton
				interval={settings.emailResendWaitTime}
				startIcon={<MdMail />}
				onClick={() => mutate()}
			>
				{t("ResendMailButton.label")}
			</TimedButton>
			<MutationStatusSnackbar mutation={mutation} />
		</>
	)
}
