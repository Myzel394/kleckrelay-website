import * as yup from "yup"
import {useFormik} from "formik"
import {MdEmail} from "react-icons/md"
import {AxiosError} from "axios"
import React, {ReactElement} from "react"

import {InputAdornment, TextField} from "@mui/material"

import {MultiStepFormElement, SimpleForm} from "~/components"
import {checkIsDomainDisposable, signup} from "~/apis"
import {parseFastapiError} from "~/utils"
import {ServerSettings} from "~/server-types"

import DetectEmailAutofillService from "./DetectEmailAutofillService"

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
				await signup(values.email)
				onSignUp(values.email)
			} catch (error) {
				setErrors(parseFastapiError(error as AxiosError))
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
			{!serverSettings.other_relays_enabled && (
				<DetectEmailAutofillService
					domains={serverSettings.other_relay_domains}
				/>
			)}
		</>
	)
}
