import {AxiosError} from "axios"
import {useLoaderData} from "react-router-dom"
import React, {ReactElement} from "react"

import {useMutation} from "@tanstack/react-query"

import {resendEmailLoginCode} from "~/apis"
import {MutationStatusSnackbar, TimedButton} from "~/components"
import {ServerSettings, SimpleDetailResponse} from "~/server-types"
import {MdMail} from "react-icons/md"

export interface ResendMailButtonProps {
	email: string
	sameRequestToken: string
}

export default function ResendMailButton({
	email,
	sameRequestToken,
}: ResendMailButtonProps): ReactElement {
	const settings = useLoaderData() as ServerSettings

	const mutation = useMutation<SimpleDetailResponse, AxiosError, void>(() =>
		resendEmailLoginCode({
			email,
			sameRequestToken,
		}),
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
