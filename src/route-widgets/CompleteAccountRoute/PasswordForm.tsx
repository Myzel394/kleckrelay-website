import * as yup from "yup"
import {useFormik} from "formik"
import {MdCheckCircle, MdLock} from "react-icons/md"
import {readKey} from "openpgp"
import {AxiosError} from "axios"
import {useTranslation} from "react-i18next"
import {useLoaderData} from "react-router-dom"
import React, {ReactElement, useCallback, useContext, useRef} from "react"

import {Box, InputAdornment} from "@mui/material"
import {useMutation} from "@tanstack/react-query"

import {AuthContext, PasswordField, SimpleForm} from "~/components"
import {setupEncryptionForUser} from "~/utils"
import {useExtensionHandler, useNavigateToNext, useSystemPreferredTheme, useUser} from "~/hooks"
import {ServerSettings, ServerUser} from "~/server-types"
import {UpdateAccountData, updateAccount} from "~/apis"

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
	const serverSettings = useLoaderData() as ServerSettings

	const navigateToNext = useNavigateToNext()
	const $password = useRef<HTMLInputElement | null>(null)
	const $passwordConfirmation = useRef<HTMLInputElement | null>(null)
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

	const {_setEncryptionPassword, login} = useContext(AuthContext)

	const {mutateAsync} = useMutation<ServerUser, AxiosError, UpdateAccountData>(updateAccount)
	const formik = useFormik<Form>({
		validationSchema: schema,
		initialValues: {
			password: "",
			passwordConfirmation: "",
		},
		onSubmit: async ({password}, {setErrors}) => {
			try {
				const {encryptionPassword, encryptedPassword, encryptedNotes, publicKey} =
					await setupEncryptionForUser({
						password,
						user,
						serverSettings,
						theme,
					})

				await mutateAsync(
					{
						encryptedPassword,
						publicKey: (
							await readKey({
								armoredKey: publicKey,
							})
						)
							.toPublic()
							.armor(),
						encryptedNotes,
					},
					{
						onSuccess: newUser => {
							login(newUser)
							_setEncryptionPassword(encryptionPassword)
							navigateToNext()
						},
					},
				)
			} catch (error) {
				setErrors({detail: t("general.defaultError")})
			}
		},
	})
	const focusPassword = useCallback(() => {
		if ($password.current?.value !== "") {
			$passwordConfirmation.current?.focus()
		} else {
			$password.current?.focus()
		}
	}, [])

	useExtensionHandler({
		onEnterPassword: focusPassword,
	})

	return (
		<Box maxWidth="80vw">
			<form onSubmit={formik.handleSubmit}>
				<SimpleForm
					title={t("routes.CompleteAccountRoute.forms.password.title")}
					description={t("routes.CompleteAccountRoute.forms.password.description")}
					continueActionLabel={t(
						"routes.CompleteAccountRoute.forms.password.continueAction",
					)}
					nonFieldError={formik.errors.detail}
				>
					{[
						<PasswordField
							key="password"
							fullWidth
							autoFocus
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
							error={formik.touched.password && Boolean(formik.errors.password)}
							helperText={formik.touched.password && formik.errors.password}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<MdLock />
									</InputAdornment>
								),
							}}
						/>,
						<PasswordField
							key="passwordConfirmation"
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
						/>,
					]}
				</SimpleForm>
			</form>
		</Box>
	)
}
