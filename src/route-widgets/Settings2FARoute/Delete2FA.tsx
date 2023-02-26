import {ReactElement, useState} from "react"
import {AxiosError} from "axios"
import {useTranslation} from "react-i18next"
import {BsPhone, BsShieldLockFill} from "react-icons/bs"
import {MdSettingsBackupRestore} from "react-icons/md"

import {useMutation} from "@tanstack/react-query"
import {Button, Grid, TextField} from "@mui/material"
import {LoadingButton} from "@mui/lab"

import {Delete2FAData, delete2FA} from "~/apis"
import {useErrorSuccessSnacks} from "~/hooks"
import {SimpleDetailResponse} from "~/server-types"

export interface Delete2FAProps {
	onSuccess: () => void
}

export default function Delete2FA({onSuccess}: Delete2FAProps): ReactElement {
	const {t} = useTranslation()
	const {showSuccess, showError} = useErrorSuccessSnacks()
	const {mutate} = useMutation<SimpleDetailResponse, AxiosError, Delete2FAData>(delete2FA, {
		onSuccess: () => {
			showSuccess(t("routes.SettingsRoute.2fa.delete.success"))
			onSuccess()
		},
		onError: showError,
	})

	const [view, setView] = useState<"showAction" | "askType" | "askCode" | "askRecoveryCode">(
		"showAction",
	)
	const [value, setValue] = useState<string>("")

	switch (view) {
		case "showAction":
			return (
				<Button onClick={() => setView("askType")} startIcon={<BsShieldLockFill />}>
					{t("routes.SettingsRoute.2fa.delete.showAction")}
				</Button>
			)

		case "askType":
			return (
				<Grid container spacing={2}>
					<Grid item>
						<Button onClick={() => setView("askCode")} startIcon={<BsPhone />}>
							{t("routes.SettingsRoute.2fa.delete.askType.code")}
						</Button>
					</Grid>
					<Grid item>
						<Button
							onClick={() => setView("askRecoveryCode")}
							startIcon={<MdSettingsBackupRestore />}
						>
							{t("routes.SettingsRoute.2fa.delete.askType.recoveryCode")}
						</Button>
					</Grid>
				</Grid>
			)

		case "askCode":
			return (
				<Grid container spacing={2} alignItems="center">
					<Grid item>
						<TextField
							fullWidth
							label={t("routes.SettingsRoute.2fa.delete.askCode.label")}
							value={value}
							onChange={e => setValue(e.target.value)}
						/>
					</Grid>
					<Grid item>
						<LoadingButton
							onClick={() => mutate({code: value})}
							variant="contained"
							startIcon={<BsShieldLockFill />}
						>
							{t("routes.SettingsRoute.2fa.delete.submit")}
						</LoadingButton>
					</Grid>
				</Grid>
			)

		case "askRecoveryCode":
			return (
				<Grid container spacing={2} alignItems="center">
					<Grid item>
						<TextField
							fullWidth
							label={t("routes.SettingsRoute.2fa.delete.askRecoveryCode.label")}
							value={value}
							onChange={e => setValue(e.target.value)}
						/>
					</Grid>
					<Grid item>
						<LoadingButton
							onClick={() => mutate({recoveryCode: value.replaceAll("-", "")})}
							variant="contained"
							startIcon={<BsShieldLockFill />}
						>
							{t("routes.SettingsRoute.2fa.delete.submit")}
						</LoadingButton>
					</Grid>
				</Grid>
			)
	}
}
