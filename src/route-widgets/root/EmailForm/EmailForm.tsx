import {useFormik} from "formik"
import {MdEmail} from "react-icons/md"
import React, {ReactElement} from "react"

import {InputAdornment, TextField} from "@mui/material"

import {MultiStepFormElement, SimpleForm} from "~/components"
import {ServerSettings} from "~/types"
import {signup} from "~/apis"
import {handleErrors} from "~/utils"

import DetectEmailAutofillService from "./DetectEmailAutofillService"
import useSchema, {Form} from "./use-schema"

interface EmailFormProps {
	serverSettings: ServerSettings
	onSignUp: (email: string) => void
}

export default function EmailForm({
	serverSettings,
	onSignUp,
}: EmailFormProps): ReactElement {
	const schema = useSchema(serverSettings)
	const formik = useFormik<Form>({
		validationSchema: schema,
		initialValues: {
			email: "",
		},
		onSubmit: (values, {setErrors}) =>
			handleErrors(
				values.email,
				setErrors,
			)(signup).then(({normalized_email}) => onSignUp(normalized_email)),
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
