import * as yup from "yup"
import {ReactElement, useContext} from "react"
import {AxiosError} from "axios"
import {useTranslation} from "react-i18next"
import {BsShieldLockFill} from "react-icons/bs"
import {useFormik} from "formik"
import {useNavigate} from "react-router-dom"

import {useMutation} from "@tanstack/react-query"
import {LoadingButton} from "@mui/lab"
import {Box, Grid, Paper, TextField, Typography} from "@mui/material"

import {SimpleDetailResponse} from "~/server-types"
import {Delete2FAData, delete2FA, getMe} from "~/apis"
import {useErrorSuccessSnacks} from "~/hooks"
import {AuthContext} from "~/components"

interface Form {
	recoveryCode: string
}

export default function Recover2FARoute(): ReactElement {
	const {t} = useTranslation()
	const {showError, showSuccess} = useErrorSuccessSnacks()
	const {login} = useContext(AuthContext)
	const navigate = useNavigate()
	const {mutateAsync} = useMutation<SimpleDetailResponse, AxiosError, Delete2FAData>(delete2FA, {
		onSuccess: async () => {
			try {
				const user = await getMe()

				showSuccess(t("routes.Recover2FARoute.loggedIn").toString())
				login(user)
				navigate("/aliases")
			} catch (error) {
				showSuccess(t("routes.Recover2FARoute.canLoginNow").toString())
				navigate("/auth/login")
			}
		},
		onError: error => {
			if (error.response?.status == 401) {
				showError(t("routes.Recover2FARoute.unauthorized").toString())
				navigate("/auth/login")
			} else {
				showError(error)
			}
		},
	})

	const schema = yup.object().shape({
		recoveryCode: yup.string().required().label(t("routes.LoginRoute.forms.otp.code.label")),
	})

	const formik = useFormik<Form>({
		validationSchema: schema,
		initialValues: {
			recoveryCode: "",
		},
		onSubmit: async values =>
			mutateAsync({
				recoveryCode: values.recoveryCode.replaceAll("-", ""),
			}),
	})

	return (
		<Paper>
			<Box maxWidth="sm">
				<form onSubmit={formik.handleSubmit}>
					<Grid
						container
						spacing={4}
						padding={4}
						alignItems="center"
						justifyContent="center"
						flexDirection="column"
					>
						<Grid item>
							<Typography variant="h5" component="h1" align="center">
								{t("routes.Recover2FARoute.title")}
							</Typography>
						</Grid>
						<Grid item>
							<Box display="flex" justifyContent="center">
								<BsShieldLockFill size={64} />
							</Box>
						</Grid>
						<Grid item>
							<Typography variant="body1" align="center">
								{t("routes.Recover2FARoute.description")}
							</Typography>
						</Grid>
						<Grid item>
							<TextField
								autoFocus
								key="recoveryCode"
								fullWidth
								name="recoveryCode"
								id="recoveryCode"
								label={t("routes.Recover2FARoute.forms.recoveryCode.label")}
								value={formik.values.recoveryCode}
								onChange={formik.handleChange}
								error={Boolean(
									formik.touched.recoveryCode && formik.errors.recoveryCode,
								)}
								helperText={formik.errors.recoveryCode}
							/>
						</Grid>
						<Grid item>
							<LoadingButton
								type="submit"
								variant="contained"
								loading={formik.isSubmitting}
								startIcon={<BsShieldLockFill />}
							>
								{t("routes.Recover2FARoute.forms.submit")}
							</LoadingButton>
						</Grid>
					</Grid>
				</form>
			</Box>
		</Paper>
	)
}
