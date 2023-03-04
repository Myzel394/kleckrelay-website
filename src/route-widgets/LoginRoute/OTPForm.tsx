import * as yup from "yup"
import {ReactElement} from "react"
import {useTranslation} from "react-i18next"
import {useFormik} from "formik"
import {BsPhone, BsShieldLockFill} from "react-icons/bs"
import {MdChevronRight} from "react-icons/md"
import {Link as RouterLink} from "react-router-dom"
import {AxiosError} from "axios"

import {useMutation} from "@tanstack/react-query"
import {LoadingButton} from "@mui/lab"
import {Box, Button, Grid, InputAdornment, TextField, Typography} from "@mui/material"

import {verifyOTP} from "~/apis"
import {parseFastAPIError} from "~/utils"
import {MultiStepFormElement} from "~/components"
import {useErrorSuccessSnacks} from "~/hooks"
import {ServerUser} from "~/server-types"

interface Form {
	code: string
}

export interface OTPFormProps {
	corsToken: string
	onConfirm: (user: ServerUser) => void
	onCodeUnavailable: () => void
}

export default function OTPForm({
	corsToken,
	onConfirm,
	onCodeUnavailable,
}: OTPFormProps): ReactElement {
	const {t} = useTranslation(["login", "common"])
	const {showError} = useErrorSuccessSnacks()
	const {mutateAsync} = useMutation<ServerUser, AxiosError, string>(
		code =>
			verifyOTP({
				code,
				corsToken,
			}),
		{
			onSuccess: onConfirm,
			onError: error => {
				if (error.response?.status === 410 || error.response?.status === 404) {
					showError(t("forms.otp.isUnavailable").toString())
					onCodeUnavailable()
				}
			},
		},
	)

	const schema = yup.object().shape({
		code: yup
			.string()
			.required()
			.label(t("fields.2faCode.label", {ns: "common"})),
	})

	const formik = useFormik<Form>({
		validationSchema: schema,
		initialValues: {
			code: "",
		},
		onSubmit: async (values, {setErrors}) => {
			try {
				await mutateAsync(values.code)
				// await mutateAsync(values)
			} catch (error) {
				const errors = parseFastAPIError(error as AxiosError)
				setErrors({code: errors.detail})
			}
		},
	})

	return (
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
							{t("forms.otp.title")}
						</Typography>
					</Grid>
					<Grid item>
						<Box display="flex" justifyContent="center">
							<BsShieldLockFill size={64} />
						</Box>
					</Grid>
					<Grid item>
						<Typography variant="subtitle1" component="p" align="center">
							{t("forms.otp.description")}
						</Typography>
					</Grid>
					<Grid item>
						<TextField
							autoFocus
							key="code"
							fullWidth
							name="code"
							id="code"
							placeholder={t("fields.2faCode.placeholder", {ns: "common"})}
							label={t("fields.2faCode.label", {ns: "common"})}
							value={formik.values.code}
							onChange={formik.handleChange}
							disabled={formik.isSubmitting}
							error={formik.touched.code && Boolean(formik.errors.code)}
							helperText={formik.touched.code && formik.errors.code}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<BsPhone />
									</InputAdornment>
								),
							}}
						/>
					</Grid>
					<Grid item>
						<Grid width="100%" container spacing={2} alignItems="center">
							<Grid item>
								<LoadingButton
									loading={formik.isSubmitting}
									variant="contained"
									type="submit"
									startIcon={<MdChevronRight />}
								>
									{t("forms.otp.continueActionLabel")}
								</LoadingButton>
							</Grid>
							<Grid item>
								<Button component={RouterLink} to="/auth/recover-2fa">
									{t("forms.otp.codesLostActionLabel")}
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</form>
		</MultiStepFormElement>
	)
}
