import {ReactElement} from "react"
import {AxiosError} from "axios"
import {useTranslation} from "react-i18next"
import {BsShieldLockFill} from "react-icons/bs"
// @ts-ignore
import {authenticator} from "@otplib/preset-browser"
import {useMutation} from "@tanstack/react-query"
import {LoadingButton} from "@mui/lab"
import {Grid, Typography} from "@mui/material"

import {Setup2FAResponse, setup2FA} from "~/apis"
import {useErrorSuccessSnacks} from "~/hooks"

import VerifyOTPForm from "./VerifyOTPForm"

export interface Setup2FAProps {
	onSuccess: () => void
}

export default function Setup2FA({onSuccess}: Setup2FAProps): ReactElement {
	const {t} = useTranslation()
	const {showError} = useErrorSuccessSnacks()

	const {
		data: {secret, recoveryCodes} = {},
		mutate,
		isLoading,
		reset,
	} = useMutation<Setup2FAResponse, AxiosError, void>(setup2FA, {
		onError: showError,
	})

	return (
		<Grid container spacing={4} direction="column">
			<Grid item>
				<Typography variant="body1">
					{t("routes.SettingsRoute.2fa.setup.description")}
				</Typography>
			</Grid>
			<Grid item alignSelf="center">
				{secret ? (
					<VerifyOTPForm
						onRecreateRequired={() => {
							reset()
							mutate()
						}}
						secret={secret}
						recoveryCodes={recoveryCodes!}
						onSuccess={onSuccess}
					/>
				) : (
					<LoadingButton
						onClick={() => mutate()}
						loading={isLoading}
						variant="contained"
						startIcon={<BsShieldLockFill />}
					>
						{t("routes.SettingsRoute.2fa.setup.setupLabel")}
					</LoadingButton>
				)}
			</Grid>
		</Grid>
	)
}
