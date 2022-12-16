import * as yup from "yup"
import {useFormik} from "formik"
import {MdCheckCircle, MdLock} from "react-icons/md"
import {generateKey, readKey} from "openpgp"
import {AxiosError} from "axios"
import {useTranslation} from "react-i18next"
import {Box, InputAdornment} from "@mui/material"
import {useMutation} from "@tanstack/react-query"
import React, {ReactElement, useCallback, useContext, useMemo, useRef} from "react"
import passwordGenerator from "secure-random-password"

import {PasswordField, SimpleForm} from "~/components"
import {buildEncryptionPassword, encryptString} from "~/utils"
import {isDev} from "~/constants/development"
import {useExtensionHandler, useSystemPreferredTheme, useUser} from "~/hooks"
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
				setTimeout(onDone, 0)
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
