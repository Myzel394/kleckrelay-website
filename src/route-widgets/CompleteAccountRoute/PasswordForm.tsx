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
import {parseFastAPIError, setupEncryptionForUser} from "~/utils"
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
	const {t} = useTranslation(["complete-account", "common"])
	const user = useUser()
	const theme = useSystemPreferredTheme()
	const serverSettings = useLoaderData() as ServerSettings

	const navigateToNext = useNavigateToNext()
	const $password = useRef<HTMLInputElement | null>(null)
	const $passwordConfirmation = useRef<HTMLInputElement | null>(null)
	const schema = yup.object().shape({
		password: yup
			.string()
			.required()
			.label(t("fields.password.label", {ns: "common"})),
		passwordConfirmation: yup
			.string()
			.required()
			.oneOf(
				[yup.ref("password"), null],
				t("fields.passwordConfirmation.errors.mismatch", {ns: "common"}) as string,
			)
			.label(t("fields.passwordConfirmation.label", {ns: "common"})),
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
				setErrors(parseFastAPIError(error as AxiosError))
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
					title={t("forms.enterPassword.title")}
					description={t("forms.enterPassword.description")}
					nonFieldError={formik.errors.detail}
				>
					{[
						<PasswordField
							key="password"
							fullWidth
							autoFocus
							id="password"
							name="password"
							label={t("fields.password.label", {ns: "common"})}
							placeholder={t("fields.password.placeholder", {ns: "common"})}
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
							label={t("fields.passwordConfirmation.label", {ns: "common"})}
							placeholder={t("fields.passwordConfirmation.placeholder", {
								ns: "common",
							})}
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
