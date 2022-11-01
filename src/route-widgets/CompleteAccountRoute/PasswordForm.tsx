import * as yup from "yup"
import {useFormik} from "formik"
import {MdCheckCircle, MdChevronRight, MdLock} from "react-icons/md"
import {generateKey, readKey} from "openpgp"
import {AxiosError} from "axios"
import {useTranslation} from "react-i18next"
import React, {ReactElement, useContext, useMemo} from "react"
import passwordGenerator from "secure-random-password"

import {LoadingButton} from "@mui/lab"
import {Box, Grid, InputAdornment, Typography} from "@mui/material"
import {useMutation} from "@tanstack/react-query"

import {PasswordField} from "~/components"
import {buildEncryptionPassword, encryptString} from "~/utils"
import {isDev} from "~/constants/development"
import {useSystemPreferredTheme, useUser} from "~/hooks"
import {MASTER_PASSWORD_LENGTH} from "~/constants/values"
import {AuthenticationDetails, UserNote} from "~/server-types"
import {UpdateAccountData, updateAccount} from "~/apis"
import {encryptUserNote} from "~/utils/encrypt-user-note"
import AuthContext from "~/AuthContext/AuthContext"

export interface PasswordFormProps {
	onDone: () => void
}

interface Form {
	password: string
	passwordConfirmation: string
	detail?: string
}

export default function PasswordForm({onDone}: PasswordFormProps): ReactElement {
	const {t} = useTranslation()
	const user = useUser()
	const theme = useSystemPreferredTheme()

	const schema = yup.object().shape({
		password: yup.string().required(),
		passwordConfirmation: yup
			.string()
			.required()
			.oneOf(
				[yup.ref("password"), null],
				t(
					"routes.CompleteAccountRoute.forms.password.form.passwordConfirm.mustMatchHelperText",
				) as string,
			)
			.label(t("routes.CompleteAccountRoute.forms.password.form.passwordConfirm.label")),
	})

	const {_setDecryptionPassword, login} = useContext(AuthContext)

	const awaitGenerateKey = useMemo(
		() =>
			generateKey({
				type: "rsa",
				format: "armored",
				userIDs: [{name: "John Smith", email: "john@example.com"}],
				passphrase: "",
				rsaBits: isDev ? 2048 : 4096,
			}),
		[],
	)
	const {mutateAsync} = useMutation<AuthenticationDetails, AxiosError, UpdateAccountData>(
		updateAccount,
		{
			onSuccess: ({user}) => {
				login(user)
				onDone()
			},
		},
	)
	const formik = useFormik<Form>({
		validationSchema: schema,
		initialValues: {
			password: "",
			passwordConfirmation: "",
		},
		onSubmit: async (values, {setErrors}) => {
			try {
				const keyPair = await awaitGenerateKey

				const masterPassword = passwordGenerator.randomPassword({
					length: MASTER_PASSWORD_LENGTH,
				})

				const encryptionPassword = buildEncryptionPassword(
					values.password,
					user.email.address,
				)
				const encryptedMasterPassword = encryptString(masterPassword, encryptionPassword)
				const note: UserNote = {
					theme,
					privateKey: keyPair.privateKey,
				}
				const encryptedNotes = encryptUserNote(note, masterPassword)

				_setDecryptionPassword(encryptionPassword)

				await mutateAsync({
					encryptedPassword: encryptedMasterPassword,
					publicKey: (
						await readKey({
							armoredKey: keyPair.publicKey,
						})
					)
						.toPublic()
						.armor(),
					encryptedNotes,
				})
			} catch (error) {
				setErrors({detail: t("general.defaultError")})
			}
		},
	})

	return (
		<Box width="80vw">
			<form onSubmit={formik.handleSubmit}>
				<Grid
					container
					spacing={4}
					paddingX={2}
					paddingY={4}
					alignItems="center"
					justifyContent="center"
				>
					<Grid item>
						<Grid container spacing={2} direction="column">
							<Grid item>
								<Typography variant="h6" component="h2" align="center">
									{t("routes.CompleteAccountRoute.forms.password.title")}
								</Typography>
							</Grid>
							<Grid item>
								<Typography variant="subtitle1" component="p">
									{t("routes.CompleteAccountRoute.forms.password.description")}
								</Typography>
							</Grid>
						</Grid>
					</Grid>
					<Grid item>
						<Grid container spacing={2} justifyContent="center">
							<Grid item>
								<PasswordField
									fullWidth
									id="password"
									name="password"
									label={t(
										"routes.CompleteAccountRoute.forms.password.form.password.label",
									)}
									placeholder={t(
										"routes.CompleteAccountRoute.forms.password.form.password.placeholder",
									)}
									autoComplete="new-password"
									value={formik.values.password}
									onChange={formik.handleChange}
									disabled={formik.isSubmitting}
									error={
										formik.touched.password && Boolean(formik.errors.password)
									}
									helperText={formik.touched.password && formik.errors.password}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<MdLock />
											</InputAdornment>
										),
									}}
								/>
							</Grid>
							<Grid item>
								<PasswordField
									fullWidth
									id="passwordConfirmation"
									name="passwordConfirmation"
									label={t(
										"routes.CompleteAccountRoute.forms.password.form.passwordConfirm.label",
									)}
									placeholder={t(
										"routes.CompleteAccountRoute.forms.password.form.passwordConfirm.placeholder",
									)}
									value={formik.values.passwordConfirmation}
									onChange={formik.handleChange}
									disabled={formik.isSubmitting}
									error={
										formik.touched.passwordConfirmation &&
										Boolean(formik.errors.passwordConfirmation)
									}
									helperText={
										formik.touched.passwordConfirmation &&
										formik.errors.passwordConfirmation
									}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<MdCheckCircle />
											</InputAdornment>
										),
									}}
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item>
						<LoadingButton
							type="submit"
							variant="contained"
							loading={formik.isSubmitting}
							startIcon={<MdChevronRight />}
						>
							{t("routes.CompleteAccountRoute.forms.password.continueAction")}
						</LoadingButton>
					</Grid>
				</Grid>
			</form>
		</Box>
	)
}
