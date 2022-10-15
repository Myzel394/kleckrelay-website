import {MdEmail} from "react-icons/md"
import {AxiosError} from "axios"
import React, {ReactElement} from "react"
import differenceInSeconds from "date-fns/differenceInSeconds"

import {useMutation} from "@tanstack/react-query"
import {LoadingButton} from "@mui/lab"

import {useIntervalUpdate} from "~/hooks"
import {resendEmailVerificationCode} from "~/apis"
import {isDev} from "~/constants/development"
import {MutationStatusSnackbar} from "~/components"

export interface ResendMailButtonProps {
	email: string
}

const RESEND_INTERVAL = isDev ? 3 : 60

export default function ResendMailButton({
	email,
}: ResendMailButtonProps): ReactElement {
	const [startDate, resetInterval] = useIntervalUpdate(1000)
	const secondsPassed = differenceInSeconds(new Date(), startDate)
	const secondsLeft = RESEND_INTERVAL - secondsPassed

	const mutation = useMutation<void, AxiosError, string>(
		resendEmailVerificationCode,
		{
			onSettled: resetInterval,
		},
	)
	const {mutate: resendEmail, isLoading} = mutation

	return (
		<>
			<LoadingButton
				variant="contained"
				startIcon={<MdEmail />}
				onClick={() => resendEmail(email)}
				loading={isLoading}
				disabled={secondsLeft > 0 || isLoading}
			>
				<span>
					<span>Resend Email</span>
					{secondsLeft > 0 && <span> ({secondsLeft})</span>}
				</span>
			</LoadingButton>
			<MutationStatusSnackbar mutation={mutation} />
		</>
	)
}
