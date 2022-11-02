import * as yup from "yup"
import {AxiosError} from "axios"
import {ReactElement} from "react"
import {useFormik} from "formik"
import {FaHashtag} from "react-icons/fa"
import {MdChevronRight, MdMail} from "react-icons/md"

import {useLoaderData} from "react-router-dom"
import {useTranslation} from "react-i18next"
import ResendMailButton from "./ResendMailButton"

import {useMutation} from "@tanstack/react-query"
import {Box, Grid, InputAdornment, TextField, Typography} from "@mui/material"
import {LoadingButton} from "@mui/lab"

import {AuthenticationDetails, ServerSettings, ServerUser} from "~/server-types"
import {VerifyLoginWithEmailData, verifyLoginWithEmail} from "~/apis"
import {MultiStepFormElement} from "~/components"
import {parseFastAPIError} from "~/utils"

export interface ConfirmCodeFormProps {
	onConfirm: (user: ServerUser) => void
	email: string
	sameRequestToken: string
}

interface Form {
	code: string
	detail: string
}

export default function ConfirmCodeForm({
	onConfirm,
	email,
	sameRequestToken,
}: ConfirmCodeFormProps): ReactElement {
	const settings = useLoaderData() as ServerSettings
	const {t} = useTranslation()
	const SCHEMA = yup.object().shape({
		code: yup
			.string()
			.required()
			.min(settings.emailLoginTokenLength)
			.max(settings.emailLoginTokenLength)
			.test(
				"chars",
				t("routes.LoginRoute.forms.confirmCode.form.code.errors.invalidChars") as string,
				code => {
					if (!code) {
						return false
					}

					const chars = settings.emailLoginTokenChars.split("")

					return code.split("").every(char => chars.includes(char))
				},
			)
			.label(t("routes.LoginRoute.forms.confirmCode.form.code.label")),
	})
	const {mutateAsync} = useMutation<AuthenticationDetails, AxiosError, VerifyLoginWithEmailData>(
		verifyLoginWithEmail,
		{
			onSuccess: ({user}) => onConfirm(user),
		},
	)
	const formik = useFormik<Form>({
		validationSchema: SCHEMA,
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
							{t("routes.LoginRoute.forms.confirmCode.title")}
						</Typography>
					</Grid>
					<Grid item>
						<Box display="flex" justifyContent="center">
							<MdMail size={64} />
						</Box>
					</Grid>
					<Grid item>
						<Typography variant="subtitle1" component="p" align="center">
							{t("routes.LoginRoute.forms.confirmCode.description")}
						</Typography>
					</Grid>
					<Grid item>
						<TextField
							key="code"
							fullWidth
							name="code"
							id="code"
							label={t("routes.LoginRoute.forms.confirmCode.form.code.label")}
							value={formik.values.code}
							onChange={formik.handleChange}
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
					<Grid item>
						<Grid width="100%" container display="flex" justifyContent="space-between">
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
									{t("routes.LoginRoute.forms.confirmCode.continueAction")}
								</LoadingButton>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</form>
		</MultiStepFormElement>
	)
}
