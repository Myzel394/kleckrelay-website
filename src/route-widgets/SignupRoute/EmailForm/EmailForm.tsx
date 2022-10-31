import * as yup from "yup"
import {useFormik} from "formik"
import {MdEmail} from "react-icons/md"
import {AxiosError} from "axios"
import React, {ReactElement} from "react"

import {InputAdornment, TextField} from "@mui/material"

import {useMutation} from "@tanstack/react-query"
import DetectEmailAutofillService from "./DetectEmailAutofillService"

import {MultiStepFormElement, SimpleForm} from "~/components"
import {SignupResult, checkIsDomainDisposable, signup} from "~/apis"
import {parseFastAPIError} from "~/utils"
import {ServerSettings} from "~/server-types"

export interface EmailFormProps {
	serverSettings: ServerSettings
	onSignUp: (email: string) => void
}

interface Form {
	email: string
	detail?: string
}

const SCHEMA = yup.object().shape({
	email: yup.string().email().required(),
})

export default function EmailForm({
	onSignUp,
	serverSettings,
}: EmailFormProps): ReactElement {
	const {mutateAsync} = useMutation<SignupResult, AxiosError, string>(
		signup,
		{
			onSuccess: ({normalizedEmail}) => onSignUp(normalizedEmail),
		},
	)
	const formik = useFormik<Form>({
		validationSchema: SCHEMA,
		initialValues: {
			email: "",
		},
		onSubmit: async (values, {setErrors}) => {
			// Check is email disposable
			try {
				const isDisposable = await checkIsDomainDisposable(
					values.email.split("@")[1],
				)

				if (isDisposable) {
					setErrors({
						email: "Disposable email addresses are not allowed",
					})
					return
				}
			} catch {
				setErrors({
					detail: "An error occurred",
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

	return (
		<>
			<MultiStepFormElement>
				<form onSubmit={formik.handleSubmit}>
					<SimpleForm
						title="Sign up"
						description="We only need your email and you are ready to go!"
						continueActionLabel="Sign up"
						nonFieldError={formik.errors.detail}
						isSubmitting={formik.isSubmitting}
					>
						{[
							<TextField
								key="email"
								fullWidth
								name="email"
								id="email"
								label="Email"
								inputMode="email"
								value={formik.values.email}
								onChange={formik.handleChange}
								disabled={formik.isSubmitting}
								error={
									formik.touched.email &&
									Boolean(formik.errors.email)
								}
								helperText={
									formik.touched.email && formik.errors.email
								}
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
				<DetectEmailAutofillService
					domains={serverSettings.otherRelayDomains}
				/>
			)}
		</>
	)
}