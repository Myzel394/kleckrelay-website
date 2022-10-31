import {AxiosError} from "axios"
import {useLoaderData} from "react-router-dom"
import {MdMail} from "react-icons/md"
import React, {ReactElement} from "react"

import {useMutation} from "@tanstack/react-query"

import {resendEmailVerificationCode} from "~/apis"
import {MutationStatusSnackbar, TimedButton} from "~/components"
import {ServerSettings, SimpleDetailResponse} from "~/server-types"

export interface ResendMailButtonProps {
	email: string
}

export default function ResendMailButton({
	email,
}: ResendMailButtonProps): ReactElement {
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
				Resend Mail
			</TimedButton>
			<MutationStatusSnackbar mutation={mutation} />
		</>
	)
}