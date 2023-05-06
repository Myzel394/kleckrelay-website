import * as yup from "yup"
import {AxiosError} from "axios"
import {ReactElement, useCallback, useMemo, useState} from "react"
import {useFormik} from "formik"
import {FaHashtag} from "react-icons/fa"
import {MdChevronRight, MdMail} from "react-icons/md"
import {useLoaderData} from "react-router-dom"
import {useTranslation} from "react-i18next"
import differenceInSeconds from "date-fns/differenceInSeconds"
import inMilliseconds from "in-milliseconds"

import {useMountEffect} from "@react-hookz/web"
import {useMutation} from "@tanstack/react-query"
import {
	Alert,
	Box,
	FormControlLabel,
	Grid,
	InputAdornment,
	Snackbar,
	Switch,
	TextField,
	Typography,
} from "@mui/material"
import {LoadingButton} from "@mui/lab"

import {ServerSettings, ServerUser, SimpleDetailResponse} from "~/server-types"
import {VerifyLoginWithEmailData, VerifyLoginWithEmailResponse, verifyLoginWithEmail} from "~/apis"
import {MultiStepFormElement} from "~/components"
import {parseFastAPIError} from "~/utils"
import {isDev} from "~/constants/development"
import changeAllowEmailLoginFromDifferentDevices from "~/apis/change-allow-email-login-from-different-devices"

import ResendMailButton from "./ResendMailButton"

export interface ConfirmCodeFormProps {
	onConfirm: (user: ServerUser) => void
	onCodeExpired: () => void
	onOTPRequested: (corsToken: string) => void
	email: string
	sameRequestToken: string
}

interface Form {
	code: string
	detail: string
}

export default function ConfirmCodeForm({
	onConfirm,
	onCodeExpired,
	onOTPRequested,
	email,
	sameRequestToken,
}: ConfirmCodeFormProps): ReactElement {
	const settings = useLoaderData() as ServerSettings
	const expirationTime = isDev ? 70 : settings.emailLoginExpirationInSeconds
	const {t} = useTranslation(["login", "common"])
	const requestDate = useMemo(() => new Date(), [])
	const [isExpiringSoon, setIsExpiringSoon] = useState<boolean>(false)

	const schema = yup.object().shape({
		code: yup
			.string()
			.required()
			.min(settings.emailLoginTokenLength)
			.max(settings.emailLoginTokenLength)
			.test(
				"chars",
				t("forms.confirmCode.fields.code.errors.invalidChars") as string,
				code => {
					if (!code) {
						return false
					}

					const chars = settings.emailLoginTokenChars.split("")

					return code.split("").every(char => chars.includes(char))
				},
			)
			.label(t("forms.confirmCode.fields.code.label")),
	})

	const {mutateAsync} = useMutation<
		VerifyLoginWithEmailResponse,
		AxiosError,
		VerifyLoginWithEmailData
	>(verifyLoginWithEmail, {
		onSuccess: result => {
			if (result.corsToken) {
				onOTPRequested(result.corsToken)
			} else {
				onConfirm(result)
			}
		},
	})
	const formik = useFormik<Form>({
		validationSchema: schema,
		initialValues: {
			code: "",
			detail: "",
		},
		onSubmit: async (values, {setErrors}) => {
			try {
				await mutateAsync({
					email,
					sameRequestToken,
					token: values.code,
				})
			} catch (error) {
				const errors = parseFastAPIError(error as AxiosError)
				setErrors({code: errors.detail})
			}
		},
	})
	const [allowLoginFromDifferentDevices, setAllowLoginFromDifferentDevices] =
		useState<boolean>(false)
	const {mutateAsync: changeAllowLoginFromDifferentDevice, isLoading} = useMutation<
		SimpleDetailResponse,
		AxiosError,
		boolean
	>(
		allow =>
			changeAllowEmailLoginFromDifferentDevices({
				allow,
				email,
				sameRequestToken,
			}),
		{
			onSuccess: (_, allow) => {
				setAllowLoginFromDifferentDevices(allow)
			},
		},
	)
	const checkExpiration = useCallback(() => {
		const diff = differenceInSeconds(new Date(), requestDate)

		if (diff >= expirationTime) {
			onCodeExpired()
		} else if (diff >= expirationTime - 60) {
			setIsExpiringSoon(true)
		}
	}, [requestDate])

	useMountEffect(() => {
		const preCheck = setInterval(checkExpiration, inMilliseconds.seconds(isDev ? 1 : 20))
		const finalCheck = setTimeout(checkExpiration, inMilliseconds.seconds(expirationTime))

		return () => {
			clearInterval(preCheck)
			clearTimeout(finalCheck)
		}
	})

	return (
		<>
			<MultiStepFormElement>
				<form onSubmit={formik.handleSubmit}>
					<Grid
						container
						spacing={4}
						padding={4}
						justifyContent="center"
						flexDirection="column"
					>
						<Grid item>
							<Typography variant="h6" component="h1" align="center">
								{t("forms.confirmCode.title")}
							</Typography>
						</Grid>
						<Grid item>
							<Box display="flex" justifyContent="center">
								<MdMail size={64} />
							</Box>
						</Grid>
						<Grid item>
							<Typography variant="subtitle1" component="p" align="center">
								{t("forms.confirmCode.description")}
							</Typography>
						</Grid>
						<Grid item>
							<Grid container spacing={2} direction="column">
								<Grid item>
									<FormControlLabel
										disabled={isLoading}
										control={
											<Switch
												disabled={isLoading}
												checked={allowLoginFromDifferentDevices}
												onChange={() =>
													changeAllowLoginFromDifferentDevice(
														!allowLoginFromDifferentDevices,
													)
												}
											/>
										}
										labelPlacement="end"
										label={t(
											"forms.confirmCode.allowLoginFromDifferentDevices",
										)}
									/>
								</Grid>
								<Grid item>
									<TextField
										key="code"
										fullWidth
										name="code"
										id="code"
										label={t("forms.confirmCode.fields.code.label")}
										value={formik.values.code}
										onChange={event => {
											formik.setFieldValue(
												"code",
												event.target.value.replace(/\D/g, ""),
											)
										}}
										disabled={formik.isSubmitting}
										error={formik.touched.code && Boolean(formik.errors.code)}
										helperText={formik.touched.code && formik.errors.code}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<FaHashtag />
												</InputAdornment>
											),
										}}
									/>
								</Grid>
							</Grid>
						</Grid>
						<Grid item>
							<Grid
								width="100%"
								container
								display="flex"
								justifyContent="space-between"
							>
								<Grid item>
									<ResendMailButton
										email={email}
										sameRequestToken={sameRequestToken}
									/>
								</Grid>
								<Grid item>
									<LoadingButton
										loading={formik.isSubmitting}
										variant="contained"
										type="submit"
										startIcon={<MdChevronRight />}
									>
										{t("forms.confirmCode.continueActionLabel")}
									</LoadingButton>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</form>
			</MultiStepFormElement>
			<Snackbar open={isExpiringSoon}>
				<Alert severity="warning" variant="filled">
					{t("forms.confirmCode.expiringSoonWarning")}
				</Alert>
			</Snackbar>
		</>
	)
}
