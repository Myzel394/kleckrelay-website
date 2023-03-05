import * as yup from "yup"
import {useFormik} from "formik"
import {MdEmail} from "react-icons/md"
import {AxiosError} from "axios"
import {useTranslation} from "react-i18next"
import React, {ReactElement, useCallback, useRef} from "react"

import {InputAdornment, TextField} from "@mui/material"
import {useMutation} from "@tanstack/react-query"

import {MultiStepFormElement, SimpleForm} from "~/components"
import {SignupResult, checkIsDomainDisposable, signup} from "~/apis"
import {parseFastAPIError} from "~/utils"
import {ServerSettings} from "~/server-types"
import {useExtensionHandler} from "~/hooks"

import DetectEmailAutofillService from "./DetectEmailAutofillService"

export interface EmailFormProps {
	serverSettings: ServerSettings
	onSignUp: (email: string) => void
}

interface Form {
	email: string
	detail?: string
}

export default function EmailForm({onSignUp, serverSettings}: EmailFormProps): ReactElement {
	const {t} = useTranslation(["signup", "common"])

	const $password = useRef<HTMLInputElement | null>(null)
	const schema = yup.object().shape({
		email: yup
			.string()
			.email()
			.required()
			.label(t("fields.email.label", {ns: "common"})),
	})

	const {mutateAsync} = useMutation<SignupResult, AxiosError, string>(signup, {
		onSuccess: ({normalizedEmail}) => onSignUp(normalizedEmail),
	})
	const formik = useFormik<Form>({
		validationSchema: schema,
		initialValues: {
			email: "",
		},
		onSubmit: async (values, {setErrors}) => {
			// Check is email disposable
			try {
				const isDisposable = await checkIsDomainDisposable(values.email.split("@")[1])

				if (isDisposable) {
					setErrors({
						email: t("fields.email.errors.disposable", {ns: "common"}),
					})
					return
				}
			} catch {
				setErrors({
					detail: t("messages.errors.unknown", {ns: "common"}),
				})
				return
			}

			try {
				await mutateAsync(values.email)
			} catch (error) {
				setErrors(parseFastAPIError(error as AxiosError))
			}
		},
	})
	const focusPassword = useCallback(() => $password.current?.focus(), [])

	useExtensionHandler({
		onEnterPassword: focusPassword,
	})

	return (
		<>
			<MultiStepFormElement>
				<form onSubmit={formik.handleSubmit}>
					<SimpleForm
						title={t("forms.email.title")}
						description={t("forms.email.description")}
						nonFieldError={formik.errors.detail}
						isSubmitting={formik.isSubmitting}
					>
						{[
							<TextField
								key="email"
								fullWidth
								autoFocus
								name="email"
								id="email"
								label={t("fields.email.label", {ns: "common"})}
								placeholder={t("fields.email.placeholder", {ns: "common"})}
								inputMode="email"
								inputRef={$password}
								value={formik.values.email}
								onChange={formik.handleChange}
								disabled={formik.isSubmitting}
								error={formik.touched.email && Boolean(formik.errors.email)}
								helperText={formik.touched.email && formik.errors.email}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<MdEmail />
										</InputAdornment>
									),
								}}
							/>,
						]}
					</SimpleForm>
				</form>
			</MultiStepFormElement>
			{!serverSettings.otherRelaysEnabled && (
				<DetectEmailAutofillService domains={serverSettings.otherRelayDomains} />
			)}
		</>
	)
}
