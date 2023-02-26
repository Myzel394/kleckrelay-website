import * as yup from "yup"
import {ReactElement, useState} from "react"
import {AxiosError} from "axios"
import {useTranslation} from "react-i18next"
import {useFormik} from "formik"
import {BsShieldLockFill} from "react-icons/bs"
import QRCode from "react-qr-code"

import {useMutation} from "@tanstack/react-query"
import {LoadingButton} from "@mui/lab"

import {Verify2FASetupData, verify2FASetup} from "~/apis"
import {useErrorSuccessSnacks, useUser} from "~/hooks"
import {
	Alert,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	InputAdornment,
	TextField,
	useTheme,
} from "@mui/material"
import {parseFastAPIError} from "~/utils"

export interface VerifyOTPFormProps {
	onSuccess: () => void
	onRecreateRequired: () => void
	secret: string
	recoveryCodes: string[]
}

const generateOTPAuthUri = (secret: string, email: string): string =>
	`otpauth://totp/KleckRelay:${email}?secret=${secret}&issuer=KleckRelay`

export default function Settings2FARoute({
	onSuccess,
	recoveryCodes,
	onRecreateRequired,
	secret,
}: VerifyOTPFormProps): ReactElement {
	const {t} = useTranslation()
	const {showSuccess, showError} = useErrorSuccessSnacks()
	const user = useUser()
	const theme = useTheme()

	const [showRecoveryCodes, setShowRecoveryCodes] = useState<boolean>(false)

	const schema = yup.object().shape({
		code: yup
			.string()
			.required()
			.length(6)
			.matches(/^[0-9]+$/, t("routes.SettingsRoute.2fa.setup.code.onlyDigits").toString())
			.label(t("routes.SettingsRoute.2fa.setup.code.label")),
	})

	const {mutateAsync} = useMutation<void, AxiosError, Verify2FASetupData>(verify2FASetup, {
		onSuccess: () => setShowRecoveryCodes(true),
		onError: error => {
			if (error.response?.status === 409 || error.response?.status === 410) {
				showError(t("routes.SettingsRoute.2fa.setup.expired").toString())
				onRecreateRequired()
			} else {
				showError(error)
			}
		},
	})
	const formik = useFormik<
		Verify2FASetupData & {
			detail?: string
		}
	>({
		initialValues: {
			code: "",
		},
		validationSchema: schema,
		onSubmit: async (values, {setErrors}) => {
			try {
				schema.validateSync(values)
				await mutateAsync(values)
			} catch (error) {
				setErrors(parseFastAPIError(error as AxiosError))
			}
		},
	})

	return (
		<>
			<form onSubmit={formik.handleSubmit}>
				<Grid container spacing={4} direction="column">
					<Grid item alignSelf="center">
						<div style={{background: "white", padding: "2rem"}}>
							<QRCode value={generateOTPAuthUri(secret, user.email.address)} />
						</div>
					</Grid>
					<Grid item>
						<Grid container alignItems="center" spacing={2} direction="row">
							<Grid item>
								<TextField
									fullWidth
									value={formik.values.code}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									error={!!formik.errors.code}
									helperText={formik.errors.code}
									name="code"
									label={t("routes.SettingsRoute.2fa.setup.code.label")}
									disabled={formik.isSubmitting}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<BsShieldLockFill />
											</InputAdornment>
										),
									}}
									onSubmit={() => formik.handleSubmit()}
								/>
							</Grid>
							<Grid item>
								<LoadingButton
									type="submit"
									variant="contained"
									loading={formik.isSubmitting}
								>
									{t("routes.SettingsRoute.2fa.setup.submit")}
								</LoadingButton>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</form>
			<Dialog open={showRecoveryCodes}>
				<DialogTitle>{t("routes.SettingsRoute.2fa.setup.recoveryCodes.title")}</DialogTitle>
				<DialogContent
					sx={{
						background: theme.palette.background.default,
					}}
				>
					<code>
						{recoveryCodes.map(code => (
							<p key={code}>{code}</p>
						))}
					</code>
					<Alert severity="warning">
						{t("routes.SettingsRoute.2fa.setup.recoveryCodes.description")}
					</Alert>
				</DialogContent>
				<DialogActions>
					<Button
						variant="contained"
						onClick={() => {
							showSuccess(t("routes.SettingsRoute.2fa.setup.success"))
							setShowRecoveryCodes(false)
							onSuccess()
						}}
					>
						{t("routes.SettingsRoute.2fa.setup.recoveryCodes.submit")}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}
